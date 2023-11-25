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
  USDT = 1,
  BUSD = 2,
  DAI = 3,
  WBTC = 4,
}

// all chain metadata
export const chainMetadata = {
  [chainID.SOLANA]: {
    chainId: chainID.SOLANA,
    contract: "",
    rpcUrl: "",
    blockExplorerURL: "https://etherscan.io/",
    Tokens: ["USDC", "USDT", "BUSD", "DAI", "WBTC"],
    MintArr: [18, 18, 18, 18, 18],
    TokenAddresses: {
      USDC: "0x3b1bCdA99Df192448137e6b592b95979bA0AC8fe",
      USDT: "0xd6780B9E360f1345242d135a47f3639E39A306Ff",
      BUSD: "0x3d741A148577d5B358AF8Ae0479d0f811118b4B3",
      DAI: "0xaA19CB732D3FD2F60914DF7A0C5a7c91175c9C6c",
      WBTC: "0xB22DF375fC125D54C123438af9D4a91Ac56891Fb",
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

export enum BlockchainConnectionChain {
  ETH = "ETH",
  BSC = "BSC",
  MATIC = "MATIC",
}

export enum RequestContext {
  TEST = "TEST",
  LIVE = "LIVE",
}

export enum EVMSupportedCryptocurrency {
  USDT = "USDT",
  USDC = "USDC",
  DAI = "DAI",
  WBTC = "WBTC",
  BUSD = "BUSD",
}
