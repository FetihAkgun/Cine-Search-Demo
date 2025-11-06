console.log('[App.js] Script loaded, readyState:', document.readyState);

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeIcon();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeIcons = document.querySelectorAll('.theme-icon');
    themeIcons.forEach(icon => {
      if (this.theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
}

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'tr';
    this.apiLang = this.currentLang === 'tr' ? 'tr-TR' : 'en-US';
    this.translations = {
      tr: {
        movies: 'Filmler',
        series: 'Diziler',
        search: 'Ara',
        searchPlaceholder: 'Film Ara',
        searchSeriesPlaceholder: 'Dizi Ara',
        first: 'İlk',
        last: 'Son',
        actors: 'OYUNCULAR',
        gallery: 'GALERİ',
        similar: 'BENZER FİLMLER',
        recommendations: 'ÖNERİLEN FİLMLER',
        genres: 'Türler:',
        imdbRating: 'IMDb Puanı',
        minutes: 'dakika',
        theme: 'Tema',
        language: 'Dil',
        overview: 'Özet',
        releaseDate: 'Yayın Tarihi',
        runtime: 'Süre',
        revenue: 'Hasılat',
        noResults: 'Sonuç bulunamadı.',
        noVideo: 'Video bulunamadı',
        videoError: 'Video yüklenirken hata oluştu',
        trending: 'Trend Filmler',
        popular: 'Popüler Filmler',
        topRated: 'En İyi Filmler',
        nowPlaying: 'Şimdi Oynatılan Filmler',
        upcoming: 'Yakında Gelecek Filmler',
        allPopular: 'Tüm Popüler Filmler',
        onTheAir: 'Yayında Olan Diziler',
        airingToday: 'Bugün Yayınlanan Diziler'
      },
      en: {
        movies: 'Movies',
        series: 'TV Series',
        search: 'Search',
        searchPlaceholder: 'Search Movie',
        searchSeriesPlaceholder: 'Search Series',
        first: 'First',
        last: 'Last',
        actors: 'CAST',
        gallery: 'GALLERY',
        similar: 'SIMILAR MOVIES',
        recommendations: 'RECOMMENDED MOVIES',
        genres: 'Genres:',
        imdbRating: 'IMDb Rating',
        minutes: 'minutes',
        theme: 'Theme',
        language: 'Language',
        overview: 'Overview',
        releaseDate: 'Release Date',
        runtime: 'Runtime',
        revenue: 'Revenue',
        noResults: 'No results found.',
        noVideo: 'Video not available',
        videoError: 'Error loading video',
        trending: 'Trending Movies',
        popular: 'Popular Movies',
        topRated: 'Top Rated Movies',
        nowPlaying: 'Now Playing',
        upcoming: 'Upcoming Movies',
        allPopular: 'All Popular Movies',
        onTheAir: 'On The Air TV Shows',
        airingToday: 'Airing Today TV Shows'
      }
    };
    this.init();
  }

  init() {
    this.apiLang = this.currentLang === 'tr' ? 'tr-TR' : 'en-US';
    this.updateLanguageSelector();
    this.translatePage();
  }

  setLanguage(lang) {
    if (this.currentLang === lang) {
      return;
    }
    
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    this.translatePage();
    this.updateLanguageSelector();
    
    this.apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
    
    this.reloadContent();
  }
  
  getApiLanguage() {
    return this.apiLang;
  }
  
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  reloadContent() {
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { lang: this.currentLang, apiLang: this.getApiLanguage() } 
    }));
  }

  translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
        element.textContent = this.translations[this.currentLang][key];
      }
    });

    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
        element.placeholder = this.translations[this.currentLang][key];
      }
    });
  }

  updateLanguageSelector() {
    const selectors = document.querySelectorAll('.language-selector select');
    selectors.forEach(selector => {
      selector.value = this.currentLang;
    });
    
    document.querySelectorAll('.language-selector').forEach(container => {
      const button = container.querySelector('.language-selector-button');
      if (button) {
        button.innerHTML = `${this.currentLang.toUpperCase()} <span style="margin-left: 8px; opacity: 0.7;">▼</span>`;
      }
      
      const dropdown = container.querySelector('.language-selector-dropdown');
      if (dropdown) {
        const options = dropdown.querySelectorAll('.language-option');
        options.forEach(opt => {
          if (opt.dataset.value === this.currentLang) {
            opt.classList.add('active');
          } else {
            opt.classList.remove('active');
          }
        });
      }
    });
  }

  t(key) {
    return this.translations[this.currentLang][key] || key;
  }
}

