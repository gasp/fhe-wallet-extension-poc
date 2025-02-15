// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any
type ChromeMessage =
  | PingMessage
  | EncryptMessage
  | InitializeWasmMessage
  | UnknownMessage

type PingMessage = {
  type: 'ping'
  target: 'offscreen' | 'main'
  data: 'ping' | 'pong'
}

type EncryptMessage = {
  type: 'encrypt'
  target: 'offscreen' | 'main'
  data: number
}

type InitializeWasmMessage = {
  type: 'initialize-wasm'
  target: 'offscreen' | 'main'
  data: boolean
}

// what if an unknown message arrives?
type UnknownMessage = {
  type: 'unknown'
  target: 'offscreen' | 'main'
  data: string
}

chrome.runtime.onMessage.addListener(async (message: ChromeMessage) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'initialize-wasm':
        await new Promise((resolve) => setTimeout(resolve, 100))
        talk('initialize-wasm', true)
        break
      case 'ping':
        // should spawn some web workers + wasm
        // should return a message to the main thread
        talk('ping', 'pong')
        break
      case 'encrypt':
        // encrypt(message.data as number).catch((error) => {
        //   talk('error', error.message)
        // })
        break
      default:
        throw new Error(`Unrecognized message: ${message.type}`)
    }
  }
})

function talk(type: ChromeMessage['type'], payload: ChromeMessage['data']) {
  chrome.runtime.sendMessage({
    type,
    target: 'offscreen',
    data: payload,
  } as ChromeMessage)
}
