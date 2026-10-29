import '../styles/main.scss';

import { Calendar } from './Calendar';
import {
  introSection,
  introCtaBtn,
  calendarContainer,
  controlsContainer,
  cropControlsContainer,
  getButton,
  editButton,
  deleteButton,
  cancelButton,
  projectNameInput,
  projectsDropdownContainer,
  projectSettingsBlock,
  lockedSettingsHint,
  singleModeBtn,
  multiModeBtn,
  newProjectOverlayTriggerBtn,
  newProjectOverlaySection,
  newProjectOverlayBG,
  newProjectOverlayCloseBtn,
  langSwitcherSelect,
} from './DOMElements';
import DataController from './entities/DataController/DataController';
import animateTriggerBtn from './animations/animateTriggerBtn';
import animateNewProjectOverlay from './animations/animateNewProjectOverlay';
import createDropdowns from './utils/DOM/createDropdowns';
import createProjectsDropdown, {
  NEW_PROJECT_ITEM,
  ProjectPickerItem,
  toProjectPickerItems,
} from './utils/DOM/createProjectsDropdown';
import getProjectName, { isCustomProjectName } from './utils/getProjectName';
import { withYear } from './utils/getYears';
import { AppLanguage, CalendarType } from '../types';
import {
  applyStaticTranslations,
  getLanguage,
  onLanguageChange,
  setLanguage,
  t,
} from './i18n/i18n';

let activeCalendar: Calendar | null = null;
let dataController: DataController | null;

// Guards against the intro/new-project CTAs firing before font loading and
// saved-project restoration have finished, which would let a new project
// be created while the last opened one is still being restored.
let isReady = false;

let userInputs: ReturnType<typeof createDropdowns>;
let projectsInput: ReturnType<typeof createProjectsDropdown>;

// Set once the user edits the name field; stops auto-suggestions from overwriting it
let isProjectNameDirty = false;

// Saved project whose settings are being edited; null outside edit mode
let editingProject: StoredProject | null = null;

/**
 * State of the "New" form, kept aside while the form is borrowed for editing
 */
type NewProjectDraft = {
  startYear: number;
  firstMonthIndex: number;
  font: string;
  format: CalendarData['format'];
  isMultiPage: boolean;
  name: string;
  isNameDirty: boolean;
};

let newProjectDraft: NewProjectDraft | null = null;

function getSuggestedProjectName() {
  return getProjectName(userInputs.yearsInput.value, userInputs.formatsInput.value);
}

// Refresh the suggested name unless the user has typed their own
function syncSuggestedProjectName() {
  if (!isProjectNameDirty) {
    projectNameInput.value = getSuggestedProjectName();
  }
}

function openOverlay() {
  introSection.classList.add('hide');
  animateNewProjectOverlay(newProjectOverlayBG, newProjectOverlaySection, 'in');
}

function closeOverlay() {
  animateNewProjectOverlay(newProjectOverlayBG, newProjectOverlaySection, 'out');
}

// With no calendar open, fall back to the intro screen
function showIntroIfNoCalendar() {
  if (!activeCalendar) {
    introSection.classList.remove('hide');
  }
}

/**
 * Re-read saved projects into the picker and select "New";
 * the picker is hidden while there are no projects
 */
async function refreshProjectsList() {
  const projects = (await dataController?.listProjects()) ?? [];

  projectsInput.setItems(toProjectPickerItems(projects), NEW_PROJECT_ITEM);
  projectsDropdownContainer.classList.toggle('hide', projects.length === 0);

  onProjectPickerChange(NEW_PROJECT_ITEM);
}

/**
 * Open the overlay on the active project in edit mode, or on "New" when no project is open
 */
async function onOverlayTriggerClick() {
  if (!isReady) return;

  await refreshProjectsList();

  const activeId = dataController?.activeProjectId;
  const activeItem = projectsInput.items.find(
    (item) => item.kind === 'project' && item.project.id === activeId,
  );

  if (activeItem) {
    projectsInput.setValue(activeItem);
    enterEditMode();
  }

  openOverlay();
}

/**
 * "New" shows the settings form + "Create";
 * a saved project hides the form + "Open"/"Edit"/"Delete";
 * editing shows the pre-filled form + "Save"/"Cancel"
 */
function onProjectPickerChange(item: ProjectPickerItem) {
  const isEditing = editingProject !== null;
  const isNew = !isEditing && item.kind === 'new';
  const isSelected = !isEditing && item.kind === 'project';

  projectSettingsBlock.classList.toggle('hide', isSelected);
  getButton.textContent = isEditing
    ? t('newProject.save')
    : isNew
      ? t('newProject.create')
      : t('newProject.open');
  editButton.classList.toggle('hide', !isSelected);
  deleteButton.classList.toggle('hide', !isSelected);
  cancelButton.classList.toggle('hide', !isEditing);
}

// Picking any item while editing discards the edit, like "Cancel"
function onProjectPickerSelect(item: ProjectPickerItem) {
  if (editingProject) {
    exitEditMode();
    return;
  }

  onProjectPickerChange(item);
}

