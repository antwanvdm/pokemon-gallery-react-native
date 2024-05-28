import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import nlNl from '../languages/nl-NL.json';
import frFR from '../languages/fr-FR.json';
import deDE from '../languages/de-DE.json';
import esES from '../languages/es-ES.json';
import itIT from '../languages/it-IT.json';
import jaJP from '../languages/ja-JP.json';
import zhCN from '../languages/zh-CN.json';
import ar from '../languages/ar.json';

//Create new instance for i18n
const i18n = new I18n({
  'en': en,
  'nl-NL': nlNl,
  'fr-FR': frFR,
  'de-DE': deDE,
  'es-ES': esES,
  'it-IT': itIT,
  'ja-JP': jaJP,
  'zh-CN': zhCN,
  'ar': ar,
});
i18n.enableFallback = true;

/**
 * @param {string} key
 * @param {string} language
 * @param {Object} [values]
 * @returns {string}
 */
const t = (key, language, values) => {
  i18n.locale = language;
  return i18n.t(key, values ?? {});
};

export { t };
