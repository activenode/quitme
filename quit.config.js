export const QUIT_CONFIG = {
  start: {
    day: 1, // 1st of
    month: 10, // october
    year: 2021,
  },
  end: {
    day: 25,
    month: 3, // march
    year: 2022,
  },
  holidays: {
    // The following props are needed for holiday calculation
    // find the reference here:
    // https://www.npmjs.com/package/date-holidays#supported-countries-states-regions

    // set disable to true to treat holidays as workdays
    disable: false,
    country: "DE",
    state: "bw",
  },
  treatSaturdayAsWorkday: false,
};
