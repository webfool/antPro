// import request from '@/utils/request'

// 通过 google code 去 node 端获取用户信息
export async function login(code: string): Promise<any> {
  console.log('code ->', code)
  return {
    avatar:
      'https://lh6.googleusercontent.com/-OeCGPFRTzoQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmqlANRmsCKBw5mIYQ0izGbNu1i9w/s100/photo.jpg',
    createTime: 1593005852000,
    email: 'haowen.liu@shopee.com',
    id: '2',
    name: 'Haowen Liu',
    permissions: {
      DashboardModule: [
        'DashboardAgentMonitor',
        'DashboardRecovery',
        'DashboardCall',
        'DashboardCase'
      ]
    },
    roleId: '1',
    roleName: 'super admin',
    token:
      '1//0eg93tNMHoxjRCgYIARAAGA4SNwF-L9IrBvuEUu3S9F2IckjQ1meWQ7MXO1Umsy-gjUrL1m2JzAFltBy-wnysiRAi31ohVNSbwB8',
    updateTime: 1593006533000
  }
}

// 校验 token 是否有效
export async function check_login(): Promise<any> {
  return {
    avatar:
      'https://lh6.googleusercontent.com/-OeCGPFRTzoQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmqlANRmsCKBw5mIYQ0izGbNu1i9w/s100/photo.jpg',
    createTime: 1593005852000,
    email: 'haowen.liu@shopee.com',
    id: '2',
    name: 'Haowen Liu',
    permissions: {
      DashboardModule: [
        'DashboardAgentMonitor',
        'DashboardRecovery',
        'DashboardCall',
        'DashboardCase'
      ]
    },
    roleId: '1',
    roleName: 'super admin',
    token:
      '1//0eg93tNMHoxjRCgYIARAAGA4SNwF-L9IrBvuEUu3S9F2IckjQ1meWQ7MXO1Umsy-gjUrL1m2JzAFltBy-wnysiRAi31ohVNSbwB8',
    updateTime: 1593006533000
  }
}

// 退出登陆
export async function logout(): Promise<any> {
  return true
}
