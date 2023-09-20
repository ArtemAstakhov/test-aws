import { mock } from "jest-mock-extended";

const mockApi = mock<typeof api>();

jest.mock("./api", () => ({
  getCurrencyRate: mockApi.getCurrencyRate,
  getEarningsSchedule: mockApi.getEarningsSchedule,
}));

import { lambdaHandler } from "./handler";
import api from "./api";
import { APIGatewayEvent, Context } from "aws-lambda";

describe("handler", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly filter data by currency", async () => {
    jest.setSystemTime(new Date("2021-01-01"));

    mockApi.getEarningsSchedule.mockResolvedValueOnce([
      ["symbol", "reportDate", "fiscalDateEnding", "estimate", "currency"],
      ["AAPL", "2021-02-27", "2020-12-31", "1.68", "USD"],
      ["AAPL", "2021-02-27", "2020-12-31", "1.68", "KRW"],
      ["AAPL", "2021-02-27", "2020-12-31", "1.68", "JPY"],
      ["AAPL", "2021-02-27", "2020-12-31", "1.68", "EUR"],
    ]);
    mockApi.getCurrencyRate.mockImplementationOnce(
      (currency, targetCurrency) => {
        if (currency === "USD" && targetCurrency === "KRW") {
          return Promise.resolve(1000);
        }

        if (currency === "USD" && targetCurrency === "JPY") {
          return Promise.resolve(100);
        }

        if (currency === "USD" && targetCurrency === "EUR") {
          return Promise.resolve(0.8);
        }

        return Promise.resolve(1);
      }
    );

    const event = {
      queryStringParameters: {
        cur: "USD,KRW",
        targetCur: "KRW",
      },
    } as unknown as APIGatewayEvent;

    const result = await lambdaHandler(event, {} as Context, () => {});

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ average: 840.84, targetCurrency: "KRW" }),
    });
  });

  it("should correctly filter data by date", async () => {
    jest.setSystemTime(new Date("2021-01-01"));

    mockApi.getEarningsSchedule.mockResolvedValueOnce([
      ["symbol", "reportDate", "fiscalDateEnding", "estimate", "currency"],
      ["AAPL", "2021-01-27", "2020-12-31", "1.68", "USD"],
      ["AAPL", "2021-02-27", "2020-12-31", "1.68", "KRW"],
      ["AAPL", "2021-02-27", "2020-12-31", "1.68", "JPY"],
      ["AAPL", "2021-03-27", "2020-12-31", "1.68", "EUR"],
      ["AAPL", "2021-04-27", "2020-12-31", "1.68", "EUR"],
      ["AAPL", "2021-05-27", "2020-12-31", "1.68", "KRW"],
      ["MSFT", "2021-02-27", "2020-12-31", "5.24", "KRW"],
    ]);
    mockApi.getCurrencyRate.mockImplementationOnce(
      (currency, targetCurrency) => {
        if (currency === "USD" && targetCurrency === "KRW") {
          return Promise.resolve(1000);
        }

        if (currency === "USD" && targetCurrency === "JPY") {
          return Promise.resolve(100);
        }

        if (currency === "USD" && targetCurrency === "EUR") {
          return Promise.resolve(0.8);
        }

        return Promise.resolve(1);
      }
    );

    const event = {
      queryStringParameters: {
        cur: "USD,KRW",
        targetCur: "KRW",
      },
    } as unknown as APIGatewayEvent;

    const result = await lambdaHandler(event, {} as Context, () => {});

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ average: 3.46, targetCurrency: "KRW" }),
    });
  });
});
