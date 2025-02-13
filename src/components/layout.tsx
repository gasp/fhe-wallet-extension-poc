import { useEffect } from 'react'
import { ethers } from 'ethers'
import { useAppStore } from '../store'
import { useRPC } from '../providers/rpc'

import { Address } from './address'
import { Balance } from './balance'
import { Send } from './send'
import { Activity } from './activity'
import { GasPrice } from './gas-price'

export function Layout() {
  const { provider } = useRPC()
  const setAddress = useAppStore((state) => state.setAddress)
  const setSigner = useAppStore((state) => state.setSigner)

  useEffect(() => {
    const wallet = new ethers.Wallet(import.meta.env.VITE_WALLET_PRIVATE_KEY)
    setAddress(wallet.address)
    const signer = wallet.connect(provider)
    setSigner(signer)
  }, [setAddress, provider, setSigner])

  return (
    <>
      <h1>Hello, Sepolia!</h1>
      <Address />
      <Balance />
      <Send />
      <Activity />
      <GasPrice />
    </>
  )
}
