import { AppLanguage, FormatName } from '../../types';
import { getLanguage, t } from '../i18n/i18n';
import getFormatLabel from './getFormatLabel';

/**
 * Auto-generated project name, e.g. `Calendar 2026 · A4 portrait`
 */
export default function getProjectName(
  startYear: number,
  format: FormatName,
  lang: AppLanguage = getLanguage(),
): string {
  return t('newProject.defaultName', lang)
    .replace('{year}', String(startYear))
    .replace('{format}', getFormatLabel(format, lang));
}

/**
 * A name differing from the generated one for its year and format was typed by the user.
 * Generated names in any app language count as generated, so switching language keeps them auto.
 */
export function isCustomProjectName(name: string, startYear: number, format: FormatName): boolean {
  return Object.values(AppLanguage).every(
    (lang) => name !== getProjectName(startYear, format, lang),
  );
}
