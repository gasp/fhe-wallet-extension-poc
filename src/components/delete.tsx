import { useCallback, useState } from 'react'
import { usePopupStore } from '../store'
import { service } from '../libs/offscreeen-service'

export function Delete() {
  const [error, setError] = useState('')
  const setHasWallet = usePopupStore((state) => state.setHasWallet)
  const onDeleteWallet = useCallback(async () => {
    setError('start')
    const deleted = await service({ type: 'wallet-delete', data: null })
    if (deleted) setHasWallet(!deleted)
    else setError('Error deleting wallet')
    setError(deleted ? 'deleed!' : 'Error deleting wallet')
  }, [setHasWallet])

  return (
    <section>
      <h1>Delete wallet</h1>
      <p>Your wallet will be deleted and your funds lost</p>
      <div>
        <button onClick={onDeleteWallet}>Delete your wallet</button>
      </div>

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
