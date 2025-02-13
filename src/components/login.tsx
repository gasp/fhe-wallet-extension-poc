import { useCallback, useState } from 'react'
import { getEncryptedWalletKey } from '../storage'
import { decryptPrivateKey } from '../libs/aes'
import { useAuthStore } from '../store'

export function Login() {
  const [password, setPassword] = useState('swordfish')
  const setWalletPrivateKey = useAuthStore((state) => state.setWalletPrivateKey)
  const [error, setError] = useState('')

  const decryptKey = useCallback(async () => {
    try {
      const { encrypted, iv } = await getEncryptedWalletKey()

      if (!encrypted || !iv) {
        console.error('No encrypted key found')
        return
      }

      const decrypted = await decryptPrivateKey(password, encrypted, iv)
      setWalletPrivateKey(decrypted)

      setError('')
    } catch (error) {
      console.error(error)
      setError(`Error decrypting key: ${error}`)
    }
  }, [password, setWalletPrivateKey])

  return (
    <section>
      <h2>input your password</h2>
      <input
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={decryptKey}>Decrypt Key</button>
      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
