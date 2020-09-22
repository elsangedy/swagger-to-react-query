/* eslint-disable */
/* tslint:disable */
import ky from 'ky'
import { useQuery, useMutation } from 'react-query'

let api = ky.create({
  "prefixUrl": "https://pix.com",
  "throwHttpErrors": false,
  "retry": {
    "statusCodes": [
      401
    ]
  }
})

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
    const contentType = (response.headers.get('content-type') || '').split('; ')[0]

    const responseType =
      {
        'application/json': 'json',
        'application/pdf': 'blob'
      }[contentType] || 'text'

    data = await response[responseType]()
  } catch (e) {
    data = e.message
  }

  if (!response.ok) {
    const error = {
      data,
      status: response.status,
      message: `Failed to fetch: ${response.status} ${response.statusText}`
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

export const mutationCriarCobranca = (pathParams, options) => mutationFn('put', '/cob/{txid}', pathParams, {}, options)
export const useMutationCriarCobranca = (pathParams, config, options) => useMutation(mutationFn('put', '/cob/{txid}', pathParams, {}, options), config)

export const mutationRevisarCobranca = (pathParams, options) => mutationFn('patch', '/cob/{txid}', pathParams, {}, options)
export const useMutationRevisarCobranca = (pathParams, config, options) => useMutation(mutationFn('patch', '/cob/{txid}', pathParams, {}, options), config)

export const queryConsultarCobranca = (pathParams, queryParams, options) => queryFn(options)('/cob/{txid}', pathParams, queryParams)
export const useQueryConsultarCobranca = (pathParams, queryParams, config, options) => useQuery({
  queryKey: pathParams && pathParams.txid && ['/cob/{txid}', pathParams, queryParams],
  queryFn: queryFn(options),
  config
})
useQueryConsultarCobranca.queryKey = '/cob/{txid}'

export const queryConsultarListaDeCobrancas = (queryParams, options) => queryFn(options)('/cob/', queryParams)
export const useQueryConsultarListaDeCobrancas = (queryParams, config, options) => useQuery({
  queryKey: ['/cob/', queryParams],
  queryFn: queryFn(options),
  config
})
useQueryConsultarListaDeCobrancas.queryKey = '/cob/'

export const mutationSolicitarDevolucao = (pathParams, options) => mutationFn('put', '/pix/{e2eid}/devolucao/{id}', pathParams, {}, options)
export const useMutationSolicitarDevolucao = (pathParams, config, options) => useMutation(mutationFn('put', '/pix/{e2eid}/devolucao/{id}', pathParams, {}, options), config)

export const queryConsultarDevolucao = (pathParams, options) => queryFn(options)('/pix/{e2eid}/devolucao/{id}', pathParams)
export const useQueryConsultarDevolucao = (pathParams, config, options) => useQuery({
  queryKey: pathParams && pathParams.e2eid && pathParams.id && ['/pix/{e2eid}/devolucao/{id}', pathParams],
  queryFn: queryFn(options),
  config
})
useQueryConsultarDevolucao.queryKey = '/pix/{e2eid}/devolucao/{id}'

export const queryConsultarPix = (pathParams, options) => queryFn(options)('/pix/{e2eid}', pathParams)
export const useQueryConsultarPix = (pathParams, config, options) => useQuery({
  queryKey: pathParams && pathParams.e2eid && ['/pix/{e2eid}', pathParams],
  queryFn: queryFn(options),
  config
})
useQueryConsultarPix.queryKey = '/pix/{e2eid}'

export const queryConsultarPixRecebidos = (queryParams, options) => queryFn(options)('/pix', queryParams)
export const useQueryConsultarPixRecebidos = (queryParams, config, options) => useQuery({
  queryKey: ['/pix', queryParams],
  queryFn: queryFn(options),
  config
})
useQueryConsultarPixRecebidos.queryKey = '/pix'

export const queryRecuperarOPayloadJsonQueRepresentaACobranca = (pathParams, options) => queryFn(options)('/{pixUrlAcessToken}', pathParams)
export const useQueryRecuperarOPayloadJsonQueRepresentaACobranca = (pathParams, config, options) => useQuery({
  queryKey: pathParams && pathParams.pixUrlAcessToken && ['/{pixUrlAcessToken}', pathParams],
  queryFn: queryFn(options),
  config
})
useQueryRecuperarOPayloadJsonQueRepresentaACobranca.queryKey = '/{pixUrlAcessToken}'

export const mutationConfigurarOWebhookPix = (options) => mutationFn('put', '/webhook', {}, {}, options)
export const useMutationConfigurarOWebhookPix = (config, options) => useMutation(mutationFn('put', '/webhook', {}, {}, options), config)

export const queryExibirInformacoesAcercaDoWebookPix = (options) => queryFn(options)('/webhook')
export const useQueryExibirInformacoesAcercaDoWebookPix = (config, options) => useQuery({
  queryKey: ['/webhook'],
  queryFn: queryFn(options),
  config
})
useQueryExibirInformacoesAcercaDoWebookPix.queryKey = '/webhook'

export const mutationCancelarOWebhookPix = (options) => mutationFn('delete', '/webhook', {}, {}, options)
export const useMutationCancelarOWebhookPix = (config, options) => useMutation(mutationFn('delete', '/webhook', {}, {}, options), config)

