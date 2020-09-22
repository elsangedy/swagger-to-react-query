/* eslint-disable */
/* tslint:disable */
import ky, { Options } from 'ky'
import { QueryOptions, QueryResult, MutationOptions, MutateFunction, MutationResult } from 'react-query'

export const getApi: { (): typeof ky }

export const setApi: { (newApi: typeof ky ): void }

export const extendApi: { (options: Options ): void }

export type TxId = string

export type EndToEndId = string

export type DevolucaoId = string

export type CobStatus = "ATIVA" | "CONCLUIDA" | "REMOVIDA_PELO_USUARIO_RECEBEDOR" | "REMOVIDA_PELO_PSP"

export type CPF = string

export type CNPJ = string

export type Revisao = number

export type Location = string

export type PessoaFisica = { cpf: CPF & any; nome: string }

export type PessoaJuridica = { cnpj: CNPJ & any; nome: string }

export type Webhook = { webhookUrl: string }

export type CobExpiracao = { expiracao?: number }

export type CobApresentacao = { apresentacao: string }

export type CobCriacao = { criacao: string }

export type Valor = string

export type CobBase = { devedor?: PessoaFisica | PessoaJuridica; valor?: { original: Valor & any }; chave?: string; solicitacaoPagador?: string; infoAdicionais?: { nome: string; valor: string }[] }

export type CobSolicitada = { calendario?: CobExpiracao } & CobBase

export type CobRevisada = { calendario?: CobExpiracao; status?: CobStatus } & CobBase

export type CobGerada = { calendario?: CobCriacao & CobExpiracao; status?: CobStatus; txid?: TxId; revisao?: Revisao; location?: Location } & CobBase

export type CobCompleta = CobGerada & CobSolicitada & { pix?: Pix[] }

export type CobPayload = { txid?: TxId; revisao?: Revisao; calendario?: CobCriacao & CobApresentacao & CobExpiracao; status?: CobStatus } & CobBase

export type ParametrosConsultaCob = { inicio: string; fim: string; cpf?: CPF & any; cnpj?: CNPJ & any; status?: CobStatus & any; paginacao: Paginacao }

export type CobsConsultadas = { parametros: ParametrosConsultaCob; cobs: (CobCompleta & any)[] }

export type Pix = { endToEndId: EndToEndId; txid?: TxId; valor: Valor & any; horario: string; pagador?: PessoaFisica | PessoaJuridica; infoPagador?: string; devolucoes?: Devolucao[] }

export type Devolucao = { id: DevolucaoId; rtrId: string; valor: Valor & any; horario: { solicitacao: string; liquidacao?: string }; status: "EM_PROCESSAMENTO" | "DEVOLVIDO" | "NAO_REALIZADO" }

export type ParametrosConsultaPix = { inicio: string; fim: string; cpf?: CPF & any; cnpj?: CNPJ & any; txId?: TxId; paginacao: Paginacao }

export type PixConsultados = { parametros: ParametrosConsultaPix; pix?: (Pix)[] }

export type Paginacao = { paginaAtual: number; itensPorPagina: number; quantidadeDePaginas: number; quantidadeTotalDeItens: number }

export type CriarCobrancaPathParams = { txid: TxId }
export const mutationCriarCobranca: { (pathParams?: CriarCobrancaPathParams, options?: Options): { (body?: CobBodyRequestBody | [CriarCobrancaPathParams, void, CobBodyRequestBody, Options]): Promise<CobGerada> } }
export const useMutationCriarCobranca: { (pathParams?: CriarCobrancaPathParams, config?: MutationOptions<CobGerada, CobBodyRequestBody>, options?: Options): [MutateFunction<CobGerada, CobBodyRequestBody | [CriarCobrancaPathParams, void, CobBodyRequestBody, Options]>, MutationResult<CobGerada>] }

export type RevisarCobrancaPathParams = { txid: TxId }
export const mutationRevisarCobranca: { (pathParams?: RevisarCobrancaPathParams, options?: Options): { (body?: CobBodyRevisadaRequestBody | [RevisarCobrancaPathParams, void, CobBodyRevisadaRequestBody, Options]): Promise<CobGerada> } }
export const useMutationRevisarCobranca: { (pathParams?: RevisarCobrancaPathParams, config?: MutationOptions<CobGerada, CobBodyRevisadaRequestBody>, options?: Options): [MutateFunction<CobGerada, CobBodyRevisadaRequestBody | [RevisarCobrancaPathParams, void, CobBodyRevisadaRequestBody, Options]>, MutationResult<CobGerada>] }

