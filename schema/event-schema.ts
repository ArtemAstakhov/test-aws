export const eventSchema = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        cur: {
          type: "string",
        },
        targetCur: {
          type: "string",
        },
      },
      required: ["cur", "targetCur"],
    },
  },
};
