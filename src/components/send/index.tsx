import { SendClear } from './send-clear'
import { SendEncrypted } from './send-encrypted'

export function Send() {
  return (
    <section>
      <h2>Send</h2>
      <SendClear />
      <SendEncrypted />
    </section>
  )
}
