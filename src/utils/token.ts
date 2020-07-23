const TOKEN_KEY = 'GOOGLE_AUTH_TOKEN'

/**
 * 获取存储于 storage 的 token 值
 */
export const getAuthorizationToken = () => localStorage.getItem(TOKEN_KEY)

/**
 * 存储 token 值到 storage
 * @param {string} token - 待存储的 token 值
 */
export const setAuthorizationToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 删除 storage 中的 token 值
 */
export const removeAuthorizationToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
