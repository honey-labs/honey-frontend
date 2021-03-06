import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useConnectedWallet } from '@saberhq/use-solana';
import { Box, Text, Card, IconPlus } from 'degen';
import { Stack } from 'degen';
import { Button } from 'degen';
import { IconPlusSmall, IconSearch } from 'degen';
import { Input } from 'degen';
import ToggleSwitch from '../../components/ToggleSwitch';
import AssetRow, { AssetRowType } from '../../components/AssetRow';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import DepositWithdrawModule from '../../components/DepositWithdrawModule/DepositWIthdrawModule';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';
import LoanHeaderComponent from 'components/LoanHeaderComponent/LoanHeaderComponent';

const assetData: Array<AssetRowType> = [
  {
    vaultName: 'Solana Monkey Business',
    vaultImageUrl: '/nfts/2738.png',
    totalBorrowed: 0,
    interest: 0,
    available: 0,
    positions: 0
  }
];

const Loan: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [borrowOrLend, setBorrowOrLend] = useState(0);

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const loadBorrowPage = wallet && borrowOrLend === 0;
  const loadLendPage = wallet && borrowOrLend === 1;

  function showLoanModal() {
    setModalIsVisible(true);
  }

  return (
    <Layout>
      <Stack>
        <ModalContainer
          onClose={() => setModalIsVisible(false)}
          isVisible={modalIsVisible}
        >
          <DepositWithdrawModule />
        </ModalContainer>
        <Box marginY="4">
          <Stack direction="vertical" space="5">
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <ToggleSwitch
                buttons={[
                  {
                    title: 'Borrow',
                    onClick: () => setBorrowOrLend(0)
                  },
                  { title: 'Lend', onClick: () => setBorrowOrLend(1) }
                ]}
                activeIndex={borrowOrLend}
              />
              <LoanHeaderComponent />
            </Stack>
          </Stack>
        </Box>
        <Box
          backgroundColor="backgroundTertiary"
          minWidth="full"
          gap="3"
          borderRadius="2xLarge"
          padding="5"
          width="full"
        >
          <Stack>
            <Box className={styles.cardMenuContainer}>
              <Box padding="1">
                <Input
                  label=""
                  placeholder="Search by name"
                  prefix={<IconSearch />}
                />
              </Box>
              <Text>Total borrowed</Text>
              <Text>Interest</Text>
              <Text>Available</Text>
              <Text>Your positions</Text>
            </Box>
            <Box>
              <hr className={styles.lineDivider}></hr>
            </Box>
            <Stack>
              <Box>
                {assetData.map(item => (
                  <Box key={item.vaultName}>
                    {loadBorrowPage && (
                      <Link href="/loan/[name]" as={`/loan/${item.vaultName}`}>
                        <a>
                          <AssetRow data={item} />
                        </a>
                      </Link>
                    )}
                    {loadLendPage && (
                      <Link
                        href="/loan/lend/[name]"
                        as={`/loan/lend/${item.vaultName}`}
                      >
                        <a>
                          <AssetRow data={item} />
                        </a>
                      </Link>
                    )}
                    {!wallet && (
                      <Box onClick={connect} cursor="pointer">
                        <AssetRow data={item} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Loan;
