var Helper = {
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
        Helper.bindEvents();
        return Helper.initWeb3(callback);
    },

    initWeb3: function (callback) {
        $.getJSON('/Network.json', function (data) {
            let netConfig = data[data.default];
            for (let key in netConfig) {
                if (netConfig.hasOwnProperty(key)) {
                    Helper.constants[key] = netConfig[key];
                }
            }

            // Initialize web3 and set the provider to the testRPC.
            if (typeof web3 !== 'undefined') {
                Helper.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
            } else {
                // set the provider you want from Web3.providers
                Helper.web3Provider = new Web3.providers.HttpProvider(Helper.constants.httpProvider);
                web3 = new Web3(Helper.web3Provider);
            }

            return Helper.initContract(callback);
        });
    },

    initContract: function (callback) {
        $.getJSON(Helper.constants.abi, function (data) {
            Helper.contracts.TOKEN = web3.eth.contract(data[Helper.constants.TOKEN].abi).at(Helper.constants.contractAddress);
            Helper.contracts.CHANNEL_MANAGER = web3.eth.contract(data[Helper.constants.CHANNEL_MANAGER].abi).at(Helper.constants.contractAddress);
            return callback();
        });
    },

    bindEvents: function () {

    },
}