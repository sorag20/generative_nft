async function main() {
  const GenerativeNFT = await hre.ethers.deployContract('GenerativeNFT');
  await GenerativeNFT.waitForDeployment();
  const GenerativeOnchainNFT = await hre.ethers.deployContract(
    'GenerativeOnchainNFT'
  );
  await GenerativeOnchainNFT.waitForDeployment();

  const [owner] = await hre.ethers.getSigners();

  console.log('GenerativeNFT deployed to:', GenerativeNFT.target);
  console.log('GenerativeOnchainNFT deployed to:', GenerativeOnchainNFT.target);

  // makeAnEpicNFT 関数を呼び出す。NFT が Mint される。
  let txn = await GenerativeNFT.mint(owner, 'test');
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait();
  // makeAnEpicNFT 関数をもう一度呼び出す。NFT がまた Mint される。
  txn = await GenerativeNFT.mint(owner, 'test');
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
