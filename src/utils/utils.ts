import { parse } from 'querystring'
import pathRegexp from 'path-to-regexp'
import { Route } from '@/models/connect'

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export const isUrl = (path: string): boolean => reg.test(path)

export const getPageQuery = () => parse(window.location.href.split('?')[1])

// 过滤出当前路由匹配到的所有路由的 authorityKey 的值
export const getAllMatchAuthority = (routeData: Route[], path: string): string[] => {
  for (let i = 0; i < routeData.length; i++) {
    const { path: currentPath, exact = false, routes, authorityKey } = routeData[i]
    if (currentPath && pathRegexp(currentPath, [], { end: exact }).test(path)) {
      const authorities = []
      if (authorityKey) {
        if (Array.isArray(authorityKey)) authorities.push(...authorityKey)
        else authorities.push(authorityKey)
      }

      routes && routes.length && authorities.push(...getAllMatchAuthority(routes, path))
      return authorities
    }
  }
  return []
}

// 判断是否是对象
export function isObject(val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

// 过滤对象中的空字符、undefined、null
export function objectTrim(obj: object) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') value = value.trim()
    if (value === null || value === undefined || value === '') delete obj[key]
    else if (isObject(value)) objectTrim(value)
    else obj[key] = value
  })
  return obj
}
