const Web3 = require('web3');
const EthSigUtil = require('eth-sig-util');
const EthereumTx = require('ethereumjs-tx');
const fs = require('fs-extra');

const web3 = new Web3("http://52.8.233.242:8545");
const contractABI = JSON.parse(fs.readFileSync(__dirname + '/../contracts/contracts.json').toString());

const TOKEN = 'CustomToken';
const CHANNEL_MANAGER = 'RaidenMicroTransferChannels';
const TOKEN_SUPLY = 1e25;
const DECIMALS = 18;
const CHALLENGE_PERIOD = 500;
const tokenAddr = "0x74434527b8e6c8296506d61d0faf3d18c9e4649a";
const channelAddr = "0xff24d15afb9eb080c089053be99881dd18aa1090";

var config = {
    gas: null,
    gasPrice: null,
    gasLimit: null,
    chainId: null,
}

var MicroRaiden = {
    web3: web3,
    ethUtil: EthSigUtil,
    channel: null,
    token: null,
    getContracts: function () {
        this.channel = web3.eth.Contract(contractABI[CHANNEL_MANAGER].abi, channelAddr);
        this.token = web3.eth.Contract(contractABI[TOKEN].abi, tokenAddr);
    },
    getBalance: function () {
        web3.eth.getAccounts().then(function (accounts) {
            var sender_address = '0x18c8bA8eA6Ba89AA3e4a329CF752E71cBA061025';
            MicroRaiden.token.methods.balanceOf(sender_address).call((error, result) => {
                console.log(error);
            }).then((result) => {
                console.log(result);
            });
        });
    },
    getChannelInfo: function () {
        web3.eth.getAccounts().then(function (accounts) {
            var sender_address = EthSigUtil.normalize('0x18c8bA8eA6Ba89AA3e4a329CF752E71cBA061025'),
                receiver_address = EthSigUtil.normalize(accounts[0]),
                open_block_number = 5227362;
            MicroRaiden.channel.methods.getKey(sender_address, receiver_address, open_block_number).call({from: receiver_address}, (error, result) => {
                console.log(error);
            }).then((result) => {
                console.log(result);
            });
        });
    },
    closeChannel: function (privKey, address, account, count, callback) {
        var transfer = this.channel.closeCoperatively(address);
        var encodedABI = transfer.encodeABI();

        const privateKey = Buffer.from(privKey, 'hex');

        const txParams = {
            from: account.toLowerCase(),
            to: config.contract,
            data: encodedABI,
            nonce: web3.utils.toHex(count),
            gas: web3.utils.toHex(config.gas),
            gasPrice: web3.utils.toHex(config.gasPrice),
            gasLimit: web3.utils.toHex(config.gasLimit),
            chainId: config.chainId
        };

        const tx = new EthereumTx(txParams);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const signedTx = '0x' + serializedTx.toString('hex');

        web3.eth.sendSignedTransaction(signedTx, function (err, result) {
            if (err) {
                callback({status: 401, data: err.message});
            } else {
                callback({status: 200, data: result});
            }
        });
    },
};

module.exports = MicroRaiden;

