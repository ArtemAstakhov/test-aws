export const config = {
  excludeEmpty: process.env.EXCLUDE_EMPTY === "true",
  currencyColumnName: process.env.CURRENCY_COLUMN_NAME || "currency",
  reportDateColumnName: process.env.REPORT_DATE_COLUMN_NAME || "reportDate",
  epsColumnName: process.env.EPS_COLUMN_NAME || "estimate",
  alphavanageApiKey: process.env.ALPHAVANTAGE_API_KEY,
  horizon: process.env.HORIZON || "3month",
};
