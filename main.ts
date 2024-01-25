import { ethers } from "ethers";
import { Server } from "./app/server/server";
import { TxSrv } from "./app/api/service/tx.srv";
import { WalletSrv } from "./app/api/service/wallet.srv";

const PORT = 9898;
// const WALLET_BASE_URL = "http://127.0.0.1:7777";
const WALLET_BASE_URL = "http://172.31.98.160:4000";

function main() {
  const server = new Server();

  const provider = new ethers.providers.JsonRpcProvider("https://pri-bcnode.dev.kstadium.io");
  const sopAddr = "0x7dcB32FFFFe697133f12b4F38e6c3B642fdD0148";
  const inKstaAddr = "0x3Ba68e376f4d86753FEe2f6677fbf84C2E0A23fd";
  const fluxAddr = "0xEe1689E05A762B343Df6bD8ADbe9bBADD8C901D4";

  const apiGroupRouter = server.groupRoute("/api");

  const walletSrv = new WalletSrv(WALLET_BASE_URL);
  new TxSrv(provider, walletSrv, sopAddr, inKstaAddr, fluxAddr).route(apiGroupRouter);

  server.start(PORT);
}

main();
