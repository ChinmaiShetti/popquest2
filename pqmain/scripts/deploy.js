const hre = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Compiling...");
  await hre.run("compile");

  const Factory = await hre.ethers.getContractFactory("AIAgentFactory");
  console.log("Deploying AIAgentFactory...");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("AIAgentFactory deployed to:", factory.address);

  // Save address for frontend convenience (frontend/src/deployed.json)
  const outPath = path.join(__dirname, "..", "frontend", "src", "deployed.json");
  const data = { factory: factory.address };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log("Wrote", outPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});