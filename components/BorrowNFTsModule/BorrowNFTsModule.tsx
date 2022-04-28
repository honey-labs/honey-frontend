import React, { useState } from 'react';
import { Box, Card } from 'degen';
import LoanBorrow from '../../components/LoanBorrow';
import LoanRepay from '../../components/LoanRepay';
import * as styles from './BorrowNFTsModule.css';
import ToggleSwitchLoan from '../../components/ToggleSwitchLoan';
import ConfigureSDK from '../../helpers/config';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
  borrow,
  repay,
  deposit,
  withdraw,
  useMarket
} from '@honey-finance/sdk';

type TButton = {
  title: string;
  hidden?: boolean;
  onClick?: void;
};
interface BorrowNFTsModule {
  buttons: TButton[],
  NFT: {
    name: string,
    image: string,
    borrowApy: string,
    estValue: string,
    assetsBorrowed: number,
    netBorrowBalance: number,
    key: number
  },
  handleBorrow: () => void,
  loanPositions?: number
}

const BorrowNFTsModule = (props: BorrowNFTsModule) => {
  const sdkConfig = ConfigureSDK();
  const { NFT, buttons, handleBorrow, loanPositions } = props;

  /**
    * @description calls upon the honey sdk - market 
    * @params solanas useConnection func. && useConnectedWallet func. && JET ID
    * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketID);
  const [borrowOrRepay, setBorrowOrRepay] = useState(0);

  async function executeBorrow() {
    setTimeout(() => {
      handleBorrow(1)
    },3000)
    const borrowTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await borrow(honeyUser, 1 * LAMPORTS_PER_SOL, borrowTokenMint, honeyReserves);

    setTimeout(() => {
      handleBorrow(0)
    },3000)
  }

  async function executeRepay() {
    setTimeout(() => {
      handleBorrow(0)
    },3000)

    const repayTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    const tx = await repay(honeyUser, 1 * LAMPORTS_PER_SOL, repayTokenMint, honeyReserves)
    console.log(tx);
  }

  function handleToggle(value:string) {
    setBorrowOrRepay(value);
  }

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <ToggleSwitchLoan
          buttons={[
            {
              title: 'Borrow',
              onClick: () => handleToggle(0)
            },
            { 
              title: 'Repay', 
              onClick: () => handleToggle(1) 
            }
          ]}
          activeIndex={borrowOrRepay}
        />
        <hr></hr>
        {
          borrowOrRepay == 0  ? (
            <LoanBorrow 
              NFT={NFT} 
              handleBorrow={executeBorrow}
              loanPositions={loanPositions}
            />
            ) : (
              <LoanRepay NFT={NFT} handleRepay={executeRepay} />
            )
        };
      </Card>
    </Box>
  );
};

export default BorrowNFTsModule;
