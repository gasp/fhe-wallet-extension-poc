import { ReactNode, createContext, useContext } from 'react'
import { ethers } from 'ethers'
import { provider } from '../libs/eth'

const RPCContext = createContext<{ provider: ethers.JsonRpcProvider }>({
  provider,
})

const RPCProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RPCContext.Provider value={{ provider }}>{children}</RPCContext.Provider>
  )
}

// A custom hook to use the context
const useRPC = () => useContext(RPCContext)

// eslint-disable-next-line react-refresh/only-export-components
export { RPCProvider, useRPC }
