'use strict'

var test = require('blue-tape')
var execa = require('execa')
var tmp = require('tmp')
var pify = require('pify')
var path = require('path')

var tmpDir = pify(tmp.dir)
var fixture = path.resolve(__dirname, 'fixture')

test('npm prune --production', function (t) {
  return execa('npm', ['install'], { cwd: fixture })
    .then(tmpDir)
    .then(function (destination) {
      return execa('node', [
        path.resolve(__dirname, 'cli.js'),
        destination,
        '--',
        '--production'
      ], {
        cwd: fixture
      })
        .then(() => execa('npm', ['ls', 'xtend'], { cwd: destination }))
        .then(() => t.shouldFail(execa('npm', ['ls', 'ap'], { cwd: destination })))
    })
})
