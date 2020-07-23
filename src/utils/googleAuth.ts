/**
 * 谷歌授权相关方法
 */
import { notification } from 'antd'

const OAUTH2_CLIENT_ID = '919893897183-8j80gmbeoal1j0vo5v9m7m0fr7rgvmv8.apps.googleusercontent.com'
// import { OAUTH2_CLIENT_ID } from '@/common/constants/oauth2.constant'

interface Failure {
  error: string
  details: string
}

const openErrorNotification = (message: string, description: string) => {
  notification.error({
    message,
    description
  })
}

const callErrorNotice = (title: string, desc: string) => {
  openErrorNotification(title, desc)
}

/**
 * Google 登录授权初始化
 * @async
 * @throws
 */
export const initGoogleAuthorization = () => {
  /* global gapi */
  if (!gapi) {
    const error = 'please load the script https://apis.google.com/js/platform.js'
    callErrorNotice('Google Sign-In OAuth', error)
    throw new Error(error)
  }
  return new Promise((resolve, reject) => {
    gapi.load('auth2', () => {
      gapi.auth2
        .init({
          client_id: OAUTH2_CLIENT_ID
        })
        .then(
          (auth2) => {
            resolve(auth2)
          },
          (err) => {
            callErrorNotice(err.error, err.details)
            reject(err)
          }
        )
    })
  })
}

/**
 * 获取 GoogleAuth 对象，可以通过它获取授权码
 * @async
 */
export const getGoogleAuthorization = () => initGoogleAuthorization()

/**
 * 获取 Google 授权码
 * @async
 * @throws
 */
export const getAuthorizationCode = async () => {
  const auth2 = (await getGoogleAuthorization()) as gapi.auth2.GoogleAuth
  return auth2
    .grantOfflineAccess()
    .then((result) => result.code)
    .catch((err: Failure) => {
      callErrorNotice(err.error, err.details)
      return ''
    })
}
