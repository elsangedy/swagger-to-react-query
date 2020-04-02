const chalk = require('chalk')
const swagger2openapi = require('swagger2openapi')

const log = console.log

const pascalCase = str =>
  str
    .split(/(?=[A-Z])/)
    .join('_')
    .match(/[a-z]+/gi)
    .map(s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())
    .join('')

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

function generateHook({ operation, verb, route, operationIds = [], parameters = [] }) {
  if (!operation.operationId) {
    throw new Error(`"operationId" is required`)
  }

  if (operationIds.includes(operation.operationId)) {
    throw new Error(`operationId "${operation.operationId}" is duplicated!`)
  }

  operationIds.push(operation.operationId)

  route = route.replace(/\{/g, '${').slice(1)
  const operationName = pascalCase(operation.operationId)
  const operationType = verb === 'get' ? 'Query' : 'Mutation'
  const isOperationQuery = operationType === 'Query'

  const allParams = [...parameters, ...(operation.parameters || [])]
  const pathParams = allParams.filter(param => param.in === 'path').map(param => param.name)
  const queryParams = allParams.filter(param => param.in === 'query').map(param => param.name)
  const hasPathParams = pathParams.length > 0
  const hasQueryParams = queryParams.length > 0
  const hasQueryParamsOrPathParams = hasPathParams || hasQueryParams

  // DEBUG
  // console.log({
  //   route,
  //   operationName,
  //   operationType,
  //   pathParams,
  //   queryParams,
  // })

  let output = ''

  // generate method
  const methodName = `${operationType.toLowerCase()}${operationName}`

  output += `export const ${methodName} = (${
    hasPathParams ? `{ ${pathParams.join(', ')}, ...options }` : 'options'
  }) => api.${verb}(\`${route}\`, options).json()
`

  // generate hook
  const hookName = `use${operationType}${operationName}`

  // query hook
  if (isOperationQuery) {
    output += `export const ${hookName} = (${
      hasQueryParamsOrPathParams ? `params, ` : ''
    }config = {}, options = {}) => useQuery({
  queryKey: ${
    hasPathParams ? `params && ${pathParams.map(param => `params.${param}`).join(' && ')} && ` : ''
  }['${route}'${hasQueryParamsOrPathParams ? `, params` : ''}],
  queryFn: (${
    hasPathParams
      ? `_, { ${pathParams.join(', ')}${hasQueryParams ? ', ...searchParams' : ''} }`
      : hasQueryParams
      ? '_, searchParams'
      : ''
  }) => ${methodName}(${
      hasQueryParamsOrPathParams
        ? `{ ${hasPathParams ? `${pathParams.join(', ')}, ` : ''}${hasQueryParams ? 'searchParams, ' : ''}...options }`
        : 'options'
    }),
  config
})
${hookName}.queryKey = '${route}'

`
  }
  // mutation hook
  else {
    output += `export const ${hookName} = (config) => useMutation(${methodName}, config)

`
  }

  return output
}

async function generator({ specs, config }) {
  log(chalk.green(`Start ${config.name} code generation`))

  const operationIds = []

  const schema = await convertToOpenApiSchema(specs)

  let output = ''

  Object.entries(schema.paths).forEach(([route, verbs]) => {
    Object.entries(verbs).forEach(([verb, operation]) => {
      if (['get', 'post', 'patch', 'put', 'delete'].includes(verb)) {
        output += generateHook({
          operation,
          verb,
          route,
          operationIds,
          parameters: verbs.parameters
        })
      }
    })
  })

  const hasQuery = Boolean(output.match(/useQuery/))
  const hasMutation = Boolean(output.match(/useMutation/))

  const reactQueryImports = []

  if (hasQuery) {
    reactQueryImports.push('useQuery')
  }

  if (hasMutation) {
    reactQueryImports.push('useMutation')
  }

  // imports
  output = `import ky from "ky"
import { ${reactQueryImports.join(', ')} } from "react-query"

let api = ky.create(${JSON.stringify(config.kyOptions || {}, null, 2)})

export const getApi = () => api

export const setApi = (newApi) => api = typeof newApi === 'function' ? newApi(getApi()) : newApi

${output}`

  log(chalk.green(`Finish ${config.name} code generation`))

  return Promise.resolve(output)
}

module.exports = generator
