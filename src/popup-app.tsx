import { useCallback, useEffect, useState } from 'react'
import { createOffscreenDocument, service } from './libs/offscreeen-service'
import { LoginResponse } from './libs/messages'
import { usePopupStore } from './store'
import { New } from './components/new'
import { Delete } from './components/delete'

function State() {
  const state = usePopupStore.getState()
  return <pre>{JSON.stringify(state, null, 2)}</pre>
}

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
        <State />
        <b>Loading</b>
        <br />
        creating offscreen, searching for storage and instantiating wasm ...
      </div>
    )
  if (!isWasm) return <div>Wasm not supported</div>
  if (!hasWallet)
    return (
      <>
        <State />
        <New />
      </>
    )
  if (!address)
    return (
      <div>
        <State />
        <Delete />
        <button onClick={handleLogin}>login</button>
      </div>
    )
  return (
    <div>
      <State />
      <Delete />
      {address}
      <pre style={{ width: '300px', height: '300px', overflow: 'scroll' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}
