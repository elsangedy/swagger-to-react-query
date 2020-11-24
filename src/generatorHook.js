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
    output += `export const ${hookName} = (${ifElse(hasPathParams, 'pathParams = null, ')}${ifElse(
      hasQueryParams,
      'queryParams = null, '
    )}config, options) => useQuery({
  queryKey: ['${route}'${ifElse(hasPathParams, ', pathParams')}${ifElse(
      hasQueryParams,
      ', queryParams'
    )}].filter(Boolean),
  queryFn: () => queryFn({ url: '${route}'${ifElse(hasPathParams, ', pathParams')}${ifElse(
      hasQueryParams,
      ', queryParams'
    )}, options }),
  enabled: ${ifElse(
    hasPathParams,
    '!!pathParams && ' + pathParams.map((param) => `!!pathParams.${param}`).join(' && '),
    true
  )}, 
  ...config
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
