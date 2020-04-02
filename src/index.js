#!/usr/bin/env node

'use strict'

const { join } = require('path')
const { writeFileSync, mkdirSync, existsSync } = require('fs')
const meow = require('meow')
const chalk = require('chalk')
const ky = require('ky-universal')

const generator = require('./generator')

const log = console.log

const cli = meow(
  `
  Usage
    $ rest-query-gen <configFile>

  Examples
    $ rest-query-gen config.js
`,
  {
    flags: {
      rainbow: {
        type: 'boolean',
        alias: 'r'
      }
    }
  }
)

const [configFile] = cli.input

const configs = require(join(process.cwd(), configFile))

async function importSpecs(url) {
  log(chalk.green(`Start import specs from "${url}"`))

  try {
    const req = await ky(url)
    const data = await req.json()

    return data
  } catch (err) {
    throw new Error(`Fail to import specs from "${url}"`)
  }
}

Promise.all(
  configs.apis.map(async config => {
    log(chalk.green(`Start ${config.name}`))

    if (!config.url) {
      throw new Error(`"url" is required`)
    }

    if (!config.output) {
      throw new Error(`"output" is required`)
    }

    if (!config.output.path) {
      throw new Error(`"output.path" is required`)
    }

    if (!config.output.file) {
      throw new Error(`"output.file" is required`)
    }

    const specs = await importSpecs(config.url)

    const code = await generator({ specs, config })

    const path = join(process.cwd(), config.output.path)

    if (!existsSync(path)) {
      mkdirSync(path)
    }

    writeFileSync(join(path, `${config.output.file}.js`), code)
  })
)
  .then(() => {
    log(chalk.green('Finish!'))
  })
  .catch(err => {
    log(chalk.red(err.message))
    process.exit(1)
  })
