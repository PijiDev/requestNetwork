import { ERC777Currency } from '../types';
import { supportedNetworks } from './networks';

/**
 * Returns a list of supported ERC777 tokens
 *
 * @returns List of supported ERC777 tokens
 */
export function getSupportedERC777Tokens(): ERC777Currency[] {
  return Object.entries(supportedNetworks).reduce(
    (acc: ERC777Currency[], [networkName, supportedCurrencies]) => {
      return [
        ...acc,
        ...Object.entries(supportedCurrencies).map(([address, token]) => ({
          address,
          network: networkName,
          decimals: token.decimals,
          symbol: token.symbol,
        })),
      ];
    },
    [],
  );
}
