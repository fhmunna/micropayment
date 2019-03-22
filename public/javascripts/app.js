var App = {
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
        App.bindEvents();
        return App.initWeb3(callback);
    },

    initWeb3: function (callback) {
        $.getJSON('/Network.json', function (data) {
            let netConfig = data[data.default];
            for (let key in netConfig) {
                if (netConfig.hasOwnProperty(key)) {
                    App.constants[key] = netConfig[key];
                }
            }

            // Initialize web3 and set the provider to the testRPC.
            if (typeof web3 !== 'undefined') {
                App.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
            } else {
                // set the provider you want from Web3.providers
                App.web3Provider = new Web3.providers.HttpProvider(App.constants.httpProvider);
                web3 = new Web3(App.web3Provider);
            }

            return App.initContract(callback);
        });
    },

    initContract: function (callback) {
        $.getJSON(App.constants.abi, function (data) {
            App.contracts.TOKEN = web3.eth.contract(data[App.constants.TOKEN].abi).at(App.constants.contractAddress);
            App.contracts.CHANNEL_MANAGER = web3.eth.contract(data[App.constants.CHANNEL_MANAGER].abi).at(App.constants.contractAddress);
            return callback();
        });
    },

    bindEvents: function () {

    },
}