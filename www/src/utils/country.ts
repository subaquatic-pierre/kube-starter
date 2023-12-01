import countries from 'data/countries';

export const getCountryNameFromCode = (countryCode: string): string => {
  const country = countries.filter((item) => item.code === countryCode)[0];

  if (!country) {
    return countryCode;
  }

  return country.label;
};
