import { useState } from "react";

export default function Verify() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState("");

  const verify = async () => {
    const res = await fetch("https://skill-trust-api.onrender.com/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash })
    });

    const data = await res.json();
    setResult(data.valid ? "✅ Credential is VALID" : "❌ Credential is INVALID");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Public Credential Verifier</h1>

      <input
        placeholder="Credential Hash (0x...)"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={verify}>Verify Credential</button>

      <h2>{result}</h2>
    </div>
  );
}