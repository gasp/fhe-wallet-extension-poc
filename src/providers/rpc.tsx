import { ReactNode, createContext, useContext } from 'react'
import { ethers } from 'ethers'

// https://docs.ethers.org/v6/api/providers/jsonrpc/#about-jsonrpcProvider
const provider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_SEPOLIA_RPC_URL
)
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

export { RPCProvider, useRPC }
