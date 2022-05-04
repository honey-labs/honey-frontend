import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text } from 'degen';
import React, { useState, useEffect } from 'react';
import * as styles from './LoanNFTsContainer.css';

type TButton = {
  title: string;
  active?: boolean;
};
interface LoanNFTsContainerProps {
  NFTs: any[];
  selectedId: number;
  onSelectNFT: (key: number) => void;
  title: string;
  buttons: TButton[];
  openPositions: any[];
  availableNFTs: any[];
  handleBorrow: (key: number) => void;
  executeWithdrawNFT: (nft: any) => void;
  executeDepositNFT: (nft: any) => void;
}

const LoanNFTsContainer = (props: LoanNFTsContainerProps) => {
  const {
    title,
    buttons,
    selectedId,
    onSelectNFT,
    openPositions,
    availableNFTs,
    handleBorrow,
    executeWithdrawNFT,
    executeDepositNFT,
  } = props;
  /**
   * @description based off renderNFTs either open positions (0) gets rendered or available nfts (1)
   * @params 0 or 1
   * @returns the appropriate array to render in the borrow module
  */
  const [renderNFTs, setRenderNFTs] = useState(0);
  /**
   * @description handler for above declared logic
   * @params title of the button thats being clicked; open positions || new position
   * @returns nothing - sets state of to be rendered nft array
  */
  function handleNFTModal(nftType: string) {
    if (nftType == 'Open positions') {
      setRenderNFTs(0)
      handleBorrow(1)
    } else {
      setRenderNFTs(1)
      handleBorrow(0)
    }
  }
  // re-render after update
  useEffect(() => {
  }, [renderNFTs])

  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <Box height="full" display="flex">
          <Stack flex={1}>
            <Stack direction="horizontal" justify="space-between">
              <Text weight="semiBold" variant="large">
                {title}
              </Text>
              <Box className={styles.buttonSelectionWrapper}>
                {buttons.map(button =>
                   (
                    <Button
                      key={button.title}
                      size="small"
                      disabled={false}
                      onClick={() => handleNFTModal(button.title)}
                    >
                      {button.title}
                    </Button>
                ))}
              </Box>
            </Stack>
              <Box className={styles.nftContainer}>
                {openPositions && renderNFTs == 0 ? openPositions.map((nft, i) => (
                  <LoanNFTCard
                    selected={nft.key === selectedId}
                    key={nft.key}
                    NFT={nft}
                    onSelect={onSelectNFT}
                    available={false}
                    executeWithdrawNFT={executeWithdrawNFT}
                  />
                )) : availableNFTs && availableNFTs.map((nft, i) => (
                  <LoanNFTCard
                    selected={nft.key === selectedId}
                    key={nft.key}
                    NFT={nft}
                    onSelect={onSelectNFT}
                    available={true}
                    executeDepositNFT={executeDepositNFT}
                  />
                ))}
              </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default LoanNFTsContainer;


