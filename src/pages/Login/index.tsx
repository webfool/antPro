import React from 'react'
import { GoogleOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'umi'
// === ts 类型 ===
import { Dispatch, AnyAction } from 'redux'
import styles from './index.less'

interface LoginProps {
  dispatch: Dispatch<AnyAction>
}

const Login: React.FC<LoginProps> = (props) => {
  function handleGoogleSignIn() {
    const { dispatch } = props
    dispatch({
      type: 'user/login'
    })
  }

  return (
    <>
      <div className={`absolute text-center font-33 ${styles.title}`}>
        <FormattedMessage id="admin_title" />
      </div>
      <div className={`${styles.btnContainer} flex content-align-center content-row-center`}>
        <div className={styles.loginButton} onClick={handleGoogleSignIn}>
          <GoogleOutlined />
          <span className={styles.loginText}>
            <FormattedMessage id="login_google" />
          </span>
        </div>
      </div>
    </>
  )
}

export default Login
