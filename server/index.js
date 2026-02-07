const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const issued = [];

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/issue", (req, res) => {
  const { credential, signature, signer } = req.body;

  const hash =
    "0x" +
    crypto
      .createHash("sha256")
      .update(JSON.stringify(credential))
      .digest("hex");

  const record = {
    holder: credential.holder,
    skill: credential.skill,
    issuedAt: credential.issuedAt,
    credentialHash: hash,
    ipfsHash: "QmDummyHash"
  };

  issued.push(record);

  res.json(record);
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