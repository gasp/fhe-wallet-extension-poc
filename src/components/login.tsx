import { useCallback, useState } from 'react'
import { getEncryptedWalletKey } from '../storage'

export function Login() {
  const [password, setPassword] = useState('')
  const [decryptedKey, setDecryptedKey] = useState('')
  const [error, setError] = useState('')

  const getKeyFromPassword = async (password: string) => {
    const enc = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode('wallet_salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  const decryptKey = useCallback(async () => {
    try {
      const { encrypted, iv } = await getEncryptedWalletKey()
      if (!encrypted || !iv) {
        console.error('No encrypted key found')
        return
      }
      const key = await getKeyFromPassword(password)
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        key,
        new Uint8Array(encrypted)
      )
      setDecryptedKey(new TextDecoder().decode(decrypted))
    } catch (error) {
      console.error(error)
      setError('Error decrypting key')
    }
  }, [password])

  return (
    <section>
      <h2>input your password</h2>
      <input
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={decryptKey}>Decrypt Key</button>
      {decryptedKey && (
        <div>
          <strong>Decrypted Private Key:</strong> {decryptedKey}
        </div>
      )}
      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
