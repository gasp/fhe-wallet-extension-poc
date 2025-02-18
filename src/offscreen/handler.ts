import {
  initialize,
  WalletExists,
  walletCreateRandom,
  walletImport,
  walletExport,
  walletDelete,
  login,
  balanceClear,
  balanceEncrypted,
  sendClear,
  sendEncrypted,
  gasPrice,
} from './extension-controller'
import { OffscreenRequest, OffscreenResponse } from '../libs/messages'

chrome.runtime.onMessage.addListener(async (message: OffscreenRequest) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'initialize-wasm':
        // eslint-disable-next-line no-case-declarations
        const instance = await initialize()
        talk('initialize-wasm', !!instance)
        break

      case 'wallet-exists':
        // eslint-disable-next-line no-case-declarations
        const exists = await WalletExists()
        talk('wallet-exists', exists)
        break

      case 'wallet-create-random':
        // eslint-disable-next-line no-case-declarations
        const created = await walletCreateRandom(message.data.password)
        talk('wallet-create-random', created)
        break

      case 'wallet-import':
        // eslint-disable-next-line no-case-declarations
        const imported = await walletImport(message.data)
        talk('wallet-import', imported)
        break

      case 'wallet-export':
        // eslint-disable-next-line no-case-declarations
        const exported = await walletExport(message.data)
        talk('wallet-export', exported)
        break

      case 'wallet-delete':
        // eslint-disable-next-line no-case-declarations
        const deleted = await walletDelete()
        talk('wallet-delete', deleted)
        break

      case 'login':
        // eslint-disable-next-line no-case-declarations
        const loggedin = await login(message.data.password)
        talk('login', loggedin)
        break

      case 'balance-clear':
        // eslint-disable-next-line no-case-declarations
        const balancec = await balanceClear()
        talk('balance-clear', balancec)
        break

      case 'balance-encrypted':
        // eslint-disable-next-line no-case-declarations
        const balancee = await balanceEncrypted()
        talk('balance-encrypted', balancee)
        break

      case 'send-clear':
        // eslint-disable-next-line no-case-declarations
        const transactionClear = await sendClear(message.data)
        talk('send-clear', transactionClear)
        break

      case 'send-encrypted':
        // eslint-disable-next-line no-case-declarations
        const transactionEncrypted = await sendEncrypted(message.data)
        talk('send-encrypted', transactionEncrypted)
        break

      case 'gas-price':
        // eslint-disable-next-line no-case-declarations
        const price = await gasPrice()
        talk('gas-price', price)
        break

      case 'ping':
        await new Promise((resolve) => setTimeout(resolve, 1000))
        talk('ping', 'pong')
        break

      default:
        return message satisfies never
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
