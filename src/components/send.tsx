import { ethers } from 'ethers'
import { useState } from 'react'
import { useStore } from '../store'
import { useRPC } from '../providers/rpc'

const DEFAULT_RECIPIENT = '0x004f6ab8B0C9977fB5464354aC152d3d1b5605F9' // main gasp sepolia account
const DEFAULT_AMOUNT = '0.01'

export function Send() {
  const [isSending, setIsSending] = useState(false)
  const [recipient, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const setTransactions = useStore((state) => state.setTransactions)
  const transactions = useStore((state) => state.transactions)
  const signer = useStore((state) => state.signer)
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
        // TODO: Add gas price from state
        // gasPrice, // Get current gas price from state
        chainId: Number((await provider.getNetwork()).chainId), // https://chainlist.org/chain/11155111
      }

      const tx = await signer.sendTransaction(txObject)

      hash = tx.hash
      setTransactions([
        ...transactions,
        {
          hash,
          status: 'Pending',
          to,
          amount: txObject.value,
        },
      ])

      await tx.wait()

      // NOTE: this is not redux
      // transactions hasn't been updated in the meantime
      setTransactions([
        ...transactions,
        {
          hash,
          status: 'Confirmed',
          to,
          amount: txObject.value,
        },
      ])
    } catch (error) {
      console.error('Error sending transaction:', error)

      setTransactions([
        ...transactions,
        {
          hash: hash ?? 'no-hash',
          status: 'Failed',
          to,
          amount: BigInt(parseInt(amount)),
        },
      ])
    }
    setIsSending(false)
    setRecipient(DEFAULT_RECIPIENT)
    setAmount(DEFAULT_AMOUNT)
  }

  return (
    <section>
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
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </section>
  )
}
