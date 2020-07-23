/**
 * 该模块管理全局的 loading 和 BasicLayout 的侧边菜单是否折叠
 */
import { Subscription, Reducer, Effect } from 'umi'

// import { ConnectState } from './connect.d';

export interface GlobalModelState {
  collapsed: boolean
  globalLoading: boolean
  basicLoading: boolean
}

export interface GlobalModelType {
  namespace: 'global'
  state: GlobalModelState
  effects: {
    [key: string]: Effect
  }
  reducers: {
    [key: string]: Reducer<GlobalModelState>
  }
  subscriptions: { setup: Subscription }
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false, // BasicLayout 是否折叠
    globalLoading: false, // 是否显示全局 loading
    basicLoading: false // 显示的内容区是否显示 loading
  },

  effects: {},

  reducers: {
    // 修改 BasicLayout 折叠状态
    changeLayoutCollapsed(
      state = { collapsed: true, globalLoading: false, basicLoading: false },
      { payload }
    ): GlobalModelState {
      return {
        ...state,
        collapsed: payload
      }
    },

    // 修改全局 loading 状态
    changeLoading(
      state = { collapsed: true, globalLoading: false, basicLoading: false },
      { payload }
    ): GlobalModelState {
      return {
        ...state,
        globalLoading: payload
      }
    },

    // 修改内容区 loading 状态
    changeBasicLoading(
      state = { collapsed: true, globalLoading: false, basicLoading: false },
      { payload }
    ): GlobalModelState {
      return {
        ...state,
        basicLoading: payload
      }
    }
  },

  subscriptions: {
    setup(): void {}
  }
}

export default GlobalModel
