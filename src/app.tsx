import { useEffect } from 'react'
import { ethers } from 'ethers'
import { useStore } from './store'
import { useRPC } from './providers/rpc'

import { Balance } from './components/balance'
import { Send } from './components/send'

export function App() {
  const { provider } = useRPC()
  const setAddress = useStore((state) => state.setAddress)
  const setSigner = useStore((state) => state.setSigner)

  useEffect(() => {
    const wallet = new ethers.Wallet(import.meta.env.VITE_WALLET_PRIVATE_KEY)
    setAddress(wallet.address)
    const signer = wallet.connect(provider)
    setSigner(signer)
  }, [setAddress, provider, setSigner])

  return (
    <>
      <h1>Hello, Sepolia!</h1>
      <Balance />
      <Send />
    </>
  )
}
