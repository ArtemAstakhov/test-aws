import { config } from "../config";
import { EarningRecord, EarningRecordHeader } from "../models/earning-record";

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
  const currencyColumnIndex = header.indexOf(config.currencyColumnName);
  const reportDateColumnIndex = header.indexOf(config.reportDateColumnName);
  const epsColumnIndex = header.indexOf(config.epsColumnName);

  return {
    currency: currencyColumnIndex,
    reportDate: reportDateColumnIndex,
    estimate: epsColumnIndex,
  };
};
