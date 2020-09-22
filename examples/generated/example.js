/* eslint-disable */
/* tslint:disable */
import ky from 'ky'
import { useQuery, useMutation } from 'react-query'

let api = ky.create({
  "prefixUrl": "https://nestjs-example.now.sh",
  "throwHttpErrors": false
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

export const queryUsersControllerFindMany = (options) => queryFn(options)('/users')
export const useQueryUsersControllerFindMany = (config, options) => useQuery({
  queryKey: ['/users'],
  queryFn: queryFn(options),
  config
})
useQueryUsersControllerFindMany.queryKey = '/users'

export const mutationUsersControllerCreate = (options) => mutationFn('post', '/users', {}, {}, options)
export const useMutationUsersControllerCreate = (config, options) => useMutation(mutationFn('post', '/users', {}, {}, options), config)

export const queryUsersControllerFindById = (pathParams, options) => queryFn(options)('/user/{id}', pathParams)
export const useQueryUsersControllerFindById = (pathParams, config, options) => useQuery({
  queryKey: pathParams && pathParams.id && ['/user/{id}', pathParams],
  queryFn: queryFn(options),
  config
})
useQueryUsersControllerFindById.queryKey = '/user/{id}'

export const mutationUsersControllerUpdate = (pathParams, options) => mutationFn('put', '/user/{id}', pathParams, {}, options)
export const useMutationUsersControllerUpdate = (pathParams, config, options) => useMutation(mutationFn('put', '/user/{id}', pathParams, {}, options), config)

export const mutationUsersControllerDelete = (pathParams, options) => mutationFn('delete', '/user/{id}', pathParams, {}, options)
export const useMutationUsersControllerDelete = (pathParams, config, options) => useMutation(mutationFn('delete', '/user/{id}', pathParams, {}, options), config)

export const queryPostsControllerFindMany = (options) => queryFn(options)('/posts')
export const useQueryPostsControllerFindMany = (config, options) => useQuery({
  queryKey: ['/posts'],
  queryFn: queryFn(options),
  config
})
useQueryPostsControllerFindMany.queryKey = '/posts'

export const mutationPostsControllerCreate = (options) => mutationFn('post', '/posts', {}, {}, options)
export const useMutationPostsControllerCreate = (config, options) => useMutation(mutationFn('post', '/posts', {}, {}, options), config)

export const queryPostsControllerFindById = (pathParams, options) => queryFn(options)('/post/{id}', pathParams)
export const useQueryPostsControllerFindById = (pathParams, config, options) => useQuery({
  queryKey: pathParams && pathParams.id && ['/post/{id}', pathParams],
  queryFn: queryFn(options),
  config
})
useQueryPostsControllerFindById.queryKey = '/post/{id}'

export const mutationPostsControllerUpdate = (pathParams, options) => mutationFn('put', '/post/{id}', pathParams, {}, options)
export const useMutationPostsControllerUpdate = (pathParams, config, options) => useMutation(mutationFn('put', '/post/{id}', pathParams, {}, options), config)

export const mutationPostsControllerDelete = (pathParams, options) => mutationFn('delete', '/post/{id}', pathParams, {}, options)
export const useMutationPostsControllerDelete = (pathParams, config, options) => useMutation(mutationFn('delete', '/post/{id}', pathParams, {}, options), config)

