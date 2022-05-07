import { useConnection, useConnectedWallet } from '@saberhq/use-solana';

/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID | marketID
*/
export function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: '6ujVJiHnyqaTBHzwwfySzTDX5EPFgmXqnibuMp3Hun1w',
        marketId: 'HB82woFm5MrTx3X4gsRpVcUxtWJJyDBeT5xNGCUUrLLe'
    }
}


