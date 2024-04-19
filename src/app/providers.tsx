// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './wagmiConfig';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

/*
const config = getDefaultConfig({
  appName: 'InRealArt App',
  projectId: 'c43264f99eb6a94f5abb42f9bc6c617f',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
*/

const client = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <ChakraProvider>
              {children}
            </ChakraProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    )
}