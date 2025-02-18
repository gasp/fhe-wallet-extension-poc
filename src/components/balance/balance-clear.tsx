import { useCallback, useEffect } from 'react'
import { usePopupStore } from '../../store'
import { service } from '../../libs/offscreeen-service'
import { BalanceClearResponse } from '../../libs/messages'

export function BalanceClear() {
  const balance = usePopupStore((state) => state.balance)
  const setBalance = usePopupStore((state) => state.setBalance)

  const fetchBalance = useCallback(async () => {
    try {
      const balanceEth = (await service({
        type: 'balance-clear',
        data: null,
      })) as BalanceClearResponse['data']
      setBalance(balanceEth)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [setBalance])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <div>
      Wallet Balance:{' '}
      <span>
        {balance.length ? <span>{balance}</span> : <span>~</span>} Clear ETH
      </span>
      <button onClick={fetchBalance}>
        <span>Refresh</span>
      </button>
      {balance === '0.0' && (
        <div>You don't have any fund, send yourself some sepolia</div>
      )}
    </div>
  )
}
