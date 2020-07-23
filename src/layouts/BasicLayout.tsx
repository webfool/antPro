/**
 * 主页面 layout 组件，该组件主要包含如下功能：
 * - 配置 layout 侧边栏：宽度、头部显示、依据 config 中的路由配置展示菜单、折叠切换
 * - 配置 layout 顶部：面包屑（需在使用的地方主动引入 PageContainer 组件包裹）、用户信息、环境显示
 * - 配置 layout 底部：暂时不展示内容
 * - 按照 config 中每项路由配置的 authorityKey 权限进行菜单过滤
 * - 渲染路由组件时，对该路由进行权限校验，通过才渲染
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings
} from '@ant-design/pro-layout'
import React from 'react'
import { Link, useIntl, connect, Dispatch } from 'umi'
import { Result, Spin } from 'antd'
import { Authorized } from '@/components/Authorized/Authorized'
import RightContent from '@/components/GlobalHeader/RightContent'
import { ConnectState } from '@/models/connect'
import { getAllMatchAuthority } from '@/utils/utils'
import logo from '../assets/logo.svg'

// 页面没有权限时，显示的内容
const noMatch = (
  <Result status={403} title="403" subTitle="Sorry, you are not authorized to access this page." />
)
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem
  }
  route: ProLayoutProps['route'] & {
    authorityKey?: string
  }
  settings: Settings // layout 的 setting，默认配置在 config/defaultSettings.ts
  dispatch: Dispatch
  basicLoading: boolean
}

// 侧边菜单栏权限递归过滤
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] }
    return Authorized.check!(item.authorityKey, localItem, null) as MenuDataItem
  })
}

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/'
    },
    basicLoading
  } = props

  // 控制左侧菜单栏是否折叠
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload
      })
    }
  }

  // 获取当前路由所匹配的菜单栏配的所有权限
  const filterAuthorities = getAllMatchAuthority(props.route.routes || [], location.pathname || '/')
  const authorities = filterAuthorities.length ? filterAuthorities : undefined

  // 国际化
  const { formatMessage } = useIntl()

  return (
    <ProLayout
      // 国际化方法
      formatMessage={formatMessage}
      // === layout 侧边菜单配置 ===
      siderWidth={270} // 侧边栏宽度
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/main">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse} // 折叠回调
      // 此处对菜单栏进行权限过滤
      menuDataRender={menuDataRender}
      menuItemRender={(menuItemProps, defaultDom) => {
        // 菜单栏中如果有子菜单，那么该项点击时只展开，但不跳转路由
        if (
          menuItemProps.isUrl ||
          (menuItemProps &&
            menuItemProps.children &&
            menuItemProps.children.length &&
            !menuItemProps.hideChildrenInMenu) ||
          !menuItemProps.path
        ) {
          return defaultDom
        }
        // 其它情况点击之后可以跳转路由
        return <Link to={menuItemProps.path}>{defaultDom}</Link>
      }}
      // === layout 顶部配置 ===
      // 面包屑配置：
      // 如果要显示，需要在页面内引入 import { PageContainer } from '@ant-design/pro-layout';
      // 再包裹实际页面内容
      breadcrumbRender={(routers = []) => [
        // 被渲染的所有面包屑配置
        {
          path: '/main',
          breadcrumbName: formatMessage({ id: 'menu.home' })
        },
        ...routers
      ]}
      itemRender={(route, params, routes) => {
        // 面包屑每一项渲染
        const first = routes.indexOf(route) === 0
        return first ? (
          <Link to="/main">{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        )
      }}
      rightContentRender={() => <RightContent />} // 用户信息及其下拉菜单
      // === layout 底部配置 ===
      footerRender={() => null}
      {...props}
      {...settings}
    >
      <Spin spinning={basicLoading || false} wrapperClassName="basic-logout-container">
        {/* 此处对路由内容进行权限限制 */}
        <Authorized authority={authorities} noMatch={noMatch}>
          {children}
        </Authorized>
      </Spin>
    </ProLayout>
  )
}

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  basicLoading: global.basicLoading,
  settings
}))(BasicLayout)
