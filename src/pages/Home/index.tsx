import React from 'react'
import { login } from '@/services/user'

export default () => {
  return (
    <>
      <div style={{ padding: '30px' }}>Home Page</div>
      <button onClick={() => login('abc')}>点击</button>
    </>
  )
}
