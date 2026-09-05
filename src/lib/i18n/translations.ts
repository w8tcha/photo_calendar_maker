import { AppLanguage } from '../../types';

export type TranslationKey =
  | 'app.pageTitle'
  | 'intro.title'
  | 'intro.subtitle'
  | 'intro.feature1'
  | 'intro.feature2'
  | 'intro.feature3'
  | 'intro.cta'
  | 'newProject.title'
  | 'newProject.singlePage'
  | 'newProject.multiPage'
  | 'newProject.create'
  | 'dropdown.startYear'
  | 'dropdown.firstMonth'
  | 'dropdown.font'
  | 'dropdown.format'
  | 'format.portrait'
  | 'format.landscape'
  | 'errors.createProjectFailed'
  | 'errors.uploadFailed'
  | 'tooltip.downloadCurrentPdf'
  | 'tooltip.downloadJpg'
  | 'tooltip.crop'
  | 'tooltip.upload'
  | 'tooltip.downloadAllPdf'
  | 'tooltip.prevMonth'
  | 'tooltip.nextMonth'
  | 'tooltip.uploadMultiple'
  | 'tooltip.newProject'
  | 'tooltip.closeModal'
  | 'tooltip.languageSwitcher';

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  [AppLanguage.EN]: 'English',
  [AppLanguage.DE]: 'Deutsch',
  [AppLanguage.RU]: 'Русский',
};

export const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  [AppLanguage.EN]: {
    'app.pageTitle': 'Photo Calendar Generator',
    'intro.title': 'Design your own photo calendar',
    'intro.subtitle':
      'Turn your favorite photos into a beautiful, printable calendar — right in your browser. Nothing is uploaded to a server, and no account is needed.',
    'intro.feature1': 'Add a photo for every month',
    'intro.feature2': 'Choose your layout & font',
    'intro.feature3': 'Export as PDF or JPG, ready to print',
    'intro.cta': 'Create your calendar',
    'newProject.title': 'New calendar',
    'newProject.singlePage': 'Single-page',
    'newProject.multiPage': 'Multi-page',
    'newProject.create': 'Create',
    'dropdown.startYear': 'Start year',
    'dropdown.firstMonth': 'First month',
    'dropdown.font': 'Font',
    'dropdown.format': 'Format',
    'format.portrait': 'portrait',
    'format.landscape': 'landscape',
    'errors.createProjectFailed': 'Failed to create the new calendar. Please try again.',
    'errors.uploadFailed': 'Failed to upload image. Please try a different file.',
    'tooltip.downloadCurrentPdf': 'Download this month as PDF',
    'tooltip.downloadJpg': 'Download this month as JPG',
    'tooltip.crop': 'Crop photo',
    'tooltip.upload': 'Upload photo',
    'tooltip.downloadAllPdf': 'Download entire calendar as PDF',
    'tooltip.prevMonth': 'Previous month',
    'tooltip.nextMonth': 'Next month',
    'tooltip.uploadMultiple': 'Upload photos for all months',
    'tooltip.newProject': 'Create new calendar',
    'tooltip.closeModal': 'Close',
    'tooltip.languageSwitcher': 'Language',
  },
  [AppLanguage.DE]: {
    'app.pageTitle': 'Fotokalender-Generator',
    'intro.title': 'Gestalte deinen eigenen Fotokalender',
    'intro.subtitle':
      'Verwandle deine Lieblingsfotos in einen schönen, druckfertigen Kalender – direkt in deinem Browser. Es wird nichts auf einen Server hochgeladen, und du brauchst kein Konto.',
    'intro.feature1': 'Ein Foto für jeden Monat hinzufügen',
    'intro.feature2': 'Layout & Schriftart wählen',
    'intro.feature3': 'Als PDF oder JPG exportieren, druckfertig',
    'intro.cta': 'Kalender erstellen',
    'newProject.title': 'Neuer Kalender',
    'newProject.singlePage': 'Einzelseite',
    'newProject.multiPage': 'Mehrseitig',
    'newProject.create': 'Erstellen',
    'dropdown.startYear': 'Startjahr',
    'dropdown.firstMonth': 'Erster Monat',
    'dropdown.font': 'Schriftart',
    'dropdown.format': 'Format',
    'format.portrait': 'Hochformat',
    'format.landscape': 'Querformat',
    'errors.createProjectFailed':
      'Der neue Kalender konnte nicht erstellt werden. Bitte versuche es erneut.',
    'errors.uploadFailed':
      'Das Bild konnte nicht hochgeladen werden. Bitte versuche eine andere Datei.',
    'tooltip.downloadCurrentPdf': 'Diesen Monat als PDF herunterladen',
    'tooltip.downloadJpg': 'Diesen Monat als JPG herunterladen',
    'tooltip.crop': 'Foto zuschneiden',
    'tooltip.upload': 'Foto hochladen',
    'tooltip.downloadAllPdf': 'Gesamten Kalender als PDF herunterladen',
    'tooltip.prevMonth': 'Vorheriger Monat',
    'tooltip.nextMonth': 'Nächster Monat',
    'tooltip.uploadMultiple': 'Fotos für alle Monate hochladen',
    'tooltip.newProject': 'Neuen Kalender erstellen',
    'tooltip.closeModal': 'Schließen',
    'tooltip.languageSwitcher': 'Sprache',
  },
  [AppLanguage.RU]: {
    'app.pageTitle': 'Генератор фотокалендаря',
    'intro.title': 'Создайте свой фотокалендарь',
    'intro.subtitle':
      'Превратите ваши любимые фотографии в красивый календарь для печати — прямо в браузере. Ничего не загружается на сервер, регистрация не требуется.',
    'intro.feature1': 'Добавьте фото на каждый месяц',
    'intro.feature2': 'Выберите макет и шрифт',
    'intro.feature3': 'Экспорт в PDF или JPG, готово к печати',
    'intro.cta': 'Создать календарь',
    'newProject.title': 'Новый календарь',
    'newProject.singlePage': 'Одна страница',
    'newProject.multiPage': 'Несколько страниц',
    'newProject.create': 'Создать',
    'dropdown.startYear': 'Год начала',
    'dropdown.firstMonth': 'Первый месяц',
    'dropdown.font': 'Шрифт',
    'dropdown.format': 'Формат',
    'format.portrait': 'книжная',
    'format.landscape': 'альбомная',
    'errors.createProjectFailed': 'Не удалось создать новый календарь. Попробуйте ещё раз.',
    'errors.uploadFailed': 'Не удалось загрузить изображение. Попробуйте другой файл.',
    'tooltip.downloadCurrentPdf': 'Скачать этот месяц в PDF',
    'tooltip.downloadJpg': 'Скачать этот месяц в JPG',
    'tooltip.crop': 'Обрезать фото',
    'tooltip.upload': 'Загрузить фото',
    'tooltip.downloadAllPdf': 'Скачать весь календарь в PDF',
    'tooltip.prevMonth': 'Предыдущий месяц',
    'tooltip.nextMonth': 'Следующий месяц',
    'tooltip.uploadMultiple': 'Загрузить фото для всех месяцев',
    'tooltip.newProject': 'Создать новый календарь',
    'tooltip.closeModal': 'Закрыть',
    'tooltip.languageSwitcher': 'Язык',
  },
};
