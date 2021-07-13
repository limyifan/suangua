// eslint-disable-next-line no-undef
const Contract = artifacts.require('CBC')
const web3 = require("web3");
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const {expectRevert} = require('@openzeppelin/test-helpers');

// eslint-disable-next-line no-undef
contract('SimpleContract', ([deployer, user, strangeAccount]) => {
    let myContract
    const amount = web3.utils.toWei("10", "ether")
    const amountToTransfer = web3.utils.toWei("4", "ether")
    const hugeAmountToTransfer = web3.utils.toWei("100000", "ether")
    beforeEach(async () => {
        myContract = await Contract.new()
    })

    describe('testing token details...', () => {
        it('checking correct token name', async () => {
            expect(await myContract.name()).to.be.eq("Charles Bank Currency")
        })
        it('checking correct token symbol', async () => {
            expect(await myContract.symbol()).to.be.eq("CBC")
        })
        it('checking correct minter role', async () => {
            expect(await myContract.minter()).to.be.eq(deployer)
        })
    })

    describe('testing mint function...', () => {
        beforeEach(async () => {
            await myContract.mint(amount, {from: deployer})
        })
        it('minter balance should increase', async () => {
            expect(Number(await myContract.balanceOf(deployer))).to.be.eq(Number(amount))
        })
        it('tokens minting should be rejected', async () => {
            await expectRevert(myContract.mint(amount, {from: strangeAccount}), EVM_REVERT);
        })
        it('passing minter role should be rejected', async () => {
            await expectRevert(myContract.passMinterRole(strangeAccount, {from: strangeAccount}), EVM_REVERT);
        })
    })

    describe('testing transfer function...', () => {
        beforeEach(async () => {
            await myContract.mint(amount, {from: deployer})
            await myContract.transfer(user, amountToTransfer, {from: deployer}) //0.01 ETH
        })
        it('transaction should fail with not enough user balance', async () => {
            await expectRevert(myContract.transfer(user, hugeAmountToTransfer, {from: deployer}), EVM_REVERT);
        })
        it('user balance should increase', async () => {
            expect(Number(await myContract.balanceOf(user))).to.be.eq(Number(amountToTransfer))
        })
        it('deployer balance should decrease', async () => {
            expect(Number(await myContract.balanceOf(deployer))).to.be.eq(Number(amount) - Number(amountToTransfer))
        })
    })
});

