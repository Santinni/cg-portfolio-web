/**
 * Copies production data (PostgreSQL + Payload media) into the local dev database.
 *
 * One-way only: production is only read (pg_dump, tar). Everything that writes goes to
 * the local Docker database from compose.dev.yaml and to public/media on this machine.
 * Both files are downloaded first, so a failed download leaves local data untouched.
 *
 * Usage:  pnpm db:pull
 * Config (.env.local):
 *   DB_PULL_SSH_HOST    SSH host or ~/.ssh/config alias of the VPS (required)
 *   DB_PULL_REMOTE_DIR  Compose project folder on the VPS (default: /opt/codeguy)
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

// Relative paths on purpose: GNU tar would read "D:\..." as a remote host.
const OUT_DIR = 'tmp/db-dump'
const DUMP_FILE = `${OUT_DIR}/codeguy.dump`
const MEDIA_FILE = `${OUT_DIR}/codeguy-media.tar.gz`
const MEDIA_DIR = 'public/media'
// Tracked in git as the seed.ts placeholder, so a pull never deletes it.
const KEEP_MEDIA = new Set(['img.webp'])
const LOCAL_COMPOSE = ['compose', '-f', 'compose.dev.yaml']

if (fs.existsSync('.env.local')) process.loadEnvFile('.env.local')
const sshHost = process.env.DB_PULL_SSH_HOST
const remoteDir = process.env.DB_PULL_REMOTE_DIR || '/opt/codeguy'

/**
 * Runs a command and fails on a non-zero exit code. With `outFile`, the command's stdout is
 * streamed into that file (used for binary dumps); otherwise output goes to the terminal.
 * stdin stays attached so ssh can ask for a key passphrase.
 */
async function run(command, args, outFile) {
	const child = spawn(command, args, { stdio: ['inherit', outFile ? 'pipe' : 'inherit', 'inherit'] })
	const written = outFile ? pipeline(child.stdout, fs.createWriteStream(outFile)) : null
	const exitCode = await new Promise((resolve, reject) => {
		child.on('error', reject)
		child.on('close', resolve)
	})
	if (written) await written
	if (exitCode !== 0) throw new Error(`"${command} ${args[0]} ..." failed with exit code ${exitCode}`)
}

/**
 * Runs a shell command on the VPS inside the production Compose folder. ClearAllForwardings
 * skips port forwards from ~/.ssh/config, which would clash with an already open SSH session.
 */
function runRemote(command, outFile) {
	return run('ssh', ['-o', 'ClearAllForwardings=yes', sshHost, `cd ${remoteDir} && ${command}`], outFile)
}

/** Fails early when a downloaded file is missing or empty (e.g. the remote command printed nothing). */
function assertNotEmpty(file) {
	const size = fs.existsSync(file) ? fs.statSync(file).size : 0
	if (size === 0) throw new Error(`${file} is empty, the download did not work`)
	console.log(`  ${file} (${Math.round(size / 1024)} kB)`)
}

async function pull() {
	if (!sshHost) {
		throw new Error('DB_PULL_SSH_HOST is not set. Add it to .env.local, e.g. DB_PULL_SSH_HOST=codeguy-karel')
	}
	// Both values end up in a command line: a host starting with "-" would be read as an ssh
	// option, and the folder is pasted into a remote shell command. Allow plain values only.
	if (!/^[\w.@-]+$/.test(sshHost) || sshHost.startsWith('-')) {
		throw new Error(`DB_PULL_SSH_HOST "${sshHost}" is not a plain host name or ssh alias`)
	}
	if (!/^\/[\w./-]+$/.test(remoteDir)) {
		throw new Error(`DB_PULL_REMOTE_DIR "${remoteDir}" must be an absolute path without spaces or shell characters`)
	}
	fs.mkdirSync(OUT_DIR, { recursive: true })

	console.log('1/5 Starting the local database...')
	await run('docker', [...LOCAL_COMPOSE, 'up', '-d', '--wait'])

	// Same command the deploy workflow uses for its pre-deploy backup. Single quotes keep the
	// $POSTGRES_* variables for the shell inside the container, where they are defined.
	console.log(`2/5 Dumping the production database from ${sshHost}...`)
	await runRemote(
		`docker compose exec -T database sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=custom'`,
		DUMP_FILE,
	)
	assertNotEmpty(DUMP_FILE)

	console.log('3/5 Packing production media...')
	await runRemote('docker compose exec -T app tar -czf - -C /app/public media', MEDIA_FILE)
	assertNotEmpty(MEDIA_FILE)

	// --clean --if-exists drops the old local tables first, so repeated pulls replace the data.
	// --no-owner --no-privileges skip production roles that do not exist locally.
	console.log('4/5 Restoring into the local database...')
	await run('docker', [...LOCAL_COMPOSE, 'cp', DUMP_FILE, 'database:/tmp/codeguy.dump'])
	await run('docker', [
		...LOCAL_COMPOSE,
		'exec',
		'-T',
		'database',
		'sh',
		'-c',
		'pg_restore --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --no-owner --no-privileges --clean --if-exists /tmp/codeguy.dump',
	])

	// Local uploads are replaced by production ones, so files deleted in production disappear too.
	console.log('5/5 Replacing public/media with production media...')
	fs.mkdirSync(MEDIA_DIR, { recursive: true })
	for (const entry of fs.readdirSync(MEDIA_DIR)) {
		if (!KEEP_MEDIA.has(entry)) fs.rmSync(path.join(MEDIA_DIR, entry), { recursive: true, force: true })
	}
	await run('tar', ['-xzf', MEDIA_FILE, '-C', 'public'])

	console.log('Done. Local database and media now match production.')
}

pull().catch((error) => {
	console.error(`\ndb:pull failed: ${error.message}`)
	process.exit(1)
})
