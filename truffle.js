require('babel-register');
require('babel-polyfill');

var keys = require('./keys');

var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = keys.infura_apikey;
var mnemonic = keys.mnemonic;

var ropstenProvider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey);
var rinkebyProvider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + infura_apikey);
var kovanProvider   = new HDWalletProvider(mnemonic, "https://kovan.infura.io/" + infura_apikey);

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: ropstenProvider,
      network_id: 3,
      from: ropstenProvider.getAddress() 
    },
    rinkeby: { 
      gasPrice: 1000000000, 
      gas: 4700000,
      network_id: 4, 
      provider: rinkebyProvider,
      from: rinkebyProvider.getAddress() 
    },
    kovan: {
      gasPrice: 1000000000, 
      gas: 4700000,
      provider: kovanProvider,
      network_id: 42,
      from: kovanProvider.getAddress() 
    } 
  }
};
