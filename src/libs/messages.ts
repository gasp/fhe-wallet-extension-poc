export type OffscreenRequest =
  | PingRequest
  | InitializeWasmRequest
  | WalletExistsRequest
  | WalletCreateRandomRequest
  | WalletImportRequest
  | WalletExportRequest
  | WalletDeleteRequest
  | LoginRequest
  | BalanceClearRequest
  | BalanceEncryptedRequest
  | SendClearRequest
  | SendEncryptedRequest
  | GasPriceRequest
export type OffscreenResponse =
  | PingResponse
  | InitializeWasmResponse
  | WalletExistsResponse
  | WalletCreateRandomResponse
  | WalletImportResponse
  | WalletExportResponse
  | WalletDeleteResponse
  | LoginResponse
  | BalanceClearResponse
  | BalanceEncryptedResponse
  | SendClearResponse
  | SendEncryptedResponse
  | GasPriceResponse

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

export type WalletImportRequest = {
  type: 'wallet-import'
  target: 'offscreen'
  data: { walletPrivateKey: string; password: string }
}

type WalletImportResponse = {
  type: 'wallet-import'
  target: 'main'
  data: boolean
}

export type WalletExportRequest = {
  type: 'wallet-export'
  target: 'offscreen'
  data: { password: string }
}

export type WalletExportResponse = {
  type: 'wallet-export'
  target: 'main'
  data: { walletPrivateKey: string } | false
}

type WalletDeleteRequest = {
  type: 'wallet-delete'
  target: 'offscreen'
  data: null
}

type WalletDeleteResponse = {
  type: 'wallet-delete'
  target: 'main'
  data: boolean
}

export type LoginRequest = {
  type: 'login'
  target: 'offscreen'
  data: { password: string }
}

export type LoginResponse = {
  type: 'login'
  target: 'main'
  data: { address: string } | false
}

type BalanceClearRequest = {
  type: 'balance-clear'
  target: 'offscreen'
  data: null
}

export type BalanceClearResponse = {
  type: 'balance-clear'
  target: 'main'
  data: string
}

type BalanceEncryptedRequest = {
  type: 'balance-encrypted'
  target: 'offscreen'
  data: null
}

export type BalanceEncryptedResponse = {
  type: 'balance-encrypted'
  target: 'main'
  data: string
}

export type SendClearRequest = {
  type: 'send-clear'
  target: 'offscreen'
  data: { to: string; amount: string }
}

export type SendClearResponse = {
  type: 'send-clear'
  target: 'main'
  data: { hash: string } | false
}

export type SendEncryptedRequest = {
  type: 'send-encrypted'
  target: 'offscreen'
  data: { to: string; amount: string }
}

export type SendEncryptedResponse = {
  type: 'send-encrypted'
  target: 'main'
  data: { hash: string } | false
}

export type GasPriceRequest = {
  type: 'gas-price'
  target: 'offscreen'
  data: null
}

export type GasPriceResponse = {
  type: 'gas-price'
  target: 'main'
  data: { price: string } | false
}
