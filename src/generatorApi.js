const { ifElse } = require('./utils')

function generatorApiTypes({
  verb,
  route,
  operationName,
  operationType,
  hasPathParams,
  hasQueryParams,
  isOperationQuery,
}) {
  let output = ''

  const methodName = `${operationType.toLowerCase()}${operationName}`

  if (isOperationQuery) {
    output += `export const ${methodName} = (${ifElse(hasPathParams, 'pathParams, ')}${ifElse(
      hasQueryParams,
      'queryParams, '
    )}options) => queryFn(options)('${route}'${ifElse(hasPathParams, ', pathParams')}${ifElse(
      hasQueryParams,
      ', queryParams'
    )})`
  } else {
    output += `export const ${methodName} = (${ifElse(hasPathParams, 'pathParams, ')}${ifElse(
      hasQueryParams,
      'queryParams, '
    )}options) => mutationFn('${verb}', '${route}', ${ifElse(hasPathParams, 'pathParams', '{}')}, ${ifElse(
      hasQueryParams,
      'queryParams',
      '{}'
    )}, options)`
  }

  return `${output}
`
}

module.exports = generatorApiTypes
