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
              {tx.encrypted ? '🔒' : '🧾'} <code>{tx.to}</code> - {tx.amount}{' '}
              {tx.encrypted ? `encrypted ETH` : `ETH`}
            </div>
            {tx.status}{' '}
            {tx.hash !== 'no-hash' && (
              <a
                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                title="View on Etherscan"
              >
                🔎
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
