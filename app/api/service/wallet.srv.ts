import fetch from "node-fetch";
import { prettyJSON } from "../../common/json";

type RestMethod = "GET" | "POST" | "DELETE";

type SignReq = {
  keyID: string;
  serializedTxn: string;
};

export class WalletSrv {
  constructor(private readonly basePath: string) {}

  public async getAddress(keyID: string): Promise<string> {
    const path = `/api/accounts/${keyID}`;
    const method: RestMethod = "GET";
    const res = await this._fetch(path, method, undefined);
    console.log(res);
    return res.address;
  }

  public async sign(signReq: SignReq): Promise<string> {
    console.log(
      `<request sign> \n${prettyJSON({
        keyID: signReq.keyID,
        unsingedSerializedTxn: signReq.serializedTxn,
      })}\n`
    );

    const method: RestMethod = "POST";
    // const path = "/api/sign/txn";
    // const res = await this._fetch(path, method, signReq);
    const path = `/signTxn/gnd/${signReq.keyID}/${signReq.serializedTxn}`;
    const res = await this._fetch(path, method);

    console.log(
      `<sign response> \n${prettyJSON({
        res,
      })}\n`
    );
    return res.signedTxn;
  }

  private async _fetch(path: string, method: RestMethod, body?: object) {
    const res = await fetch(this.basePath + path, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    const resJson = await res.json();
    if (Math.floor(res.status / 100) == 2) {
      return resJson;
    } else {
      throw new Error(
        "<wallet request failed> \n" +
          prettyJSON({
            status: res.status,
            path: this.basePath + path,
            res: resJson,
          }) +
          "\n"
      );
    }
  }

  private _removeIfPrefixed(hex: string): string {
    if (hex.startsWith("0x")) {
      hex = hex.slice(2);
    }
    return hex;
  }
}
