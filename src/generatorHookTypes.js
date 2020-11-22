const { ifElse } = require('./utils')
const { getResReqTypes } = require('./generatorTypes')

function generatorHookTypes({
  hasPathParams,
  hasQueryParams,
  operation,
  operationType,
  operationName,
  isOperationQuery,
}) {
  let output = ''

  const hookName = `use${operationType}${operationName}`

  const isOk = ([statusCode]) => statusCode.toString().startsWith('2')
  const responseTypes = getResReqTypes(Object.entries(operation.responses).filter(isOk)) || 'void'

  if (isOperationQuery) {
    output += `export const ${hookName}: { (${ifElse(
      hasPathParams,
      `pathParams?: ${operationName}PathParams, `
    )}${ifElse(
      hasQueryParams,
      `queryParams?: ${operationName}QueryParams, `
    )}config?: QueryConfig<${responseTypes}>, options?: Options): QueryResult<${responseTypes}>; queryKey: string }`
  } else {
    const requestBodyTypes = getResReqTypes([['body', operation.requestBody]])

    const requestBodyTypesOptional = `[${ifElse(hasPathParams, `${operationName}PathParams`, 'void')}, ${ifElse(
      hasQueryParams,
      `${operationName}QueryParams`,
      'void'
    )}, ${requestBodyTypes}, Options]`

    output += `export const ${hookName}: { (${ifElse(
      hasPathParams,
      `pathParams?: ${operationName}PathParams, `
    )}${ifElse(
      hasQueryParams,
      `queryParams?: ${operationName}QueryParams, `
    )}config?: MutationConfig<${responseTypes}, unknown, ${requestBodyTypes}>, options?: Options): [MutateFunction<${responseTypes}, unknown, ${requestBodyTypes} | ${requestBodyTypesOptional}>, MutationResult<${responseTypes}>] }`
  }

  return `${output}
`
}

module.exports = generatorHookTypes
