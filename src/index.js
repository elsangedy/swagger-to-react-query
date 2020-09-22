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
    $ swagger-to-react-query <configFile>

  Options
    --hooks, -hk  Include hooks

  Examples
    $ swagger-to-react-query config.js --hooks
`,
  {
    flags: {
      hooks: {
        type: 'boolean',
        alias: 'hk',
      },
    },
  }
)

const [configFile] = cli.input

if (!configFile) {
  throw new Error('Config file is required')
}

const configs = require(join(process.cwd(), configFile))

async function importSpecs({ url, json }) {
  if (url) {
    log(chalk.green(`Start import specs from "${url}"`))

    try {
      const req = await ky(url, { timeout: false })
      const data = await req.json()

      return data
    } catch (err) {
      throw new Error(`Fail to import specs from "${url}"`)
    }
  }

  if (json) {
    return json
  }

  throw new Error(`Fail to import specs from "${url || json}"`)
}

Promise.all(
  configs.apis.map(async (config) => {
    log(chalk.green(`Start ${config.name}`))

    if (!config.input || (!config.input.url && !config.input.json)) {
      throw new Error(`"input.url" or "input.json" is required`)
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

    const specs = await importSpecs(config.input)

    const { code, types } = await generator({ specs, config })

    const path = join(process.cwd(), config.output.path)

    if (!existsSync(path)) {
      mkdirSync(path)
    }

    writeFileSync(join(path, `${config.output.file}.js`), code)
    writeFileSync(join(path, `${config.output.file}.d.ts`), types)
  })
)
  .then(() => {
    log(chalk.green('Finish!'))
  })
  .catch((err) => {
    log(chalk.red(err.message))
    process.exit(1)
  })
