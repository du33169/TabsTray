// temporary, will be removed after web-ext build is working under bun
// this file require common shell command `zip, tar`
import path from 'path'
import { spawnSync } from "bun";
import packageJson from '@/../package.json'

function pack_src(projDir: string, distDir: string, version: string) {
	const fname = `${packageJson.name}-${version}.tar.gz`
	const fpath = path.join(distDir, fname)
	console.log(`Packing source code to ${fpath}`)
	const cmds = ["tar", "--exclude-from=.gitignore", "--exclude=.git", "-czf", fpath, "-C", projDir, "."]
	const { stdout, stderr } = spawnSync(cmds)
	const err = stderr.toString().trim()
	if (err) {
		console.error(err)
		return
	}
}

export { pack_src }