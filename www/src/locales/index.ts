import en from './en.json';
import ar from './ar.json';
import { I18n } from 'types/config';

const dictionaries = {
  en,
  ar,
};

const getDictionary = (locale: I18n) => dictionaries[locale];

export default getDictionary;
