async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Insignia = await ethers.getContractFactory("Insignia");
  const insignia = await Insignia.deploy();

  console.log("Insignia address:", insignia.address);

  //  To save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(insignia);
}

function saveFrontendFiles(insignia) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Insignia: insignia.address }, undefined, 2)
  );

  const InsigniaArtifact = artifacts.readArtifactSync("Insignia");

  fs.writeFileSync(
    contractsDir + "/Insignia.json",
    JSON.stringify(InsigniaArtifact, null, 2)
  );
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
