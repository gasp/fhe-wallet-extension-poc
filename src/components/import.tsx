import { useCallback, useState } from 'react'
import { service } from '../libs/offscreeen-service'

export function Import() {
  const [password, setPassword] = useState('swordfish')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')

  const onImport = useCallback(async () => {
    if (!privateKey || !password)
      return setError('Enter private key and password')
    try {
      await service({
        type: 'wallet-import',
        data: { walletPrivateKey: privateKey, password },
      })
      setError('')
    } catch (error) {
      console.error(error)
      setError(`Error encrypting key ${error}`)
    }
  }, [privateKey, password])

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
      <button onClick={onImport}>Import your wallet</button>

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
