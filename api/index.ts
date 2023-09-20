import axios from "axios";
import { config } from "../config";

export default {
  getCurrencyRate: async (
    currency: string,
    targetCurrency: string
  ): Promise<number> => {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=${targetCurrency}&apikey=${config.alphavanageApiKey}`
    );

    const rate =
      response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

    return parseFloat(rate);
  },
  getEarningsSchedule: async () => {
    const { data } = await axios.get<string>(
      `https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=${config.horizon}&apikey=${config.alphavanageApiKey}`,
      {
        responseType: "text",
      }
    );

    return data
      .split("\n")
      .filter((line) => line.length)
      .map((line) => line.replace(/\r/g, "").split(","));
  },
};
