README.md

# 🤖 AI Agent Wallets
## (The main content is there in pqmain and in frontend)
A full-stack blockchain MVP that gives AI agents real financial autonomy. Each agent is a smart contract wallet that can hold ETH, make payments, and interact with other agents or services—all on-chain.

## 🚀 Features

- **Smart contract agent wallets**: Each agent is a contract that can hold and send ETH.
- **Factory contract**: Deploys new agents for users.
- **Deposit, pay, and send**: Fund your agent, pay for a (mock) API, or send ETH to any address.
- **MetaMask integration**: All actions are signed and sent via MetaMask.
- **Modern React frontend**: Beautiful, responsive UI with clear status and error feedback.
- **Simulated AI logic**: “Run AI” triggers a random on-chain action.

## 🧩 Architecture

- **Solidity contracts**: `AIAgent.sol`, `AIAgentFactory.sol`
- **Frontend**: Vite + React + ethers.js
- **Scripts**: Hardhat deploy, simple AI simulation

## 🗂️ Project Structure

contracts/
AIAgent.sol
AIAgentFactory.sol
scripts/
deploy.js
aiDecision.js
frontend/
index.html
package.json
src/
app.css
App.jsx
main.jsx
components/
WalletUI.jsx
deployed.json

```
App.jsx

components/
  
deployed.json
```
Deploy contracts:
```
cd path/to/pqmain
npx hardhat node
```
Open another bash
```
cd path/to/pqmain
npx hardhat run --network localhost scripts/deploy.js
```

Install frontend dependencies (first time only)
Directory: frontend folder
```
cd path/to/pqmain/frontend
npm install
```
Start the frontend
Directory: frontend folder

```
cd path/to/pqmain/frontend
npm run dev
```




Connect MetaMask:

Add the local Hardhat network (http://127.0.0.1:8545).
Import a private key from the Hardhat node output.
Use the app:

Deploy an agent, deposit ETH, pay for API, send ETH, and run AI actions—all on-chain!
💡 Notes
**“Pay API” is a mock action: it just sends ETH to a service address (your own account by default).
“Run AI” is a random decision, simulating agent autonomy.**
All contract actions are real and require MetaMask confirmation.
