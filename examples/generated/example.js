import ky from 'ky'
import { useQuery, useMutation } from 'react-query'

let api = ky.create({
  prefixUrl: 'https://nestjs-example.now.sh'
})

export const getApi = () => api

export const setApi = newApi => (api = typeof newApi === 'function' ? newApi(getApi()) : newApi)

export const queryUsersControllerFindMany = options => api.get(`users`, options).json()
export const useQueryUsersControllerFindMany = (config = {}, options = {}) =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => queryUsersControllerFindMany(options),
    config
  })
useQueryUsersControllerFindMany.queryKey = 'users'

export const mutationUsersControllerCreate = options => api.post(`users`, options).json()
export const useMutationUsersControllerCreate = config => useMutation(mutationUsersControllerCreate, config)

export const queryUsersControllerFindById = ({ id, ...options }) => api.get(`user/${id}`, options).json()
export const useQueryUsersControllerFindById = (params, config = {}, options = {}) =>
  useQuery({
    queryKey: params && params.id && ['user/${id}', params],
    queryFn: (_, { id }) => queryUsersControllerFindById({ id, ...options }),
    config
  })
useQueryUsersControllerFindById.queryKey = 'user/${id}'

export const mutationUsersControllerUpdate = ({ id, ...options }) => api.put(`user/${id}`, options).json()
export const useMutationUsersControllerUpdate = config => useMutation(mutationUsersControllerUpdate, config)

export const mutationUsersControllerDelete = ({ id, ...options }) => api.delete(`user/${id}`, options).json()
export const useMutationUsersControllerDelete = config => useMutation(mutationUsersControllerDelete, config)

export const queryPostsControllerFindMany = options => api.get(`posts`, options).json()
export const useQueryPostsControllerFindMany = (config = {}, options = {}) =>
  useQuery({
    queryKey: ['posts'],
    queryFn: () => queryPostsControllerFindMany(options),
    config
  })
useQueryPostsControllerFindMany.queryKey = 'posts'

export const mutationPostsControllerCreate = options => api.post(`posts`, options).json()
export const useMutationPostsControllerCreate = config => useMutation(mutationPostsControllerCreate, config)

export const queryPostsControllerFindById = ({ id, ...options }) => api.get(`post/${id}`, options).json()
export const useQueryPostsControllerFindById = (params, config = {}, options = {}) =>
  useQuery({
    queryKey: params && params.id && ['post/${id}', params],
    queryFn: (_, { id }) => queryPostsControllerFindById({ id, ...options }),
    config
  })
useQueryPostsControllerFindById.queryKey = 'post/${id}'

export const mutationPostsControllerUpdate = ({ id, ...options }) => api.put(`post/${id}`, options).json()
export const useMutationPostsControllerUpdate = config => useMutation(mutationPostsControllerUpdate, config)

export const mutationPostsControllerDelete = ({ id, ...options }) => api.delete(`post/${id}`, options).json()
export const useMutationPostsControllerDelete = config => useMutation(mutationPostsControllerDelete, config)
