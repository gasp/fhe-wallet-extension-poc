import { usePopupStore } from '../store'

export function Activity() {
  const transactions = usePopupStore((state) => state.transactions)
  return (
    <section>
      <h3>Transaction Activity ({transactions.length})</h3>
      {transactions.map((tx, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <div>
            to: <code>{tx.to}</code>
          </div>
          <div>
            amount:{' '}
            <b>
              {tx.amount} {tx.encrypted ? `encrypted ETH` : `ETH`}
              {tx.encrypted ? ' 🔒' : ' ♢'}
            </b>{' '}
            – {tx.status}{' '}
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
          </div>
        </div>
      ))}
    </section>
  )
}
