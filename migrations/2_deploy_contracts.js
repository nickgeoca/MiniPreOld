var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var MainToken = artifacts.require("MainToken");
var PlaceHolder = artifacts.require("PlaceHolder");
var SafeMath = artifacts.require("SafeMath");
var PreSale = artifacts.require("PreSale");

// function latestBlockNumber () { return web3.eth.getBlock('latest').number; }

const BigNumber = web3.BigNumber;

const duration = {
  seconds: function(val) { return val },
  minutes: function(val) { return val * this.seconds(60) },
  hours:   function(val) { return val * this.minutes(60) },
  days:    function(val) { return val * this.hours(24) },
  weeks:   function(val) { return val * this.days(7) },
  years:   function(val) { return val * this.days(365) }
};

module.exports = function (deployer, chain, accounts) {
  return deployer.deploy(SafeMath).then(async () => {

    // Parameters
    const timeFromStart = duration.minutes(8);                // seconds
    const presaleDuration = duration.minutes(30);              // seconds
    const walletAddress = '0xF1F69b62Ba6721bcdc2E6A29DA87991C185a4e9a';
    const presaleSupplyCap = 100;                              // token major unit (like ether)
    const minimumInvestment = 0.1;                             // ether

    const blockDuration = 14;                                  // seconds
    const latestBlock = 1254259;                               // latest block number on respective network

    // Deployment
    const startBlock = latestBlock + Math.floor(timeFromStart / blockDuration);
    const endBlock = startBlock + Math.floor(presaleDuration / blockDuration);
    const presaleSupplyCapQuanta = new BigNumber(10**18)       // token quantum unit (like wei)
          * new BigNumber(presaleSupplyCap);
    const weiMinimumInvestment = new BigNumber(10**18)         // wei
          * new BigNumber(minimumInvestment);
    console.log('Start block- ' + startBlock);
    console.log('End block- '   + endBlock);

    await deployer.deploy(MiniMeTokenFactory);
    await deployer.deploy(MainToken, MiniMeTokenFactory.address);
    await deployer.deploy(PlaceHolder, MainToken.address);
    deployer.link(SafeMath, PreSale);
    await deployer.deploy(PreSale, MainToken.address, PlaceHolder.address);

    const apt = await MainToken.deployed();
    const ps = await PreSale.deployed();

    await apt.changeController(PreSale.address)
    await ps.initialize(
      walletAddress,
      presaleSupplyCapQuanta,
      weiMinimumInvestment,
      startBlock,
      endBlock
    ); 
  })
};


