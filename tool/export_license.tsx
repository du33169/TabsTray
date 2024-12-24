import path from 'path'
import fs from 'fs'
import { spawnSync } from "bun";

interface LicenseDataItem {
	name: string
	licenseType: string
	installedVersion: string
	licenseText?: string
}

function export_license_data(): LicenseDataItem[] {
	
	const commands: string[] = [
		'bunx',
		'license-report',
		'--output=json',
		'--fields=name',
		'--fields=licenseType',
		'--fields=installedVersion',
		'--excludeRegex=@types/.*',
	];
	//execute shell command
	const { stdout } = spawnSync(commands)
	const jsonString=stdout.toString()
	const jsonData = JSON.parse(jsonString)

	return jsonData as LicenseDataItem[]
}

function copy_licenses(projDir: string,buildDir: string, licenseData: LicenseDataItem[]) {
	const licenseDataFile = path.join(buildDir, 'pages', 'options', 'about', 'license_data.json')
	// make sure the license data folder exists
	fs.mkdirSync(path.dirname(licenseDataFile), { recursive: true })
	//read license file from node_modules
	licenseData.forEach(item => {
		const possibleLicenseFileName = ['LICENSE', 'LICENSE.md', 'LICENSE.txt']
		for (const licenseFileName of possibleLicenseFileName) {
			const licenseFile = path.join(projDir, 'node_modules', item.name, licenseFileName)
			if (fs.existsSync(licenseFile)) {
				const licenseText = fs.readFileSync(licenseFile, 'utf8')
				item.licenseText = licenseText
				// console.log(`License peek: ${licenseText.slice(0, 100)}...`)
				return
			}
		}
		console.error(`License file not found for ${item.name}`)
	})
	//write license data to file
	fs.writeFileSync(licenseDataFile, JSON.stringify(licenseData, null, 2))
}

function generate_license_data(projDir: string, buildDir: string) {
	console.log('Generating license data...')
	const licenseData = export_license_data()
	copy_licenses(projDir, buildDir, licenseData)
}
export { generate_license_data }
