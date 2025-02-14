import { useEffect } from 'react'
import { useAppStore, useAuthStore } from '../store'
import { useRPC } from '../providers/rpc'

import { Layout } from './layout'
import { getSigner } from '../libs/eth'

export function Authenticated() {
  const { provider } = useRPC()
  const setAddress = useAppStore((state) => state.setAddress)
  const setSigner = useAppStore((state) => state.setSigner)
  const walletPrivateKey = useAuthStore((state) => state.walletPrivateKey)

  useEffect(() => {
    const signer = getSigner(walletPrivateKey)
    setAddress(signer.address)
    setSigner(signer)
  }, [setAddress, provider, setSigner, walletPrivateKey])

  return <Layout />
}
