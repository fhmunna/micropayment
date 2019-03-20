const Web3 = require('web3');
const EthSigUtil = require('eth-sig-util');
const EthereumTx = require('ethereumjs-tx');
const fs = require('fs-extra');

const web3 = new Web3("http://52.8.233.242:8545");

var MicroRaiden = {
    web3: web3,
    ethUtil: EthSigUtil,
    contract: null,
    getAccounts: function () {
        fs.readFile(__dirname + '/../contracts/build/Journal.abi', function (err, file_data) {
            if (err) {
                console.log(err);
                return;
            }
            jContract = new web3.eth.Contract(JSON.parse(file_data.toString()), config.contract);
        });
    },
    onInstall: function (address, account, count, callback) {
        var transfer = MicroRaiden.methods.onInstall(address);
        var encodedABI = transfer.encodeABI();

        const privateKey = Buffer.from(config.privKey, 'hex');

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
            }
            else {
                callback({status: 200, data: result});
            }
        });
    },
};

module.exports = MicroRaiden;

