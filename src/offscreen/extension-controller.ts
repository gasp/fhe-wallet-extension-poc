import { ethers, formatEther } from 'ethers'
import {
  createFhevmInstance,
  decryptBalance,
  encryptAmount,
} from '../libs/fhevm'
import { decryptPrivateKey, encryptPrivateKey } from '../libs/aes'
import {
  SendClearRequest,
  WalletExportRequest,
  WalletImportRequest,
} from '../libs/messages'
import { getSigner } from '../libs/eth'
import {
  getEncryptedWalletKey,
  hasEncryptedWalletKey,
  removeEncryptedWalletKey,
  setEncryptedWalletKey,
} from '../storage'

const ENCRYPTEDERC20_CONTRACT_ADDRESS = import.meta.env
  .VITE_ENCRYPTEDERC20_CONTRACT_ADDRESS

let signer: null | ethers.Wallet = null

export async function initialize() {
  return await createFhevmInstance()
}

export async function WalletExists() {
  const exists = await hasEncryptedWalletKey()
  return exists
}

export async function walletCreateRandom(password: string) {
  const wallet = ethers.Wallet.createRandom()
  const privateKey = wallet.privateKey
  const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
  await setEncryptedWalletKey({ encrypted, iv })
  return true
}

export async function walletImport({
  password,
  walletPrivateKey,
}: WalletImportRequest['data']) {
  const { encrypted, iv } = await encryptPrivateKey(password, walletPrivateKey)
  await setEncryptedWalletKey({ encrypted, iv })
  return true
}

export async function walletExport({ password }: WalletExportRequest['data']) {
  const { encrypted, iv } = await getEncryptedWalletKey()
  const decrypted = await decryptPrivateKey(password, encrypted, iv)
  return { walletPrivateKey: decrypted }
}

export async function walletDelete() {
  await removeEncryptedWalletKey()
  console.log('deleted wallet')
  return true
}

export async function login(password: string) {
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

export async function balanceClear() {
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

export async function balanceEncrypted() {
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

export async function sendClear({ to, amount }: SendClearRequest['data']) {
  if (!signer) {
    console.error('No signer found')
    return false
  }
  if (!signer.provider) {
    console.error('No provider found')
    return false
  }

  try {
    const { gasPrice } = await signer.provider.getFeeData()

    const txObject = {
      to,
      value: ethers.parseEther(amount), // Amount to expects wei value
      gasLimit: 21000, // Basic gas limit for a simple transaction
      gasPrice, //use current gas price
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

export async function sendEncrypted({ to, amount }: SendClearRequest['data']) {
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

export async function gasPrice() {
  if (!signer) {
    console.error('No signer found')
    return false
  }
  if (!signer.provider) {
    console.error('No provider found')
    return false
  }
  const { gasPrice } = await signer.provider.getFeeData()

  if (!gasPrice) {
    console.error('No gas price found')
    return false
  }
  return { price: formatEther(gasPrice) }
}
