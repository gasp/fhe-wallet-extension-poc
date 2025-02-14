import { ethers } from 'ethers'

// doc: https://docs.ethers.org/v6/api/providers/jsonrpc/#about-jsonrpcProvider
export const provider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_SEPOLIA_RPC_URL
)

export const getSigner = (walletPrivateKey: string) => {
  const wallet = new ethers.Wallet(walletPrivateKey)
  return wallet.connect(provider)
}
