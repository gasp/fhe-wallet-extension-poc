import { useCallback, useState } from 'react'
import { createOffscreenDocument, service } from './libs/offscreeen-service'

export function PopupApp() {
  const [isOffscreenCreated, setIsOffscreenCreated] = useState(false)
  const [debug, setDebug] = useState({})

  const handleOffScreen = useCallback(async () => {
    const existingContexts = await chrome.runtime.getContexts({})
    setDebug({ ...debug, existingContexts })
    await createOffscreenDocument()

    setIsOffscreenCreated(true)
    setDebug({ ...debug, existingContexts })
  }, [debug])

  const handleMessage = useCallback(async () => {
    const response = await service({ type: 'ping', data: 'ping' })
    const wasm = await service({ type: 'initialize-wasm', data: null })
    setDebug({ wasm, response, ...debug })
  }, [debug])

  const handleCreateWallet = useCallback(async () => {
    const wallet = await service({
      type: 'wallet-create-random',
      data: { password: 'swordfish' },
    })
    setDebug({ wallet, ...debug })
  }, [debug])

  return (
    <div>
      <button onClick={handleOffScreen}>create offscreen</button>

      {isOffscreenCreated && (
        <div>
          <button onClick={handleMessage}>create message</button>
          <button onClick={handleCreateWallet}>create wallet</button>
        </div>
      )}
      <pre style={{ width: '300px', height: '300px', overflow: 'scroll' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}
