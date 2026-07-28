const fs = require("node:fs")
const path = require("node:path")
const { fdir } = require("fdir")

/**
 * Ultra-fast icon processing utility using fdir.
 * Scans SVG source files and generated components, producing a report.
 */
class IconProcessor {
	constructor() {
		this.sourceDir = path.resolve(process.cwd(), "src/assets/icons")
		this.outputDir = path.resolve(process.cwd(), "src/components/icons")
	}

	async findSvgFiles() {
		console.log("🔍 Scanning for SVG files...")

		const api = new fdir()
			.withFullPaths()
			.filter((filePath) => path.extname(filePath) === ".svg")
			.crawl(this.sourceDir)

		const files = await api.withPromise()

		console.log(`📊 Found ${files.length} SVG files`)
		return files
	}

	async findGeneratedComponents() {
		console.log("🔍 Scanning for generated components...")

		if (!fs.existsSync(this.outputDir)) {
			console.log("📁 Output directory does not exist yet")
			return []
		}

		const api = new fdir()
			.withFullPaths()
			.filter((filePath) => path.extname(filePath) === ".tsx")
			.exclude((dirName) => dirName === "node_modules")
			.crawl(this.outputDir)

		const files = await api.withPromise()

		console.log(`📊 Found ${files.length} generated component files`)
		return files
	}

	generateReport(svgFiles, componentFiles) {
		const report = {
			scan: {
				timestamp: new Date().toISOString(),
				tool: "fdir",
				performance: "ultra-fast",
			},
			source: {
				directory: path.relative(process.cwd(), this.sourceDir),
				count: svgFiles.length,
				files: svgFiles.map((f) => path.relative(this.sourceDir, f)),
			},
			generated: {
				directory: path.relative(process.cwd(), this.outputDir),
				count: componentFiles.length,
				files: componentFiles.map((f) => path.relative(this.outputDir, f)),
			},
			stats: {
				needsConversion: svgFiles.length > componentFiles.length,
				upToDate: svgFiles.length === componentFiles.length,
			},
		}

		return report
	}

	async run() {
		console.log("🚀 Starting ultra-fast icon scan...\n")

		try {
			const [svgFiles, componentFiles] = await Promise.all([
				this.findSvgFiles(),
				this.findGeneratedComponents(),
			])

			const report = this.generateReport(svgFiles, componentFiles)

			const reportPath = path.join(process.cwd(), "icon-scan-report.json")
			fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

			console.log(`\n📈 Performance Report:`)
			console.log(`   SVG Files: ${report.source.count}`)
			console.log(`   Components: ${report.generated.count}`)
			console.log(
				`   Status: ${report.stats.upToDate ? "✅ Up to date" : "⚠️  Needs conversion"}`,
			)
			console.log(`   Report: ${path.relative(process.cwd(), reportPath)}`)

			return report
		} catch (error) {
			console.error("❌ Error during scan:", error.message)
			process.exit(1)
		}
	}
}

if (require.main === module) {
	const processor = new IconProcessor()
	processor.run()
}

module.exports = IconProcessor
