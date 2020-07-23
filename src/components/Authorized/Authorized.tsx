/**
 * 该模块是最外层的接收权限数据的组件，包括：
 * - Authorized：接收页面权限数据的组件
 * - AuthorizedBtn：接收按钮权限数据的组件
 */
import React from 'react'
import { Result } from 'antd'
import { check, IAuthorityType, filter, Filter } from './CheckPermissions'

interface AuthorizedProps {
  authority: IAuthorityType
  noMatch?: React.ReactNode
}

type IAuthorizedType = React.FunctionComponent<AuthorizedProps> & {
  check?: typeof check
  filter?: Filter
}

// 组件：接收页面权限数据的组件
export const Authorized: IAuthorizedType = ({
  children,
  authority,
  noMatch = (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  )
}) => {
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children
  const dom = check(authority, childrenRender, noMatch)
  return <>{dom}</>
}

Authorized.check = check
Authorized.filter = filter

// 组件：接收按钮权限数据的组件
interface AuthorizedBtnProps {
  authority: string
  pageKey: string
  noMatch?: React.ReactNode | null
}

export const AuthorizedBtn: React.FunctionComponent<AuthorizedBtnProps> = ({
  authority,
  pageKey,
  children,
  noMatch = null
}) => {
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children
  const dom = check(authority, childrenRender, noMatch, pageKey)
  return <>{dom}</>
}
