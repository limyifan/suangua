// eslint-disable-next-line no-undef
const CBC = artifacts.require("CBC");
const Gua = artifacts.require("Gua");

module.exports = async function(deployer) {
    await deployer.deploy(CBC);
    //assign token into variable to get it's address
    const token = await CBC.deployed()
   await deployer.deploy(Gua,token.address);
};