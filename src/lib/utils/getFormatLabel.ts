import { AppLanguage, FormatName } from '../../types';
import { getLanguage, t } from '../i18n/i18n';

/**
 * Human-readable label of a paper format, e.g. `A4 portrait`
 */
export default function getFormatLabel(
  format: FormatName,
  lang: AppLanguage = getLanguage(),
): string {
  const formatPrefix = format.slice(0, 2);

  if (format.endsWith('Y')) {
    return `${formatPrefix} ${t('format.portrait', lang)}`;
  } else {
    return `${formatPrefix} ${t('format.landscape', lang)}`;
  }
}
