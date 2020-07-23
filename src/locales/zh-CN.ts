import main from './zh-CN/main'
import menu from './zh-CN/menu'
import component from './zh-CN/component'
import message from './zh-CN/message'
import page from './zh-CN/page'

export default {
  ...main, // 全局通用国际化
  ...menu, // 菜单栏国际化
  ...component, // 通用组件国际化
  ...page, // 业务页面国际化
  ...message // 提示信息国际化
}
