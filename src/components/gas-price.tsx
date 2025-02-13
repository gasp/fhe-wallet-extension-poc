import { useCallback, useEffect } from 'react'
import { formatEther } from 'ethers'

import { useAppStore } from '../store'
import { provider as rawProvider } from '../providers/rpc'
/**
 * get gas price from provider
 * @returns {bigint} gas price in wei
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function getGasPrice(): Promise<bigint> {
  const { gasPrice } = await rawProvider.getFeeData()
  if (!gasPrice) throw new Error('unable to fetch gas price')
  return gasPrice
}

export function GasPrice() {
  const gasPrice = useAppStore((state) => state.gasPrice)
  const setGasPrice = useAppStore((state) => state.setGasPrice)

  const updateGasPrice = useCallback(async () => {
    try {
      const price = await getGasPrice()
      setGasPrice(price)
    } catch (error) {
      console.error('Error fetching gas price:', error)
    }
  }, [setGasPrice])

  useEffect(() => {
    // quickly update the price
    updateGasPrice()
    const intervalId = setInterval(() => {
      updateGasPrice()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [updateGasPrice])

  return (
    <p>
      gas Price: {formatEther(gasPrice)} ETH{' '}
      <button onClick={updateGasPrice}>Refresh</button>
    </p>
  )
}
