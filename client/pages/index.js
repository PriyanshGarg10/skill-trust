import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [skill, setSkill] = useState("");
  const [output, setOutput] = useState("");

  const issue = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const credential = {
      holder: address,
      skill,
      issuedAt: Date.now()
    };

    const signature = await signer.signMessage(
      JSON.stringify(credential)
    );

    const res = await fetch("https://skill-trust-api.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credential,
        signature,
        signer: address
      })
    });

    const data = await res.json();
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Skill Credential Issuer</h1>

      <input
        placeholder="Skill name"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
      />

      <br /><br />

      <button onClick={issue}>Sign & Issue Credential</button>

      <pre>{output}</pre>
    </div>
  );
}