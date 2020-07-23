/**
 * 重置权限的工具方法
 */

import RenderAuthorize from '@/components/Authorized/renderAuthorize'
// 初始加载时，设置权限为空
RenderAuthorize({})

// 重置权限的方法
export const reloadAuthorized = (authority: UserAuthorized): void => {
  RenderAuthorize(authority)
}
window.reloadAuthorized = reloadAuthorized
