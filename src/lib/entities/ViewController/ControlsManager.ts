import { icons } from '../../../assets/icons';
import { createHTMLElement } from '../../utils/DOM/createElement/createHTMLElement';
import { t } from '../../i18n/i18n';
import { TranslationKey } from '../../i18n/translations';

// Icon-only controls have no visible label, so give them both an accessible
// name (aria-label) and a CSS-only visual tooltip (data-tooltip) driven by
// the same translation. `pos` anchors the tooltip for elements flush against
// a screen edge, where the default centered-above placement would clip.
function tooltipAttrs(key: TranslationKey, pos?: 'left' | 'right'): Record<string, string> {
  const label = t(key);
  const attrs: Record<string, string> = { 'aria-label': label, 'data-tooltip': label };
  if (pos) attrs['data-tooltip-pos'] = pos;
  return attrs;
}

export type ControlsCallbacks = {
  onDownloadCurrentPdf: () => void;
  onDownloadJpg: () => void;
  onCrop: () => void;
  onUploadImage: (event: InputEvent) => void;
};

export type MultiPageViewControllsCallbacks = {
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export type MultiPageControlsCallbacks = ControlsCallbacks & {
  onDownloadAllPdf: () => void;
  onUploadMultipleImages: (event: Event) => void;
};

export abstract class ControlsManager {
  constructor(
    protected controlsContainer: HTMLDivElement,
    protected imagesContainers: SVGGElement[],
  ) {}

  init(): void {
    this.controlsContainer.innerHTML = '';
    this.createControls();
    this.bindEvents();
  }

  protected abstract createControls(): void;
  protected abstract bindEvents(): void;
}

export class BasicControlsManager extends ControlsManager {
  currentPDFDownloadBtn!: HTMLButtonElement;
  jpgDownloadBtn!: HTMLButtonElement;
  cropBtn!: HTMLButtonElement;
  uploadImgInput!: HTMLInputElement;
  uploadImgBtn!: HTMLLabelElement;

  constructor(
    controlsContainer: HTMLDivElement,
    protected imagesContainers: SVGGElement[],
    protected callbacks: ControlsCallbacks,
  ) {
    super(controlsContainer, imagesContainers);
  }

  protected createControls(): void {
    this.currentPDFDownloadBtn = createHTMLElement({
      elementName: 'button',
      parentToAppend: this.controlsContainer,
      id: 'pdf-download-current',
      content: icons.pdfSingle,
      attributes: tooltipAttrs('tooltip.downloadCurrentPdf'),
    });

    this.jpgDownloadBtn = createHTMLElement({
      elementName: 'button',
      parentToAppend: this.controlsContainer,
      id: 'jpg-download',
      content: icons.jpg,
      attributes: tooltipAttrs('tooltip.downloadJpg'),
    });

    this.cropBtn = createHTMLElement({
      elementName: 'button',
      id: 'crop-btn',
      content: icons.crop,
      parentToAppend: this.controlsContainer,
      attributes: tooltipAttrs('tooltip.crop'),
    });

    this.uploadImgInput = createHTMLElement({
      elementName: 'input',
      id: 'upload-input',
      parentToAppend: this.controlsContainer,
      attributes: {
        type: 'file',
        accept: 'image/jpeg, image/png, image/jpg',
        hidden: 'true',
        onclick: 'this.value=null;',
      },
    });

    this.uploadImgBtn = createHTMLElement({
      elementName: 'label',
      id: 'upload-btn',
      content: icons.upload,
      className: 'upload-btn',
      parentToAppend: this.controlsContainer,
      attributes: {
        for: 'upload-input',
        ...tooltipAttrs('tooltip.upload'),
      },
    });
  }

  protected bindEvents(): void {
    this.currentPDFDownloadBtn.addEventListener('click', () => {
      this.callbacks.onDownloadCurrentPdf();
    });

    this.jpgDownloadBtn.addEventListener('click', () => {
      this.callbacks.onDownloadJpg();
    });

    this.cropBtn.addEventListener('click', () => {
      this.callbacks.onCrop();
    });

    this.uploadImgInput.addEventListener('input', (event) => {
      this.callbacks.onUploadImage(event as InputEvent);
    });

    this.imagesContainers.forEach((g) => {
      g.addEventListener('click', () => {
        // Check if image uploaded...
        const imageInGroup = g.querySelector('image');
        if (imageInGroup) {
          // ...if uploaded - get the Cropper
          this.callbacks.onCrop();
        } else {
          // ...if not - upload it
          this.uploadImgInput.click();
        }
      });
    });
  }
}

export class MultiPageControlsManager extends BasicControlsManager {
  prevBtn!: HTMLButtonElement;
  nextBtn!: HTMLButtonElement;
  allPDFDownloadBtn!: HTMLButtonElement;
  multipleImagesInput!: HTMLInputElement;
  uploadMultipleImgsBtn!: HTMLLabelElement;

  constructor(
    controlsContainer: HTMLDivElement,
    protected imagesContainers: SVGGElement[],
    protected callbacks: MultiPageControlsCallbacks,
    protected viewCallbacks: MultiPageViewControllsCallbacks,
  ) {
    super(controlsContainer, imagesContainers, callbacks);
  }

  protected createControls(): void {
    super.createControls();
    this.allPDFDownloadBtn = createHTMLElement({
      elementName: 'button',
      id: 'pdf-download-all',
      className: 'multiple-btn',
      content: icons.pdfMulti,
      attributes: tooltipAttrs('tooltip.downloadAllPdf'),
      insertTo: {
        element: this.controlsContainer,
        position: 'afterbegin',
      },
    });

    this.prevBtn = createHTMLElement({
      elementName: 'button',
      id: 'prev-month',
      className: 'nav-btn',
      content: icons.prev,
      attributes: tooltipAttrs('tooltip.prevMonth', 'right'),
      insertTo: {
        element: this.controlsContainer,
        position: 'afterbegin',
      },
    });

    this.multipleImagesInput = createHTMLElement({
      elementName: 'input',
      id: 'upload-multiple-input',
      attributes: {
        type: 'file',
        multiple: 'multiple',
        hidden: 'true',
        accept: 'image/jpeg, image/png, image/jpg',
        onclick: 'this.value=null;',
      },
      insertTo: {
        element: this.controlsContainer,
        position: 'beforeend',
      },
    });

    this.uploadMultipleImgsBtn = createHTMLElement({
      elementName: 'label',
      id: 'upload-multiple',
      className: 'multiple-btn',
      content: icons.uploadMulti,
      attributes: {
        for: 'upload-multiple-input',
        ...tooltipAttrs('tooltip.uploadMultiple'),
      },
      insertTo: {
        element: this.controlsContainer,
        position: 'beforeend',
      },
    });

    this.nextBtn = createHTMLElement({
      elementName: 'button',
      id: 'next-month',
      className: 'nav-btn',
      content: icons.next,
      attributes: tooltipAttrs('tooltip.nextMonth', 'left'),
      insertTo: {
        element: this.controlsContainer,
        position: 'beforeend',
      },
    });
  }

  protected bindEvents(): void {
    super.bindEvents();

    this.prevBtn.addEventListener('click', () => {
      this.viewCallbacks.onPrevMonth();
    });

    this.nextBtn.addEventListener('click', () => {
      this.viewCallbacks.onNextMonth();
    });

    this.allPDFDownloadBtn.addEventListener('click', () => {
      this.callbacks.onDownloadAllPdf();
    });

    this.multipleImagesInput.addEventListener('change', (event) => {
      this.callbacks.onUploadMultipleImages(event);
    });
  }
}
