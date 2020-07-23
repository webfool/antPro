/**
 * 该模块用来管理全局
 * - root 是否使用 colorWeak 样式
 * - 修改 layout 的 contentWidth 值，并触发页面 resize
 */
import { Reducer } from 'umi'
import defaultSettings, { DefaultSettings } from '../../config/defaultSettings'

export interface SettingModelType {
  namespace: 'settings'
  state: DefaultSettings
  reducers: {
    changeSetting: Reducer<DefaultSettings>
  }
}

const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
  const root = document.getElementById('root')
  if (root) {
    root.className = colorWeak ? 'colorWeak' : ''
  }
}

const SettingModel: SettingModelType = {
  namespace: 'settings',
  state: defaultSettings,
  reducers: {
    changeSetting(state = defaultSettings, { payload }) {
      const { colorWeak, contentWidth } = payload

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'))
      }
      updateColorWeak(!!colorWeak)
      return {
        ...state,
        ...payload
      }
    }
  }
}
export default SettingModel
