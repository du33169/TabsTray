import path from 'path'
import fs from 'fs'
import { spawnSync } from "bun";

interface VersionPackage {
	scmVersion: string, // full version string
	version: string, // version number without 'v' prefix, for manifest.json
	distance: string, // number of commits since last tag
	hash: string, // git commit hash, if available
	suffix: string // suffix for nightly builds, if any
}
export function get_version(): VersionPackage {
	
	const commands: string[] = [
		'git',
		'describe',
		'--tags',
		'--match', 'v[0-9]*.[0-9]*.[0-9]*' // somehow git describe cannot accept '--match v[0-9]*.[0-9]*.[0-9]*' directly
	];
	//execute shell command
	const { stdout,stderr } = spawnSync(commands)
	if (stderr.toString().trim() !== "") console.log(stderr.toString());
	const scmVersion = stdout.toString().trim();
	const devPattern = /^v([0-9]+.[0-9]+.[0-9]+)-([0-9]+)-g([0-9a-f]+)$/;
	var version = "";
	var distance = "";
	var hash = "";
	var suffix = "";
	if (devPattern.test(scmVersion)) { // if it's a dev version
		const match = devPattern.exec(scmVersion)!;
		version = match[1];
		distance = match[2];
		hash = match[3];
		suffix = `-dev+${distance}+g${hash}`
	}
	else {
		if (/^v[0-9]+.[0-9]+.[0-9]+$/.test(scmVersion)) { 
			version = scmVersion.replace(/^v/, ''); // remove 'v' prefix for release build
		} else{
			console.error(`Invalid version string for release build: ${scmVersion}`); // if it's not a valid release version string
			process.exit(1);
		}
	}
	const vPackage: VersionPackage = {
		scmVersion: scmVersion,
		version: version,
		distance: distance,
		hash: hash,
		suffix: suffix
	}
	return vPackage;
}