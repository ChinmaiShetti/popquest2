// Simple AI decision simulator (can be extended to run periodically or as a service)
// This script demonstrates a random decision: whether the AI will request to pay for an API.
// It does not perform on-chain calls by default — it's a local simulator for development.

function aiDecide() {
  const r = Math.random();
  if (r < 0.5) return { action: "noop", reason: "Idle" };
  return { action: "pay_api", amountWei: "10000000000000000", reason: "Call API" }; // 0.01 ETH
}

if (require.main === module) {
  console.log("AI Decision Simulator Running (single-shot)");
  const decision = aiDecide();
  console.log("Decision:", decision);
}

module.exports = { aiDecide };
