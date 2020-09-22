const { ifElse } = require('./utils')

function generatorHook({
  verb,
  route,
  operationName,
  operationType,
  isOperationQuery,
  pathParams,
  hasPathParams,
  hasQueryParams,
}) {
  let output = ''

  const hookName = `use${operationType}${operationName}`

  if (isOperationQuery) {
    output += `export const ${hookName} = (${ifElse(hasPathParams, 'pathParams, ')}${ifElse(
      hasQueryParams,
      'queryParams, '
    )}config, options) => useQuery({
  queryKey: ${ifElse(
    hasPathParams,
    'pathParams && ' + pathParams.map((param) => `pathParams.${param}`).join(' && ') + ' && '
  )}['${route}'${ifElse(hasPathParams, ', pathParams')}${ifElse(hasQueryParams, ', queryParams')}],
  queryFn: queryFn(options),
  config
})
${hookName}.queryKey = '${route}'`
  }
  // mutation hook
  else {
    output += `export const ${hookName} = (${ifElse(hasPathParams, 'pathParams, ')}${ifElse(
      hasQueryParams,
      'queryParams, '
    )}config, options) => useMutation(mutationFn('${verb}', '${route}', ${ifElse(
      hasPathParams,
      'pathParams',
      '{}'
    )}, ${ifElse(hasQueryParams, 'queryParams', '{}')}, options), config)`
  }

  return `${output}
`
}

module.exports = generatorHook
