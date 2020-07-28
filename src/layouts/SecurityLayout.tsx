/**
 * 该组件负责对登陆状态进行校验：
 * - 登陆之后不能进行 login 页，未登陆不能进入 main 页
 * - 未登陆但存了 token，则校验 token 是否过期
 */
import { stringify } from 'querystring'
import React from 'react'
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect, connect, ConnectProps } from 'umi'
import { Spin } from 'antd'
import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import { getAuthorizationToken } from '@/utils/token'

interface SecurityLayoutProps extends ConnectProps {
  currentUser?: CurrentUser
  globalLoading: boolean
}

interface SecurityLayoutState {
  isCheckingLogin: boolean
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isCheckingLogin: true
  }

  componentDidMount() {
    const { currentUser, dispatch } = this.props
    const token = getAuthorizationToken()
    if (!currentUser && token) {
      dispatch!({
        type: 'user/check_login',
        unLoginCb: () => {
          // token 无效的回调
          this.setState({
            isCheckingLogin: false
          })
        }
      })
    }
  }

  render() {
    /**
     * - 没有 user、token，跳转 login 页
     * - 没有 user, 有 token，进行 check_login
     *  ｜- check 通过：当前页不是 login，则进入；是 login，则进入主页
     *  ｜- check 不通过：跳转 login 页
     * - 有 user
     *  ｜- 进入 login，或者其它非 /main 下的页面，则跳转回主页
     *  ｜- 其它正常进入
     */
    const { pathname } = window.location
    const { currentUser, children, globalLoading } = this.props

    function createToLoginNode() {
      const queryString = stringify({
        redirect: pathname.startsWith('/main')
          ? window.location.href
          : `${window.location.origin}/main`
      })
      return !pathname.includes('/user/login') ? (
        <Redirect to={`/user/login?${queryString}`} />
      ) : (
        <Spin wrapperClassName="global-loading" spinning={globalLoading}>
          {children}
        </Spin>
      )
    }

    if (currentUser) {
      // 已登陆时，进入登陆页或者非 /main 下的页面，则直接跳转主页
      if (pathname.includes('/user/login') || !pathname.startsWith('/main')) {
        return <Redirect to="/main" />
      }
      return (
        <Spin wrapperClassName="global-loading" spinning={globalLoading}>
          {children}
        </Spin>
      )
    } // 未登陆
    const token = getAuthorizationToken()
    if (!token) {
      // 没有 token，跳转 login 页，并在地址后面加上 redirect
      return createToLoginNode()
    } // 进入 check_login 状态
    const { isCheckingLogin } = this.state
    if (isCheckingLogin) {
      // 正在校验 token 是否有效
      return <PageLoading />
    } // 此处只需要写 token 无效的处理，有效的处理会重新走 if (currentUser) 里面的校验
    return createToLoginNode()
  }
}

export default connect(({ global, user }: ConnectState) => ({
  globalLoading: global.globalLoading,
  currentUser: user.currentUser
}))(SecurityLayout)
