import { useState } from 'react'
import { usePopupStore } from '../../store'
import { service } from '../../libs/offscreeen-service'
import { SendClearResponse } from '../../libs/messages'

const DEFAULT_RECIPIENT = '0xA3C78377D77FaadEb6759c87E4A42E854C671671'
const DEFAULT_AMOUNT = '0.01'

export function SendClear() {
  const [isSending, setIsSending] = useState(false)
  const [recipient, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const setTransactions = usePopupStore((state) => state.setTransactions)
  const transactions = usePopupStore((state) => state.transactions)

  async function sendTransaction() {
    setIsSending(true)
    try {
      if (!recipient || !amount) {
        console.error('Recipient or  not set', {
          recipient,
          amount,
        })
        throw new Error('Recipient or amount not set')
      }
      const transaction = (await service({
        type: 'send-clear',
        data: { to: recipient, amount },
      })) as SendClearResponse['data']
      if (!transaction) {
        console.error('Error sending transaction')
        throw new Error('Error sending transaction')
      }
      const { hash } = transaction
      setIsSending(true)
      setTransactions([
        ...transactions,
        {
          encrypted: false,
          hash,
          status: 'Confirmed',
          to: recipient,
          amount,
        },
      ])
    } catch (error) {
      console.error('Error sending transaction:', error)
      setTransactions([
        ...transactions,
        {
          encrypted: false,
          hash: 'no-hash',
          status: 'Failed',
          to: recipient,
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
      {isSending && <h3>Sending...</h3>}
      <h3>Send Clear ETH</h3>
      <input
        style={{ width: '150px' }}
        name="recipient"
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        style={{ width: '40px', margin: '0 10px' }}
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
