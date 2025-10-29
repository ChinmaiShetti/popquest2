import React from "react";
import WalletUI from "./components/WalletUI";
import "./app.css";

export default function App() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          letterSpacing: '-2px',
          background: 'linear-gradient(135deg, #00d9ff 0%, #a78bfa 50%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          AI Agent Wallets
        </h1>
        <p style={{ color: '#a8adc7', marginTop: '12px' }}>MVP Edition • Web3 Autonomy</p>
      </div>
      <WalletUI />
    </div>
  );
}