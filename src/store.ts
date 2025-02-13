import { create } from 'zustand'
import { ethers } from 'ethers'
import { Transaction } from './types'

type Store = {
  address: string
  setAddress: (address: string) => void
  balance: string
  setBalance: (balance: string) => void
  signer: ethers.Wallet | null
  setSigner: (signer: ethers.Wallet) => void
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
}

export const useStore = create<Store>((set) => ({
  balance: '',
  setBalance: (balance: string) => set({ balance }),
  address: '',
  setAddress: (address: string) => set({ address }),
  signer: null,
  setSigner: (signer: ethers.Wallet) => set({ signer }),
  transactions: [],
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
}))