const themeManager = new ThemeManager();
const languageManager = new LanguageManager();

window.themeManager = themeManager;
window.languageManager = languageManager;

document.addEventListener('DOMContentLoaded', () => {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(button => {
    button.addEventListener('click', () => {
      themeManager.toggle();
    });
  });

  function createCustomLanguageSelector() {
    const languageSelectors = document.querySelectorAll('.language-selector');
    
    languageSelectors.forEach(container => {
      const select = container.querySelector('select');
      if (!select) return;
      
      const currentLang = select.value;
      
      const button = document.createElement('button');
      button.className = 'language-selector-button';
      button.type = 'button';
      button.innerHTML = `${currentLang.toUpperCase()} <span style="margin-left: 8px; opacity: 0.7;">▼</span>`;
      
      const dropdown = document.createElement('div');
      dropdown.className = 'language-selector-dropdown';
      
      const options = Array.from(select.options);
      options.forEach(option => {
        const langOption = document.createElement('div');
        langOption.className = `language-option ${option.value === currentLang ? 'active' : ''}`;
        langOption.textContent = option.value.toUpperCase();
        langOption.dataset.value = option.value;
        
        langOption.addEventListener('click', () => {
          languageManager.setLanguage(option.value);
          updateLanguageSelectorUI(container, option.value);
          dropdown.classList.remove('show');
        });
        
        dropdown.appendChild(langOption);
      });
      
      select.style.display = 'none';
      container.appendChild(button);
      container.appendChild(dropdown);
      
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = dropdown.classList.contains('show');
        
        document.querySelectorAll('.language-selector-dropdown').forEach(dd => {
          dd.classList.remove('show');
        });
        document.querySelectorAll('.language-selector-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        if (!isActive) {
          dropdown.classList.add('show');
          button.classList.add('active');
        }
      });
      
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          dropdown.classList.remove('show');
          button.classList.remove('active');
        }
      });
    });
  }
  
  function updateLanguageSelectorUI(container, lang) {
    const button = container.querySelector('.language-selector-button');
    const dropdown = container.querySelector('.language-selector-dropdown');
    
    if (button) {
      button.innerHTML = `${lang.toUpperCase()} <span style="margin-left: 8px; opacity: 0.7;">▼</span>`;
    }
    
    if (dropdown) {
      const options = dropdown.querySelectorAll('.language-option');
      options.forEach(opt => {
        if (opt.dataset.value === lang) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }
  }
  
  createCustomLanguageSelector();
  
  window.addEventListener('languageChanged', (e) => {
    const { lang, apiLang } = e.detail;
    document.querySelectorAll('.language-selector').forEach(container => {
      updateLanguageSelectorUI(container, lang);
    });
    
    if (typeof reloadPageContent === 'function') {
      reloadPageContent(lang, apiLang);
    }
  });

  languageManager.translatePage();
  
  if (document.readyState === 'loading') {
  } else {
    languageManager.translatePage();
  }
});

