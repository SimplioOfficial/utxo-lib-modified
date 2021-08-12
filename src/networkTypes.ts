/**
 * @prettier
 */

/**
 * @deprecated
 */
export const coins = {
  BCH: 'bch',
  BSV: 'bsv',
  BTC: 'btc',
  BTG: 'btg',
  LTC: 'ltc',
  ZEC: 'zec',
  DASH: 'dash',
  DOGE: 'doge',
  DGB: 'dgb'
} as const;

/** @deprecated */
export type CoinKey = keyof typeof coins;
/** @deprecated */
export type Coin = typeof coins[CoinKey];

export type NetworkName =
  | 'bitcoin'
  | 'testnet'
  | 'bitcoincash'
  | 'bitcoincashTestnet'
  | 'bitcoingold'
  | 'bitcoingoldTestnet'
  | 'bitcoinsv'
  | 'bitcoinsvTestnet'
  | 'dash'
  | 'dashTest'
  | 'litecoin'
  | 'litecoinTest'
  | 'zcash'
  | 'zcashTest'
  | 'digibyte'
  | 'dogecoin';

export type Network = {
  messagePrefix: string;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
  bip32: {
    public: number;
    private: number;
  };
  bech32?: string;
  /**
   * @deprecated
   */
  coin: Coin;
  forkId?: number;
};

export type ZcashNetwork = Network & {
  consensusBranchId: Record<number, number>;
};
