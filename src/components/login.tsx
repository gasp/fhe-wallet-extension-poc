import { useCallback, useState } from 'react'
import { service } from '../libs/offscreeen-service'
import { LoginResponse } from '../libs/messages'
import { usePopupStore } from '../store'

export function Login() {
  const [password, setPassword] = useState('swordfish')
  const [error, setError] = useState('')
  const setAddress = usePopupStore((state) => state.setAddress)

  const onLogin = useCallback(async () => {
    try {
      const response = (await service({
        type: 'login',
        data: { password },
      })) as LoginResponse['data']
      if (response === false) {
        setError('Invalid password')
        return
      }
      setAddress(response.address)
      setError('')
    } catch (error) {
      console.error(error)
      setError(`Error decrypting key: ${error}`)
    }
  }, [password, setAddress])

  return (
    <section>
      <h1>Login</h1>
      <p>input your password to unlock your wallet</p>
      <div>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '50%', margin: '1rem 0' }}
        />
      </div>
      <button onClick={onLogin}>Unlock</button>
      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
