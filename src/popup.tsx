import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

async function createOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({})

  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
  )

  // If an offscreen document is not already open, create one.
  if (!offscreenDocument) {
    // everyone seems to add an await here, even if it's not necessary :-/
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      // contextType: 'OFFSCREEN_DOCUMENT',
      reasons: ['WORKERS'], // should be Reason.WORKERS
      justification: 'Recording from chrome.tabCapture API',
    })

    console.log('created offscreen document')
  }
}

function TestOffscreen() {
  const [isOffscreenCreated, setIsOffscreenCreated] = useState(false)
  const [debug, setDebug] = useState({})

  useEffect(() => {
    const handleResponse = (message: {
      type: string
      target: 'offscreen' | 'popup'
      data: string
    }) => {
      setDebug({ message, ...debug })
    }
    chrome.runtime.onMessage.addListener(handleResponse)
    return () => {
      chrome.runtime.onMessage.removeListener(handleResponse)
    }
  }, [debug])

  const handleOffScreen = useCallback(async () => {
    const existingContexts = await chrome.runtime.getContexts({})
    setDebug({ ...debug, existingContexts })
    await createOffscreenDocument()

    chrome.runtime.sendMessage({
      type: 'ping',
      target: 'offscreen',
      data: 'hello',
    })

    setIsOffscreenCreated(true)
    setDebug({ ...debug, existingContexts })
  }, [debug])
  return (
    <div>
      <button onClick={handleOffScreen}>Click me</button>
      {isOffscreenCreated && <div>display sub component here</div>}
      <pre style={{ width: '300px', height: '300px', overflow: 'scroll' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestOffscreen />
  </StrictMode>
)
