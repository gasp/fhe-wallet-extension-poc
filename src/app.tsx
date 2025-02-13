import { useEffect, useState } from 'react'
import { hasEncryptedWalletKey } from './storage'
import { useAuthStore } from './store'

import { Create } from './components/create'
import { Login } from './components/login'
import { Authenticated } from './components/authenticated'

export function App() {
  const [isLoading, setIsLoading] = useState(true)
  const hasWallet = useAuthStore((state) => state.hasWallet)
  const setHasWallet = useAuthStore((state) => state.setHasWallet)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    hasEncryptedWalletKey().then((result) => {
      setHasWallet(result)
      setIsLoading(false)
    })
  })
  if (isLoading) return <div>Loading...</div>
  if (!hasWallet) return <Create />
  if (!isLoggedIn) return <Login />
  return <Authenticated />
}
