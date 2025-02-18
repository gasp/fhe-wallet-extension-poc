import { useCallback, useState } from 'react'
import { WalletExportResponse } from '../libs/messages'
import { service } from '../libs/offscreeen-service'

export function ExportWallet() {
  const [password, setPassword] = useState('swordfish')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')
  const onExport = useCallback(async () => {
    if (!password) return setError('Enter password')
    try {
      const exported = (await service({
        type: 'wallet-export',
        data: { password },
      })) as WalletExportResponse['data']
      if (!exported) return setError('Error exporting wallet')
      setError('')
      setPrivateKey(exported.walletPrivateKey)
    } catch (error) {
      console.error(error)
      setError(`Error encrypting key ${error}`)
    }
  }, [password])

  return (
    <section>
      <h1>Export your wallet</h1>
      <p>Disclaimer: I don't know how this is secure, it's for testing only</p>
      {privateKey.length ? (
        <textarea
          value={privateKey}
          readOnly
          style={{ width: '310px' }}
          rows={3}
        ></textarea>
      ) : (
        <>
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '50%', margin: '1rem 0' }}
            />
          </div>
          <button onClick={onExport}>Export your wallet</button>
        </>
      )}

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
