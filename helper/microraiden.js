var Web3 = require('web3');

const web3 = new Web3("http://52.8.233.242:8545");

var MicroRaiden = {
    web3: web3,
    accounts: function(){
        return web3.eth.getAccounts().then(console.log);
    }
}

module.exports = MicroRaiden

