import { useAppStore } from '../store'

export function Address() {
  const address = useAppStore((state) => state.address)

  return (
    <section>
      <h2>Address</h2>
      <code>{address}</code>
      <a
        href={`https://sepolia.etherscan.io/address/${address}`}
        target="_blank"
        rel="noreferrer"
        title="View on Etherscan"
      >
        🔎
      </a>
    </section>
  )
}
