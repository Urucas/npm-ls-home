#!/usr/bin/env node
'use strict';
const meow = require('meow');
const readPkgUp = require('read-pkg-up');
const opn = require('opn');
const inquirer = require('inquirer');

const cli = meow(`
	Usage
	  $ npm-ls-home
	  $ nlh
	Options
	  -l, -list Show package dependencies
`, {
	alias: {
		l: 'list'
	}
});

function open(pkg) {
	opn(`https://www.npmjs.com/package/${pkg}`, {wait: false});
}

function prompt(pkg, dependencies, devDependencies) {
	const pkgs = [pkg];
	Object.keys(dependencies).map(key => {
		pkgs.push(key);
		return key;
	});
	Object.keys(devDependencies).map(key => {
		pkgs.push(key);
		return key;
	});
	inquirer.prompt({
		type: 'list',
		name: 'pkg',
		message: 'Choice a package',
		choices: pkgs,
		default: [pkg]
	}, answer => {
		open(answer.pkg);
	});
}

readPkgUp().then(result => {
	if (cli.flags.l || cli.flags.list) {
		prompt(result.pkg.name, result.pkg.dependencies || {}, result.pkg.devDependencies || {});
	} else {
		open(result.pkg.name);
	}
});
