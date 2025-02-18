import { create } from 'zustand'
import { Transaction } from './types'

type PopupStore = {
  showSettings: boolean
  setShowSettings: (showSettings: boolean) => void
  hasWallet: boolean
  setHasWallet: (hasWallet: boolean) => void
  address: string
  setAddress: (address: string) => void
  balance: string
  setBalance: (balance: string) => void
  encryptedBalance: string
  setEncryptedBalance: (encryptedBalance: string) => void
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  gasPrice: string
  setGasPrice: (gasPrice: string) => void
}

export const usePopupStore = create<PopupStore>((set) => ({
  showSettings: false,
  setShowSettings: (showSettings: boolean) => set({ showSettings }),
  hasWallet: false,
  setHasWallet: (hasWallet: boolean) => set({ hasWallet }),
  address: '',
  setAddress: (address: string) => set({ address }),
  balance: '',
  setBalance: (balance: string) => set({ balance }),
  encryptedBalance: '',
  setEncryptedBalance: (encryptedBalance: string) => set({ encryptedBalance }),
  transactions: [],
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  gasPrice: '0',
  setGasPrice: (gasPrice: string) => set({ gasPrice }),
}))
