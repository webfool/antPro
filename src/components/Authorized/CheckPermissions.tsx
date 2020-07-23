/**
 * 当前模块主要是权限的具体校验逻辑，包括：
 * - checkPermissions：校验，并返回通过/不通过需要渲染的组件
 * - filter：拿到配置对象数组，过滤出有权限的配置对象
 */
import React from 'react'
import { getCurrent } from './renderAuthorize'

/**
 * === 校验 authority 是否 currentAuthority 的子集，是就返回 target，不是就返回 Exception ===
 * @param { 待校验的权限列表 | Permission judgment } authority
 * @param { 权限列表 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = <T, K>(
  authority: IAuthorityType,
  currentAuthority: string | string[],
  target: T,
  Exception: K
): T | K | React.ReactNode => {
  // 需要校验的权限为空，则返回通过组件
  if (!authority) {
    return target
  }

  // 被校验的 authority 是数组：需要满足其所有项都在 currentAuthority 内
  if (Array.isArray(authority)) {
    if (Array.isArray(currentAuthority)) {
      if (authority.every((item) => currentAuthority.includes(item))) return target
    } else if (authority.length === 1 && authority[0] === currentAuthority) {
      return target
    }
    return Exception
  }

  // 被校验的 authority 是 string：需要满足它在 currentAuthority 内
  if (typeof authority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority === item)) {
        return target
      }
    } else if (authority === currentAuthority) {
      return target
    }
    return Exception
  }

  // 其它情况指直接返回未通过组件
  return Exception
}

export { checkPermissions }

// === 筛选出权限列表，再传给 checkPermissions 进行校验 ===
function check<T, K>(
  authority: IAuthorityType,
  target: T,
  Exception: K,
  pageKey?: string
): T | K | React.ReactNode {
  let authorityList: string[]
  const CURRENT = getCurrent()
  if (pageKey) {
    // 代表是按钮校验
    authorityList = CURRENT[pageKey] || []
  } else {
    // 代表是页面校验
    authorityList = Object.keys(CURRENT)
  }

  return checkPermissions<T, K>(authority, authorityList, target, Exception)
}

export type IAuthorityType = undefined | string | string[]

// === 筛选出有权限的配置对象，每一个配置对象都有一个 key 作为权限标识 ===
interface PermissionBtn {
  key: string
  [k: string]: any
}

export type Filter = (btnsList: PermissionBtn[], pageKey: string) => PermissionBtn[]

const filter: Filter = function(btnsList, pageKey) {
  const CURRENT = getCurrent()
  const allowBtnKeys = CURRENT[pageKey] || []
  return btnsList.filter(({ key }) => allowBtnKeys.includes(key))
}

export { check, filter }
