var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var APT = artifacts.require("APT");
var PlaceHolder = artifacts.require("PlaceHolder");
var SafeMath = artifacts.require("SafeMath");
var PreSale = artifacts.require("PreSale");

function latestBlockNumber() {
  return web3.eth.getBlock('latest').number;
}

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
    const timeFromStart = duration.hours(5);                   // seconds
    const presaleDuration = duration.seconds(60);              // seconds
    const walletAddress = '0x7a4baa345548aa30f11ffa61d2a7a685ea4537a9';
    const presaleSupplyCap = 100;                              // tokens
    const minimumInvestment = 0.1;                             // ether
    const blockDuration = 14;                                  // seconds
    
    // Deployment
    const lastBlock = await latestBlockNumber();
    const startBlock = lastBlock + blockDuration * timeFromStart;
    const endBlock = startBlock + blockDuration * presaleDuration;
    const weiMinimumInvestment = new BigNumber(10**18) * new BigNumber(minimumInvestment);  // wei
    console.log('Start block -' + startBlock);
    console.log('End block -'   + endBlock);
    
    await deployer.deploy(MiniMeTokenFactory);
    await deployer.deploy(APT, MiniMeTokenFactory.address);
    await deployer.deploy(PlaceHolder, APT.address);
    deployer.link(SafeMath, PreSale);
    await deployer.deploy(PreSale, APT.address, PlaceHolder.address);
    
    const apt = await APT.deployed();
    const ps = await PreSale.deployed();
    
    await apt.changeController(PreSale.address)
    await ps.initialize(
      walletAddress,
      presaleSupplyCap,
      weiMinimumInvestment,
      startBlock,
      endBlock
    ); 
  }
)};