window.addEventListener('load', () => {
  languageManager.translatePage();
});

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.mobile-bottom-nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href) {
      const hrefPage = href.split('/').pop() || 'index.html';
      item.classList.remove('active');
      if (currentPage === hrefPage || 
          (currentPage === 'index.html' && hrefPage === 'index.html') ||
          (currentPage.includes('detail') && !href.includes('detail')) ||
          (currentPage.includes('actor') && !href.includes('actor'))) {
        if (currentPage === hrefPage) {
          item.classList.add('active');
        }
      }
    }
  });
  
  if (currentPage === 'index.html' || currentPage === '') {
    const homeItem = document.querySelector('.mobile-bottom-nav-item[href*="index.html"]');
    if (homeItem) {
      document.querySelectorAll('.mobile-bottom-nav-item').forEach(item => item.classList.remove('active'));
      homeItem.classList.add('active');
    }
  }
  
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      if (window.themeManager) {
        window.themeManager.toggle();
      }
    });
  }
  
  const mobileLanguageButton = document.getElementById('mobileLanguageButton');
  const mobileLanguageDropdown = document.getElementById('mobileLanguageDropdown');
  const mobileLanguageItem = document.querySelector('.mobile-language-item');
  
  if (mobileLanguageButton && mobileLanguageDropdown && mobileLanguageItem) {
    mobileLanguageButton.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileLanguageItem.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!mobileLanguageItem.contains(e.target)) {
        mobileLanguageItem.classList.remove('active');
      }
    });
    
    const languageOptions = mobileLanguageDropdown.querySelectorAll('.mobile-language-option');
    languageOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        if (window.languageManager) {
          window.languageManager.setLanguage(lang);
        }
        languageOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        const langText = document.getElementById('mobileLanguageText');
        if (langText) {
          langText.textContent = lang.toUpperCase();
        }
        mobileLanguageItem.classList.remove('active');
      });
    });
    
    if (window.languageManager) {
      const currentLang = window.languageManager.getCurrentLanguage();
      languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
          option.classList.add('active');
          const langText = document.getElementById('mobileLanguageText');
          if (langText) {
            langText.textContent = currentLang.toUpperCase();
          }
        }
      });
    }
  }
  
  function initMobileSearchModal() {
    console.log('[Mobile Search] Initializing mobile search modal...');
    
    const mobileSearchButton = document.getElementById('mobileSearchButton');
    const mobileSearchModal = document.getElementById('mobileSearchModal');
    const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
    const mobileSearchClose = document.getElementById('mobileSearchClose');
    const mobileSearchForm = document.getElementById('mobileSearchForm');

    console.log('[Mobile Search] Elements found:', {
      button: !!mobileSearchButton,
      modal: !!mobileSearchModal,
      overlay: !!mobileSearchOverlay,
      close: !!mobileSearchClose,
      form: !!mobileSearchForm
    });

    if (!mobileSearchButton) {
      console.error('[Mobile Search] ERROR: mobileSearchButton not found!');
      return;
    }

    if (!mobileSearchModal) {
      console.error('[Mobile Search] ERROR: mobileSearchModal not found!');
      return;
    }

    function openMobileSearch() {
      console.log('[Mobile Search] Opening modal...');
      try {
        mobileSearchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('[Mobile Search] Modal opened, classList:', mobileSearchModal.classList.toString());
        
        setTimeout(() => {
          const input = document.getElementById('mobileSearchInput');
          if (input) {
            input.focus();
            input.select();
            console.log('[Mobile Search] Input focused');
          } else {
            console.warn('[Mobile Search] Input not found for focus');
          }
        }, 300);
      } catch (error) {
        console.error('[Mobile Search] Error opening modal:', error);
      }
    }

    function closeMobileSearch() {
      console.log('[Mobile Search] Closing modal...');
      try {
        mobileSearchModal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('[Mobile Search] Modal closed');
      } catch (error) {
        console.error('[Mobile Search] Error closing modal:', error);
      }
    }

    mobileSearchButton.addEventListener('click', (e) => {
      console.log('[Mobile Search] Button clicked!');
      e.preventDefault();
      e.stopPropagation();
      openMobileSearch();
    });

    if (mobileSearchOverlay) {
      mobileSearchOverlay.addEventListener('click', (e) => {
        console.log('[Mobile Search] Overlay clicked');
        e.stopPropagation();
        closeMobileSearch();
      });
    } else {
      console.warn('[Mobile Search] Overlay not found');
    }

    if (mobileSearchClose) {
      mobileSearchClose.addEventListener('click', (e) => {
        console.log('[Mobile Search] Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        closeMobileSearch();
      });
    } else {
      console.warn('[Mobile Search] Close button not found');
    }

    if (mobileSearchForm) {
      mobileSearchForm.addEventListener('submit', (e) => {
        console.log('[Mobile Search] Form submitted');
        e.preventDefault();
        e.stopPropagation();
        
        const input = document.getElementById('mobileSearchInput');
        const typeRadio = mobileSearchForm.querySelector('input[name="searchType"]:checked');
        const type = typeRadio ? typeRadio.value : 'movie';
        
        console.log('[Mobile Search] Input value:', input?.value);
        console.log('[Mobile Search] Search type:', type);
        
        if (input && input.value.trim()) {
          const query = input.value.trim();
          console.log('[Mobile Search] Redirecting to search page with query:', query);
          closeMobileSearch();
          setTimeout(() => {
            window.location.href = `/search.html?query=${encodeURIComponent(query)}&type=${type}&page=1`;
          }, 200);
        } else {
          console.warn('[Mobile Search] No query entered');
        }
      });
    } else {
      console.warn('[Mobile Search] Form not found');
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileSearchModal.classList.contains('active')) {
        console.log('[Mobile Search] ESC key pressed');
        closeMobileSearch();
      }
    });

    console.log('[Mobile Search] Initialization complete!');
  }

  try {
    initMobileSearchModal();
  } catch (error) {
    console.error('[Mobile Search] Fatal error during initialization:', error);
  }
});

