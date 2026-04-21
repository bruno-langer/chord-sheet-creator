# Song Configurator - i18n Implementation

This project now supports internationalization (i18n) using i18next, allowing users to switch between multiple languages.

## Supported Languages

- **Portuguese (pt)** - Default language
- **English (en)**
- **Spanish (es)**

## How It Works

### Files Structure

```
cifra_song_configurator/
├── cifra_song_configurator.html    # Main HTML with data-i18n attributes
├── cifra_song_configurator.js      # JavaScript with i18n integration
├── cifra_song_configurator.css     # Styling (unchanged)
├── i18n-config.js                  # i18next configuration and initialization
└── locales.json                    # Translation files for all languages
```

### Key Components

1. **i18n-config.js**: Loads i18next from CDN and initializes translations
2. **locales.json**: Contains all translation strings organized by language
3. **HTML data-i18n attributes**: Mark elements that should be translated
4. **JavaScript i18next.t() calls**: Translate strings programmatically

### Usage

#### For Users
- Use the language selector dropdown in the top-right corner
- Language preference is saved in localStorage
- All UI elements update immediately when language changes

#### For Developers

##### Adding New Translations

1. **Update locales.json**:
```json
{
  "en": { "translation": { "newKey": "New text" } },
  "pt": { "translation": { "newKey": "Novo texto" } },
  "es": { "translation": { "newKey": "Nuevo texto" } }
}
```

2. **Add to HTML**:
```html
<span data-i18n="newKey">Fallback text</span>
```

3. **Use in JavaScript**:
```javascript
const text = i18next.t('newKey');
```

##### Dynamic Content

For select options and dynamic content:
```html
<select data-i18n-options="sections.types">
  <!-- Options populated automatically -->
</select>
```

##### Interpolation

```javascript
i18next.t('viewer.songCounter', { current: 1, total: 5 });
// Output: "Song 1 of 5" (English) or "Música 1 de 5" (Portuguese)
```

### Translation Keys Structure

```
app.*           - Application-wide strings
songs.*         - Song management related
sections.*      - Section editing related
actions.*       - Button labels and actions
output.*        - Export/output related
preview.*       - Preview panel strings
viewer.*        - Exported HTML viewer strings
```

### Adding New Languages

1. Add new language object to `locales.json`
2. Update the language selector in `cifra_song_configurator.html`
3. Add language option to `i18n-config.js` if needed

### Best Practices

- Use descriptive, hierarchical keys
- Provide meaningful fallback text in HTML
- Test all languages for layout issues
- Keep translations consistent across languages
- Use interpolation for dynamic content instead of string concatenation

### Browser Support

- Modern browsers with ES6 support
- i18next loads from CDN automatically
- Fallback to Portuguese if i18next fails to load

### Performance

- Translations loaded once on page load
- Language switching is instant (no server requests)
- Minimal impact on bundle size