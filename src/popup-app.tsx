import { useCallback, useEffect, useState } from 'react'
import { createOffscreenDocument, service } from './libs/offscreeen-service'
import { LoginResponse } from './libs/messages'
import { usePopupStore } from './store'
import { New } from './components/new'

export function PopupApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [isWasm, setIsWasm] = useState(false)
  const [debug, setDebug] = useState({})
  const hasWallet = usePopupStore((state) => state.hasWallet)
  const setHasWallet = usePopupStore((state) => state.setHasWallet)
  const address = usePopupStore((state) => state.address)
  const setAddress = usePopupStore((state) => state.setAddress)

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

  // const handleCreateWallet = useCallback(async () => {
  //   const wallet = await service({
  //     type: 'wallet-create-random',
  //     data: { password: 'swordfish' },
  //   })
  //   setDebug({ wallet, ...debug })
  // }, [debug])

  const handleLogin = useCallback(async () => {
    const login = (await service({
      type: 'login',
      data: { password: 'swordfish' },
    })) as LoginResponse['data']
    setAddress(login.address)
    setDebug({ login, ...debug })
  }, [debug, setAddress])

  if (isLoading)
    return (
      <div>
        <b>Loading</b>
        <br />
        creating offscreen, searching for storage and instantiating wasm ...
      </div>
    )
  if (!isWasm) return <div>Wasm not supported</div>
  if (!hasWallet) return <New />
  if (!address)
    return (
      <div>
        <button onClick={handleLogin}>login</button>
      </div>
    )
  return (
    <div>
      {address}
      <pre style={{ width: '300px', height: '300px', overflow: 'scroll' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}