export type ConsultarCobrancaPathParams = { txid: TxId }
export type ConsultarCobrancaQueryParams = { revisao?: Revisao }
export const queryConsultarCobranca: { (pathParams?: ConsultarCobrancaPathParams, queryParams?: ConsultarCobrancaQueryParams, options?: Options): Promise<CobCompleta> }
export const useQueryConsultarCobranca: { (pathParams?: ConsultarCobrancaPathParams, queryParams?: ConsultarCobrancaQueryParams, config?: QueryOptions<CobCompleta>, options?: Options): QueryResult<CobCompleta>; queryKey: string }

export type ConsultarListaDeCobrancasQueryParams = { cpf?: CPF & any; cnpj?: CNPJ & any; status?: CobStatus & any }
export const queryConsultarListaDeCobrancas: { (queryParams?: ConsultarListaDeCobrancasQueryParams, options?: Options): Promise<CobsConsultadas> }
export const useQueryConsultarListaDeCobrancas: { (queryParams?: ConsultarListaDeCobrancasQueryParams, config?: QueryOptions<CobsConsultadas>, options?: Options): QueryResult<CobsConsultadas>; queryKey: string }

export type SolicitarDevolucaoPathParams = { e2eid: EndToEndId; id: DevolucaoId }
export const mutationSolicitarDevolucao: { (pathParams?: SolicitarDevolucaoPathParams, options?: Options): { (body?: { valor?: Valor & any } | [SolicitarDevolucaoPathParams, void, { valor?: Valor & any }, Options]): Promise<Devolucao> } }
export const useMutationSolicitarDevolucao: { (pathParams?: SolicitarDevolucaoPathParams, config?: MutationOptions<Devolucao, { valor?: Valor & any }>, options?: Options): [MutateFunction<Devolucao, { valor?: Valor & any } | [SolicitarDevolucaoPathParams, void, { valor?: Valor & any }, Options]>, MutationResult<Devolucao>] }

export type ConsultarDevolucaoPathParams = { e2eid: EndToEndId; id: DevolucaoId }
export const queryConsultarDevolucao: { (pathParams?: ConsultarDevolucaoPathParams, options?: Options): Promise<Devolucao> }
export const useQueryConsultarDevolucao: { (pathParams?: ConsultarDevolucaoPathParams, config?: QueryOptions<Devolucao>, options?: Options): QueryResult<Devolucao>; queryKey: string }

export type ConsultarPixPathParams = { e2eid: EndToEndId }
export const queryConsultarPix: { (pathParams?: ConsultarPixPathParams, options?: Options): Promise<Pix> }
export const useQueryConsultarPix: { (pathParams?: ConsultarPixPathParams, config?: QueryOptions<Pix>, options?: Options): QueryResult<Pix>; queryKey: string }

export type ConsultarPixRecebidosQueryParams = { txId?: TxId; cpf?: CPF & any; cnpj?: CNPJ & any }
export const queryConsultarPixRecebidos: { (queryParams?: ConsultarPixRecebidosQueryParams, options?: Options): Promise<PixConsultados> }
export const useQueryConsultarPixRecebidos: { (queryParams?: ConsultarPixRecebidosQueryParams, config?: QueryOptions<PixConsultados>, options?: Options): QueryResult<PixConsultados>; queryKey: string }

export type RecuperarOPayloadJsonQueRepresentaACobrancaPathParams = { pixUrlAcessToken: string }
export const queryRecuperarOPayloadJsonQueRepresentaACobranca: { (pathParams?: RecuperarOPayloadJsonQueRepresentaACobrancaPathParams, options?: Options): Promise<void> }
export const useQueryRecuperarOPayloadJsonQueRepresentaACobranca: { (pathParams?: RecuperarOPayloadJsonQueRepresentaACobrancaPathParams, config?: QueryOptions<void>, options?: Options): QueryResult<void>; queryKey: string }

export const mutationConfigurarOWebhookPix: { (options?: Options): { (body?: Webhook | [void, void, Webhook, Options]): Promise<void> } }
export const useMutationConfigurarOWebhookPix: { (config?: MutationOptions<void, Webhook>, options?: Options): [MutateFunction<void, Webhook | [void, void, Webhook, Options]>, MutationResult<void>] }

export const queryExibirInformacoesAcercaDoWebookPix: { (options?: Options): Promise<Webhook> }
export const useQueryExibirInformacoesAcercaDoWebookPix: { (config?: QueryOptions<Webhook>, options?: Options): QueryResult<Webhook>; queryKey: string }

export const mutationCancelarOWebhookPix: { (options?: Options): { (body?: void | [void, void, void, Options]): Promise<void> } }
export const useMutationCancelarOWebhookPix: { (config?: MutationOptions<void, void>, options?: Options): [MutateFunction<void, void | [void, void, void, Options]>, MutationResult<void>] }

