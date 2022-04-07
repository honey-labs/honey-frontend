import type { NextPage } from 'next';
import { Box, Button, Card, IconExclamation, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { useState, useMemo } from 'react';
import PHoneyModal from 'components/PHoneyModal/PHoneyModal';
import VeHoneyModal from 'components/VeHoneyModal/VeHoneyModal';
import HoneyModal from 'components/HoneyModal/HoneyModal';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { useStake } from 'hooks/useStake';
import { useAccounts } from 'hooks/useAccounts';
import {
  PHONEY_DECIMALS,
  PHONEY_MINT,
  HONEY_MINT,
  HONEY_DECIMALS
} from 'helpers/sdk/constant';
import {
  convert,
  convertBnTimestampToDate,
  calcVeHoneyAmount
} from 'helpers/utils';

const Governance: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [showPHoneyModal, setShowPHoneyModal] = useState(false);
  const [showVeHoneyModal, setShowVeHoneyModal] = useState(false);
  const [showHoneyModal, setShowHoneyModal] = useState(false);

  const { tokenAccounts } = useAccounts();

  // ======================== Should replace with configuration ================
  const pHoneyToken = tokenAccounts.find(t => t.info.mint.equals(PHONEY_MINT));
  const honeyToken = tokenAccounts.find(t => t.info.mint.equals(HONEY_MINT))

  const STAKE_POOL_ADDRESS = new PublicKey(
    process.env.NEXT_STAKE_POOL_ADDR ||
      '4v62DWSwrUVEHe2g88MeyJ7g32vVzQsCnADZF8yUy8iU'
  );
  const LOCKER_ADDRESS = new PublicKey(
    process.env.NEXT_LOCKER_ADDR ||
      '5FnK8H9kDbmPNpBYMuvSkDevkMfnVPRrPNNqmTQyBBae'
  );
  // ============================================================================

  const { user, escrow } = useStake(STAKE_POOL_ADDRESS, LOCKER_ADDRESS);

  const lockedAmount = useMemo(() => {
    if (!escrow) {
      return 0;
    }

    return convert(escrow.amount, HONEY_DECIMALS);
  }, [escrow]);

  const lockedPeriodStart = useMemo(() => {
    if (!escrow) {
      return 0;
    }

    return convertBnTimestampToDate(escrow.escrowStartedAt);
  }, [escrow]);

  const lockedPeriodEnd = useMemo(() => {
    if (!escrow) {
      return 0;
    }

    return convertBnTimestampToDate(escrow.escrowEndsAt);
  }, [escrow]);

  const veHoneyAmount = useMemo(() => {
    if (!escrow) {
      return 0;
    }
    return calcVeHoneyAmount(
      escrow.escrowStartedAt,
      escrow.escrowEndsAt,
      escrow.amount
    );
  }, [escrow]);

  const depositedAmount = useMemo(() => {
    if (!user) {
      return 0;
    }

    return convert(user.depositAmount, PHONEY_DECIMALS);
  }, [user]);

  const pHoneyAmount = useMemo(() => {
    if (!pHoneyToken) {
      return 0;
    }

    return convert(pHoneyToken.info.amount, PHONEY_DECIMALS);
  }, [pHoneyToken]);

  const honeyAmount = useMemo(() => {
    if (!honeyToken) {
      return 0;
    }

    return convert(honeyToken.info.amount, HONEY_DECIMALS);
  }, [honeyToken]);

  return (
    <Layout>
      <Stack space="5" flex={1}>
        {/* Modals */}
        <ModalContainer
          onClose={() => setShowPHoneyModal(false)}
          isVisible={showPHoneyModal}
        >
          <PHoneyModal />
        </ModalContainer>
        <ModalContainer
          onClose={() => setShowVeHoneyModal(false)}
          isVisible={showVeHoneyModal}
        >
          <VeHoneyModal />
        </ModalContainer>
        <ModalContainer
          onClose={() => setShowHoneyModal(false)}
          isVisible={showHoneyModal}
        >
          <HoneyModal />
        </ModalContainer>
        {/* Page title */}
        {/* <Box marginTop="5">
          <Text variant="extraLarge" weight="bold">
            Vote on new collateral assets
          </Text>
        </Box> */}
        {/* Cards row */}
        <Stack
          direction={{
            lg: 'horizontal',
            md: 'horizontal',
            sm: 'vertical',
            xs: 'vertical'
          }}
          space="6"
        >
          <Card width={{ md: '1/2' }} level="2" padding="6">
            <Box display="flex" height="full">
              <Stack flex={1} justify="center" align="center" space="3">
                <IconExclamation color="accent" />
                <Text variant="small" align="center">
                  pre-IDO HONEY (pHONEY) has to be deposited after the IDO on
                  March 30th You can{' '}
                  <Text as="span" color="accent">
                    Convert it for HONEY or Lock/Vest it for veHONEY.
                  </Text>{' '}
                  Check out our docs to learn the difference between HONEY and
                  veHONEY + exchange rates.
                </Text>
                <Stack direction="horizontal" justify="center" align="center">
                  <Button
                    as="a"
                    href="https://docs.honey.finance/products/tokens"
                    target="_blank"
                    size="small"
                    variant="tertiary"
                  >
                    Learn more
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>
          <Card width={{ md: '1/2' }} level="2" padding="6">
            <Box height="full" width="full" display="flex">
              <Stack flex={1} direction="horizontal" space="3">
                <Box
                  width="3/4"
                  display="flex"
                  paddingRight="3"
                  borderRightWidth="0.375"
                >
                  <Stack flex={1} justify="space-between" space="6">
                    <Stack justify="space-between" direction="horizontal">
                      <Stack align="flex-end">
                        <Text size="small">
                          <b>{veHoneyAmount}</b> $veHONEY (locked)
                        </Text>
                      </Stack>

                      <Stack align="flex-end">
                        {/* <Text size="small">$HONEY locked</Text> */}
                        <Text size="small">
                          <b>{lockedAmount}</b> $HONEY (locked)
                        </Text>
                      </Stack>
                    </Stack>
                    <Box marginTop="auto">
                      <Stack space="3">
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Lock period starts</Text>
                          <Text size="small">{lockedPeriodStart}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Lock period ends</Text>
                          <Text size="small">{lockedPeriodEnd}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">$pHONEY deposited:</Text>
                          <Text size="small">{depositedAmount}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">$pHONEY balance</Text>
                          <Text size="small">{pHoneyAmount}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">$HONEY balance</Text>
                          <Text size="small">{honeyAmount}</Text>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
                <Stack justify="space-around">
                  {wallet ? (
                      <Button
                        onClick={() => setShowVeHoneyModal(true)}
                        width="full"
                        size="small"
                        variant="secondary"
                      >
                        Lock pHONEY
                      </Button>
                  ) : (
                    <Button
                      onClick={connect}
                      width="full"
                      size="small"
                      variant="secondary"
                    >
                      Lock pHONEY
                    </Button>
                  )}
                  {wallet ? (
                      <Button
                        onClick={() => setShowHoneyModal(true)}
                        width="full"
                        size="small"
                        variant="secondary"
                      >
                        Lock HONEY
                      </Button>
                  ) : (
                    <Button
                      onClick={connect}
                      width="full"
                      size="small"
                      variant="secondary"
                    >
                      Lock HONEY
                    </Button>
                  )}
                        {wallet ? (
                    <Button
                      onClick={() => setShowPHoneyModal(true)}
                      width="full"
                      size="small"
                      variant="secondary"
                    >
                      pHONEY to HONEY
                    </Button>
                  ) : (
                    <Button
                      onClick={connect}
                      width="full"
                      size="small"
                      variant="secondary"
                    >
                      pHONEY to HONEY
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Stack>
        {/* Table */}
        {/* <Box
          flex={1}
          borderRadius="2xLarge"
          backgroundColor="backgroundTertiary"
        ></Box> */}
      </Stack>
    </Layout>
  );
};

export default Governance;
