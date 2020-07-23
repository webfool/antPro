/**
 * 该组件显示 layout 右上角的用户信息和当前环境
 */
import { Tag } from 'antd'
import { Settings as ProSettings } from '@ant-design/pro-layout'
import React from 'react'
import { connect, ConnectProps } from 'umi'
import { ConnectState } from '@/models/connect'
import Avatar from './AvatarDropdown'
import styles from './index.less'

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark'
}

const ENVTagColor = {
  development: 'orange',
  test3: 'green',
  test: 'green',
  uat: '#87d068'
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props
  let className = styles.right

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`
  }

  return (
    <div className={className}>
      <Avatar />

      {/* 显示当前属于哪个环境，生产环境下不会显示 */}
      {APP_ENV && (
        <span>
          <Tag color={ENVTagColor[APP_ENV]}>{APP_ENV}</Tag>
        </span>
      )}
    </div>
  )
}

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout
}))(GlobalHeaderRight)
