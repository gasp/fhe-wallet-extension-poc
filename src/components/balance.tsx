import { useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAppStore } from '../store'
import { useRPC } from '../providers/rpc'

export function Balance() {
  const balance = useAppStore((state) => state.balance)
  const setBalance = useAppStore((state) => state.setBalance)
  const address = useAppStore((state) => state.address)
  const { provider } = useRPC()

  const fetchBalance = useCallback(
    async (address: string) => {
      try {
        const balanceWei = await provider.getBalance(address)
        const balanceEth = ethers.formatEther(balanceWei)
        setBalance(balanceEth)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    },
    [provider, setBalance]
  )

  useEffect(() => {
    if (address) fetchBalance(address)
  }, [address, fetchBalance])

  return (
    <div>
      Wallet Balance:{' '}
      <span>
        {balance !== null ? <span>{balance}</span> : <span>Loading...</span>}{' '}
        ETH
      </span>
      <button onClick={() => fetchBalance(address)}>
        <span>Refresh</span>
      </button>
    </div>
  )
}
