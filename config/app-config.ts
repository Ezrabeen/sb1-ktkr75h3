// Configuration for the application
export const appConfig = {
  // Application name
  appName: "ReVive",

  // Enable demo mode when VeWorld is not available
  enableDemoMode: true,

  // Demo mode configuration
  demoMode: {
    // Demo account address
    demoAddress: "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf",

    // Demo balance in VET
    demoBalance: "1000",

    // Demo token balance (B3TR)
    demoTokenBalance: "500",

    // Demo network (mainnet or testnet)
    demoNetwork: "testnet" as const,

    // Demo chain ID (40 for testnet, 39 for mainnet)
    demoChainId: 40,
  },

  // Network configuration
  networks: {
    mainnet: {
      name: "Thor Mainnet",
      chainId: 39,
      explorerUrl: "https://explore.vechain.org",
    },
    testnet: {
      name: "Thor Testnet",
      chainId: 40,
      explorerUrl: "https://explore-testnet.vechain.org",
    },
  },

  // Token configuration
  tokens: {
    B3TR: {
      name: "B3TR Token",
      symbol: "B3TR",
      decimals: 18,
      address: {
        mainnet: "0x1234567890123456789012345678901234567890",
        testnet: "0x1234567890123456789012345678901234567890",
      },
    },
  },
}

