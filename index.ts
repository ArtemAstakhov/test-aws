import { Handler, APIGatewayEvent, Context } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import middy from "@middy/core";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

import { eventSchema } from "./schema/event-schema";
import { lambdaHandler } from "./handler";

export const handler = middy<APIGatewayEvent>()
  .use(validator({ eventSchema: transpileSchema(eventSchema) }))
  .use(httpErrorHandler())
  .handler(lambdaHandler);

handler(
  {
    queryStringParameters: {
      cur: "USD,EUR",
      targetCur: "USD",
    },
  } as unknown as APIGatewayEvent,
  {} as Context,
  () => {}
);
