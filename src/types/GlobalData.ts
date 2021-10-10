type LatestDate = {
  [key: string]: number;
};
type Periods = {
  [key: string]: number[];
};
type GlobalData = {
  latestDate: LatestDate,
  periods: Periods,
  lastPeriod: boolean
};

export default GlobalData;
