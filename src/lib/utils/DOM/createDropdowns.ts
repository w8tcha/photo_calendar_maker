import {
  yearDropdownContainer,
  monthDropdownContainer,
  fontDropdownContainer,
  formatDropdownContainer,
} from '../../DOMElements';

import { Dropdown } from './Dropdown';

import getYears from '../getYears';
import getFormatLabel from '../getFormatLabel';
import { getMonthsList } from '../getMonthsList';
import fontsData from '../../../assets/sourceFontsData';
import { A_outputFormats } from '../../../assets/A_FormatOptions/A_OutputDimensions';
import { FormatName } from '../../../types';
import { getLanguage, onLanguageChange, t } from '../../i18n/i18n';

/**
 * @param onChange - called whenever a dropdown that affects the generated project name changes
 */
export default function createDropdowns(onChange?: () => void) {
  // Create years dropdown
  const years = getYears(10);

  const yearsInput = new Dropdown<number>({
    container: yearDropdownContainer,
    items: years,
    caption: t('dropdown.startYear'),
    renderItem: (item) => item.toString(),
    onChange,
  });

  // Create months dropdown

  // Get current month...
  const currentMonth = new Date().getMonth();
  let monthsList = getMonthsList(getLanguage());

  const monthsInput = new Dropdown<number>({
    container: monthDropdownContainer,
    items: Array.from({ length: monthsList.length }, (_, i) => i),
    value: currentMonth,
    caption: t('dropdown.firstMonth'),
    renderItem: (item) => monthsList[item],
  });

  // Create fonts dropdown
  const fontsInput = new Dropdown<string>({
    container: fontDropdownContainer,
    items: Object.keys(fontsData),
    caption: t('dropdown.font'),
    renderItem: (font) => `
        <span style="font-family:${font}">
            ${font}
        </span>
    `,
  });

  // Create formats dropdown
  const formatsInput = new Dropdown<FormatName>({
    container: formatDropdownContainer,
    items: Object.keys(A_outputFormats) as FormatName[],
    value: FormatName.A4_Y,
    caption: t('dropdown.format'),
    renderItem: (format) => getFormatLabel(format),
    onChange,
  });

  // Keep dropdown captions & translated labels in sync with the app language,
  // without losing the user's current selection.
  onLanguageChange((lang) => {
    monthsList = getMonthsList(lang);

    yearsInput.setCaption(t('dropdown.startYear'));

    monthsInput.setCaption(t('dropdown.firstMonth'));
    monthsInput.refresh();

    fontsInput.setCaption(t('dropdown.font'));

    formatsInput.setCaption(t('dropdown.format'));
    formatsInput.refresh();
  });

  return { years, yearsInput, monthsInput, fontsInput, formatsInput };
}
