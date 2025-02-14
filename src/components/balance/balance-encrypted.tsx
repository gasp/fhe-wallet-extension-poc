import { useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAppStore, useAuthStore } from '../../store'
import { useRPC } from '../../providers/rpc'
import { decryptBalance } from '../../libs/fhevm'

const ENCRYPTEDERC20_CONTRACT_ADDRESS = import.meta.env
  .VITE_ENCRYPTEDERC20_CONTRACT_ADDRESS

export function BalanceEncrypted() {
  const encryptedBalance = useAppStore((state) => state.encryptedBalance)
  const setEncryptedBalance = useAppStore((state) => state.setEncryptedBalance)
  const address = useAppStore((state) => state.address)
  const walletPrivateKey = useAuthStore((state) => state.walletPrivateKey)
  const { provider } = useRPC()

  const handleFetchEncryptBalance = useCallback(
    async (address: string) => {
      try {
        const contract = new ethers.Contract(
          ENCRYPTEDERC20_CONTRACT_ADDRESS,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        )
        const encryptedBalance: bigint = await contract.balanceOf(address)
        const decrypted = await decryptBalance(
          encryptedBalance,
          walletPrivateKey
        )
        setEncryptedBalance(decrypted.toString())
      } catch (error) {
        console.error('Error fetching or decrypting balance:', error)
      }
    },
    [provider, setEncryptedBalance, walletPrivateKey]
  )
  useEffect(() => {
    if (address) handleFetchEncryptBalance(address)
  }, [address, handleFetchEncryptBalance])

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
      <button onClick={() => handleFetchEncryptBalance(address)}>
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
