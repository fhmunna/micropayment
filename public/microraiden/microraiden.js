var MicroRaiden = {
    web3Provider: null,
    privateKey: null,
    account: null,
    constants: {
        TOKEN: "CustomToken",
        CHANNEL_MANAGER: "RaidenMicroTransferChannels"
    },
    contracts: {
        TOKEN: null,
        CHANNEL_MANAGER: null
    },

    init: function (callback) {
        $.getJSON('/microraiden/network.json', function (data) {
            let netConfig = data[data.default];
            for (let key in netConfig) {
                if (netConfig.hasOwnProperty(key)) {
                    MicroRaiden.constants[key] = netConfig[key];
                }
            }

            // Initialize web3 and set the provider to the testRPC.
            if (typeof web3 !== 'undefined') {
                MicroRaiden.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
            } else {
                // set the provider you want from Web3.providers
                MicroRaiden.web3Provider = new Web3.providers.HttpProvider(MicroRaiden.constants.httpProvider);
                web3 = new Web3(MicroRaiden.web3Provider);
            }

            return MicroRaiden.initContract(callback);
        });
    },

    initContract: function (callback) {
        $.getJSON(MicroRaiden.constants.abi, function (data) {
            MicroRaiden.contracts.TOKEN = web3.eth.contract(data[MicroRaiden.constants.TOKEN].abi).at(MicroRaiden.constants.contractAddress);
            MicroRaiden.contracts.CHANNEL_MANAGER = web3.eth.contract(data[MicroRaiden.constants.CHANNEL_MANAGER].abi).at(MicroRaiden.constants.contractAddress);
            return callback();
        });
    },

    getBalance: function (sender, callback) {
        MicroRaiden.contracts.TOKEN.balanceOf(sender, (error, result) => {
            callback(result.toNumber());
        });
    }
}

