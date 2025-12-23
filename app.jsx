import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createBurnInstruction,
  getMint,
  getAccount
} from "@solana/spl-token";
import { useState } from "react";

const FEE_WALLET = new PublicKey("CBtJSnNcxvxvMF6MPwHyvPRbjKKiz1QwCsVNFJRhFyuv");
const FEE_SOL = 0.001;

export default function App() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const [mint, setMint] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const burn = async () => {
    try {
      if (!publicKey) throw "Connect Phantom first";

      const mintPk = new PublicKey(mint);
      const mintInfo = await getMint(connection, mintPk);

      const ata = await getAssociatedTokenAddress(mintPk, publicKey);
      const acc = await getAccount(connection, ata);

      const rawAmount = BigInt(
        Math.floor(Number(amount) * Math.pow(10, mintInfo.decimals))
      );

      if (rawAmount <= 0n) Throw "Invalid Amount";

If (rawAmount > acc.amount) throw "Insufficient balance";

Const burnIx = createBurnInstruction(

Ata,
        mintPk,
        publicKey,
        rawAmount
      );

      const feeIx = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: FEE_WALLET,
        lamports: FEE_SOL * LAMPORTS_PER_SOL
      });

      const tx = new Transaction().add(burnIx, feeIx);
      tx.feePayer = publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      setStatus(`🔥 Burned successfully
https://solscan.io/tx/${sig}`);
    } catch (e) {
      setStatus("❌ Error: " + e);
    }
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: "40px auto",
      color: "white",
      fontFamily: "Arial"
    }}>
      <h2>🔥 Burn Kem 🔥</h2>

      <WalletMultiButton />

      <input
        placeholder="Mint del token"
        onChange={e => setMint(e.target.value)}
        style={{ width: "100%", marginTop: 10, padding: 10 }}

/>

<input

placeholder="Amount to burn"

onChange={e => setAmount(e.target.value)}

Style={{ width: "100%", marginTop: 10, padding: 10 }}

/>

<button

onClick={burn}

Style={{

Width: "100%",

marginTop: 10,

Padded: 12,

fontWeight: "bold"

}}

>

🔥 It burns tokens

</button>

<pre style={{ whiteSpace: "pre-wrap", marginTop: 15 }}>

{State}

</pre>

</div>

);

}