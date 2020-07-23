const configs = {
  'development': {
    baseUrl: 'http://localhost:4001/v1/dc',
  },
  'test3': {
    baseUrl: '/',
  },
  'test': {
    baseUrl: '/',
  },
  'uat': {
    baseUrl: '/',
  },
  'production': {
    baseUrl: '/',
  },
}

const env = APP_ENV || 'production'
export default configs[env]