function takeNewProjectDraft(): NewProjectDraft {
  return {
    startYear: userInputs.yearsInput.value,
    firstMonthIndex: userInputs.monthsInput.value,
    font: userInputs.fontsInput.value,
    format: userInputs.formatsInput.value,
    isMultiPage: multiModeBtn.checked,
    name: projectNameInput.value,
    isNameDirty: isProjectNameDirty,
  };
}

// Fill the settings form without triggering name auto-suggestions
function fillSettingsForm(values: NewProjectDraft) {
  userInputs.yearsInput.setValue(values.startYear);
  userInputs.monthsInput.setValue(values.firstMonthIndex);
  userInputs.fontsInput.setValue(values.font);
  userInputs.formatsInput.setValue(values.format);

  multiModeBtn.checked = values.isMultiPage;
  singleModeBtn.checked = !values.isMultiPage;

  projectNameInput.value = values.name;
  isProjectNameDirty = values.isNameDirty;
}

// Format and type are fixed after creation
function setEditLocks(locked: boolean) {
  userInputs.formatsInput.setDisabled(locked);
  singleModeBtn.disabled = locked;
  multiModeBtn.disabled = locked;
  lockedSettingsHint.classList.toggle('hide', !locked);
}

/**
 * Put the "New" draft aside and show the selected project's settings in the form
 */
function enterEditMode() {
  const selected = projectsInput.value;

  if (selected.kind !== 'project' || editingProject) return;

  const { project } = selected;

  newProjectDraft = takeNewProjectDraft();
  editingProject = project;

  // A past project year is not in the standard list, but must stay selectable
  userInputs.yearsInput.setItems(withYear(userInputs.years, project.startYear));

  fillSettingsForm({
    startYear: project.startYear,
    firstMonthIndex: project.firstMonthIndex,
    font: project.font,
    format: project.format,
    isMultiPage: project.type === CalendarType.MultiPage,
    name: project.name,
    // An auto-generated name follows year changes, a custom one is kept
    isNameDirty: isCustomProjectName(project.name, project.startYear, project.format),
  });

  // Show an auto-generated name in the current app language
  syncSuggestedProjectName();

  setEditLocks(true);
  onProjectPickerChange(selected);
}

/**
 * Discard edits, restore the "New" draft and return to the selected project
 */
function exitEditMode() {
  if (!editingProject) return;

  editingProject = null;

  userInputs.yearsInput.setItems(userInputs.years);

  if (newProjectDraft) {
    fillSettingsForm(newProjectDraft);
    newProjectDraft = null;
  }

  setEditLocks(false);
  onProjectPickerChange(projectsInput.value);
}

/**
 * Persist the edited settings and open the project. Unchanged settings only
 * open it (nothing is written); a failure keeps edit mode and the current calendar.
 */
async function saveEditedProject() {
  if (!editingProject) return;

  const { id } = editingProject;

  const settings: EditableProjectSettings = {
    // Empty / whitespace-only name falls back to the generated default
    name: projectNameInput.value.trim() || getSuggestedProjectName(),
    startYear: userInputs.yearsInput.value,
    firstMonthIndex: userInputs.monthsInput.value,
    // Calendar language always follows the app-wide language
    lang: getLanguage(),
    font: userInputs.fontsInput.value,
  };

  let isChanged: boolean;

  try {
    isChanged = (await dataController?.updateProject(id, settings)) ?? false;
  } catch (err) {
    console.log(`Failed to save project ${id}:`, err);
    return;
  }

  exitEditMode();
  closeOverlay();

  if (isChanged) {
    // Re-render with the new settings
    newCalendar();
    await refreshProjectsList();
  } else {
    await openProject(id);
  }
}

async function newProject() {
  const now = Date.now();
  const startYear = userInputs.yearsInput.value;
  const format = userInputs.formatsInput.value;

  // Empty / whitespace-only name falls back to the generated default
  const name = projectNameInput.value.trim() || getProjectName(startYear, format);

  const newCalendarData: CalendarData = {
    name,
    createdAt: now,
    lastOpenedAt: now,
    startYear,
    firstMonthIndex: userInputs.monthsInput.value,
    lang: getLanguage(),
    font: userInputs.fontsInput.value,
    format,
    type: multiModeBtn.checked ? CalendarType.MultiPage : CalendarType.SinglePage,
  };

  try {
    // Persist a new project (earlier projects stay in IDB) and make it active
    await dataController?.createProject(newCalendarData);
    // Generate new calendar
    newCalendar();
  } catch (err) {
    console.log('Failed to create new project:', err);
    alert(t('errors.createProjectFailed'));
    return;
  }

  // Reset name field to a fresh suggestion for the next project
  isProjectNameDirty = false;
  syncSuggestedProjectName();

  await refreshProjectsList();
}

