import { toEarningsRecord, toEarningsRecordHeader } from "./to-earnings-record";

describe("toEarningsRecordHeader", () => {
  it("should parse header", () => {
    expect(
      toEarningsRecordHeader(["currency", "reportDate", "estimate"])
    ).toEqual({
      currency: 0,
      reportDate: 1,
      estimate: 2,
    });
  });
});

describe("toEarningsRecord", () => {
  it.each([
    [
      {
        header: { currency: 0, reportDate: 1, estimate: 2 },
        row: ["USD", "2021-01-01", "1.23"],
      },
      { currency: "USD", reportDate: "2021-01-01", estimate: "1.23" },
    ],
    [
      {
        header: { currency: 2, reportDate: 0, estimate: 1 },
        row: ["2021-01-01", "", "USD"],
      },
      { currency: "USD", reportDate: "2021-01-01", estimate: "" },
    ],
  ])(`should parse %o`, ({ header, row }, expected) => {
    expect(toEarningsRecord(row, header)).toEqual(expected);
  });
});
