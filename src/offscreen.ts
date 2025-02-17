import { ethers } from 'ethers'
import { createFhevmInstance } from './libs/fhevm'
import { encryptPrivateKey } from './libs/aes'
import { OffscreenRequest, OffscreenResponse } from './libs/messages'
import { getEncryptedWalletKey, setEncryptedWalletKey } from './storage'

chrome.runtime.onMessage.addListener(async (message: OffscreenRequest) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'initialize-wasm':
        // eslint-disable-next-line no-case-declarations
        const instance = await createFhevmInstance()
        talk('initialize-wasm', !!instance)
        break

      case 'wallet-create-random':
        await WalletCreateRandom(message.data.password)
        talk('wallet-create-random', true)
        break

      case 'ping':
        await new Promise((resolve) => setTimeout(resolve, 1000))
        talk('ping', chrome)
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

async function WalletCreateRandom(password: string) {
  const wallet = ethers.Wallet.createRandom()
  const privateKey = wallet.privateKey
  const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
  await setEncryptedWalletKey({ encrypted, iv })
  return
}
