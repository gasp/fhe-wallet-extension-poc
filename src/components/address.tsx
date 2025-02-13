import { useStore } from '../store'

export function Address() {
  const address = useStore((state) => state.address)

  return (
    <section>
      <h2>Address</h2>
      <code>{address}</code>
    </section>
  )
}
