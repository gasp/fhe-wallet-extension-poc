import { ethers } from 'ethers'
import { createFhevmInstance, decryptBalance } from './libs/fhevm'
import { decryptPrivateKey, encryptPrivateKey } from './libs/aes'
import { OffscreenRequest, OffscreenResponse } from './libs/messages'
import { getSigner } from './libs/eth'
import {
  getEncryptedWalletKey,
  hasEncryptedWalletKey,
  removeEncryptedWalletKey,
  setEncryptedWalletKey,
} from './storage'

const ENCRYPTEDERC20_CONTRACT_ADDRESS = import.meta.env
  .VITE_ENCRYPTEDERC20_CONTRACT_ADDRESS

chrome.runtime.onMessage.addListener(async (message: OffscreenRequest) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'initialize-wasm':
        // eslint-disable-next-line no-case-declarations
        const instance = await createFhevmInstance()
        talk('initialize-wasm', !!instance)
        break

      case 'wallet-exists':
        // eslint-disable-next-line no-case-declarations
        const exists = await WalletExists()
        talk('wallet-exists', exists)
        break

      case 'wallet-create-random':
        // eslint-disable-next-line no-case-declarations
        const created = await WalletCreateRandom(message.data.password)
        talk('wallet-create-random', created)
        break

      case 'wallet-delete':
        // eslint-disable-next-line no-case-declarations
        const deleted = await WalletDelete()
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

async function WalletExists() {
  const exists = await hasEncryptedWalletKey()
  return exists
}

async function WalletCreateRandom(password: string) {
  const wallet = ethers.Wallet.createRandom()
  const privateKey = wallet.privateKey
  const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
  await setEncryptedWalletKey({ encrypted, iv })
  return true
}

async function WalletDelete() {
  await removeEncryptedWalletKey()
  console.log('deleted wallet')
  return true
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

async function balanceClear() {
  if (!signer) {
    console.error('No signer found')
    return false
  }
  if (!signer.provider) {
    console.error('No provider found')
    return false
  }
  const balanceWei = await signer.provider.getBalance(signer.address)
  return ethers.formatEther(balanceWei)
}

async function balanceEncrypted() {
  if (!signer) {
    console.error('No signer found')
    return false
  }
  if (!signer.provider) {
    console.error('No provider found')
    return false
  }
  const contract = new ethers.Contract(
    ENCRYPTEDERC20_CONTRACT_ADDRESS,
    ['function balanceOf(address) view returns (uint256)'],
    signer
  )
  const encryptedBalance: bigint = await contract.balanceOf(signer.address)
  const decrypted = await decryptBalance(encryptedBalance, signer.privateKey)
  return decrypted.toString()
}
