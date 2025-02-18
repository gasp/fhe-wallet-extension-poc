import { useState } from 'react'
import { usePopupStore } from '../store'
import { service } from '../libs/offscreeen-service'

export function Create() {
  const [password, setPassword] = useState('swordfish')
  const [error, setError] = useState('')
  const setHasWallet = usePopupStore((state) => state.setHasWallet)

  const onCreateWallet = async () => {
    if (!password) return setError('Enter private key and password')
    try {
      const created = (await service({
        type: 'wallet-create-random',
        data: { password },
      })) as boolean
      setHasWallet(created)
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
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        make sure you remember this password, without it your wallet is lost
      </div>
      <button onClick={onCreateWallet}>Create your wallet</button>

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
