interface WalletAddress {
  address: string;
  txCount: number;
  balance: number;
  tokens: [
    {
      address: string;
      name: string;
      displayName: string;
      fingerprint: string;
      quantity: number;
      metadata?: ITokenMetadata;
    }
  ];
  stakeAddress: string;
  isContract: boolean;
  verifiedContract?: boolean;
  associatedNativeScript?: boolean;
  associatedSmartContract?: boolean;
  scriptHash?: string;
}

interface WalletStake {
  status: "ACTIVE" | "INACTIVE ";
  stakeAddress: string;
  totalStake: number;
  rewardAvailable: number;
  rewardWithdrawn: number;
  pool: {
    tickerName: string;
    poolName: string;
    poolId: string;
  };
}
