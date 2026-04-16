import {
  isCoinSymbol,
  L2Regex,
  NetworkDictionary,
  SolanaNetworks,
  TronNetworks,
} from '@akashic/as-backend';
import {
  BinanceSymbol,
  BitcoinSymbol,
  type CoinSymbol,
  EthereumSymbol,
  SolanaSymbol,
  TronSymbol,
} from '@akashic/core-lib';

import { ALLOWED_NETWORKS } from '../../../constants/currencies';
import type { DepositChainOption } from '../../../utils/hooks/useAccountL1Address';

export const CRYPTO_COLORS = {
  tron: '#EB0029',
  ethereum: '#5065E4',
  binance: '#F3BA2F',
  bitcoin: '#F7931A',
  solana: '#000008',
  usdt: '#22A079',
  usdc: '#2775ca',
  akashicChain: '#A3A2FF',
} as const;

export function getNetworkColor(
  network: DepositChainOption,
  isDarkMode = false
): string {
  if (network === 'AkashicChain') return CRYPTO_COLORS.akashicChain;
  const coin = network as CoinSymbol;
  if (isCoinSymbol(coin, TronSymbol)) return CRYPTO_COLORS.tron;
  if (isCoinSymbol(coin, EthereumSymbol)) return CRYPTO_COLORS.ethereum;
  if (isCoinSymbol(coin, BinanceSymbol)) return CRYPTO_COLORS.binance;
  if (isCoinSymbol(coin, BitcoinSymbol)) return CRYPTO_COLORS.bitcoin;
  if (isCoinSymbol(coin, SolanaSymbol))
    return isDarkMode ? '#ffffff' : CRYPTO_COLORS.solana;
  return CRYPTO_COLORS.ethereum;
}

export function detectNetworks(address: string): DepositChainOption[] {
  const trimmed = address.trim();
  if (!trimmed) return [];

  if (L2Regex.test(trimmed)) {
    return ['AkashicChain'];
  }

  const matches = ALLOWED_NETWORKS.filter((chain) =>
    RegExp(NetworkDictionary[chain].regex.address).test(trimmed)
  );

  // Tron and Solana address regexes can overlap (Tron's T-prefix chars are valid
  // base58). If both families match, keep only Tron — the T-prefix is definitive.
  const hasTron = matches.some((m) => TronNetworks.includes(m));
  const hasSolana = matches.some((m) => SolanaNetworks.includes(m));
  if (hasTron && hasSolana) {
    return matches.filter((m) => !SolanaNetworks.includes(m));
  }

  return matches;
}
