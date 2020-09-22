/* eslint-disable */
/* tslint:disable */
import ky, { Options } from 'ky'
import { QueryOptions, QueryResult, MutationOptions, MutateFunction, MutationResult } from 'react-query'

export const getApi: { (): typeof ky }

export const setApi: { (newApi: typeof ky ): void }

export const extendApi: { (options: Options ): void }

export type User = { id: string; name: string }

export type CreateUserDto = { name: string }

export type UpdateUserDto = { name: string }

export type Post = { id: string; title: string }

export type CreatePostDto = { title: string }

export type UpdatePostDto = { title: string }

export const queryUsersControllerFindMany: { (options?: Options): Promise<void> }
export const useQueryUsersControllerFindMany: { (config?: QueryOptions<void>, options?: Options): QueryResult<void>; queryKey: string }

export const mutationUsersControllerCreate: { (options?: Options): { (body?: CreateUserDto | [void, void, CreateUserDto, Options]): Promise<void> } }
export const useMutationUsersControllerCreate: { (config?: MutationOptions<void, CreateUserDto>, options?: Options): [MutateFunction<void, CreateUserDto | [void, void, CreateUserDto, Options]>, MutationResult<void>] }

export type UsersControllerFindByIdPathParams = { id: string }
export const queryUsersControllerFindById: { (pathParams?: UsersControllerFindByIdPathParams, options?: Options): Promise<void> }
export const useQueryUsersControllerFindById: { (pathParams?: UsersControllerFindByIdPathParams, config?: QueryOptions<void>, options?: Options): QueryResult<void>; queryKey: string }

export type UsersControllerUpdatePathParams = { id: string }
export const mutationUsersControllerUpdate: { (pathParams?: UsersControllerUpdatePathParams, options?: Options): { (body?: UpdateUserDto | [UsersControllerUpdatePathParams, void, UpdateUserDto, Options]): Promise<void> } }
export const useMutationUsersControllerUpdate: { (pathParams?: UsersControllerUpdatePathParams, config?: MutationOptions<void, UpdateUserDto>, options?: Options): [MutateFunction<void, UpdateUserDto | [UsersControllerUpdatePathParams, void, UpdateUserDto, Options]>, MutationResult<void>] }

export type UsersControllerDeletePathParams = { id: string }
export const mutationUsersControllerDelete: { (pathParams?: UsersControllerDeletePathParams, options?: Options): { (body?: void | [UsersControllerDeletePathParams, void, void, Options]): Promise<void> } }
export const useMutationUsersControllerDelete: { (pathParams?: UsersControllerDeletePathParams, config?: MutationOptions<void, void>, options?: Options): [MutateFunction<void, void | [UsersControllerDeletePathParams, void, void, Options]>, MutationResult<void>] }

export const queryPostsControllerFindMany: { (options?: Options): Promise<void> }
export const useQueryPostsControllerFindMany: { (config?: QueryOptions<void>, options?: Options): QueryResult<void>; queryKey: string }

export const mutationPostsControllerCreate: { (options?: Options): { (body?: CreatePostDto | [void, void, CreatePostDto, Options]): Promise<void> } }
export const useMutationPostsControllerCreate: { (config?: MutationOptions<void, CreatePostDto>, options?: Options): [MutateFunction<void, CreatePostDto | [void, void, CreatePostDto, Options]>, MutationResult<void>] }

export type PostsControllerFindByIdPathParams = { id: string }
export const queryPostsControllerFindById: { (pathParams?: PostsControllerFindByIdPathParams, options?: Options): Promise<void> }
export const useQueryPostsControllerFindById: { (pathParams?: PostsControllerFindByIdPathParams, config?: QueryOptions<void>, options?: Options): QueryResult<void>; queryKey: string }

export type PostsControllerUpdatePathParams = { id: string }
export const mutationPostsControllerUpdate: { (pathParams?: PostsControllerUpdatePathParams, options?: Options): { (body?: UpdatePostDto | [PostsControllerUpdatePathParams, void, UpdatePostDto, Options]): Promise<void> } }
export const useMutationPostsControllerUpdate: { (pathParams?: PostsControllerUpdatePathParams, config?: MutationOptions<void, UpdatePostDto>, options?: Options): [MutateFunction<void, UpdatePostDto | [PostsControllerUpdatePathParams, void, UpdatePostDto, Options]>, MutationResult<void>] }

export type PostsControllerDeletePathParams = { id: string }
export const mutationPostsControllerDelete: { (pathParams?: PostsControllerDeletePathParams, options?: Options): { (body?: void | [PostsControllerDeletePathParams, void, void, Options]): Promise<void> } }
export const useMutationPostsControllerDelete: { (pathParams?: PostsControllerDeletePathParams, config?: MutationOptions<void, void>, options?: Options): [MutateFunction<void, void | [PostsControllerDeletePathParams, void, void, Options]>, MutationResult<void>] }

