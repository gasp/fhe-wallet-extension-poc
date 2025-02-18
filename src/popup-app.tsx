import { useEffect, useState } from 'react'
import { createOffscreenDocument, service } from './libs/offscreeen-service'
import { usePopupStore } from './store'
import { New } from './components/new'
import { Login } from './components/login'
import { Settings } from './components/settings'
import { Nav } from './components/nav'
import { Address } from './components/address'
import { Balance } from './components/balance'
import { Send } from './components/send'
import { Activity } from './components/activity'

export function PopupApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [isWasm, setIsWasm] = useState(false)
  const hasWallet = usePopupStore((state) => state.hasWallet)
  const setHasWallet = usePopupStore((state) => state.setHasWallet)
  const address = usePopupStore((state) => state.address)
  const showSettings = usePopupStore((state) => state.showSettings)

  useEffect(() => {
    async function load() {
      try {
        await createOffscreenDocument()
        const [wallet, fhevm] = await Promise.all([
          service({ type: 'wallet-exists', data: null }),
          service({ type: 'initialize-wasm', data: null }),
        ])
        setHasWallet(wallet as boolean)
        setIsWasm(!!fhevm)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  })

  if (showSettings) return <Settings />
  if (isLoading)
    return (
      <div>
        <Nav />
        <b>Loading</b>
        <br />
        creating offscreen, searching for storage and instantiating wasm ...
      </div>
    )
  if (!isWasm) return <div>Wasm not supported</div>
  if (!hasWallet) return <New />
  if (!address)
    return (
      <>
        <Nav />
        <Login />
      </>
    )
  return (
    <>
      <Nav />
      <Address />
      <Balance />
      <Send />
      <Activity />
      {/* 
      <GasPrice /> */}
    </>
  )
}
