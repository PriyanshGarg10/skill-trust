const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const PinataSDK = require("@pinata/sdk");
require("dotenv").config();

const pinata = new PinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

function getIssuerWallet() {
  if (!process.env.ISSUER_PRIVATE_KEY) {
    throw new Error("ISSUER_PRIVATE_KEY missing");
  }
  if (!process.env.SEPOLIA_RPC_URL) {
    throw new Error("SEPOLIA_RPC_URL missing");
  }

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL
  );

  return new ethers.Wallet(
    process.env.ISSUER_PRIVATE_KEY,
    provider
  );
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());

const issued = [];

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/issue", async (req, res) => {
  try {
    const issuerWallet = getIssuerWallet();
    const { holder, skill, signature } = req.body;

    if (!holder || !skill || !signature) {
      return res.status(400).json({ error: "Missing input" });
    }

    const credential = {
      holder,
      skill,
      issuer: issuerWallet.address,
      issuedAt: new Date().toISOString()
    };

    const credentialString = JSON.stringify(credential);

    const credentialHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(credentialString)
    );

    const ipfsRes = await pinata.pinJSONToIPFS(credential);
    const ipfsHash = ipfsRes.IpfsHash;

    const tx = await contract.storeCredential(credentialHash);
    await tx.wait(1);

    return res.json({
      credentialHash,
      ipfsHash
    });
  } catch (err) {
    console.error("ISSUE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});


app.post("/verify", (req, res) => {
  const { hash } = req.body;
  const valid = issued.some((c) => c.credentialHash === hash);
  res.json({ valid });
});

app.get("/issued", (req, res) => {
  res.json(issued);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});