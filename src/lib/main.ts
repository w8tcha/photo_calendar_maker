import '../styles/main.scss';

import { Calendar } from './Calendar';
import {
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
} from './DOMElements';
import DataController from './entities/DataController/DataController';
import animateTriggerBtn from './animations/animateTriggerBtn';
import animateNewProjectOverlay from './animations/animateNewProjectOverlay';
import createDropdowns from './utils/DOM/createDropdowns';
import { CalendarType } from '../types';

let activeCalendar: Calendar | null = null;
let dataController: DataController | null;

// Guards against the intro/new-project CTAs firing before font loading and
// saved-project restoration have finished, which would let a new project
// silently overwrite a not-yet-restored saved one.
let isReady = false;

let userInputs: ReturnType<typeof createDropdowns>;

async function newProject() {
  const newCalendarData: CalendarData = {
    startYear: userInputs.yearsInput.value,
    firstMonthIndex: userInputs.monthsInput.value,
    lang: userInputs.langsInput.value,
    font: userInputs.fontsInput.value,
    format: userInputs.formatsInput.value,
    type: multiModeBtn.checked ? CalendarType.MultiPage : CalendarType.SinglePage,
  };

  try {
    // Set new calendar in IDB via DS with user's input data
    await dataController?.reset(newCalendarData);

    // Purge all current content
    calendarContainer.innerHTML = '';
    // Generate new calendar
    newCalendar();
  } catch (err) {
    console.log('Failed to create new project:', err);
    alert('Failed to create the new calendar. Please try again.');
  }
}

function newCalendar() {
  introSection.classList.add('hide');
  newProjectOverlayTriggerBtn.classList.remove('hide');

  controlsContainer.classList.remove('hide');
  if (activeCalendar) {
    activeCalendar.dispose();
  }

  activeCalendar = new Calendar(
    {
      calendarContainer,
      controlsContainer,
      cropControlsContainer,
    },
    dataController as DataController,
  );
}

// Init
window.addEventListener(
  'DOMContentLoaded',
  async () => {
    userInputs = createDropdowns();

    // Disable calendar-creation entry points until fonts are loaded and any
    // saved project has been restored, so a new project can't be created
    // (and silently overwrite a saved one) while that is still in flight.
    introCtaBtn.disabled = true;

    // Generate new calendar from inputs
    getButton.addEventListener('click', () => {
      if (!isReady) return;

      animateNewProjectOverlay(newProjectOverlayBG, newProjectOverlaySection, 'out');
      newProject();
    });

    // Animate new project overlay trigger button on hover
    newProjectOverlayTriggerBtn?.addEventListener('mouseenter', animateTriggerBtn);
    newProjectOverlayTriggerBtn?.addEventListener('mouseleave', animateTriggerBtn);

    // Animate & toggle new project container
    newProjectOverlayTriggerBtn?.addEventListener('click', () => {
      animateNewProjectOverlay(newProjectOverlayBG, newProjectOverlaySection, 'in');
    });
    newProjectOverlayCloseBtn.addEventListener('click', () => {
      animateNewProjectOverlay(newProjectOverlayBG, newProjectOverlaySection, 'out');

      // If no calendar exists yet, return to the intro screen
      if (!activeCalendar) {
        introSection.classList.remove('hide');
      }
    });

    // Open the new project overlay from the intro screen
    introCtaBtn.addEventListener('click', () => {
      if (!isReady) return;

      introSection.classList.add('hide');
      animateNewProjectOverlay(newProjectOverlayBG, newProjectOverlaySection, 'in');
    });

    // Init dataController
    dataController = new DataController();

    try {
      // Load fonts from /assets
      await dataController.loadFonts();

      // If some data in IDB - get it and store in DS object
      await dataController.retrieveDataFromIDB();

      // If data in DS - init new project
      if (dataController.calendarProjectData) {
        newCalendar();
      }
    } catch (err) {
      console.log('Failed to initialize app:', err);
    } finally {
      isReady = true;
      introCtaBtn.disabled = false;
    }
  },
  { once: true },
);
