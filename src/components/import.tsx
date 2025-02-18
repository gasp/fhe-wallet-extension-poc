import { useCallback, useState } from 'react'
import { service } from '../libs/offscreeen-service'
import { usePopupStore } from '../store'

export function Import() {
  const [password, setPassword] = useState('swordfish')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')
  const setHasWallet = usePopupStore((state) => state.setHasWallet)

  const onImport = useCallback(async () => {
    if (!privateKey || !password)
      return setError('Enter private key and password')
    try {
      const imported = await service({
        type: 'wallet-import',
        data: { walletPrivateKey: privateKey, password },
      })
      if (imported) setHasWallet(true)
    } catch (error) {
      console.error(error)
      setError(`Error encrypting key ${error}`)
    }
  }, [privateKey, password, setHasWallet])

  return (
    <section>
      <h1>Import your wallet</h1>
      <p>Disclaimer: I don't know how this is secure, it's for testing only</p>
      <div>
        <textarea
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          style={{ width: '310px' }}
          rows={3}
        ></textarea>
      </div>
      <div>
        (You can get this private key from your metamask wallet extension)
      </div>
      <p>Create a password to secure your wallet</p>
      <div>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '50%', margin: '1rem 0' }}
        />
      </div>
      <button onClick={onImport}>Import your wallet</button>

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
