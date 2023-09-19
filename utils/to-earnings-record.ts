import { EarningRecord, EarningRecordHeader } from "../models/earning-record";

const CURRENCY_COLUMN_NAME = process.env.CURRENCY_COLUMN_NAME || "currency";
const REPORT_DATE_COLUMN_NAME =
  process.env.REPORT_DATE_COLUMN_NAME || "reportDate";
const EPS_COLUMN_NAME = process.env.EPS_COLUMN_NAME || "estimate";

export const toEarningsRecord = (
  row: Array<string>,
  header: EarningRecordHeader
): EarningRecord => {
  return {
    currency: row[header.currency],
    reportDate: row[header.reportDate],
    estimate: row[header.estimate],
  };
};

export const toEarningsRecordHeader = (
  header: Array<string>
): EarningRecordHeader => {
  const currencyColumnIndex = header.indexOf(CURRENCY_COLUMN_NAME);
  const reportDateColumnIndex = header.indexOf(REPORT_DATE_COLUMN_NAME);
  const epsColumnIndex = header.indexOf(EPS_COLUMN_NAME);

  return {
    currency: currencyColumnIndex,
    reportDate: reportDateColumnIndex,
    estimate: epsColumnIndex,
  };
};
