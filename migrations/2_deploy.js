// eslint-disable-next-line no-undef
const CBC = artifacts.require("CBC");

module.exports = async function(deployer) {
    //assign dBank contract into variable to get it's address
    deployer.deploy(CBC);

};