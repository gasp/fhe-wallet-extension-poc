import { useEffect } from 'react'
import { ethers } from 'ethers'
import { useStore } from '../store'
import { useRPC } from '../providers/rpc'

export function Balance() {
  const balance = useStore((state) => state.balance)
  const setBalance = useStore((state) => state.setBalance)
  const address = useStore((state) => state.address)
  const { provider } = useRPC()

  useEffect(() => {
    async function fetchBalance(address: string) {
      try {
        const balanceWei = await provider.getBalance(address)
        const balanceEth = ethers.formatEther(balanceWei)
        setBalance(balanceEth)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }
    if (address) fetchBalance(address)
  }, [address, provider, setBalance])

  return (
    <div>
      Wallet Balance:{' '}
      <span>
        {balance !== null ? <span>{balance}</span> : <span>Loading...</span>}{' '}
        ETH
      </span>
    </div>
  )
}
