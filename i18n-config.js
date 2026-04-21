// i18n-config.js - i18next configuration for vanilla JS
(function() {
  // Translations embedded directly (since we can't use import in script tags)
  const resources = {
    en: {
      translation: {
        app: {
          title: "Chord Song Configurator",
          description: "Build sections and export HTML"
        },
        songs: {
          label: "Songs",
          new: "+ New",
          newSong: "New Song",
          title: "Song title",
          key: "Key",
          sections: "sections",
          minSongsError: "You must have at least one song"
        },
        sections: {
          add: "+ Add section",
          repeat: "Repeat",
          placeholder: "Chords, one line per row…",
          empty: "(empty)",
          types: {
            intro: "Intro",
            verse: "Verse",
            pre: "Pre-chorus",
            chorus: "Chorus",
            bridge: "Bridge"
          }
        },
        actions: {
          export: "Export HTML",
          copy: "Copy",
          copied: "Copied!"
        },
        output: {
          label: "Generated HTML"
        },
        preview: {
          title: "Preview",
          keyLabel: "Key:"
        },
        viewer: {
          title: "Chord Viewer",
          songCounter: "Song {{current}} of {{total}}"
        }
      }
    },
    pt: {
      translation: {
        app: {
          title: "Configurador de Cifras",
          description: "Construa seções e exporte HTML"
        },
        songs: {
          label: "Músicas",
          new: "+ Nova",
          newSong: "Nova Música",
          title: "Título da música",
          key: "Tom",
          sections: "seções",
          minSongsError: "Você deve ter pelo menos uma música"
        },
        sections: {
          add: "+ Adicionar seção",
          repeat: "Repetir",
          placeholder: "Acordes, uma linha por fileira…",
          empty: "(vazio)",
          types: {
            intro: "Introdução",
            verse: "Verso",
            pre: "Pré-refrão",
            chorus: "Refrão",
            bridge: "Ponte"
          }
        },
        actions: {
          export: "Exportar HTML",
          copy: "Copiar",
          copied: "Copiado!"
        },
        output: {
          label: "HTML Gerado"
        },
        preview: {
          title: "Visualização",
          keyLabel: "Tom:"
        },
        viewer: {
          title: "Visualizador de Cifras",
          songCounter: "Música {{current}} de {{total}}"
        }
      }
    },
    es: {
      translation: {
        app: {
          title: "Configurador de Acordes",
          description: "Construye secciones y exporta HTML"
        },
        songs: {
          label: "Canciones",
          new: "+ Nueva",
          newSong: "Nueva Canción",
          title: "Título de la canción",
          key: "Tonalidad",
          sections: "secciones",
          minSongsError: "Debes tener al menos una canción"
        },
        sections: {
          add: "+ Agregar sección",
          repeat: "Repetir",
          placeholder: "Acordes, una línea por fila…",
          empty: "(vacío)",
          types: {
            intro: "Introducción",
            verse: "Verso",
            pre: "Pre-estribillo",
            chorus: "Estribillo",
            bridge: "Puente"
          }
        },
        actions: {
          export: "Exportar HTML",
          copy: "Copiar",
          copied: "¡Copiado!"
        },
        output: {
          label: "HTML Generado"
        },
        preview: {
          title: "Vista previa",
          keyLabel: "Tonalidad:"
        },
        viewer: {
          title: "Visor de Acordes",
          songCounter: "Canción {{current}} de {{total}}"
        }
      }
    }
  };

  // Load i18next from CDN synchronously
  function loadI18next(callback) {
    if (window.i18next) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/i18next@23.7.6/dist/umd/i18next.min.js';
    script.onload = function() {
      initI18n(callback);
    };
    script.onerror = function() {
      console.warn('Failed to load i18next, falling back to Portuguese');
      // Fallback: make a basic i18next-like object available
      window.i18next = {
        t: function(key) {
          // Simple fallback that returns Portuguese translations
          const keys = key.split('.');
          let value = resources.pt.translation;
          for (const k of keys) {
            value = value && value[k];
          }
          return value || key;
        },
        language: 'pt',
        changeLanguage: function() {}
      };
      callback();
    };
    document.head.appendChild(script);
  }

  function initI18n(callback) {
    i18next.init({
      lng: getSavedLanguage() || 'pt',
      fallbackLng: 'pt',
      resources,
      interpolation: {
        escapeValue: false
      }
    }, function(err, t) {
      if (err) {
        console.warn('i18next initialization error:', err);
      }
      updateUI();
      if (callback) callback();
    });
  }

  function getSavedLanguage() {
    return localStorage.getItem('language') || null;
  }

  function setSavedLanguage(lang) {
    localStorage.setItem('language', lang);
  }

  // Function to change language
  window.changeLanguage = function(lang) {
    if (window.i18next && window.i18next.changeLanguage) {
      i18next.changeLanguage(lang, function(err, t) {
        if (!err) {
          setSavedLanguage(lang);
          updateUI();
          document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
          }));
        }
      });
    }
  };

  // Function to update all UI elements with translations
  function updateUI() {
    if (!window.i18next) return;

    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = i18next.t(key);
      if (el.tagName === 'INPUT' && el.type === 'text') {
        if (!el.dataset.i18nProcessed) {
          el.placeholder = translation;
          el.dataset.i18nProcessed = 'true';
        }
      } else if (el.tagName === 'TEXTAREA') {
        if (!el.dataset.i18nProcessed) {
          el.placeholder = translation;
          el.dataset.i18nProcessed = 'true';
        }
      } else {
        el.textContent = translation;
      }
    });

    // Update select options
    document.querySelectorAll('[data-i18n-options]').forEach(select => {
      const optionsKey = select.getAttribute('data-i18n-options');
      const options = i18next.t(optionsKey, { returnObjects: true });
      if (options && typeof options === 'object') {
        const currentValue = select.value;
        select.innerHTML = '';
        Object.entries(options).forEach(([value, text]) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = text;
          if (value === currentValue) option.selected = true;
          select.appendChild(option);
        });
      }
    });

    // Update language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
      langSelect.value = i18next.language;
    }
  }

  // Expose updateUI function globally
  window.updateI18nUI = updateUI;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadI18next();
    });
  } else {
    loadI18next();
  }

})();