import path from 'path'
import fs from 'fs'
import { spawnSync } from "bun";

export function generate_changelog(version : string)  {
	
	const commands: string[] = [
		'bunx',
		'auto-changelog',
		'--config tool/.auto-changelog',
		`-v ${version}`
	];
	//execute shell command
	const { stdout } = spawnSync(commands)

}