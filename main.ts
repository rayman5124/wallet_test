import { ethers } from "ethers";
import { Server } from "./app/server/server";
import { TxSrv } from "./app/api/service/tx.srv";
import { WalletSrv } from "./app/api/service/wallet.srv";

const PORT = 9898;
const WALLET_BASE_URL = "http://172.31.98.160:4000";
const RPC_ENDPOINT = "https://pri-bcnode.dev.kstadium.io";
const ADDR_SOP = "0x7dcB32FFFFe697133f12b4F38e6c3B642fdD0148";
const ADDR_INKSTA = "0x3Ba68e376f4d86753FEe2f6677fbf84C2E0A23fd";
const ADDR_FLUX = "0xEe1689E05A762B343Df6bD8ADbe9bBADD8C901D4";

function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const walletSrv = new WalletSrv(WALLET_BASE_URL);

  const server = new Server();
  const apiGroupRouter = server.groupRoute("/api");
  new TxSrv(provider, walletSrv, ADDR_SOP, ADDR_INKSTA, ADDR_FLUX).route(apiGroupRouter);
  server.start(PORT);
}

main();
