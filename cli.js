#!/usr/bin/env node

'use strict'

var meow = require('meow')
var copy = require('cpy')
var packages = require('npm-package-files').names
var execa = require('execa')
var path = require('path')

var cli = meow(`
  Usage
    npm-cp-prune <destination> -- <npm prune flags>

  Options
    https://docs.npmjs.com/cli/prune
`)

var destination = cli.input[0]
if (!destination) cli.showHelp()

var separator = process.argv.indexOf('--')
var flags = separator >= 0
  ? process.argv.slice(separator + 1, process.argv.length)
  : []

Promise.all([
  copy(toGlob(packages), destination),
  execa('cp', ['-r', 'node_modules', destination])
])
.then(() => execa('npm', ['prune'].concat(flags), {
  cwd: path.resolve(process.cwd(), destination),
  stdio: 'inherit'
}))

function toGlob (filenames) {
  return '{' + Object.keys(filenames).join(',') + '}'
}
