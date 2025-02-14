import { ethers } from 'ethers'
import { useState } from 'react'
import { useAppStore } from '../../store'
import { useRPC } from '../../providers/rpc'

const DEFAULT_RECIPIENT = '0xA3C78377D77FaadEb6759c87E4A42E854C671671'
const DEFAULT_AMOUNT = '0.01'

export function SendClear() {
  const [isSending, setIsSending] = useState(false)
  const [recipient, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const setTransactions = useAppStore((state) => state.setTransactions)
  const transactions = useAppStore((state) => state.transactions)
  const signer = useAppStore((state) => state.signer)
  const gasPrice = useAppStore((state) => state.gasPrice)
  const { provider } = useRPC()

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
      const txObject = {
        to,
        value: ethers.parseEther(amount), // Amount to expects wei value
        gasLimit: 21000, // Basic gas limit for a simple transaction
        gasPrice, //use current gas price
        chainId: Number((await provider.getNetwork()).chainId), // https://chainlist.org/chain/11155111
      }

      const tx = await signer.sendTransaction(txObject)

      hash = tx.hash
      setTransactions([
        ...transactions,
        {
          encrypted: false,
          hash,
          status: 'Pending',
          to,
          amount: ethers.formatEther(txObject.value),
        },
      ])

      await tx.wait()

      // NOTE: this is not redux
      // transactions have't been updated yet by latest setTransactions
      setTransactions([
        ...transactions,
        {
          encrypted: false,
          hash,
          status: 'Confirmed',
          to,
          amount: ethers.formatEther(txObject.value),
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
      <h3>Send Clear ETH</h3>
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
