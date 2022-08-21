const main = async () => {
  // Это фактически скомпилирует наш контракт и
  // создаст необходимые файлы для работы с
  //  нашим контрактом в каталоге артефактов
  const hookahContractFactory = await hre.ethers.getContractFactory(
    "HookahPortal"
  );

  const hookahContract = await hookahContractFactory.deploy();

  console.log("Hookah Contract deployed to:", hookahContract.address);
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
