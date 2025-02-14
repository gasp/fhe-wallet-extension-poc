import { initFhevm, createInstance, FhevmInstance } from 'fhevmjs'
import { getSigner } from './eth'
import { Signer } from 'ethers'

const ENCRYPTEDERC20_CONTRACT_ADDRESS = import.meta.env
  .VITE_ENCRYPTEDERC20_CONTRACT_ADDRESS

let instance: FhevmInstance

export async function init() {
  return initFhevm() // TODO: try with { thread: navigator.hardwareConcurrency }
}

function toHexString(bytes: Uint8Array) {
  return (
    '0x' +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
  )
}

export const createFhevmInstance = async () => {
  instance = await createInstance({
    kmsContractAddress: '0x9D6891A6240D6130c54ae243d8005063D05fE14b', // env this
    aclContractAddress: '0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5', // env this too
    networkUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
    gatewayUrl: 'https://gateway.sepolia.zama.ai/',
  })
  return instance
}

async function reencryptHandle(
  signer: Signer,
  instance: FhevmInstance,
  handle: bigint,
  contractAddress: string
): Promise<bigint> {
  const { publicKey: publicKey, privateKey: privateKey } =
    instance.generateKeypair()
  const eip712 = instance.createEIP712(publicKey, contractAddress)
  const signature = await signer.signTypedData(
    eip712.domain,
    { Reencrypt: eip712.types.Reencrypt },
    eip712.message
  )

  const reencryptedHandle = await instance.reencrypt(
    handle,
    privateKey,
    publicKey,
    signature.replace('0x', ''),
    contractAddress,
    await signer.getAddress()
  )

  return reencryptedHandle
}

export async function decryptBalance(
  encryptedBalance: bigint,
  walletPrivateKey: string // TODO: this should be stored locally in the offscreen and not sent by sendMessage
): Promise<bigint> {
  const signer = getSigner(walletPrivateKey)
  const decryptedBalance = await reencryptHandle(
    signer,
    instance,
    encryptedBalance,
    ENCRYPTEDERC20_CONTRACT_ADDRESS
  )

  return decryptedBalance
}

export async function encryptAmount(
  amount: number,
  walletPrivateKey: string
): Promise<{ proof: string; encrypted: string }> {
  const signer = getSigner(walletPrivateKey)

  const encryptionResult = await instance
    .createEncryptedInput(ENCRYPTEDERC20_CONTRACT_ADDRESS, signer.address)
    .add64(amount)
    .encrypt()

  const proof = toHexString(encryptionResult.inputProof)
  const encrypted = toHexString(encryptionResult.handles[0])
  return { encrypted, proof }
}
