import { create } from 'zustand'
import { ethers } from 'ethers'
import { Transaction } from './types'

type AppStore = {
  address: string
  setAddress: (address: string) => void
  balance: string
  setBalance: (balance: string) => void
  signer: ethers.Wallet | null
  setSigner: (signer: ethers.Wallet) => void
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  gasPrice: bigint
  setGasPrice: (gasPrice: bigint) => void
}

type AuthStore = {
  hasWallet: boolean
  setHasWallet: (hasWallet: boolean) => void
  walletPrivateKey: string
  setWalletPrivateKey: (walletPrivateKey: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  balance: '',
  setBalance: (balance: string) => set({ balance }),
  address: '',
  setAddress: (address: string) => set({ address }),
  signer: null,
  setSigner: (signer: ethers.Wallet) => set({ signer }),
  transactions: [],
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  gasPrice: BigInt(0),
  setGasPrice: (gasPrice: bigint) => set({ gasPrice }),
}))

export const useAuthStore = create<AuthStore>((set) => ({
  hasWallet: false,
  setHasWallet: (hasWallet: boolean) => set({ hasWallet }),
  walletPrivateKey: '',
  setWalletPrivateKey: (walletPrivateKey: string) => set({ walletPrivateKey }),
}))
