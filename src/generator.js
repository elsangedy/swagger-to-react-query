const chalk = require('chalk')
const swagger2openapi = require('swagger2openapi')

const { pascalCase, camelCase } = require('./utils')
const generatorApi = require('./generatorApi')
const generatorHook = require('./generatorHook')
const generatorApiTypes = require('./generatorApiTypes')
const generatorHookTypes = require('./generatorHookTypes')
const { generatorGlobalTypes, generatorTypes } = require('./generatorTypes')

const log = console.log

function convertToOpenApiSchema(data) {
  return new Promise((resolve, reject) => {
    if (!data.openapi || !data.openapi.startsWith('3.0')) {
      swagger2openapi.convertObj(data, {}, (err, convertedObj) => {
        if (err) {
          reject(err)
        } else {
          resolve(convertedObj.openapi)
        }
      })
    } else {
      resolve(data)
    }
  })
}

function validateSchema(schema) {
  const operationIds = []

  Object.entries(schema.paths).forEach(([route, verbs]) => {
    Object.entries(verbs).forEach(([verb, operation]) => {
      if (['get', 'post', 'patch', 'put', 'delete'].includes(verb)) {
        if (!operation.operationId && !!operation.summary) {
          operation.operationId = camelCase(operation.summary)
        }

        if (!operation.operationId) {
          throw new Error(
            `Every path must have a operationId or summary - No operationId or summary set for ${verb} ${route}`
          )
        }

        if (operationIds.includes(operation.operationId)) {
          throw new Error(`"${operation.operationId}" is duplicated in your schema definition!`)
        }

        operationIds.push(operation.operationId)
      }
    })
  })
}

async function generator({ specs, config }) {
  const schema = await convertToOpenApiSchema(specs)

  let outputCode = ''
  let outputTypes = generatorGlobalTypes(schema)

  validateSchema(schema)

  Object.entries(schema.paths).forEach(([route, verbs]) => {
    Object.entries(verbs).forEach(([verb, operation]) => {
      if (['get', 'post', 'patch', 'put', 'delete'].includes(verb)) {
        const operationName = pascalCase(operation.operationId)
        const operationType = verb === 'get' ? 'Query' : 'Mutation'
        const isOperationQuery = operationType === 'Query'

        const allParams = [...(verbs.parameters || []), ...(operation.parameters || [])]
        const pathParamsBase = allParams.filter((param) => param.in === 'path')
        const pathParams = pathParamsBase.map((param) => param.name)
        const queryParamsBase = allParams.filter((param) => param.in === 'query')
        const queryParams = queryParamsBase.map((param) => param.name)
        const hasPathParams = pathParams.length > 0
        const hasQueryParams = queryParams.length > 0
        const hasQueryParamsOrPathParams = hasPathParams || hasQueryParams

        const params = {
          route,
          verb: verb.toLowerCase(),
          operation,
          operationName,
          operationType,
          isOperationQuery,
          allParams,
          pathParams,
          queryParams,
          pathParamsBase,
          queryParamsBase,
          hasPathParams,
          hasQueryParams,
          hasQueryParamsOrPathParams,
        }

        outputCode += generatorApi(params)
        outputCode += generatorHook(params)
        outputCode += `
`
        outputTypes += generatorTypes(params)
        outputTypes += generatorApiTypes(params)
        outputTypes += generatorHookTypes(params)
        outputTypes += `
`
      }
    })
  })

  const hasQuery = Boolean(outputCode.match(/useQuery/))
  const hasMutation = Boolean(outputCode.match(/useMutation/))

  const codeReactQueryImports = []
  const typesReactQueryImports = []

  if (hasQuery) {
    codeReactQueryImports.push('useQuery')
    typesReactQueryImports.push('QueryConfig', 'QueryResult')
  }

  if (hasMutation) {
    codeReactQueryImports.push('useMutation')
    typesReactQueryImports.push('MutationConfig', 'MutateFunction', 'MutationResult')
  }

  // imports
  outputCode = `/* eslint-disable */
/* tslint:disable */
import ky from 'ky'
import { ${codeReactQueryImports.join(', ')} } from 'react-query'

let api = ky.create(${JSON.stringify(config.kyOptions || {}, null, 2)})

export const getApi = () => api

export const setApi = (newApi) => {
  api = newApi
}

export const extendApi = (options) => {
  api = getApi().extend(options)
}

const requestFn = async ({ url, method, pathParams, queryParams, ...rest }) => {
  const urlPathParams = url.match(/{([^}]+)}/g)

  if (urlPathParams) {
    url = urlPathParams.reduce((acc, param) => acc.replace(param, pathParams[param.replace(/{|}/g, '')]), url)
  } else {
    queryParams = pathParams
  }

  if (url.charAt(0) === '/') {
    url = url.replace('/', '')
  }

  const response = await api(url, {
    method,
    ...rest,
    searchParams: {
      ...(rest.searchParams || {}),
      ...queryParams
    }
  })

  let data

  try {
    const contentType = (response.headers.get('content-type') || '').split(';')[0]

    const responseType =
      {
        'application/json': 'json',
        'application/pdf': 'blob'
      }[contentType] || 'text'

    data = await response[responseType]()
  } catch (e) {
    data = e.message
  }

  if (!response || !response.ok) {
    const error = {
      data,
      status: response.status,
      message: \`Failed to fetch: \${response.status} \${response.statusText}\`
    }

    throw error
  }

  return data
}

const queryFn = (options = {}) => (url, pathParams = {}, queryParams = {}) => {
  const controller = new AbortController()
  const { signal } = controller

  const promise = requestFn({
    url,
    method: 'get',
    pathParams,
    queryParams,
    signal,
    ...options
  })

  // cancel the request if React Query calls the 'promise.cancel' method
  promise.cancel = () => {
    controller.abort('Query was cancelled by React Query')
  }

  return promise
}

const mutationFn = (
  method,
  url,
  pathParams = {},
  queryParams = {},
  options = {}
) => (body = {}) => {
  if (Array.isArray(body)) {
    pathParams = { ...pathParams, ...(body[0] || {}) }
    queryParams = { ...queryParams, ...(body[1] || {}) }
    options = { ...options, ...(body[3] || {}) }
    body = body[2]
  }

  const request = {
    url,
    method,
    pathParams,
    queryParams,
    ...options
  }

  if (method !== 'delete') {
    try {
      request[body.toString() === '[object FormData]' ? 'body' : 'json'] = body
    } catch(e) {
    }
  }

  return requestFn(request)
}

${outputCode}`

  outputTypes = `/* eslint-disable */
/* tslint:disable */
import ky, { Options } from 'ky'
import { ${typesReactQueryImports.join(', ')} } from 'react-query'

export const getApi: { (): typeof ky }

export const setApi: { (newApi: typeof ky ): void }

export const extendApi: { (options: Options ): void }

${outputTypes}`

  log(chalk.green(`Finish ${config.name} code generation`))

  return Promise.resolve({
    code: outputCode,
    types: outputTypes,
  })
}

module.exports = generator
