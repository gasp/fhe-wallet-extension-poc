import { useState } from 'react'
import { SendClear } from './send-clear'
import { SendEncrypted } from './send-encrypted'

export function Send() {
  const [isEncrypted, setIsEncrypted] = useState(true)
  return (
    <section>
      <h2>Send</h2>
      {isEncrypted ? <SendEncrypted /> : <SendClear />}
      <div>
        <input
          id="checkEncrypted"
          type="checkbox"
          checked={isEncrypted}
          onChange={(e) => setIsEncrypted(e.target.checked)}
        />
        <label htmlFor="checkEncrypted">encrypt transaction</label>
      </div>
    </section>
  )
}
