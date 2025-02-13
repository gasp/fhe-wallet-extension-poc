import { BalanceClear } from './balance-clear'
import { BalanceEncrypted } from './balance-encrypted'

export function Balance() {
  return (
    <section>
      <h2>Balance</h2>
      <BalanceClear />
      <BalanceEncrypted />
    </section>
  )
}
