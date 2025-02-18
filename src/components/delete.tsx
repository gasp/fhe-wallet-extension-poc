import { useCallback, useState } from 'react'
import { usePopupStore } from '../store'
import { service } from '../libs/offscreeen-service'

export function Delete() {
  const [error, setError] = useState('')
  const setHasWallet = usePopupStore((state) => state.setHasWallet)
  const setShowSettings = usePopupStore((state) => state.setShowSettings)
  const onDeleteWallet = useCallback(async () => {
    const deleted = await service({ type: 'wallet-delete', data: null })
    if (deleted) {
      setHasWallet(!deleted)
      setShowSettings(false)
    } else setError('Error deleting wallet')
  }, [setHasWallet, setShowSettings])

  return (
    <section>
      <h2>Delete wallet</h2>
      <p>Your wallet will be deleted and your funds lost</p>
      <div>
        <button onClick={onDeleteWallet}>Delete your wallet</button>
      </div>

      {!!error.length && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
