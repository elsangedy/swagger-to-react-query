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

  const methodName = `${operationType.toLowerCase()}${operationName}`

  const isOk = ([statusCode]) => statusCode.toString().startsWith('2')
  const responseTypes = getResReqTypes(Object.entries(operation.responses).filter(isOk)) || 'void'

  if (isOperationQuery) {
    output += `export const ${methodName}: { (${ifElse(
      hasPathParams,
      `pathParams?: ${operationName}PathParams, `
    )}${ifElse(
      hasQueryParams,
      `queryParams?: ${operationName}QueryParams, `
    )}options?: Options): Promise<${responseTypes}> }`
  } else {
    const requestBodyTypes = getResReqTypes([['body', operation.requestBody]])

    const requestBodyTypesOptional = `[${ifElse(hasPathParams, `${operationName}PathParams`, 'void')}, ${ifElse(
      hasQueryParams,
      `${operationName}QueryParams`,
      'void'
    )}, ${requestBodyTypes}, Options]`

    output += `export const ${methodName}: { (${ifElse(
      hasPathParams,
      `pathParams?: ${operationName}PathParams, `
    )}${ifElse(
      hasQueryParams,
      `queryParams?: ${operationName}QueryParams, `
    )}options?: Options): { (body?: ${requestBodyTypes} | ${requestBodyTypesOptional}): Promise<${responseTypes}> } }`
  }

  return `${output}
`
}

module.exports = generatorHookTypes
