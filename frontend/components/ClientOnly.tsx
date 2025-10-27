import React, { FC, ReactNode, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface WalletConnectedProps {
  children: ReactNode
  fallback?: ReactNode
}

export const WalletConnected: FC<WalletConnectedProps> = ({ children, fallback = null }) => {
  const { publicKey } = useWallet()
  
  if (!publicKey) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface WalletDisconnectedProps {
  children: ReactNode
  fallback?: ReactNode
}

export const WalletDisconnected: FC<WalletDisconnectedProps> = ({ children, fallback = null }) => {
  const { publicKey } = useWallet()
  
  if (publicKey) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

