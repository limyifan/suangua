// eslint-disable-next-line no-undef
const Gua = artifacts.require('Gua')
const CBC = artifacts.require('CBC')
const web3 = require("web3");
const imgUrl="https://firebasestorage.googleapis.com/v0/b/suangua-47a55.appspot.com/o/卦象%2F乾卦一爻.jpeg?alt=media&token=615c9f96-2d94-48bb-9a9f-44eaec356746";
const EVM_REVERT = 'VM Exception while processing transaction: revert'

require('chai')
    .use(require('chai-as-promised'))
    .should()

const amount = web3.utils.toWei("10", "ether")
const amountPerNFT = web3.utils.toWei("0.1", "ether")

// eslint-disable-next-line no-undef
contract('GUA Contract', ([deployer, user]) => {
    let gua,cbc
    beforeEach(async () => {
        cbc = await CBC.new()
        gua = await Gua.new(cbc.address)
        await cbc.passMinterRole(deployer, {from: deployer})
        await cbc.mint(amount, {from: deployer})
    })

    describe('testing token details...', () => {
        it('deploys successfully', async () => {
            const address = gua.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('checking correct token name', async () => {
            expect(await gua.name()).to.be.eq("Gua NFT")
        })
        it('checking correct token symbol', async () => {
            expect(await gua.symbol()).to.be.eq("GUA")
        })
        it('checking correct token initial id', async () => {
            expect(Number(await gua.tokenId())).to.be.eq(0)
        })
    })

    describe('checking deployer and user details...', () => {
        it('deployer balance should increase', async () => {
            expect(Number(await cbc.balanceOf(deployer))).to.be.eq(Number(amount))
        })
    })

    describe('testing mint token...', () => {
        beforeEach(async () => {
            const address=await gua.receiverAddress()
            await cbc.approve(address,amount, {from: deployer})
            await gua.changeReceiverAddress(user, {from: deployer})
            await gua.mint(imgUrl,amountPerNFT, {from: deployer})
        })

        it('checking correct token owner', async () => {
            expect(await gua.ownerOf(0)).to.be.eq(deployer)
        })
        it('checking correct token url', async () => {
            expect(await gua.tokenURI(0)).to.be.eq(imgUrl)
        })
        it('checking token id increased', async () => {
            expect(Number(await gua.tokenId())).to.be.eq(1)
        })
        it('checking correct receiver address', async () => {
            expect(await gua.receiverAddress()).to.be.eq(user)
        })
        it('checking correct balance of receiver', async () => {
            expect(Number(await cbc.balanceOf(user))).to.be.eq(Number(amountPerNFT))
        })
        it('testing owner transfer', async () => {
            await gua.transferFrom(deployer,user,0)
            expect(await gua.ownerOf(0)).to.be.eq(user)
        })
    })

    describe('testing failed mint token...', () => {
        it('mint token should fail with not enough allowance', async () => {
            await gua.mint(imgUrl,amountPerNFT).should.be.rejectedWith(EVM_REVERT)
        })
    })
});
