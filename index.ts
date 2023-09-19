import { StringStream } from "scramjet";
import { Context, Handler, APIGatewayEvent } from "aws-lambda";

import { getNextMonth } from "./utils/get-next-month";
import { parseISODate } from "./utils/parse-iso-date";
import {
  toEarningsRecord,
  toEarningsRecordHeader,
} from "./utils/to-earnings-record";
import api from "./api";

const EXCLUDE_EMPTY = process.env.EXCLUDE_EMPTY === "true";

export const handler: Handler<APIGatewayEvent> = async (event) => {
  const currencies = event.queryStringParameters?.cur?.split(",") || [];
  const targetCurrency = event.queryStringParameters?.targetCur || "USD";

  if (!currencies.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "cur query string parameter is required",
      }),
    };
  }

  const earningsData: Array<Array<string>> = await StringStream.from(
    api.getEarningsSchedule
  )
    .CSVParse()
    .toArray();

  const header = toEarningsRecordHeader(earningsData[0]);

  const earnings = earningsData
    .slice(1)
    .map((row) => toEarningsRecord(row, header));

  const currencyRates = await Promise.all(
    currencies
      .filter((currency) => currency !== targetCurrency)
      .map(async (currency) => {
        const rate = await api.getCurrencyRate(currency, targetCurrency);

        return { currency, rate };
      })
  );

  const currencyRatesMap = currencyRates.reduce(
    (acc, { currency, rate }) => {
      acc[currency] = rate;

      return acc;
    },
    {} as {
      [key: string]: number;
    }
  );

  const nextMonth = getNextMonth();

  const nextMonthEarnings = earnings.filter((earning) => {
    const date = parseISODate(earning.reportDate);

    if (!date) {
      return false;
    }

    if (!currencies.includes(earning.currency)) {
      return false;
    }

    if (EXCLUDE_EMPTY && !earning.estimate) {
      return false;
    }

    return date.year === nextMonth.year && date.month === nextMonth.month;
  });

  const epsSummary = nextMonthEarnings.reduce((acc, row) => {
    const currencyRate = currencyRatesMap[row.currency] || 1;

    acc += parseFloat(row.estimate || "0") * currencyRate;

    return acc;
  }, 0);

  return {
    statusCode: 200,
    body: JSON.stringify({
      average: epsSummary / nextMonthEarnings.length,
      targetCurrency,
    }),
  };
};
