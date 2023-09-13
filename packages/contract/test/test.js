const { expect } = require('chai');

describe('Generative NFT', function () {
  it('NFT basic test', async function () {
    const [signer, badSigner] = await ethers.getSigners();
    const GenerativeNFTContract = await ethers.deployContract('GenerativeNFT');
    const GenerativeNFT = await GenerativeNFTContract.waitForDeployment();

    expect(await GenerativeNFT.name()).to.equal('Generative NFT');
    await GenerativeNFT.mint(signer.address, 'test');
    expect(await GenerativeNFT.balanceOf(signer.address)).to.equal(1);
    expect(await GenerativeNFT.tokenURI(0)).to.equal('test');
  });
});
