const reqDTO = {
  TransferReq: {
    type: "object",
    properties: {
      keyID: {
        type: "string",
        example: "2f4c980d-5e3b-4139-8e85-a3c154190876",
        describe: "kms keyID",
      },
      userAddr: {
        type: "string",
        example: "0x053495aB8dD181c6413be812fE63F56Af43a625E",
        describe: "to address",
      },
      to: {
        type: "string",
        example: "0x5F90d10443B03F46a6c3513fe62F60733E7BceA7",
        describe: "to address",
      },
      amount: {
        type: "string",
        example: 1,
        describe: "eth unit amount",
      },
    },
  },
  FluxDelegateReq: {
    type: "object",
    properties: {
      keyID: {
        type: "string",
        example: "2f4c980d-5e3b-4139-8e85-a3c154190876",
        describe: "kms keyID",
      },
      userAddr: {
        type: "string",
        example: "0x053495aB8dD181c6413be812fE63F56Af43a625E",
        describe: "to address",
      },
      soID: {
        type: "string",
        example: "12",
        describe: "so ID",
      },
      amount: {
        type: "string",
        example: 1,
        describe: "eth unit amount",
      },
    },
  },
  FluxUndelegateReq: {
    type: "object",
    properties: {
      keyID: {
        type: "string",
        example: "2f4c980d-5e3b-4139-8e85-a3c154190876",
        describe: "kms keyID",
      },
      soID: {
        type: "string",
        example: "12",
        describe: "so ID",
      },
    },
  },
};

module.exports = reqDTO;
