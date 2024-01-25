import { ethers } from "ethers";
import { Erc20, Erc20__factory, Flux, Flux__factory } from "../../../contracts/typechain";
import { WalletSrv } from "./wallet.srv";
import { Router, Request, Response, NextFunction } from "express";
import keccak256 from "keccak256";
import { prettyJSON } from "../../common/json";

export class TxSrv {
  private readonly ierc20: ethers.utils.Interface;
  private readonly sop: Erc20;
  private readonly inKsta: Erc20;
  private readonly flux: Flux;

  constructor(
    private readonly provider: ethers.providers.JsonRpcProvider,
    private readonly walletSrv: WalletSrv,
    private readonly sopAddr: string,
    private readonly inKstaAddr: string,
    private readonly fluxAddr: string
  ) {
    this.ierc20 = new ethers.utils.Interface(Erc20__factory.abi);
    this.sop = Erc20__factory.connect(sopAddr, provider);
    this.inKsta = Erc20__factory.connect(inKstaAddr, provider);
    this.flux = Flux__factory.connect(fluxAddr, provider);
  }

  public route(router: Router) {
    // 비동기 handler 의 에러 처리를 위해

    router.post("/coin/transfer", (req, res, next) => {
      console.log("===== /coin/transfer =====");
      /*
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'sop transfer body',
        schema: { $ref: '#/definitions/TransferReq'},
      },
      #swagger.responses[200] = {
        description: 'all success response',
        schema: { $ref: '#/definitions/TxSuccessRes'}
      },
      #swagger.responses[500] = {
        description: 'all errors',
        schema: { $ref: '#/definitions/ErrRes'}
      } 
      */
      this.transferCoin
        .bind(this)(req, res, next)
        .catch(next)
        .then(() => {
          console.log("=".repeat(50) + "\n");
        });
    });

    router.post("/sop/transfer", (req, res, next) => {
      console.log("===== /sop/transfer =====");
      /*
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'sop transfer body',
        schema: { $ref: '#/definitions/TransferReq'},
      },
      #swagger.responses[200] = {
        description: 'all success response',
        schema: { $ref: '#/definitions/TxSuccessRes'}
      },
      #swagger.responses[500] = {
        description: 'all errors',
        schema: { $ref: '#/definitions/ErrRes'}
      } 
      */
      this.transferSop
        .bind(this)(req, res, next)
        .catch(next)
        .then(() => {
          console.log("=".repeat(50) + "\n");
        });
    });

    router.post("/flux/delegate", (req, res, next) => {
      console.log("===== /flux/delegate =====");
      /*
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'flux delegate body',
        schema: { $ref: '#/definitions/FluxDelegateReq'},
      },
      #swagger.responses[200] = {
        description: 'all success response',
        schema: { $ref: '#/definitions/TxSuccessRes'}
      },
      #swagger.responses[500] = {
        description: 'all errors',
        schema: { $ref: '#/definitions/ErrRes'}
      } 
      */
      this.delegate
        .bind(this)(req, res, next)
        .catch(next)
        .then(() => {
          console.log("=".repeat(50) + "\n");
        });
    });

    router.post("/flux/undelegate", (req, res, next) => {
      console.log("===== /flux/undelegate =====");
      /*
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'flux undelegate body',
        schema: { $ref: '#/definitions/FluxUndelegateReq'},
      },
      #swagger.responses[200] = {
        description: 'all success response',
        schema: { $ref: '#/definitions/TxSuccessRes'}
      },
      #swagger.responses[500] = {
        description: 'all errors',
        schema: { $ref: '#/definitions/ErrRes'}
      } 
      */
      this.undelegate
        .bind(this)(req, res, next)
        .catch(next)
        .then(() => {
          console.log("=".repeat(50) + "\n");
        });
    });
  }

