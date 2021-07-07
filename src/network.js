const networkSettings = {
    56: {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com/'],
    },
    97: {
        chainId: '0x61',
        chainName: 'BSC TestNet',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
    },

};
export const networkSetup = () => {
    return new Promise((resolve, reject) => {
        const provider = window.ethereum;
        if (provider) {
            provider
                .request({
                    method: 'wallet_addEthereumChain',
                    params: [networkSettings[97]],
                })
                .then(resolve)
                .catch(reject);
        }

    });
};