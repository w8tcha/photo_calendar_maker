import { AppLanguage } from '../../types';
import { getLanguage } from '../i18n/i18n';
import getFormatLabel from './getFormatLabel';
import { getMonthsList } from './getMonthsList';

/**
 * Short settings summary shown under a project name, e.g. `2026 · January · A4 portrait`
 */
export default function getProjectSummary(
  project: CalendarData,
  lang: AppLanguage = getLanguage(),
): string {
  const month = getMonthsList(lang)[project.firstMonthIndex];

  return `${project.startYear} · ${month} · ${getFormatLabel(project.format, lang)}`;
}
