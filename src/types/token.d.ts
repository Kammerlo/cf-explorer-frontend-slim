interface ITokenOverview {
  name?: string;
  displayName?: string;
  policy?: string;
  fingerprint?: string;
  txCount?: number;
  supply?: number;
  createdOn?: string;
  metadata?: ITokenMetadata;
  volumeIn24h: number;
  totalVolume: string;
  numberOfHolders: number;
  tokenType?: string;
  tokenLastActivity?: string;
  metadataJson?: string;
}

interface ITokenMetadata {
  policy?: string;
  logo?: string;
  decimals?: number;
  description?: string;
  ticker?: string;
  url?: string;
}

interface IToken extends ITokenOverview, ITokenMetadata {}

interface ITokenTopHolderTable {
  address: string;
  name: string;
  displayName: string;
  fingerprint: string;
  quantity: number;
}

interface ITokenMintingTable {
  txHash: string;
  amount: number;
  time: string;
}

interface TokensSearch {
  createdOn: string;
  displayName: string;
  fingerprint: string;
  name: string;
  numberOfHolders: number;
  policy: string;
  supply: string;
  totalVolume: string;
  txCount: number;
  volumeIn24h: string;
}
