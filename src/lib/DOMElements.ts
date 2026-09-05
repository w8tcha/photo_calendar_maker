const introSection = document.querySelector('.intro-section') as HTMLElement;
const introCtaBtn = document.querySelector('#intro-cta-btn') as HTMLButtonElement;

const newProjectOverlayTriggerBtn = document.querySelector(
  '.new-project-overlay-trigger-btn',
) as HTMLButtonElement;
const newProjectOverlaySection = document.querySelector('.new-project-section') as HTMLElement;
const newProjectOverlayBG = document.querySelector('.new-project-bg') as HTMLElement;
const newProjectOverlayCloseBtn = document.querySelector(
  '.new-project-section__close-modal',
) as HTMLDivElement;

const multiModeBtn = document.querySelector('#multi-page') as HTMLInputElement;

const getButton = document.querySelector('#get-button') as HTMLButtonElement;

const yearDropdownContainer = document.querySelector('#year-dropdown') as HTMLDivElement;
const monthDropdownContainer = document.querySelector('#month-dropdown') as HTMLDivElement;
const fontDropdownContainer = document.querySelector('#font-dropdown') as HTMLDivElement;
const formatDropdownContainer = document.querySelector('#format-dropdown') as HTMLDivElement;

const langSwitcherSelect = document.querySelector('#lang-switcher-select') as HTMLSelectElement;

const calendarContainer = document.querySelector('.calendar-container') as HTMLDivElement;
const controlsContainer = document.querySelector('.controls-container') as HTMLDivElement;
const cropControlsContainer = document.querySelector('.crop-controls-container') as HTMLDivElement;

export {
  introSection,
  introCtaBtn,
  calendarContainer,
  controlsContainer,
  cropControlsContainer,
  getButton,
  multiModeBtn,
  newProjectOverlayTriggerBtn,
  newProjectOverlaySection,
  newProjectOverlayBG,
  newProjectOverlayCloseBtn,
  yearDropdownContainer,
  monthDropdownContainer,
  fontDropdownContainer,
  formatDropdownContainer,
  langSwitcherSelect,
};
