import { ethers } from 'ethers'
import { useAppStore } from '../store'

export function Activity() {
  const transactions = useAppStore((state) => state.transactions)
  return (
    <section>
      <h3>Transaction Activity ({transactions.length})</h3>
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
    </section>
  )
}
