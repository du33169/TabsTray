// temporary, will be removed after web-ext build is working under bun
// this file require common shell command `zip, tar`
import path from 'path'
import { execSync } from 'child_process'
import packageJson from '@/../package.json'
function pack_ext(buildDir: string, distDir: string, version: string) {
	const fname = `${packageJson.name}-${version}.zip`
	const fpath = path.join(distDir, fname)
	console.log(`Packing extension to ${fpath}`)
	const cmd = `cd ${buildDir} && zip -qrT ${fpath} *`
	// execute shell command
	console.log(cmd)
	execSync(cmd, { stdio: 'inherit' })
}

function pack_src(projDir: string, distDir: string, version: string) {
	const fname = `${packageJson.name}-${version}.tar.gz`
	const fpath = path.join(distDir, fname)
	console.log(`Packing source code to ${fpath}`)
	const cmd = `tar --exclude-from=.gitignore --exclude=.git -czf ${fpath} -C ${projDir} . `
	// execute shell command
	console.log(cmd)
	execSync(cmd, { stdio: 'inherit' })
}

export { pack_ext, pack_src }