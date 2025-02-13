import { useEffect } from 'react'
import { ethers } from 'ethers'
import { useAppStore, useAuthStore } from '../store'
import { useRPC } from '../providers/rpc'

import { Layout } from './layout'

export function Authenticated() {
  const { provider } = useRPC()
  const setAddress = useAppStore((state) => state.setAddress)
  const setSigner = useAppStore((state) => state.setSigner)
  const walletPrivateKey = useAuthStore((state) => state.walletPrivateKey)

  useEffect(() => {
    const wallet = new ethers.Wallet(walletPrivateKey)
    setAddress(wallet.address)
    const signer = wallet.connect(provider)
    setSigner(signer)
  }, [setAddress, provider, setSigner, walletPrivateKey])

  return <Layout />
}
