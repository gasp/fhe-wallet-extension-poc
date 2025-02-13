import { useAppStore } from '../store'

export function Address() {
  const address = useAppStore((state) => state.address)

  return (
    <section>
      <h2>Address</h2>
      <code>{address}</code>
    </section>
  )
}
