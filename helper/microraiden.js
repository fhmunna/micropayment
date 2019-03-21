const Web3 = require('web3');
const EthSigUtil = require('eth-sig-util');
const EthereumTx = require('ethereumjs-tx');
const fs = require('fs-extra');

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/e34106c3ca954f9dbacb790b39474dda"));
// const web3 = new Web3("https://ropsten.infura.io/e34106c3ca954f9dbacb790b39474dda");
const contractABI = JSON.parse(fs.readFileSync(__dirname + '/../contracts/contracts.json').toString());

const TOKEN = 'CustomToken';
const CHANNEL_MANAGER = 'RaidenMicroTransferChannels';
const TOKEN_SUPLY = 1e25;
const DECIMALS = 18;
const CHALLENGE_PERIOD = 500;
const tokenAddr = EthSigUtil.normalize("0x74434527b8e6c8296506d61d0faf3d18c9e4649a");
const channelAddr = EthSigUtil.normalize("0xff24d15afb9eb080c089053be99881dd18aa1090");

var config = {
    gas: null,
    gasPrice: null,
    gasLimit: null,
    chainId: null,
}

var MicroRaiden = {
    web3: web3,
    ethUtil: EthSigUtil,
    token: null,
    contract: null,
    getContracts: function () {
        this.token = web3.eth.contract(contractABI[TOKEN].abi).at(channelAddr);
        this.contract = web3.eth.contract(contractABI[CHANNEL_MANAGER].abi).at(channelAddr);
    },
    getBalance: function () {
        var sender = EthSigUtil.normalize('0x18c8bA8eA6Ba89AA3e4a329CF752E71cBA061025'),
            receiver = EthSigUtil.normalize('0xB9EB427911BAb56E8B7683cC3d82821B44d2c7cc');

        MicroRaiden.token.balanceOf(sender, {from: receiver}, (error, result) => {
            console.log(result.toNumber());
        });
    },
    getChannelInfo: function () {
        var sender = '0x18c8bA8eA6Ba89AA3e4a329CF752E71cBA061025',
            receiver = '0xB9EB427911BAb56E8B7683cC3d82821B44d2c7cc',
            open_block_number = 5227540;
        MicroRaiden.contract.getChannelInfo(sender, receiver, open_block_number, {from: receiver}, (error, result) => {
            console.log(result);
            // console.log(web3.fromWei(result[1].toNumber(), "ether" ) );
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

