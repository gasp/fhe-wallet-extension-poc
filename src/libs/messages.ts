export type OffscreenRequest =
  | PingRequest
  | InitializeWasmRequest
  | WalletExistsRequest
  | WalletCreateRandomRequest
  | LoginRequest
// | UnknownMessage
export type OffscreenResponse =
  | PingResponse
  | InitializeWasmResponse
  | WalletExistsResponse
  | WalletCreateRandomResponse
  | LoginResponse
// | UnknownMessage

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

type WalletExistsRequest = {
  type: 'wallet-exists'
  target: 'offscreen'
  data: null
}

type WalletExistsResponse = {
  type: 'wallet-exists'
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

type LoginRequest = {
  type: 'login'
  target: 'offscreen'
  data: { password: string }
}

export type LoginResponse = {
  type: 'login'
  target: 'main'
  data: { address: string }
}
