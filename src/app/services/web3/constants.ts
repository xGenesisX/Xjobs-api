// supported chain IDs
export enum chainID {
  SOLANA = 0,
}

// supported chains
export enum SupportedChains {
  SOLANA = "SOL",
}

// supported currencies
export enum SupportedSPLCurrencies {
  USDC = 0,
}

// all chain metadata
export const chainMetadata = {
  [chainID.SOLANA]: {
    chainId: chainID.SOLANA,
    contract: "",
    rpcUrl: "",
    blockExplorerURL: "https://solscan.io/",
    Tokens: ["USDC"],
    MintArr: [18],
    TokenAddresses: {
      USDC: "0x3b1bCdA99Df192448137e6b592b95979bA0AC8fe",
    },
    Config: {
      chainId: 1,
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/1/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    },
  },
};

export enum BlockchainConnectionNetwork {
  LIVE = "mainnet",
  TEST = "testnet",
}

export enum RequestContext {
  TEST = "TEST",
  LIVE = "LIVE",
}

export enum EVMSupportedCryptocurrency {
  USDC = "USDC",
}
