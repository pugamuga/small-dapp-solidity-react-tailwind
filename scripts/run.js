const main = async () => {

  const hookahContractFactory = await hre.ethers.getContractFactory(
    "HookahPortalContract"
  );

  const hookahContract = await hookahContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"), // format of eth
  });

  console.log("Hookah Contract deployed to:", hookahContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(hookahContract.address)

  console.log("Contract balance is", hre.ethers.utils.formatEther(contractBalance) )

  const HookahTxt = await hookahContract.buyHookah(
    "This is hookah #1",
    "Pugamuga",
    ethers.utils.parseEther("0.001")
  )

  await HookahTxt.wait()

  contractBalance = await hre.ethers.provider.getBalance(hookahContract.address)
};



const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
};

runMain();
