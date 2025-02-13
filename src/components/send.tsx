import { ethers } from 'ethers'
import { useState } from 'react'
import { useStore } from '../store'
import { useRPC } from '../providers/rpc'

type Transaction = {
  to: string
  amount: bigint
  hash: string
  status: string
}

export function Send() {
  const [isSending, setIsSending] = useState(false)
  const [recipient, setRecipient] = useState(
    '0x004f6ab8B0C9977fB5464354aC152d3d1b5605F9' // main gasp sepolia account
  )
  const [amount, setAmount] = useState('0.01')
  const [transactions, setTransactions] = useState<Transaction[]>([])
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
    try {
      const txObject = {
        to: recipient,
        value: ethers.parseEther(amount), // Amount to expects wei value
        gasLimit: 21000, // Basic gas limit for a simple transaction
        // TODO: Add gas price from state
        // gasPrice, // Get current gas price from state
        chainId: Number((await provider.getNetwork()).chainId), // https://chainlist.org/chain/11155111
      }

      const tx = await signer.sendTransaction(txObject)
      setTransactions((prev) => [
        ...prev,
        {
          hash: tx.hash,
          status: 'Pending',
          to: txObject.to,
          amount: txObject.value,
        },
      ])
      await tx.wait()
      setTransactions((prev) =>
        prev.map((t) =>
          t.hash === tx.hash ? { ...t, status: 'Confirmed' } : t
        )
      )
      setRecipient('')
      setAmount('')
    } catch (error) {
      console.error('Error sending transaction:', error)
    }
    setIsSending(false)
  }

  return (
    <>
      <h3>Send Clear ETH</h3>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>

      <h3>Transaction Activity</h3>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            <div>
              <code>{tx.to}</code> - {ethers.formatEther(tx.amount)} ETH
            </div>
            {tx.hash} - {tx.status}
          </li>
        ))}
      </ul>
    </>
  )
}
