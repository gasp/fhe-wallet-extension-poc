import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const wallet = new ethers.Wallet(import.meta.env.VITE_WALLET_PRIVATE_KEY)
const provider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_SEPOLIA_RPC_URL
)

export function App() {
  const [balance, setBalance] = useState('')

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balanceWei = await provider.getBalance(wallet.address)
        const balanceEth = ethers.formatEther(balanceWei)
        setBalance(balanceEth)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }

    fetchBalance()
  }, [])

  return (
    <div>
      <h2>Wallet Balance</h2>
      {balance !== null ? <p>{balance} ETH</p> : <p>Loading...</p>}
    </div>
  )
}
