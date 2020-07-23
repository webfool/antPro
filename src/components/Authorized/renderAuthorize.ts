/**
 * 该模块用来存储权限和刷新权限
 */

// eslint-disable-next-line prettier/prettier
let CURRENT: UserAuthorized = {}

type CurrentAuthorityType = UserAuthorized | (() => UserAuthorized)

// 刷新权限数据
const renderAuthorize = (currentAuthority: CurrentAuthorityType) => {
  if (currentAuthority) {
    // 如果是生成权限数据的函数，则调用函数
    if (typeof currentAuthority === 'function') {
      CURRENT = currentAuthority()
    }

    // 如果是对象，直接使用
    if (Object.prototype.toString.call(currentAuthority) === '[object Object]') {
      CURRENT = currentAuthority as UserAuthorized
    }
  } else {
    CURRENT = {}
  }
}

function getCurrent() {
  return CURRENT
}
export { getCurrent }

export default renderAuthorize
