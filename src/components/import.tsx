import { useState } from 'react'
import { setEncryptedWalletKey } from '../storage'
import { useAuthStore } from '../store'
import { encryptPrivateKey } from '../libs/aes'

export function Import() {
  const [password, setPassword] = useState('swordfish')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')
  const setHasWallet = useAuthStore((state) => state.setHasWallet)

  const storeEncryptedKey = async () => {
    if (!privateKey || !password)
      return setError('Enter private key and password')
    try {
      const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
      await setEncryptedWalletKey({ encrypted, iv })
      setHasWallet(true)
      setError('')
    } catch (error) {
      console.error(error)
      setError(`Error encrypting key ${error}`)
    }
  }

  return (
    <section>
      <h1>Import your wallet</h1>
      <p>Disclaimer: I don't know how this is secure, it's for testing only</p>
      <div>
        <input
          type="text"
          placeholder="Wallet Private Key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
      </div>
      <div>(get this code from your metamask extension)</div>
      <div>
        <input
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={storeEncryptedKey}>Import your wallet</button>

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
