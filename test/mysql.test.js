/* jslint node: true */
/* Copyright (c) 2012 Mircea Alexandru */
/*
 * These tests assume a MySQL database/structure is already created.
 * execute script/schema.sql to create
 */

'use strict'

var _ = require('lodash')
var Seneca = require('seneca')
var Shared = require('seneca-store-test')
var Extra = require('./mysql.ext.test.js')
var Autoincrement = require('./mysql.autoincrement.test.js')
var Fs = require('fs')

var Lab = require('lab')
var lab = (exports.lab = Lab.script())
var before = lab.before
var describe = lab.describe

var dbConfig
if (Fs.existsSync(__dirname + '/dbconfig.mine.js')) {
  dbConfig = require('./dbconfig.mine')
} else {
  dbConfig = require('./dbconfig.example')
}

var si = Seneca({
  default_plugins: {
    'mem-store': false
  }
})

if (si.version >= '2.0.0') {
  si.use('entity')
}

describe('MySQL suite tests ', function() {
  before({}, function(done) {
    si.use(require('../mysql-store.js'), dbConfig)
    si.ready(done)
  })

  Shared.basictest({
    seneca: si,
    script: lab
  })

  Shared.sorttest({
    seneca: si,
    script: lab
  })

  Shared.limitstest({
    seneca: si,
    script: lab
  })

  Shared.sqltest({
    seneca: si,
    script: lab
  })

  Extra.extendTest({
    seneca: si,
    script: lab
  })
})

var incrementConfig = _.assign({}, dbConfig, {
  map: { '-/-/incremental': '*' },
  auto_increment: true
})

var si2 = Seneca({
  default_plugins: {
    'mem-store': false
  }
})

if (si2.version >= '2.0.0') {
  si2.use('entity')
}

describe('MySQL autoincrement tests ', function() {
  before({}, function(done) {
    si2.use(require('../mysql-store.js'), incrementConfig)
    si2.ready(done)
  })

  Autoincrement.autoincrementTest({
    seneca: si2,
    script: lab
  })
})
