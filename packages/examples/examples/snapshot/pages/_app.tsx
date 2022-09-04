/* eslint-disable curly */
/* eslint-disable no-shadow */
/* eslint-disable import/named */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
/* eslint-disable import/no-unassigned-import */
/* eslint-disable import/extensions */
/* eslint-disable jsdoc/require-jsdoc */
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@components/Navbar';
import { useEffect, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import merge from 'lodash.merge';

declare global {
  interface Window {
    ethereum: any;
  }
}

const { chains, provider } = configureChains(
  [chain.rinkeby],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'Snapshot',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

/* Theming */
const theme = extendTheme({
  styles: {
    global: {
      // "*": {
      //   backgroundColor: "transparent",
      // },
      a: {
        _hover: {
          textDecoration: 'underline',
        },
      },
      h1: {
        fontSize: '4xl',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '2xl',
        fontWeight: 'bold',
      },
      h3: {
        fontSize: 'lg',
      },
      h4: {
        fontSize: 'md',
      },
    },
  },
});

/* RainbowKit Theming */
const customTheme = merge(lightTheme(), {
  colors: {
    accentColor: '#ec5920',
  },
} as Theme);

function MyApp({ Component, pageProps, router }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // prevent hydration UI bug: https://blog.saeloun.com/2021/12/16/hydration.html
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={customTheme}>
          <ChakraProvider theme={theme}>
            <div className="centerEllipse" />
            <Navbar></Navbar>
            <Component {...pageProps} key={router.route} />
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
