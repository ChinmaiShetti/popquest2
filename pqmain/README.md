# AI Agent Wallets

Minimal MVP that gives AI agents simple wallet autonomy: each agent is a contract that can hold ETH, pay for a mock API, and send ETH.

## Features
- Deployable AI Agent contracts via a factory
- Deposit ETH into an agent
- Agent can pay a "service" (mock API) using on-chain transfer
- Frontend (Vite + React) with MetaMask integration to deploy and interact
- Simple AI decision simulator (scripts/aiDecision.js) that can be extended later

## Quick start

Open two terminals.

1) Run a local Hardhat node

```bash
npx hardhat node
```

2) Deploy the factory to the local network (this also writes `frontend/src/deployed.json`)

```bash
npx hardhat run --network localhost scripts/deploy.js
```

3) Start the frontend (from repository root)

```bash
npm run dev
```

4) Open your browser to the Vite dev URL (usually http://localhost:5173). Connect MetaMask to the local Hardhat network (one of the accounts printed by `npx hardhat node`).

## Project structure

```
ai-agent-wallet/
 ├── contracts/
 │   ├── AIAgent.sol
 │   └── AIAgentFactory.sol
 ├── scripts/
 │   ├── deploy.js
 │   └── aiDecision.js
 ├── frontend/
 │   ├── index.html
 │   └── src/
 │       ├── main.jsx
 │       ├── App.jsx
 │       ├── deployed.json   # written by deploy script
 │       └── components/
 │           └── WalletUI.jsx
 ├── hardhat.config.js
 ├── package.json
 └── README.md
```

## Notes & usage

- The deploy script writes the factory address to `frontend/src/deployed.json` so the frontend can import it directly.
- Frontend actions:
  - Connect MetaMask
  - Deploy AI Agent via Factory
  - Deposit ETH to the agent (sends 0.05 ETH)
  - Pay for API (agent calls `payForAPI` and sends 0.01 ETH to your address as a mock service)
  - Send ETH from agent to a recipient (0.005 ETH in demo)
  - Run AI — random decision triggers a pay for API or nothing

## Development tips

- If you change contracts, re-run `npx hardhat compile` and re-deploy the factory to update the address used by the frontend.
- To change the amounts used by the frontend, edit `frontend/src/components/WalletUI.jsx`.

## License

MIT
