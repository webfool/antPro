import main from './en-US/main'
import menu from './en-US/menu'
import component from './en-US/component'
import message from './en-US/message'
import page from './en-US/page'

export default {
  ...main, // 全局通用国际化
  ...menu, // 菜单栏国际化
  ...component, // 通用组件国际化
  ...page, // 业务组件国际化
  ...message // 提示信息国际化
}
