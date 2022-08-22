const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contract with account", deployer.address);
  console.log("Account balance", accountBalance.toString());

  const hookahContractFactory = await hre.ethers.getContractFactory(
    "HookahPortalContract"
  );
  const hookahContract = await hookahContractFactory.deploy();

  console.log("HookahContract address", hookahContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
