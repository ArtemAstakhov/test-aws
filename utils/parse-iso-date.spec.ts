import { parseISODate } from "./parse-iso-date";

describe("parseISODate", () => {
  it.each([
    ["2021-01-01", { year: 2021, month: 1, day: 1 }],
    ["2021-05-13", { year: 2021, month: 5, day: 13 }],
    ["2021-12-31", { year: 2021, month: 12, day: 31 }],
  ])("should parse %s", (input, expected) => {
    expect(parseISODate(input)).toEqual(expected);
  });
});
