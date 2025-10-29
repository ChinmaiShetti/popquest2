// frontend/src/components/WalletUI.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import deployed from "../deployed.json";
// import "./app.css"; // new stylesheet

const FACTORY_ABI = [
  "function deployAgent(string name) external returns (address)",
  "function getDeployedAgents() external view returns (address[])",
  "event AgentDeployed(address indexed agentAddress, address indexed owner, string name)"
];
const AGENT_ABI = [
  "function deposit() external payable",
  "function getBalance() external view returns (uint256)",
  "function payForAPI(address payable service) external payable",
  "function sendTo(address payable to, uint256 amount) external",
  "function owner() view returns (address)",
  "event API_Paid(address indexed agent, address indexed service, uint256 amount)",
  "event Transfer_Made(address indexed from, address indexed to, uint256 amount)",
  "event Deposited(address indexed by, uint256 amount)"
];

export default function WalletUI() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [factory, setFactory] = useState(null);
  const [agentAddress, setAgentAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // MetaMask detection & eager connect if already authorized
  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      p.listAccounts().then((accs) => {
        if (accs && accs.length > 0) {
          const s = p.getSigner();
          setSigner(s);
          setAccount(accs[0]);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!provider) return;
    try {
      const f = new ethers.Contract(deployed.factory, FACTORY_ABI, provider);
      setFactory(f);
    } catch (e) {
      // ignore
    }
  }, [provider]);

  async function connect() {
    clearMessages();
    if (!window.ethereum) {
      return setError("MetaMask not detected. Install MetaMask and refresh.");
    }
    try {
      setLoading(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const p = new ethers.providers.Web3Provider(window.ethereum);
      const s = p.getSigner();
      const a = await s.getAddress();
      setProvider(p);
      setSigner(s);
      setAccount(a);
      setStatus("Connected: " + shorten(a));
    } catch (e) {
      setError("Failed to connect MetaMask: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function deployAgent() {
    clearMessages();
    if (!signer) return setError("Connect MetaMask first.");
    try {
      setLoading(true);
      setStatus("Deploying agent...");
      const factoryWithSigner = new ethers.Contract(deployed.factory, FACTORY_ABI, signer);
      const tx = await factoryWithSigner.deployAgent("My AI Agent");
      setStatus("Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      const ev = receipt.events?.find((e) => e.event === "AgentDeployed");
      const addr = ev?.args?.agentAddress?.toString() || receipt.contractAddress?.toString() || "";
      setAgentAddress(addr);
      setStatus("Agent deployed: " + shorten(addr));
      await refreshBalance(addr);
    } catch (e) {
      setError("Failed to deploy agent: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function isValidAddress(addr) {
    return typeof addr === "string" && addr.length === 42 && addr.startsWith("0x");
  }

  async function refreshBalance(addr = agentAddress) {
    clearMessages(false);
    if (!isValidAddress(addr)) {
      console.error("refreshBalance: invalid address", addr);
      return setError("No agent deployed or invalid address");
    }
    try {
      setLoading(true);
      const agent = new ethers.Contract(addr, AGENT_ABI, provider);
      const b = await agent.getBalance();
      setBalance(ethers.utils.formatEther(b));
      setStatus("Balance: " + formatEtherFriendly(b));
    } catch (e) {
      setError("Failed to fetch balance: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function depositEther() {
    clearMessages();
    if (!signer || !agentAddress) return setError("Connect and deploy agent first");
    try {
      setLoading(true);
      setStatus("Sending 0.05 ETH to agent...");
      const tx = await signer.sendTransaction({ to: agentAddress, value: ethers.utils.parseEther("0.05") });
      await tx.wait();
      setStatus("Deposit complete");
      await refreshBalance();
    } catch (e) {
      setError("Deposit failed: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function payForAPI() {
    clearMessages();
    if (!signer || !agentAddress) return setError("Connect and deploy agent first");
    try {
      setLoading(true);
      setStatus("Paying for mock API (0.01 ETH)...");
      const agentWithSigner = new ethers.Contract(agentAddress, AGENT_ABI, signer);
      const tx = await agentWithSigner.payForAPI(account, { value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      setStatus("API paid");
      await refreshBalance();
    } catch (e) {
      setError("API payment failed: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function sendTo() {
    clearMessages();
    if (!signer || !agentAddress) return setError("Connect and deploy agent first");
    try {
      setLoading(true);
      setStatus("Sending 0.005 ETH from agent to you...");
      const recipient = account;
      const agentWithSigner = new ethers.Contract(agentAddress, AGENT_ABI, signer);
      const tx = await agentWithSigner.sendTo(recipient, ethers.utils.parseEther("0.005"));
      await tx.wait();
      setStatus("Transfer complete");
      await refreshBalance();
    } catch (e) {
      setError("Send failed: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function runAI() {
    clearMessages();
    setLoading(true);
    try {
      const r = Math.random();
      if (r < 0.5) {
        setStatus("🤖 AI decided to do nothing");
      } else {
        setStatus("🤖 AI decided to pay for an API");
        await payForAPI();
      }
    } catch (e) {
      setError("AI action failed: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function clearMessages(clearStatus = true) {
    setError("");
    if (clearStatus) setStatus("");
  }

  // small helpers
  const shorten = (addr = "") =>
    addr && addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-6)}` : addr;
  const formatEtherFriendly = (big) => {
    try {
      const str = ethers.utils.formatEther(big);
      return Number(str) < 0.0001 ? "<0.0001" : Number(str).toFixed(4) + " ETH";
    } catch {
      return "0 ETH";
    }
  };

  // UI
  return (
    <div className="ui-root">
      <div className="ui-shell">
        <header className="ui-topbar">
          <div className="brand">
            <div className="brand-mark" aria-hidden>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#6EE7B7" />
                    <stop offset="1" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
                <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#g1)" />
                <path d="M7 15c1.5-3 5-3 6.5 0" stroke="#071033" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="title">AI Agent Wallets</div>
              <div className="subtitle">Autonomous agents that can hold & spend crypto</div>
            </div>
          </div>

          <div className="account-block">
            <div className={`chip ${account ? "chip-connected" : ""}`}>
              <span className="chip-dot" />
              {account ? shorten(account) : "Not connected"}
            </div>
            <button
              className="btn btn-ghost"
              onClick={connect}
              disabled={loading || !!account}
              aria-label="Connect MetaMask"
            >
              {account ? "Connected" : "Connect"}
            </button>
          </div>
        </header>

        <main className="ui-grid">
          <section className="card card-left">
            <div className="card-header">
              <h3>Agent Controls</h3>
              <p className="muted">Deploy, fund and control your AI agent.</p>
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={deployAgent} disabled={loading || !account || isValidAddress(agentAddress)} title="Deploy a new AI Agent contract">
                Deploy AI Agent
              </button>

              <div className="split-row">
                <button className="btn" onClick={depositEther} disabled={loading || !isValidAddress(agentAddress)} title="Deposit 0.05 ETH to your agent">
                  Deposit 0.05 ETH
                </button>
                <button className="btn" onClick={payForAPI} disabled={loading || !isValidAddress(agentAddress)} title="Pay 0.01 ETH for a mock API call">
                  Pay API (0.01 ETH)
                </button>
              </div>

              <div className="split-row">
                <button className="btn" onClick={sendTo} disabled={loading || !isValidAddress(agentAddress)} title="Send 0.005 ETH from agent to your account">
                  Send to Me (0.005 ETH)
                </button>
                <button className="btn" onClick={refreshBalance} disabled={loading || !isValidAddress(agentAddress)} title="Refresh agent's ETH balance">
                  Refresh Balance
                </button>
              </div>

              <button className="btn btn-accent" onClick={runAI} disabled={loading || !isValidAddress(agentAddress)} title="Let the AI make a random decision">
                Run AI Decision
              </button>
            </div>

            <div className="card-footer small">
              <div><strong>Factory</strong> <span className="mono">{deployed.factory}</span></div>
              <div><strong>Agent</strong> <span className="mono">{agentAddress || "(not deployed)"}</span></div>
            </div>
          </section>

          <aside className="card card-right">
            <div className="balance-block">
              <div className="balance-header">
                <div>
                  <div className="h2">{balance} <span className="small-muted">ETH</span></div>
                  <div className="muted small">Agent balance</div>
                </div>
                <div className="balance-actions">
                  <button className="icon-btn" onClick={refreshBalance} disabled={loading || !agentAddress} title="Refresh">
                    ⟳
                  </button>
                </div>
              </div>
              <div className="account-info">
                <div><span className="muted">Connected account</span><div className="mono">{account || "(not connected)"}</div></div>
                <div><span className="muted">Last status</span><div className="mono">{status || "-"}</div></div>
              </div>
            </div>

            <div className="notifications">
              {loading && (
                <div className="notice notice-info">
                  <div className="spinner" aria-hidden />
                  <div>Working — {status || "processing..."}</div>
                </div>
              )}

              {error && (
                <div className="notice notice-error">
                  <strong>Error</strong>
                  <div className="mono">{error}</div>
                </div>
              )}

              {!loading && !error && status && (
                <div className="notice notice-success">
                  <strong>Success</strong>
                  <div>{status}</div>
                </div>
              )}
            </div>

            <div className="howto">
              <strong>Quick tips</strong>
              <ol>
                <li>Connect MetaMask (use Hardhat / localhost account)</li>
                <li>Deploy an AI Agent</li>
                <li>Deposit ETH and try API payments</li>
                <li>Use "Run AI" to simulate agent behavior</li>
              </ol>
            </div>
          </aside>
        </main>

        <footer className="ui-footer">
          <div className="foot-right">Local network: <span className="mono">localhost:8545</span></div>
        </footer>
      </div>
    </div>
  );
}
