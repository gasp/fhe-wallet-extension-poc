import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { setEncryptedWalletKey } from '../storage'
import { useAuthStore } from '../store'
import { encryptPrivateKey } from '../libs/aes'

export function Create() {
  const [password, setPassword] = useState('swordfish')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')
  const setHasWallet = useAuthStore((state) => state.setHasWallet)

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom()
    setPrivateKey(wallet.privateKey)
  }, [])

  const storeEncryptedKey = async () => {
    if (!privateKey || !password)
      return setError('Enter private key and password')
    try {
      console.log('encrypting in create')
      const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
      console.log(JSON.stringify({ encrypted, iv }))
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
      <h1>New wallet</h1>
      <p>Disclaimer: I don't know how this is secure, it's for testing only</p>
      <div>
        <input
          type="text"
          placeholder="Wallet Private Key"
          value={privateKey}
          // disabled
          onChange={(e) => setPrivateKey(e.target.value)}
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
