'use strict'

var test = require('blue-tape')
var execa = require('execa')
var tmp = require('tmp')
var pify = require('pify')
var path = require('path')

var tmpDir = pify(tmp.dir)

test('npm prune --production', function (t) {
  return tmpDir()
    .then(function (destination) {
      return execa('node', [
        path.resolve(__dirname, 'cli.js'),
        destination,
        '--',
        '--production'
      ], {
        cwd: path.resolve(__dirname, 'fixture')
      })
      .then(() => execa('npm', ['ls', 'xtend'], {cwd: destination}))
      .then(() => t.shouldFail(execa('npm', ['ls', 'ap'], {cwd: destination})))
    })
})