  public async transferCoin(req: Request, res: Response, next: NextFunction) {
    const { keyID, userAddr, to, amount }: { [key: string]: string } = req.body;
    const weiAmount = ethers.utils.parseEther(amount);

    const unsignedSerializedTx = await this._autoFillNSerializeTxn(
      userAddr,
      to,
      undefined,
      weiAmount
    );
    const signedSerializedTx = await this.walletSrv.sign({
      keyID,
      serializedTxn: unsignedSerializedTx,
    });

    console.log("<send signed tx to gnd_chain>\n");
    const beforeBal = {
      sender: ethers.utils.formatEther(await this.provider.getBalance(userAddr)),
      receiver: ethers.utils.formatEther(await this.provider.getBalance(to)),
    };
    const txRes = await this.provider.sendTransaction(signedSerializedTx);
    const receipt = await txRes.wait();
    const afterBal = {
      sender: ethers.utils.formatEther(await this.provider.getBalance(userAddr)),
      receiver: ethers.utils.formatEther(await this.provider.getBalance(to)),
    };
    if (receipt.status && receipt.status >= 1) {
      console.log(
        `<tx succeed>\n${prettyJSON({
          beforeBal,
          afterBal,
        })}`
      );
      res.status(200).json({
        message: "success",
        txHash: receipt.transactionHash,
      });
    } else {
      next(new Error(`<tx failed>\n ${prettyJSON({ txHash: receipt.transactionHash })}\n`));
    }
  }

  public async transferSop(req: Request, res: Response, next: NextFunction) {
    const { keyID, userAddr, to, amount }: { [key: string]: string } = req.body;

    const weiAmount = ethers.utils.parseEther(amount);
    const calldata = this.ierc20.encodeFunctionData("transfer", [to, weiAmount]);

    const unsignedSerializedTx = await this._autoFillNSerializeTxn(
      userAddr,
      this.sopAddr,
      calldata
    );
    const signedSerializedTx = await this.walletSrv.sign({
      keyID,
      serializedTxn: unsignedSerializedTx,
    });

    console.log("<send signed tx to gnd_chain>\n");
    const beforeBal = {
      sender: ethers.utils.formatEther(await this.sop.balanceOf(userAddr)),
      receiver: ethers.utils.formatEther(await this.sop.balanceOf(to)),
    };
    const txRes = await this.provider.sendTransaction(signedSerializedTx);
    const receipt = await txRes.wait();
    const afterBal = {
      sender: ethers.utils.formatEther(await this.sop.balanceOf(userAddr)),
      receiver: ethers.utils.formatEther(await this.sop.balanceOf(to)),
    };
    if (receipt.status && receipt.status >= 1) {
      console.log(
        `<tx succeed>\n${prettyJSON({
          beforeBal,
          afterBal,
        })}`
      );
      res.status(200).json({
        message: "success",
        txHash: receipt.transactionHash,
      });
    } else {
      next(new Error(`<tx failed>\n ${prettyJSON({ txHash: receipt.transactionHash })}\n`));
    }
  }

  public async delegate(req: Request, res: Response, next: NextFunction) {
    const { keyID, userAddr, soID, amount }: { [key: string]: string } = req.body;

    const weiAmount = BigInt(amount) * BigInt(10 ** 18);
    const allowance = await this.sop.allowance(userAddr, this.fluxAddr);
    if (allowance.lt(weiAmount)) {
      await this._approveToken(this.sopAddr, keyID, userAddr, this.fluxAddr, weiAmount);
    }

    const hexWeiAmount = weiAmount.toString(16);
    const selector = keccak256("delegate(uint32,uint256)").toString("hex").slice(0, 8);
    const paddedSoID = Number(soID).toString(16).padStart(64, "0");
    const paddedAmount = hexWeiAmount.padStart(64, "0");
    const calldata = "0x" + selector + paddedSoID + paddedAmount;

    const unsignedSerializedTx = await this._autoFillNSerializeTxn(
      userAddr,
      this.fluxAddr,
      calldata
    );
    const signedSerializedTx = await this.walletSrv.sign({
      keyID,
      serializedTxn: unsignedSerializedTx,
    });

    console.log("<send signed tx to gnd_chain>\n");
    const tx = await this.provider.sendTransaction(signedSerializedTx);
    const receipt = await tx.wait();
    const userInfo = await this.flux.getUserInfo(soID, userAddr);
    if (receipt.status && receipt.status >= 1) {
      console.log(
        `<tx succeed>\n${prettyJSON({
          delegate: userInfo.delegate.toString(),
          delegateAt: userInfo.delegateAt.toString(),
          clearingAt: userInfo.clearingAt.toString(),
        })}\n`
      );
      res.status(200).json({
        message: "success",
        txHash: receipt.transactionHash,
      });
    } else {
      next(new Error(`<tx failed>\n ${receipt.transactionHash}\n`));
    }
  }

