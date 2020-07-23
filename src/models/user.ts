/**
 * 该模块管理 user 信息，包括：
 * - 登陆
 * - 登出
 * - 校验用户信息是否失效
 * - 保存用户信息
 */
import { Effect, Reducer, history } from 'umi'
import { login, check_login, logout } from '@/services/user'
// 工具包
import { getAuthorizationCode } from '@/utils/googleAuth'
import { getPageQuery } from '@/utils/utils'
import { reloadAuthorized } from '@/utils/Authorized'
import { setAuthorizationToken, removeAuthorizationToken } from '@/utils/token'

export interface CurrentUser {
  name: string
  avatar: string
  email: string
  permissions: UserAuthorized
}

export interface UserModelState {
  currentUser?: CurrentUser
}

export interface UserModelType {
  namespace: 'user'
  state: UserModelState
  effects: {
    [key: string]: Effect
  }
  reducers: {
    [key: string]: Reducer<UserModelState>
  }
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    // currentUser: undefined
    currentUser: {
      avatar:
        'https://lh6.googleusercontent.com/-OeCGPFRTzoQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmqlANRmsCKBw5mIYQ0izGbNu1i9w/s100/photo.jpg',
      email: 'haowen.liu@shopee.com',
      name: 'Haowen Liu',
      permissions: {
        DashboardModule: [
          'DashboardAgentMonitor',
          'DashboardRecovery',
          'DashboardCall',
          'DashboardCase'
        ]
      }
    }
  },

  effects: {
    *login(_, { call, put }) {
      const code = yield call(getAuthorizationCode)
      const data = yield call(() => login(code))

      if (!data) return
      const { token, permissions, ...result } = data
      reloadAuthorized(permissions) // 保存权限信息
      setAuthorizationToken(token) // 保存 token 信息

      // 登陆成功之后，如果地址后缀有 redirect，则按 redirect 进行跳转处理
      const urlParams = new URL(window.location.href)
      const params = getPageQuery()
      let { redirect } = params as { redirect: string }
      if (redirect) {
        const redirectUrlParams = new URL(redirect)
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length)
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1)
          }
        } else {
          window.location.href = '/'
        }
      }
      history.replace(redirect || '/main')

      // 此处要注意：必须先 history.replace 地址，再修改 state 数据
      yield put({
        type: 'saveCurrentUser',
        payload: result
      })
    },

    *check_login({ unLoginCb }, { call, put }) {
      const data = yield call(check_login)
      if (!data) {
        removeAuthorizationToken()
        unLoginCb()
        return
      }
      const { token, permissions, ...result } = data
      reloadAuthorized(permissions) // 保存权限信息
      setAuthorizationToken(token) // 保存 token 信息
      yield put({
        type: 'saveCurrentUser',
        payload: result
      })
    },

    *logout(_, { call, put }) {
      const data = yield call(logout)
      if (!data) return

      history.replace('/user/login')
      reloadAuthorized({})
      removeAuthorizationToken()

      yield put({
        type: 'saveCurrentUser',
        payload: undefined
      })
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      }
    }
  }
}

export default UserModel
