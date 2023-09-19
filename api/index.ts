import axios from "axios";
import { Readable } from "stream";

const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;
const HORIZON = process.env.HORIZON || "3month";

export default {
  getCurrencyRate: (
    currency: string,
    targetCurrency: string
  ): Promise<number> => {
    return axios
      .get(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=${targetCurrency}&apikey=${ALPHAVANTAGE_API_KEY}`
      )
      .then((response) => {
        return response.data["Realtime Currency Exchange Rate"][
          "5. Exchange Rate"
        ];
      })
      .then((rate) => {
        return parseFloat(rate);
      });
  },
  getEarningsSchedule: async () => {
    const { data } = await axios.get<Readable>(
      `https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=${HORIZON}&apikey=${ALPHAVANTAGE_API_KEY}`,
      {
        responseType: "stream",
      }
    );

    return data;
  },
};
