import { useConnection, useConnectedWallet } from '@saberhq/use-solana';
import { HONEY_PROGRAM_ID, HONEY_MARKET_ID } from 'constants/loan';
import { toast } from 'react-toastify';

/**
 * @description exports the current sdk configuration object
 * @params none
 * @returns connection | wallet | honeyID | marketID
*/
export function ConfigureSDK() {
    return {
        saberHqConnection: useConnection(),
        sdkWallet: useConnectedWallet(),
        honeyId: HONEY_PROGRAM_ID,
        marketId: HONEY_MARKET_ID
    }
}

/**
 * @description exports function that validates if input is number
 * @params user input
 * @returns success or failure object
*/
export async function inputNumberValidator(val: any) {
    if (val >= 0 && val < 100) {
      return {
          success: true,
          message: '',
          value: val
      };
    } else {
      return {
        success: false,
        message: 'Please fill in a number between 0 and 100',
        value: val
      }
    }
}

/**
 * @description
 * @params
 * @returns
*/
export async function toastResponse(responseType: string, message: string) {
  if (responseType == 'ERROR') {
    return toast.error(message);
  } else if (responseType == 'LOADING') {
    const resolveP = new Promise(resolve => setTimeout(resolve, 4000));
    return toast.promise(
      resolveP,
      {
        pending: 'Loading data..',
        success: 'Data loaded',
        error: 'An error occurred'
      }
    )
  } else if (responseType == 'SUCCESS') {
    // success logic
    return toast.success(message);
  }
}