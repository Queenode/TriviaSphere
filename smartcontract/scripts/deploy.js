import hre from "hardhat";

async function main() {
  console.log("Deploying TriviaSphereBadge...");
  
  const TriviaSphereBadge = await hre.ethers.getContractFactory("TriviaSphereBadge");
  const badge = await TriviaSphereBadge.deploy();
  await badge.waitForDeployment();

  const address = await badge.getAddress();
  console.log(`✅ TriviaSphereBadge deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
