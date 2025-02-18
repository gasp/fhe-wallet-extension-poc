import { useCallback, useEffect, useState } from 'react'

import { usePopupStore } from '../store'
import { service } from '../libs/offscreeen-service'
import { GasPriceResponse } from '../libs/messages'

export function GasPrice() {
  const gasPrice = usePopupStore((state) => state.gasPrice)
  const setGasPrice = usePopupStore((state) => state.setGasPrice)
  const [loading, setLoading] = useState(false)

  const updateGasPrice = useCallback(async () => {
    setLoading(true)
    try {
      const response = (await service({
        type: 'gas-price',
        data: null,
      })) as GasPriceResponse['data']
      if (!response) return
      setGasPrice(response.price)
    } catch (error) {
      console.error('Error fetching gas price:', error)
    }
    setLoading(false)
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
    <div style={{ position: 'fixed', bottom: '1rem' }}>
      gas Price: {gasPrice} ETH{' '}
      <button className="refresh" disabled={loading} onClick={updateGasPrice}>
        <span>⟳</span>
      </button>
    </div>
  )
}
