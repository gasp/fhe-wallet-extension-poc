import { ethers } from 'ethers'
import { useState } from 'react'
import { useAppStore, useAuthStore } from '../../store'
import { encryptAmount } from '../../libs/fhevm'

const DEFAULT_RECIPIENT = '0xA3C78377D77FaadEb6759c87E4A42E854C671671'
const DEFAULT_AMOUNT = '10'
const ENCRYPTEDERC20_CONTRACT_ADDRESS = import.meta.env
  .VITE_ENCRYPTEDERC20_CONTRACT_ADDRESS

export function SendEncrypted() {
  const [isSending, setIsSending] = useState(false)
  const [recipient, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const setTransactions = useAppStore((state) => state.setTransactions)
  const transactions = useAppStore((state) => state.transactions)
  const signer = useAppStore((state) => state.signer)
  const walletPrivateKey = useAuthStore((state) => state.walletPrivateKey)

  async function sendTransaction() {
    if (!recipient || !amount || !signer) {
      console.error('Recipient, amount, or signer not set', {
        recipient,
        amount,
        signer,
      })
      return
    }
    setIsSending(true)
    let hash: string | null = null
    const to = recipient
    try {
      setTransactions([
        ...transactions,
        {
          encrypted: true,
          hash: 'no-hash',
          status: 'Encrypting',
          to,
          amount,
        },
      ])

      const contract = new ethers.Contract(
        ENCRYPTEDERC20_CONTRACT_ADDRESS,
        ['function transfer(address,bytes32,bytes) external returns (bool)'],
        signer
      )

      const { encrypted, proof } = await encryptAmount(
        parseInt(amount, 10),
        walletPrivateKey
      )
      const contractArgs = [to, encrypted, proof]

      const tx = await contract.transfer(...contractArgs)

      hash = tx.hash
      setTransactions([
        ...transactions,
        {
          encrypted: true,
          hash: hash ?? 'no-hash',
          status: 'Pending',
          to,
          amount,
        },
      ])

      await tx.wait()

      // NOTE: this is not redux
      // transactions have't been updated yet by latest setTransactions
      setTransactions([
        ...transactions,
        {
          encrypted: true,
          hash: hash ?? 'no-hash',
          status: 'Confirmed',
          to,
          amount,
        },
      ])
    } catch (error) {
      console.error('Error sending transaction:', error)

      setTransactions([
        ...transactions,
        {
          encrypted: false,
          hash: hash ?? 'no-hash',
          status: 'Failed',
          to,
          amount,
        },
      ])
    }
    setIsSending(false)
    setRecipient(DEFAULT_RECIPIENT)
    setAmount(DEFAULT_AMOUNT)
  }

  return (
    <>
      <h3>Send Encrypted ETH</h3>
      <input
        name="recipient"
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        min={0}
        onChange={(e) => setAmount(e.target.value || '0')}
      />
      <button onClick={sendTransaction} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </>
  )
}