function initMobileSearchDirect() {
  console.log('[Mobile Search Direct] Starting direct initialization...');
  console.log('[Mobile Search Direct] Document readyState:', document.readyState);
  
  try {
    const mobileSearchButton = document.getElementById('mobileSearchButton');
    const mobileSearchModal = document.getElementById('mobileSearchModal');
    
    console.log('[Mobile Search Direct] Elements check:', {
      button: !!mobileSearchButton,
      modal: !!mobileSearchModal,
      buttonElement: mobileSearchButton,
      modalElement: mobileSearchModal
    });
    
    if (mobileSearchButton && mobileSearchModal) {
      console.log('[Mobile Search Direct] Both elements found, setting up event listeners...');
      
      const overlay = document.getElementById('mobileSearchOverlay');
      const close = document.getElementById('mobileSearchClose');
      const form = document.getElementById('mobileSearchForm');

      function openMobileSearch() {
        console.log('[Mobile Search Direct] Opening modal...');
        mobileSearchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          const input = document.getElementById('mobileSearchInput');
          if (input) {
            input.focus();
            input.select();
            console.log('[Mobile Search Direct] Input focused');
          }
        }, 300);
      }

      function closeMobileSearch() {
        console.log('[Mobile Search Direct] Closing modal...');
        mobileSearchModal.classList.remove('active');
        document.body.style.overflow = '';
      }

      mobileSearchButton.addEventListener('click', function(e) {
        console.log('[Mobile Search Direct] BUTTON CLICKED!!! Event:', e);
        e.preventDefault();
        e.stopPropagation();
        openMobileSearch();
      }, true);

      mobileSearchButton.addEventListener('mousedown', function(e) {
        console.log('[Mobile Search Direct] Button mousedown!');
      });
      
      mobileSearchButton.addEventListener('touchstart', function(e) {
        console.log('[Mobile Search Direct] Button touchstart!');
        e.preventDefault();
        openMobileSearch();
      });

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          e.stopPropagation();
          closeMobileSearch();
        });
      }

      if (close) {
        close.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeMobileSearch();
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          console.log('[Mobile Search Direct] Form submitted');
          e.preventDefault();
          e.stopPropagation();
          
          const input = document.getElementById('mobileSearchInput');
          const typeRadio = form.querySelector('input[name="searchType"]:checked');
          const type = typeRadio ? typeRadio.value : 'movie';
          
          if (input && input.value.trim()) {
            const query = input.value.trim();
            closeMobileSearch();
            setTimeout(() => {
              window.location.href = `/search.html?query=${encodeURIComponent(query)}&type=${type}&page=1`;
            }, 200);
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileSearchModal.classList.contains('active')) {
          closeMobileSearch();
        }
      });

      console.log('[Mobile Search Direct] Direct initialization complete!');
    } else {
      console.error('[Mobile Search Direct] ERROR - Elements not found:', {
        button: !!mobileSearchButton,
        modal: !!mobileSearchModal
      });
    }
  } catch (error) {
    console.error('[Mobile Search Direct] Fatal error:', error);
  }
}

