import opentype from 'opentype.js';

export default class FontsController {
  fonts: LoadedFontsObject = {};

  async loadFonts(src: SourceFontsData): Promise<void> {
    for (const [fontTitle, fontVariants] of Object.entries(src)) {
      const { fontNameBold, fontNameRegular } = fontVariants;
      const fontBoldBuffer = await fetch(`${import.meta.env.BASE_URL}${fontNameBold}.ttf`);
      const fontMeiumBuffer = await fetch(`${import.meta.env.BASE_URL}${fontNameRegular}.ttf`);

      const fonts = await Promise.all(
        [fontBoldBuffer, fontMeiumBuffer].map(async (res) => {
          const font = opentype.parse(await res.arrayBuffer());

          // Some fonts (e.g. Montserrat) ship GSUB lookup subtypes opentype.js
          // can't parse, which throws when rendering. We only need plain glyph
          // outlines here, so drop GSUB to skip ligature/contextual substitution.
          delete font.tables.gsub;

          return font;
        }),
      );

      this.fonts[fontTitle] = fonts;
    }
  }

  getFont(font: string): FontData {
    return {
      bold: this.fonts[font][0],
      regular: this.fonts[font][1],
    };
  }
}
