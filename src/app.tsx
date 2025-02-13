import { useEffect, useState } from 'react'
import { hasEncryptedWalletKey } from './storage'
import { useAuthStore } from './store'

import { Login } from './components/login'
import { Authenticated } from './components/authenticated'
import { New } from './components/new'

export function App() {
  const [isLoading, setIsLoading] = useState(true)
  const hasWallet = useAuthStore((state) => state.hasWallet)
  const setHasWallet = useAuthStore((state) => state.setHasWallet)
  const walletPrivateKey = useAuthStore((state) => state.walletPrivateKey)

  useEffect(() => {
    hasEncryptedWalletKey().then((result) => {
      setHasWallet(result)
      setIsLoading(false)
    })
  })
  if (isLoading) return <div>Loading...</div>
  if (!hasWallet) return <New />
  if (!walletPrivateKey) return <Login />
  return <Authenticated />
}
