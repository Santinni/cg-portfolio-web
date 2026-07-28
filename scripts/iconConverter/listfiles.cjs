const fs = require("node:fs")
const path = require("node:path")
const fg = require("fast-glob")

/**
 * Modern, fast file listing utility using fast-glob.
 * Usage: node scripts/iconConverter/listfiles.cjs <directory> <pattern> <output-file>
 */

const directory = process.argv[2] || "src/assets"
const patternInput = process.argv[3] || "**/*.svg"
const output = process.argv[4] || "files.json"

const patterns = patternInput.split(";").map((p) => p.trim())

const rootDirectory = path.resolve(process.cwd(), directory)

try {
	const files = fg
		.globSync(patterns, {
			cwd: rootDirectory,
			onlyFiles: true,
			dot: false,
		})
		.sort()

	const result = {
		directory,
		patterns,
		count: files.length,
		files,
		generatedAt: new Date().toISOString(),
		tool: "fast-glob",
	}

	const targetPath = path.join(rootDirectory, output)

	fs.mkdirSync(path.dirname(targetPath), { recursive: true })
	fs.writeFileSync(targetPath, JSON.stringify(result, null, 2))

	console.log(`✅ Listed ${files.length} files to ${targetPath}`)

	if (files.length > 0) {
		console.log(`📁 Sample files:`)
		files.slice(0, 3).forEach((file) => {
			console.log(`   ${file}`)
		})
		if (files.length > 3) {
			console.log(`   ... and ${files.length - 3} more`)
		}
	}
} catch (error) {
	console.error("❌ Error:", error.message)
	process.exit(1)
}
