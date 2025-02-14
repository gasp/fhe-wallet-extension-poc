import { Address } from './address'
import { Balance } from './balance'
import { Send } from './send'
import { Activity } from './activity'
import { GasPrice } from './gas-price'

export function Layout() {
  return (
    <>
      <Address />
      <Balance />
      <Send />
      <Activity />
      <GasPrice />
    </>
  )
}
