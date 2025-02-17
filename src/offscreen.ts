import { ethers } from 'ethers'
import { createFhevmInstance } from './libs/fhevm'
import { decryptPrivateKey, encryptPrivateKey } from './libs/aes'
import { OffscreenRequest, OffscreenResponse } from './libs/messages'
import { getSigner } from './libs/eth'
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

      case 'login':
        // eslint-disable-next-line no-case-declarations
        const result = await login(message.data.password)
        talk('login', result)
        break

      case 'ping':
        await new Promise((resolve) => setTimeout(resolve, 1000))
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

async function WalletCreateRandom(password: string) {
  const wallet = ethers.Wallet.createRandom()
  const privateKey = wallet.privateKey
  const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
  await setEncryptedWalletKey({ encrypted, iv })
  return
}

let signer: null | ethers.Wallet = null

async function login(password: string) {
  try {
    const { encrypted, iv } = await getEncryptedWalletKey()
    if (!encrypted || !iv) {
      console.error('No encrypted key found')
      return false
    }
    const decrypted = await decryptPrivateKey(password, encrypted, iv)

    signer = getSigner(decrypted)
    const { address } = signer
    return { address }
  } catch (error) {
    console.error(error)
    console.log(`Error decrypting key: ${error}`)
    return false
  }
}
