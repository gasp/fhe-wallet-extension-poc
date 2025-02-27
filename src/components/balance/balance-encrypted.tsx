import { useCallback, useEffect, useState } from 'react'
import { usePopupStore } from '../../store'
import { service } from '../../libs/offscreeen-service'
import { BalanceEncryptedResponse } from '../../libs/messages'

export function BalanceEncrypted() {
  const encryptedBalance = usePopupStore((state) => state.encryptedBalance)
  const setEncryptedBalance = usePopupStore(
    (state) => state.setEncryptedBalance
  )
  const [loading, setLoading] = useState(false)

  const handleFetchEncryptBalance = useCallback(async () => {
    setLoading(true)
    try {
      const balanceEnc = (await service({
        type: 'balance-encrypted',
        data: null,
      })) as BalanceEncryptedResponse['data']

      if (!balanceEnc) {
        console.error('No encrypted balance found')
        return
      }
      setEncryptedBalance(balanceEnc)
    } catch (error) {
      console.error('Error fetching or decrypting balance:', error)
    }
    setLoading(false)
  }, [setEncryptedBalance])
  useEffect(() => {
    handleFetchEncryptBalance()
  }, [handleFetchEncryptBalance])

  return (
    <div>
      Wallet Balance:{' '}
      <span>
        {encryptedBalance.length ? (
          <span>{encryptedBalance}</span>
        ) : (
          <span>~</span>
        )}{' '}
        Encrypted ETH
      </span>{' '}
      <button
        className="refresh"
        disabled={loading}
        onClick={handleFetchEncryptBalance}
        title="Refresh"
      >
        <span>⟳</span>
      </button>
      {encryptedBalance === '0' && (
        <div>
          You don't have any funds, convert some clear ETH into encrypted ETH
        </div>
      )}
    </div>
  )
}
