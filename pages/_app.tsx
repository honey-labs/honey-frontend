import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import '../styles/globals.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { accentSequence, ThemeAccent } from 'helpers/theme-utils';
import { PartialNetworkConfigMap } from '@saberhq/use-solana/src/utils/useConnectionInternal';
import SecPopup from 'components/SecPopup';
import { AnchorProvider, HoneyProvider } from 'helpers/honey-sdk';
import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import React, { FC, ReactNode, useEffect, useState } from "react";

const network = process.env.NETWORK as Network;

const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap;
  } else {
    return undefined;
  }
};

const defaultAccent: ThemeAccent = accentSequence[0];
const storedAccent =
  typeof window !== 'undefined'
    ? (localStorage.getItem('accent') as ThemeAccent)
    : undefined;

const OnChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useConnectedWallet();
  const connection = useConnection();
  const network = 'devnet';

  return (
    <AnchorProvider
    wallet={wallet}
    connection={connection}
    network={network}
    honeyProgram={"6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w"}>
      <HoneyProvider
        wallet={wallet}
        connection={connection}
        honeyProgramId={"6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w"}
        honeyMarketId={"47RbcdWKUJJKNwtX7JAtt8KarzA1APztHaDo8Dd4cZAt"}
      >
        {/* HB82woFm5MrTx3X4gsRpVcUxtWJJyDBeT5xNGCUUrLLe */}
        {/* 47RbcdWKUJJKNwtX7JAtt8KarzA1APztHaDo8Dd4cZAt */}
        {children}
      </HoneyProvider>
    </AnchorProvider>
  )
}


function MyApp({ Component, pageProps }: AppProps) {
  const [showPopup, setShowPopup] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const cautionAgreed = localStorage.getItem('caution-agreed');
    setShowPopup(cautionAgreed === 'true' ? false : true);
    setShouldRender(true);
  }, []);

  if (!shouldRender) return null;

  return (
    <ThemeProvider
      defaultMode="dark"
      defaultAccent={storedAccent || defaultAccent}
    >
      <WalletKitProvider
        defaultNetwork={network}
        app={{
          name: 'Honey Finance'
        }}
        networkConfigs={networkConfiguration()}
      >
        {/* {children} */}
        {showPopup ? (
          <SecPopup setShowPopup={setShowPopup} />
        ) : (
          <>
            <OnChainProvider>
              <Component {...pageProps} />
              <ToastContainer theme="dark" position="bottom-right" />
            </OnChainProvider>
          </>
        )}
      </WalletKitProvider>
    </ThemeProvider>
  );
}

export default MyApp;