export type EarningRecord = {
  currency: string;
  reportDate: string;
  estimate: string;
  //   fiscalDateEnding: string;
  //   symbol: string;
  //   name: string;
};

export type EarningRecordHeader = Record<keyof EarningRecord, number>;
