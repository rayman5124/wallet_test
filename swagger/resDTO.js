const resDTO = {
  ErrRes: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "failed",
      },
    },
  },
  TxSuccessRes: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "success",
      },
      txHash: {
        type: "string",
        example: "0xdf62d376699d78c736b55186dfe27bbb2f60b423ba00b753b690cfb4d7d62008",
      },
    },
  },
};

module.exports = resDTO;
