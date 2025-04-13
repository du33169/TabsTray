import path from 'path'
import fs from 'fs'
import { spawnSync } from "bun";

export function generate_changelog()  {
	
	const commands: string[] = [
		'bunx',
		'auto-changelog',
		'--config tool/.auto-changelog',
	];
	//execute shell command
	const { stdout } = spawnSync(commands)

}