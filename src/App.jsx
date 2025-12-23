import { useEffect, useState } from "react";

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("Detectando Phantom...");

  useEffect(() => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        setStatus("Phantom detectado");
      }
    } else {
      setStatus("Phantom no encontrado");
    }
  }, []);

  const connectWallet = async () => {
    try {
      const resp = await window.solana.connect();
      setWallet(resp.publicKey.toString());
      setStatus("Wallet conectada");
    } catch (err) {
      console.error(err);
      setStatus("Error al conectar");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", textAlign: "center" }}>
      <h1>🔥 Burnkem</h1>
      <p>{status}</p>

      {!wallet ? (
        <button onClick={connectWallet}>
          Conectar Phantom
        </button>
      ) : (
        <p>
          Wallet: <br />
          <strong>{wallet}</strong>
        </p>
      )}
    </div>
  );
}

export default App;