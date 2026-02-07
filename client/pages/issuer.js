import { useEffect, useState } from "react";

export default function IssuerDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://skill-trust-api.onrender.com/issued")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Issuer Dashboard</h1>

      {data.length === 0 && <p>No credentials issued yet.</p>}

      {data.map((c, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 12
          }}
        >
          <p><b>Holder:</b> {c.holder}</p>
          <p><b>Skill:</b> {c.skill}</p>
          <p><b>Credential Hash:</b> {c.credentialHash}</p>
          <p><b>IPFS Hash:</b> {c.ipfsHash}</p>
        </div>
      ))}
    </div>
  );
}