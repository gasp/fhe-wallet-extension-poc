export type OffscreenRequest =
  | PingRequest
  | InitializeWasmRequest
  | UnknownMessage
export type OffscreenResponse =
  | PingResponse
  | InitializeWasmResponse
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

type UnknownMessage = {
  type: 'unknown'
  target: 'offscreen' | 'main'
  data: unknown
}