if (document.readyState === 'loading') {
  console.log('[Mobile Search] Document still loading, will init on DOMContentLoaded');
} else {
  console.log('[Mobile Search] Document already loaded, initializing directly...');
  setTimeout(() => {
    initMobileSearchDirect();
  }, 100);
}

window.addEventListener('load', () => {
  console.log('[Mobile Search] Window loaded, initializing...');
  setTimeout(() => {
    initMobileSearchDirect();
  }, 100);
});

function initPageLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.id = 'pageLoader';
  loader.innerHTML = `
    <div class="page-loader-logo">Cine Search</div>
    <div class="page-loader-spinner"></div>
    <div class="page-loader-text">Yükleniyor...</div>
  `;
  document.body.appendChild(loader);
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 800);
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .content-row, .fade-in-stagger'
  );
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });

  const cards = document.querySelectorAll('.movie-card, .movie-card-large, .card');
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.05}s`;
    observer.observe(card);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    setTimeout(initScrollAnimations, 100);
  });
} else {
  initPageLoader();
  setTimeout(initScrollAnimations, 100);
}

document.addEventListener('contentLoaded', () => {
  setTimeout(initScrollAnimations, 100);
});


function initParallaxEffect() {
  const heroBackdrop = document.getElementById('heroBackdrop');
  const detailBackdrop = document.getElementById('detailBackdrop');
  
  if (heroBackdrop) {
    let ticking = false;
    
    function updateParallax() {
      const heroSection = heroBackdrop.closest('.hero-section');
      
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
          const parallaxSpeed = 0.4;
          const parallaxOffset = scrollTop * parallaxSpeed;
          heroBackdrop.style.transform = `translateY(${parallaxOffset}px)`;
        }
      }
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    
    // Initial call
    updateParallax();
  }
  
  if (detailBackdrop) {
    let ticking = false;
    
    function updateDetailParallax() {
      const detailHero = detailBackdrop.closest('.detail-hero');
      
      if (detailHero) {
        const detailRect = detailHero.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (detailRect.bottom > 0 && detailRect.top < window.innerHeight) {
          const parallaxSpeed = 0.35;
          const parallaxOffset = scrollTop * parallaxSpeed;
          detailBackdrop.style.transform = `translateY(${parallaxOffset}px)`;
        }
      }
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDetailParallax);
        ticking = true;
      }
    }, { passive: true });
    
    // Initial call
    updateDetailParallax();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initParallaxEffect, 300);
    initDragToScroll();
  });
} else {
  setTimeout(initParallaxEffect, 300);
  initDragToScroll();
}

function initDragToScroll() {
  const movieRows = document.querySelectorAll('.movies-row');
  
  movieRows.forEach(row => {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    row.addEventListener('mousedown', (e) => {
      isDown = true;
      row.style.cursor = 'grabbing';
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      row.style.userSelect = 'none';
    });
    
    row.addEventListener('mouseleave', () => {
      isDown = false;
      row.style.cursor = 'grab';
      row.style.userSelect = 'auto';
    });
    
    row.addEventListener('mouseup', () => {
      isDown = false;
      row.style.cursor = 'grab';
      row.style.userSelect = 'auto';
    });
    
    row.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX) * 2;
      row.scrollLeft = scrollLeft - walk;
    });
    
    let touchStartX = 0;
    let scrollLeftTouch = 0;
    
    row.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - row.offsetLeft;
      scrollLeftTouch = row.scrollLeft;
    }, { passive: true });
    
    row.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const x = e.touches[0].pageX - row.offsetLeft;
      const walk = (x - touchStartX) * 2;
      row.scrollLeft = scrollLeftTouch - walk;
    }, { passive: true });
    
    row.style.cursor = 'grab';
  });
}

