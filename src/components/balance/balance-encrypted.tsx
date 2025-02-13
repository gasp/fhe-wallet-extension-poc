import { useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAppStore } from '../../store'
import { useRPC } from '../../providers/rpc'

const ENCRYPTEDERC20_CONTRACT_ADDRESS = import.meta.env
  .VITE_ENCRYPTEDERC20_CONTRACT_ADDRESS

export function BalanceEncrypted() {
  const encryptedBalance = useAppStore((state) => state.encryptedBalance)
  const setEncryptedBalance = useAppStore((state) => state.setEncryptedBalance)
  const address = useAppStore((state) => state.address)
  const { provider } = useRPC()

  const fetchEncryptBalance = useCallback(
    async (address: string) => {
      try {
        const contract = new ethers.Contract(
          ENCRYPTEDERC20_CONTRACT_ADDRESS,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        )
        const handleBalance = await contract.balanceOf(address)
        setEncryptedBalance(handleBalance.toString())
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    },
    [provider, setEncryptedBalance]
  )

  useEffect(() => {
    if (address) fetchEncryptBalance(address)
  }, [address, fetchEncryptBalance])

  return (
    <div>
      Wallet Balance:{' '}
      <span>
        {encryptedBalance !== null ? (
          <span>{encryptedBalance}</span>
        ) : (
          <span>Loading...</span>
        )}{' '}
        Encrypted ETH
      </span>
      <button onClick={() => fetchEncryptBalance(address)}>
        <span>Refresh</span>
      </button>
      {encryptedBalance === '0' && (
        <div>
          You don't have any funds, convert some clear ETH into encrypted ETH
        </div>
      )}
    </div>
  )
}
