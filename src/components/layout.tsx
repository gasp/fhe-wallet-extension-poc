import { Address } from './address'
import { Balance } from './balance'
import { Send } from './send'
import { Activity } from './activity'
import { GasPrice } from './gas-price'

export function Layout() {
  return (
    <>
      <h1>Hello, Sepolia!</h1>
      <Address />
      <Balance />
      <Send />
      <Activity />
      <GasPrice />
    </>
  )
}