  public async undelegate(req: Request, res: Response, next: NextFunction) {
    const { keyID, userAddr, soID }: { [key: string]: string } = req.body;

    const inKstaBal = await this.inKsta.balanceOf(userAddr);
    const allowance = await this.inKsta.allowance(userAddr, this.fluxAddr);
    if (allowance.lt(inKstaBal)) {
      await this._approveToken(this.inKstaAddr, keyID, userAddr, this.fluxAddr, inKstaBal);
    }

    const selector = keccak256("undelegate(uint32)").toString("hex").slice(0, 8);
    const paddedSoID = Number(soID).toString(16).padStart(64, "0");
    const calldata = "0x" + selector + paddedSoID;

    const unsignedSerializedTx = await this._autoFillNSerializeTxn(
      userAddr,
      this.fluxAddr,
      calldata
    );
    const signedSerializedTx = await this.walletSrv.sign({
      keyID,
      serializedTxn: unsignedSerializedTx,
    });

    console.log("<send signed tx to gnd_chain>\n");
    const tx = await this.provider.sendTransaction(signedSerializedTx);
    const receipt = await tx.wait();
    const userInfo = await this.flux.getUserInfo(soID, userAddr);
    if (receipt.status && receipt.status >= 1) {
      console.log(
        `<tx succeed>\n${prettyJSON({
          delegate: userInfo.delegate.toString(),
          delegateAt: userInfo.delegateAt.toString(),
          clearingAt: userInfo.clearingAt.toString(),
        })}\n`
      );
      res.status(200).json({
        message: "success",
        txHash: receipt.transactionHash,
      });
    } else {
      next(new Error(`<tx failed>\n ${receipt.transactionHash}\n`));
    }
  }

  private async _approveToken(
    tokenAddr: string,
    keyID: string,
    from: string,
    to: string,
    weiAmount: ethers.BigNumberish
  ) {
    const calldata = this.ierc20.encodeFunctionData("approve", [to, weiAmount]);

    const unsignedSerializedTx = await this._autoFillNSerializeTxn(from, tokenAddr, calldata);
    const signedSerializedTx = await this.walletSrv.sign({
      keyID,
      serializedTxn: unsignedSerializedTx,
    });

    const txRes = await this.provider.sendTransaction(signedSerializedTx);
    const receipt = await txRes.wait();
    if (receipt.status && receipt.status >= 1) {
      return receipt.transactionHash;
    } else {
      throw new Error(`approve tx failed: ${receipt.transactionHash}\n`);
    }
  }

  private async _autoFillNSerializeTxn(
    from: string,
    to?: string,
    calldata?: string,
    value?: ethers.BigNumberish
  ): Promise<string> {
    const promises = [
      this.provider.getTransactionCount(from, "pending"),
      this.provider.getGasPrice(),
      this.provider.estimateGas({
        from,
        to,
        data: calldata,
        value,
      }),
    ];
    const [nonce, gasPrice, gasLimit] = (await Promise.all(promises)) as [
      number,
      ethers.BigNumber,
      ethers.BigNumber
    ];

    return ethers.utils.serializeTransaction({
      to,
      data: calldata,
      nonce,
      gasLimit,
      gasPrice,
      value,
    });
  }
}