async function openProject(id: number) {
  // Already looking at this project — nothing to re-render
  if (dataController?.activeProjectId === id) return;

  try {
    await dataController?.loadProject(id);
    // Keep the project's language in sync with the current app-wide language
    await dataController?.setLanguage(getLanguage());
    newCalendar();
  } catch (err) {
    console.log(`Failed to open project ${id}:`, err);
    disposeCalendar();
  }

  // Keep "most recently opened first" ordering up to date
  await refreshProjectsList();
}

// Primary overlay button: create or open, depending on the picker
async function onGetButtonClick() {
  if (!isReady) return;

  if (editingProject) {
    await saveEditedProject();
    return;
  }

  const selected = projectsInput.value;

  closeOverlay();

  if (selected.kind === 'new') {
    await newProject();
  } else {
    await openProject(selected.project.id);
  }

  showIntroIfNoCalendar();
}

/**
 * Delete the selected project with all of its images after confirmation;
 * the overlay stays open with the picker reset to "New"
 */
async function onDeleteButtonClick() {
  const selected = projectsInput.value;

  if (selected.kind !== 'project') return;

  const { id, name } = selected.project;

  if (!confirm(t('newProject.confirmDelete').replace('{name}', name))) return;

  const wasActive = dataController?.activeProjectId === id;

  try {
    await dataController?.deleteProject(id);
  } catch (err) {
    console.log(`Failed to delete project ${id}:`, err);
    return;
  }

  // The calendar behind the overlay no longer exists
  if (wasActive) {
    disposeCalendar();
  }

  await refreshProjectsList();
}

function newCalendar() {
  disposeCalendar();

  introSection.classList.add('hide');
  newProjectOverlayTriggerBtn.classList.remove('hide');
  controlsContainer.classList.remove('hide');

  activeCalendar = new Calendar(
    {
      calendarContainer,
      controlsContainer,
      cropControlsContainer,
    },
    dataController as DataController,
  );
}

/**
 * Tear down the current calendar and leave the app in the "no project" state
 */
function disposeCalendar() {
  activeCalendar?.dispose();
  activeCalendar = null;

  calendarContainer.innerHTML = '';
  controlsContainer.classList.add('hide');
  newProjectOverlayTriggerBtn.classList.add('hide');
}

// Keep an open calendar's language (month/weekday names) and the overlay's
// dynamic labels in sync with the app-wide language, since there's no
// separate per-calendar choice.
onLanguageChange(async (lang: AppLanguage) => {
  if (!isReady) return;

  syncSuggestedProjectName();
  onProjectPickerChange(projectsInput.value);

  if (!dataController?.calendarProjectData) return;

  try {
    await dataController.setLanguage(lang);
    newCalendar();
  } catch (err) {
    console.log('Failed to switch calendar language:', err);
  }
});

// Init
window.addEventListener(
  'DOMContentLoaded',
  async () => {
    // Apply the persisted/browser-detected app language to static UI text
    // before building anything else that reads translated strings.
    applyStaticTranslations();

    langSwitcherSelect.value = getLanguage();
    langSwitcherSelect.addEventListener('change', () => {
      setLanguage(langSwitcherSelect.value as AppLanguage);
    });

    userInputs = createDropdowns(syncSuggestedProjectName);
    syncSuggestedProjectName();

    projectsInput = createProjectsDropdown(onProjectPickerSelect);

    projectNameInput.addEventListener('input', () => {
      isProjectNameDirty = true;
    });

    // Disable calendar-creation entry points until fonts are loaded and the
    // last opened project has been restored.
    introCtaBtn.disabled = true;

    // Create or open a project from the picker
    getButton.addEventListener('click', onGetButtonClick);
    editButton.addEventListener('click', enterEditMode);
    deleteButton.addEventListener('click', onDeleteButtonClick);
    cancelButton.addEventListener('click', exitEditMode);

    // Animate new project overlay trigger button on hover
    newProjectOverlayTriggerBtn?.addEventListener('mouseenter', animateTriggerBtn);
    newProjectOverlayTriggerBtn?.addEventListener('mouseleave', animateTriggerBtn);

    // Animate & toggle new project container
    newProjectOverlayTriggerBtn?.addEventListener('click', onOverlayTriggerClick);
    // Open the project overlay from the intro screen
    introCtaBtn.addEventListener('click', onOverlayTriggerClick);
    // Closing the overlay while editing discards the edit
    newProjectOverlayCloseBtn.addEventListener('click', () => {
      exitEditMode();
      closeOverlay();
      showIntroIfNoCalendar();
    });

    // Init dataController
    dataController = new DataController();

    try {
      // Load fonts from /assets
      await dataController.loadFonts();

      // Reopen the most recently opened project, if any
      const restored = await dataController.restoreLastOpened();

      if (restored) {
        // Keep the restored project's language in sync with the current
        // app-wide language (e.g. it was changed since this project was saved).
        await dataController.setLanguage(getLanguage());

        newCalendar();
      }
    } catch (err) {
      console.log('Failed to initialize app:', err);
      disposeCalendar();
    } finally {
      isReady = true;
      introCtaBtn.disabled = false;
    }

    await refreshProjectsList();
  },
  { once: true },
);
