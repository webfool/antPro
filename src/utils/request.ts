/**
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 * request 请求工具，支持以下功能：
 * - 统一配置 url 前缀，亦可传入 baseUrl 配置自定义 url 前缀
 * - 允许配置 loading 参数开启请求时打开全局 loading 的功能
 * - 请求默认带上 token，允许配置 notToken 参数取消携带
 * - 自动对请求的数据对象进行去空处理，以及去除字符串前后空格
 * - 同一个请求，后面发起的会把前面发起但未完成的请求取消。以 method、url、params 三者为因素生成请求的唯一标识
 * - 请求头默认带上 redirectUri、requestId 和 token
 * - 每一次请求都会被缓存，请求完成自动清除缓存。亦可传入 getCancel 方法获取取消当前请求的方法，在特定情况下手动取消
 * - 对外暴露2个方法：cancelAllRequest（取消所有正在进行的请求） 和 cancelRequest（取消特定请求）
 * - 针对以下情况进行了错误处理：url 无效、断网、请求被取消、http 状态码不为 2xx、后端返回信息 code 不为 0
 */
import Request, { extend, Canceler, RequestOptionsInit } from 'umi-request'
import { notification } from 'antd'
import { getDvaApp, formatMessage, history } from 'umi'
import { v4 as uuidv4 } from 'uuid'
import { isObject, objectTrim } from '@/utils/utils'
import env from '@/../config/env'
import { removeAuthorizationToken, getAuthorizationToken } from '@/utils/token'

const REDIRECT_URI_HEADER = 'X-Oauth2-Redirect-Uri'
const REQUEST_ID_HEADER = 'X-Request-Id'
const TOKEN_HEADER = 'token'
const prefix = env.baseUrl

// 缓存正在请求的api所对应的取消请求的方法
let requestingApis: { [key: string]: Canceler } = {}
// 取消所有正在进行的请求
export function cancelAllRequest() {
  Object.values(requestingApis).forEach((cancel) => cancel())
  requestingApis = {}
}
// 取消某个特定的请求
export function cancelRequest(key: string | string[], baseUrl?: string) {
  const keys = Array.isArray(key) ? key : [key]
  keys.forEach((api) => {
    api = (baseUrl || prefix) + api
    requestingApis[api] && requestingApis[api]()
    delete requestingApis[api]
  })
}

export interface requestOptions extends RequestOptionsInit {
  baseUrl?: string // 自定义 url 前缀
  getCancel?(cancel: Canceler): void // 获取取消当前请求的方法
  loading?: boolean // 请求时是否开启全局 loading
  notToken?: boolean // 请求头是否不带 token
}

/**
 * 异常处理程序：url无效、断网、http返回状态码不为 2xx、请求被取消，后端返回信息里 code 不为 0，会走该 errorHandler
 *
 * 不同场景下的 error 对象:
 * - 【url 无效、断网】：error.response 为 null 或 html 字符串，报错信息取 error.message
 * - 【请求被取消】：error.response 为 null，error.message 和 error.data 都没有值，可以固定写死提示信息，如 请求被取消
 * - 【http 返回状态码不为 2xx】：响应对象放在 error.response 中，报错信息在 error.data 中找，目前与后端约定的是 msg 字段，即 error.data.msg
 * - 【后端返回信息 code 不为 0】：响应对象放在 error.response 中，并且有 error.isResDataErr 标识代表是返回数据 code 不为 0的情况。报错信息以后端报错信息为准
 */

