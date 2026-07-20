// FreshNews Client JavaScript
document.addEventListener('DOMContentLoaded', () => {
  
  // --- STATE MANAGEMENT ---
  const state = {
    language: localStorage.getItem('freshnews_lang') || 'malayalam',
    theme: localStorage.getItem('freshnews_theme') || 'light',
    currentView: 'feed', // 'feed', 'videos', 'deals', 'menu'
    articles: []
  };

  // --- DOM SELECTORS ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const fabRefreshBtn = document.getElementById('fab-refresh-btn');
  
  const newsFeedContainer = document.getElementById('news-feed-container');
  const tickerStatusText = document.getElementById('ticker-status-text');
  
  // Navigation elements
  const navButtons = {
    malayalam: document.getElementById('nav-btn-malayalam'),
    hindi: document.getElementById('nav-btn-hindi'),
    english: document.getElementById('nav-btn-english'),
    tamil: document.getElementById('nav-btn-tamil'),
    kannada: document.getElementById('nav-btn-kannada'),
    menu: document.getElementById('nav-btn-menu')
  };

  // Overlay Sub-views
  const overlays = {
    menu: document.getElementById('menu-view-overlay')
  };

  // Settings elements
  const themeSelect = document.getElementById('settings-theme-select');

  // --- INIT APPLICATION ---
  function init() {
    // Check for deep link language parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    const validLangs = ['malayalam', 'english', 'hindi', 'tamil', 'kannada', 'marathi'];
    if (langParam && validLangs.includes(langParam)) {
        state.language = langParam;
    }

    applyTheme(state.theme);
    applyLanguage(state.language);
    setupEventListeners();
    fetchNews();
  }

  // --- THEME ENGINE ---
  function applyTheme(newTheme) {
    state.theme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('freshnews_theme', newTheme);
    themeSelect.value = newTheme;

    // Update Header Toggle Icon
    if (newTheme === 'dark') {
      themeToggleIcon.innerHTML = `
        <!-- Sun Icon -->
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41zM5.99 16.95l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
        </svg>
      `;
    } else {
      themeToggleIcon.innerHTML = `
        <!-- Moon Icon -->
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.5-.1 1 .2 1.2.7.2.5.1 1.1-.3 1.4-1.6 1.3-2.5 3.3-2.5 5.5 0 3.9 3.2 7.1 7.1 7.1 2.2 0 4.2-.9 5.5-2.5.3-.4.9-.5 1.4-.3.5.2.8.7.7 1.2-.9 4.7-5 8.2-9.8 8.2z"/>
        </svg>
      `;
    }
  }

  // --- LANGUAGE ENGINE ---
  function applyLanguage(lang) {
    state.language = lang;
    localStorage.setItem('freshnews_lang', lang);
    
    // Update tickers
    const strings = {
      malayalam: 'Updates every 15 mins | Refresh to load latest',
      english: 'Updates every 15 mins | Refresh to load latest',
      hindi: 'हर 15 मिनट में अपडेट | नवीनतम लोड करने के लिए रीफ्रेश करें',
      tamil: '15 நிமிடத்திற்கு ஒருமுறை புதுப்பிக்கப்படும்',
      kannada: 'ಪ್ರತಿ 15 ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ ನವೀಕರಿಸಲಾಗುತ್ತದೆ',
      marathi: 'दर 15 मिनिटांनी अपडेट केले जाते'
    };
    tickerStatusText.textContent = strings[lang] || strings.english;
    
    // Update language scroll pills
    document.querySelectorAll('.lang-pill').forEach(pill => {
      if (pill.dataset.lang === lang) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Theme icon toggle in header
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });

    // Theme selector dropdown in menu
    themeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });

    // Language pills below header
    const langPills = document.querySelectorAll('.lang-pill');
    langPills.forEach(pill => {
      pill.addEventListener('click', () => {
        applyLanguage(pill.dataset.lang);
        switchView('feed');
        fetchNews();
      });
    });

    // Horizontal Scroll Arrows for Desktop
    const scrollMenu = document.getElementById('lang-scroll-menu');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    
    if (scrollLeftBtn && scrollRightBtn && scrollMenu) {
      scrollLeftBtn.addEventListener('click', () => {
        scrollMenu.scrollBy({ left: -150, behavior: 'smooth' });
      });
      scrollRightBtn.addEventListener('click', () => {
        scrollMenu.scrollBy({ left: 150, behavior: 'smooth' });
      });
    }

    // FAB Manual Refresh
    fabRefreshBtn.addEventListener('click', () => {
      // Rotation animation
      fabRefreshBtn.classList.add('spinning');
      fetchNews(() => {
        setTimeout(() => {
          fabRefreshBtn.classList.remove('spinning');
        }, 600);
      });
    });

    // Navigation Tab Taps
    Object.entries(navButtons).forEach(([key, btn]) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        // Remove active class from all navs
        Object.values(navButtons).forEach(b => b && b.classList.remove('active'));
        
        // Add active to current
        btn.classList.add('active');

        // Handle navigation target
        if (btn.dataset.lang) {
          // Language click handles feed switches
          applyLanguage(btn.dataset.lang);
          switchView('feed');
          fetchNews();
        } else if (btn.dataset.view) {
          // View overlay click handles view switches
          switchView(btn.dataset.view);
        }
      });
    });
  }

  // --- VIEW CONTROLLER ---
  function switchView(viewName) {
    state.currentView = viewName;
    
    // Hide all sub-view overlays
    Object.values(overlays).forEach(overlay => {
      if (overlay) overlay.classList.remove('active');
    });

    // Show selected overlay if it exists
    if (viewName !== 'feed' && overlays[viewName]) {
      overlays[viewName].classList.add('active');
      fabRefreshBtn.style.display = 'none'; // hide FAB for settings/videos
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    } else {
      // Show main feed
      fabRefreshBtn.style.display = 'flex';
    }

    // Ensure nav items reflect active view
    Object.entries(navButtons).forEach(([key, btn]) => {
      if (!btn) return;
      
      const isLangBtn = btn.dataset.lang !== undefined;
      
      if (viewName === 'feed') {
        if (isLangBtn && btn.dataset.lang === state.language) {
          btn.classList.add('active');
        } else if (!isLangBtn) {
          btn.classList.remove('active');
        }
      } else {
        if (!isLangBtn && btn.dataset.view === viewName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }

  // --- NEWS SERVICES & FETCHING ---
  function fetchNews(callback = null) {
    showLoading();
    
    // Fetch live news directly from GitHub's unlimited raw content servers to bypass Cloudflare build limits!
    // Adding a timestamp query param to completely bypass raw.githubusercontent caching
    const cacheBuster = new Date().getTime();
    const feedUrl = `https://raw.githubusercontent.com/dealstrip/freshnews-app/main/www/feeds/${state.language}.json?_t=${cacheBuster}`;

    fetch(feedUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network file not found');
        }
        return response.json();
      })
      .then(data => {
        state.articles = data;
        renderNews();
        if (callback) callback();
      })
      .catch(error => {
        console.error('Fetch error:', error);
        renderError();
        if (callback) callback();
      });
  }

  function showLoading() {
    newsFeedContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.22" />
        </svg>
        <p>Loading news briefs...</p>
      </div>
    `;
  }

  function renderError() {
    const errorMessages = {
      malayalam: 'വാർത്തകൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
      english: 'Could not load news feeds. Please check your connection and retry.',
      hindi: 'समाचार लोड नहीं किए जा सके। कृपया पुनः प्रयास करें।',
      tamil: 'செய்திகளை ஏற்ற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
      kannada: 'ಸುದ್ದಿ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
      marathi: 'बातम्या लोड होऊ शकल्या नाहीत. कृपया पुन्हा प्रयत्न करा.'
    };

    newsFeedContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>${errorMessages[state.language] || errorMessages.english}</p>
        <button onclick="window.location.reload()" class="ad-button" style="margin-top: 10px;">Retry</button>
      </div>
    `;
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${month} ${day}, ${hours}:${strMinutes} ${ampm}`;
  }

  function renderNews() {
    if (state.articles.length === 0) {
      newsFeedContainer.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>No brief articles available right now.</p>
        </div>
      `;
      return;
    }

    newsFeedContainer.innerHTML = '';

    state.articles.forEach((item, index) => {
      // Create News Card Element
      const card = document.createElement('div');
      card.className = 'news-card';
      card.setAttribute('id', `news-card-${item.id}`);

      // Fallback placeholder image using Picsum if no feed image exists
      const imageSrc = item.image || `https://picsum.photos/id/${100 + index}/300/200`;

      // Read full article label in user preferred language
      const readMoreLabels = {
        malayalam: 'പൂർണ്ണ വാർത്ത വായിക്കുക',
        english: 'Read full article',
        hindi: 'पूरा समाचार पढ़ें',
        tamil: 'முழு செய்தியைப் படிக்க',
        kannada: 'ಸಂಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ',
        marathi: 'संपूर्ण बातमी वाचा'
      };
      
      const label = readMoreLabels[state.language] || readMoreLabels.english;

      card.innerHTML = `
        <div class="card-content">
          <div>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-meta">
              <span class="source-pill">${item.source}</span>
              <span>${formatTime(item.pubDate)}</span>
            </div>
          </div>
          
          <!-- Brief content displayed when card is tapped/expanded -->
          <div class="brief-container">
            <p>${item.summary}</p>
            <div class="card-action-bar">
              <a href="${item.link}" target="_blank" class="read-more-link" rel="noopener noreferrer">
                ${label} ➔
              </a>
            </div>
            <!-- Share Buttons Row -->
            <div class="share-buttons-row">
              <button class="share-btn share-whatsapp" data-share="whatsapp" title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
              <button class="share-btn share-facebook" data-share="facebook" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button class="share-btn share-twitter" data-share="twitter" title="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button class="share-btn share-generic" data-share="native" title="Share">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="card-image-container">
          <img src="${imageSrc}" alt="Article thumbnail" loading="lazy" onerror="this.src='https://picsum.photos/id/10/300/200'">
        </div>
      `;

      // Make card expandable on tap
      card.addEventListener('click', (e) => {
        // If clicking on the anchor link or share button, let it do its thing
        if (e.target.tagName.toLowerCase() === 'a') return;
        if (e.target.closest('.share-btn')) return;

        // Toggle expanded class
        const wasExpanded = card.classList.contains('expanded');
        
        // Collapse all other cards first (single card mode, like a slider)
        document.querySelectorAll('.news-card').forEach(c => c.classList.remove('expanded'));
        
        if (!wasExpanded) {
          card.classList.add('expanded');
          // Smooth scroll to card
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      // Wire up share buttons
      card.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const shareType = btn.dataset.share;
          const shareTitle = item.title;
          const shareUrl = `${window.location.origin}${window.location.pathname}?lang=${state.language}&id=${item.id}`;
          const shareText = `${shareTitle} - ${shareUrl}`;

          if (shareType === 'whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          } else if (shareType === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
          } else if (shareType === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          } else if (shareType === 'native') {
            if (navigator.share) {
              navigator.share({ title: shareTitle, url: shareUrl }).catch(() => {});
            } else {
              // Fallback: copy to clipboard
              navigator.clipboard.writeText(shareText).then(() => {
                btn.title = 'Copied!';
                setTimeout(() => { btn.title = 'Share'; }, 2000);
              });
            }
          }
        });
      });

      newsFeedContainer.appendChild(card);

      // Insert a beautiful custom Promotion card (like the screenshot advert) after card index 1
      if (index === 1) {
        const adCard = document.createElement('div');
        adCard.className = 'ad-card';
        adCard.innerHTML = `
          <div class="ad-badge">Promoted</div>
          <div class="ad-title">Grip Invest</div>
          <div class="ad-headline">Invest in High-Yield Bonds & FDs. Start earning up to 12% returns.</div>
          <button class="ad-button" onclick="window.open('https://gripinvest.in', '_blank')">Invest Now</button>
        `;
        newsFeedContainer.appendChild(adCard);
      }
    });

    // Deep Linking: Auto-scroll and expand specific article if 'id' is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id');
    if (targetId) {
      const targetElement = document.getElementById(`news-card-${targetId}`);
      if (targetElement) {
        targetElement.classList.add('expanded');
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }

  // --- SHARE APP BUTTON ---
  const shareAppBtn = document.getElementById('share-app-btn');
  if (shareAppBtn) {
    shareAppBtn.addEventListener('click', () => {
      const shareData = {
        title: 'FreshNews - Brief News in 10 Indian Languages',
        text: 'Check out FreshNews! Get the latest brief news from top Indian newspapers in Malayalam, English, Hindi, Tamil & more.',
        url: 'https://freshnews.top'
      };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`).then(() => {
          shareAppBtn.textContent = 'Link Copied!';
          setTimeout(() => { shareAppBtn.textContent = 'Share This App'; }, 2000);
        });
      }
    });
  }

  // Run initialization
  init();
});
