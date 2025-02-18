import { ethers } from 'ethers'
import {
  createFhevmInstance,
  decryptBalance,
  encryptAmount,
} from './libs/fhevm'
import { decryptPrivateKey, encryptPrivateKey } from './libs/aes'
import {
  OffscreenRequest,
  OffscreenResponse,
  SendClearRequest,
  WalletExportRequest,
  WalletImportRequest,
} from './libs/messages'
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

      case 'wallet-import':
        // eslint-disable-next-line no-case-declarations
        const imported = await WalletImport(message.data)
        talk('wallet-import', imported)
        break

      case 'wallet-export':
        // eslint-disable-next-line no-case-declarations
        const exported = await WalletExport(message.data)
        talk('wallet-export', exported)
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

async function WalletImport({
  password,
  walletPrivateKey,
}: WalletImportRequest['data']) {
  const { encrypted, iv } = await encryptPrivateKey(password, walletPrivateKey)
  await setEncryptedWalletKey({ encrypted, iv })
  return true
}

async function WalletExport({ password }: WalletExportRequest['data']) {
  const { encrypted, iv } = await getEncryptedWalletKey()
  const decrypted = await decryptPrivateKey(password, encrypted, iv)
  return { walletPrivateKey: decrypted }
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

async function sendClear({ to, amount }: SendClearRequest['data']) {
  if (!signer) {
    console.error('No signer found')
    return false
  }
  if (!signer.provider) {
    console.error('No provider found')
    return false
  }

  try {
    const txObject = {
      to,
      value: ethers.parseEther(amount), // Amount to expects wei value
      gasLimit: 21000, // Basic gas limit for a simple transaction
      // TODO gasPrice, //use current gas price
      chainId: Number((await signer.provider.getNetwork()).chainId), // https://chainlist.org/chain/11155111
    }

    const tx = await signer.sendTransaction(txObject)
    await tx.wait()
    return { hash: tx.hash }
  } catch (error) {
    console.error('Error sending transaction:', error)
    return false
  }
}

async function sendEncrypted({ to, amount }: SendClearRequest['data']) {
  if (!signer) {
    console.error('No signer found')
    return false
  }
  if (!signer.provider) {
    console.error('No provider found')
    return false
  }
  try {
    const contract = new ethers.Contract(
      ENCRYPTEDERC20_CONTRACT_ADDRESS,
      ['function transfer(address,bytes32,bytes) external returns (bool)'],
      signer
    )

    const { encrypted, proof } = await encryptAmount(
      parseInt(amount, 10),
      signer.privateKey
    )
    const contractArgs = [to, encrypted, proof]

    const tx = await contract.transfer(...contractArgs)

    await tx.wait()
    return { hash: tx.hash }
  } catch (error) {
    console.error('Error sending transaction:', error)
    return false
  }
}
