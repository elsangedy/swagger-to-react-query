const { pascalCase, ifElse, fixTypeWhenHaveHyphen } = require('./utils')

const isReference = (property) => Boolean(property.$ref)

const getRef = ($ref) => {
  if ($ref.startsWith('#/components/schemas')) {
    return pascalCase($ref.replace('#/components/schemas/', ''))
  } else if ($ref.startsWith('#/components/responses')) {
    return pascalCase($ref.replace('#/components/responses/', '')) + 'Response'
  } else if ($ref.startsWith('#/components/parameters')) {
    return pascalCase($ref.replace('#/components/parameters/', '')) + 'Parameter'
  } else if ($ref.startsWith('#/components/requestBodies')) {
    return pascalCase($ref.replace('#/components/requestBodies/', '')) + 'RequestBody'
  } else {
    throw new Error('This library only resolve $ref that are include into `#/components/*` for now')
  }
}

const resolveTypeValue = (schema) => (isReference(schema) ? getRef(schema.$ref) : getScalar(schema))

const getArray = (item) => {
  if (item.items) {
    if (!isReference(item.items) && (item.items.oneOf || item.items.allOf)) {
      return `(${resolveTypeValue(item.items)})[]`
    } else {
      return `${resolveTypeValue(item.items)}[]`
    }
  } else {
    throw new Error('All arrays must have an `items` key define')
  }
}

const getObject = (item) => {
  if (isReference(item)) {
    return getRef(item.$ref)
  }

  if (item.allOf) {
    return item.allOf.map(resolveTypeValue).join(' & ')
  }

  if (item.oneOf) {
    return item.oneOf.map(resolveTypeValue).join(' | ')
  }

  if (item.properties) {
    return (
      '{ ' +
      Object.entries(item.properties)
        .filter(([_, prop]) => !prop.readOnly)
        .map(([key, prop]) => `${key}${(item.required || []).includes(key) ? '' : '?'}: ${resolveTypeValue(prop)}`)
        .join('; ') +
      ' }'
    )
  }

  return item.type === 'object' ? '{}' : 'any'
}

const getScalar = (item) => {
  const nullable = item.nullable ? ' | null' : ''

  switch (item.type) {
    case 'int32':
    case 'int64':
    case 'number':
    case 'integer':
    case 'long':
    case 'float':
    case 'double':
      return 'number' + nullable

    case 'boolean':
      return 'boolean' + nullable

    case 'array':
      return getArray(item) + nullable

    case 'string':
    case 'byte':
    case 'binary':
    case 'date':
    case 'dateTime':
    case 'date-time':
    case 'password':
      return (item.enum ? `"${item.enum.join(`" | "`)}"` : 'string') + nullable

    case 'object':
    default:
      return getObject(item) + nullable
  }
}

const generateSchemasDefinition = (schemas = {}) => {
  if (Object.keys(schemas).length === 0) {
    return ''
  }

  return (
    Object.entries(schemas)
      .map(([name, schema]) =>
        (!schema.type || schema.type === 'object') &&
        !schema.allOf &&
        !schema.oneOf &&
        !isReference(schema) &&
        !schema.nullable
          ? `export type ${pascalCase(name)} = ${getScalar(schema)}`
          : `export type ${pascalCase(name)} = ${resolveTypeValue(schema)}`
      )
      .join('\n\n') + '\n'
  )
}

const getResReqTypes = (responsesOrRequests) =>
  responsesOrRequests
    .map(([_, res]) => {
      if (!res) {
        return 'void'
      }

      if (isReference(res)) {
        return getRef(res.$ref)
      } else {
        if (res.content && res.content['application/json']) {
          const schema = res.content['application/json'].schema
          return resolveTypeValue(schema)
        } else if (res.content && res.content['application/octet-stream']) {
          const schema = res.content['application/octet-stream'].schema
          return resolveTypeValue(schema)
        } else {
          return 'void'
        }
      }
    })
    .join(' | ')

const generateResponsesDefinition = (responses = {}) => {
  if (Object.keys(responses).length === 0) {
    return ''
  }

  return (
    '\n' +
    Object.entries(responses)
      .map(([name, response]) => {
        const type = getResReqTypes([['', response]])

        if (type.includes('{') && !type.includes('|') && !type.includes('&')) {
          return `export interface ${pascalCase(name)}Response ${type}`
        } else {
          return `export type ${pascalCase(name)}Response = ${type}`
        }
      })
      .join('\n\n') +
    '\n'
  )
}

function generatorGlobalTypes(schema) {
  let output = ''

  output += generateSchemasDefinition(schema.components && schema.components.schemas)
  output += generateResponsesDefinition(schema.components && schema.components.responses)

  return `${output}
`
}

function generatorTypes({ pathParamsBase, queryParamsBase, hasPathParams, hasQueryParams, operationName }) {
  let output = ''

  output += ifElse(
    hasPathParams,
    `export type ${operationName}PathParams = { ${pathParamsBase
      .map((p) => `${p.name}${p.required ? '' : '?'}: ${resolveTypeValue(p.schema)}`)
      .join('; ')} }
`
  )

  output += ifElse(
    hasQueryParams,
    `export type ${operationName}QueryParams = { ${queryParamsBase
      .map((p) => `${fixTypeWhenHaveHyphen(p.name)}${p.required ? '' : '?'}: ${resolveTypeValue(p.schema)}`)
      .join('; ')} }
`
  )

  return output
}

module.exports = {
  generatorTypes,
  getResReqTypes,
  resolveTypeValue,
  generatorGlobalTypes,
}
