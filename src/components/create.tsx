import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { setEncryptedWalletKey } from '../storage'
import { useAuthStore } from '../store'

export function Create() {
  const [password, setPassword] = useState('swordsfish')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')
  const setHasWallet = useAuthStore((state) => state.setHasWallet)

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom()
    setPrivateKey(wallet.privateKey)
  }, [])

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

  const storeEncryptedKey = async () => {
    if (!privateKey || !password)
      return setError('Enter private key and password')
    const key = await getKeyFromPassword(password)
    const enc = new TextEncoder()
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(privateKey)
    )
    setEncryptedWalletKey({
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
    })
    setHasWallet(true)
  }

  return (
    <section>
      <h1>New wallet</h1>
      <p>Disclaimer: I don't know how this is secure, it's for testing only</p>
      <div>
        <input
          type="text"
          placeholder="Wallet Private Key"
          value={privateKey}
          disabled
        />
      </div>
      <div>(copy this code somewhere)</div>
      <div>
        <input
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        make sure you remember this password, without it your wallet is lost
      </div>
      <button onClick={storeEncryptedKey}>Create your wallet</button>
      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
