import { useEffect, useState } from 'react'
import { hasEncryptedWalletKey } from './storage'
import { useAuthStore } from './store'
import { init, createFhevmInstance } from './libs/fhevm'

import { Login } from './components/login'
import { Authenticated } from './components/authenticated'
import { New } from './components/new'

export function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isWasm, setIsWasm] = useState(false)
  const hasWallet = useAuthStore((state) => state.hasWallet)
  const setHasWallet = useAuthStore((state) => state.setHasWallet)
  const walletPrivateKey = useAuthStore((state) => state.walletPrivateKey)

  useEffect(() => {
    async function load() {
      try {
        const [wallet, fhevm] = await Promise.all([
          hasEncryptedWalletKey(),
          init().then(() => createFhevmInstance()),
        ])
        setHasWallet(wallet)
        setIsWasm(!!fhevm)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  })
  if (isLoading)
    return (
      <div>
        <b>Loading</b>
        <br /> searching for storage and instanciating wasm ...
      </div>
    )
  if (!isWasm) return <div>Wasm not supported</div>
  if (!hasWallet) return <New />
  if (!walletPrivateKey) return <Login />
  return <Authenticated />
}
