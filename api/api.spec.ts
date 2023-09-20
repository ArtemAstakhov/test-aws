import { mock } from "jest-mock-extended";

const mockAxios = mock<Axios>();

jest.mock("axios", () => ({
  get: mockAxios.get,
}));

import api from "./index";
import { Axios } from "axios";

describe("api", () => {
  describe("getCurrencyRate", () => {
    it("shoud extract currency rate", async () => {
      const currency = "USD";
      const targetCurrency = "KRW";

      mockAxios.get.mockResolvedValueOnce({
        data: {
          "Realtime Currency Exchange Rate": {
            "5. Exchange Rate": "1000",
          },
        },
      });

      const rate = await api.getCurrencyRate(currency, targetCurrency);

      expect(rate).toEqual(1000);
    });
  });

  describe("getEarningsSchedule", () => {
    it("shoud extract earnings schedule", async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: [
          "symbol,reportDate,fiscalDateEnding,reportedEPS,estimatedEPS",
          "AAPL,2021-01-27,2020-12-31,1.68,1.41",
          "AAPL,2020-10-29,2020-09-30,0.73,0.7",
          "AAPL,2020-07-30,2020-06-30,0.65,0.51",
          "AAPL,2020-04-30,2020-03-31,0.64,0.51",
        ].join("\n"),
      });

      const earningsSchedule = await api.getEarningsSchedule();

      expect(earningsSchedule).toEqual([
        [
          "symbol",
          "reportDate",
          "fiscalDateEnding",
          "reportedEPS",
          "estimatedEPS",
        ],
        ["AAPL", "2021-01-27", "2020-12-31", "1.68", "1.41"],
        ["AAPL", "2020-10-29", "2020-09-30", "0.73", "0.7"],
        ["AAPL", "2020-07-30", "2020-06-30", "0.65", "0.51"],
        ["AAPL", "2020-04-30", "2020-03-31", "0.64", "0.51"],
      ]);
    });
  });
});
