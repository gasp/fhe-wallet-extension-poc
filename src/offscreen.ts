import { createFhevmInstance } from './libs/fhevm'
import { OffscreenRequest, OffscreenResponse } from './libs/messages'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any

chrome.runtime.onMessage.addListener(async (message: OffscreenRequest) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'initialize-wasm':
        // eslint-disable-next-line no-case-declarations
        const instance = await createFhevmInstance()
        talk('initialize-wasm', !!instance)
        break

      case 'ping':
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // should spawn some web workers + wasm
        // should return a message to the main thread
        talk('ping', 'pong')
        break
      default:
        throw new Error(`Unrecognized message: ${message.type}`)
    }
  }
})

function talk(
  type: OffscreenResponse['type'],
  payload: OffscreenResponse['data']
) {
  try {
    chrome.runtime.sendMessage({
      type,
      target: 'main',
      data: payload,
    } as OffscreenResponse)
  } catch (error) {
    console.error('Error sending message', error)
    console.log(type, payload)
    throw error
  }
}