type ErrFlag = {
  isCancel?: boolean // 是否被取消
  isExpired?: boolean // 是否 token 过期
  isResDataErr?: boolean // 是否成功请求和返回，但返回的不是正常的数据
  isOther?: boolean // 其它错误
}
const errorHandler = (error: any): never => {
  let err: ErrFlag

  // 如果有配置 loading，则关闭全局 loading
  const dispatch = getDvaApp()._store.dispatch
  if (error.request && error.request.options && error.request.options.loading) {
    dispatch({
      type: 'global/changeLoading',
      payload: false
    })
  }

  // 报错提示的标题和描述
  let message: string
  let description: string
  const defaultErrorMsg = formatMessage({ id: 'message.request.defaultError' })

  if (error.__CANCEL__) {
    // 请求被取消时
    err = { isCancel: true }
    message = defaultErrorMsg
    description = formatMessage({ id: 'message.request.cancelTip' })
  } else if (error.response !== null && typeof error.response === 'object') {
    // http返回非2xx请求 或者 后端返回数据code不为0
    if (error.isResDataErr) {
      err = { isResDataErr: true }
      message = defaultErrorMsg
      description = error.response.msg || defaultErrorMsg
    } else if (error.response.status === 401) {
      // 登陆过期时，自动跳转登陆页
      history.replace({
        pathname: `/user/login`,
        query: {
          redirect: window.location.href
        }
      })

      removeAuthorizationToken()
      dispatch({
        type: 'user/saveCurrentUser',
        payload: null
      })

      err = { isExpired: true }
      message = defaultErrorMsg
      description = formatMessage({ id: 'message.request.tokenExpire' })
    } else {
      err = { isOther: true }
      message = defaultErrorMsg
      description = error.data ? error.data.msg : defaultErrorMsg
    }
  } else {
    // url 错误、断网
    err = { isOther: true }
    message = formatMessage({ id: 'message.request.netError' })
    description = error.message || defaultErrorMsg
  }

  notification.error({
    message,
    description
  })

  throw err
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  timeout: 60 * 1000,
  errorHandler // 默认错误处理，特定 api 可单独配置 errorHandler 进行覆盖
})

request.use(async (ctx, next) => {
  // === 请求前的拦截 ===
  const { req } = ctx
  let { url } = req
  const { options } = req
  const { baseUrl, getCancel, loading, notToken = false } = options as requestOptions

  // url 添加前缀
  url = url.startsWith('http') ? url : (baseUrl || prefix) + url

  // 过滤空字段
  const { params, data, method } = options
  params && isObject(params) && objectTrim(params)
  data && isObject(data) && objectTrim(data)

  const cacheKey = `${method}${url}${JSON.stringify(data || params || {})}`

  // 如果当前 api 正在请求，则取消之前的请求
  if (requestingApis[cacheKey]) requestingApis[cacheKey]()

  // 配置头信息
  const headers = options.headers as Record<string, string>
  !notToken && (headers[TOKEN_HEADER] = getAuthorizationToken() || '')
  headers[REDIRECT_URI_HEADER] = location.origin
  headers[REQUEST_ID_HEADER] = uuidv4()

  // 取消请求的相关配置
  const { CancelToken } = Request
  const { token, cancel } = CancelToken.source()
  options.cancelToken = token
  requestingApis[cacheKey] = cancel
  if (typeof getCancel === 'function') {
    getCancel(cancel)
  }

  ctx.req.url = url
  ctx.req.options = options

  // 如果传入 loading 配置，则打开全局 loading
  const dispatch = getDvaApp()._store.dispatch
  if (loading) {
    dispatch({
      type: 'global/changeLoading',
      payload: true
    })
  }

  await next()

  // === 请求后的拦截，如果出错了，则会走 errorHandle，不会走下面的代码 ===
  const { res } = ctx
  delete requestingApis[url]

  // 清除全局 loading
  if (loading) {
    dispatch({
      type: 'global/changeLoading',
      payload: false
    })
  }

  if (res) {
    // 正常的请求，将实际的内容数据返回
    if (res.code === 0) {
      ctx.res = res.data || {}
    }

    // 异常数据，进行报错并将返回内容置为 null
    if (res.code !== 0) {
      // eslint-disable-next-line
      throw { isResDataErr: true, request: req, response: res }
    }
  }
})

export default {
  get(url: string, options: requestOptions = {}) {
    const { data, ...rest } = options
    return request.get(url, {
      params: data,
      ...rest
    })
  },
  post(url: string, options: requestOptions = {}) {
    return request.post(url, options)
  },
  put(url: string, options: requestOptions = {}) {
    return request.put(url, options)
  },
  delete(url: string, options: requestOptions = {}) {
    return request.delete(url, options)
  }
}
