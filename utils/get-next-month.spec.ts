import { getNextMonth } from "./get-next-month";

describe("getNextMonth", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it.each([
    [new Date(2023, 5, 4), { month: 7, year: 2023 }],
    [new Date(2023, 11, 4), { month: 1, year: 2024 }],
    [new Date(2023, 0, 4), { month: 2, year: 2023 }],
  ])("should parse %s", (input, expected) => {
    jest.setSystemTime(input);

    expect(getNextMonth()).toEqual(expected);
  });
});
