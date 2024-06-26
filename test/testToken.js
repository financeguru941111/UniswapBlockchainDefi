const chai = require('chai');
const {createMockProvider, deployContract, getWallets, solidity} = require('ethereum-waffle');
const BasicTokenMock = require('../build/Token');


chai.use(solidity);
const {expect} = chai;

describe('INTEGRATION: Example', () => {
  let provider = createMockProvider();
  let [wallet, walletTo] = getWallets(provider);
  let token;

  beforeEach(async () => {
    token = await deployContract(wallet, BasicTokenMock, ['HayCoin', 'HAY', 18, 1000]);
  });

  it('Is named HayCoin', async () => {
    expect(await token.name()).to.eq('HayCoin');
  });

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.eq(1000);
  });

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    expect(await token.balanceOf(walletTo.address)).to.eq(7);
  });

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);
  });

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.reverted;
  });

});
