export type OffscreenRequest =
  | PingRequest
  | InitializeWasmRequest
  | WalletCreateRandomRequest
  | UnknownMessage
export type OffscreenResponse =
  | PingResponse
  | InitializeWasmResponse
  | WalletCreateRandomResponse
  | UnknownMessage

type PingRequest = {
  type: 'ping'
  target: 'offscreen'
  data: 'ping'
  // TODO: add an error field to the response
}

type PingResponse = {
  type: 'ping'
  target: 'main'
  data: 'pong'
}

type InitializeWasmRequest = {
  type: 'initialize-wasm'
  target: 'offscreen'
  data: null
}

type InitializeWasmResponse = {
  type: 'initialize-wasm'
  target: 'main'
  data: boolean
}

type WalletCreateRandomRequest = {
  type: 'wallet-create-random'
  target: 'offscreen'
  data: { password: string }
}

type WalletCreateRandomResponse = {
  type: 'wallet-create-random'
  target: 'main'
  data: boolean
}

type UnknownMessage = {
  type: 'unknown'
  target: 'offscreen' | 'main'
  data: unknown
}
