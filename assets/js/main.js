(function () {
  'use strict';

  /* ============================================================
     THEME SWITCHER
     ============================================================ */
  var THEME_KEY = 'criypt-theme';
  var THEMES = ['dark', 'light', 'auto'];

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-btn') === theme);
    });
  }

  // Restore saved theme on load (before paint to avoid flash)
  var saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);

  // Wire up toggle buttons
  document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-theme-btn'));
    });
  });

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  var toggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked (mobile)
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     PEOPLE FILTERING
     ============================================================ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var personCards = document.querySelectorAll('.person-card');
  var countDisplay = document.getElementById('people-count');
  var searchInput = document.getElementById('search-people');

  function getInitials(name) {
    return name.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase();
  }

  if (filterBtns.length && personCards.length) {
    var FILTER_GROUPS = [
      ['ACADEMIA', 'INDUSTRY'],
      ['WORKING_IN_INDIA', 'WORKING_ABROAD']
    ];
    var activeFilters = new Set();

    // Assign gradient colors to avatars based on index
    personCards.forEach(function (card, idx) {
      var avatar = card.querySelector('.person-avatar');
      if (avatar) {
        var colors = [
          'linear-gradient(135deg,#7c3aed,#06b6d4)',
          'linear-gradient(135deg,#00ff88,#06b6d4)',
          'linear-gradient(135deg,#f59e0b,#7c3aed)',
          'linear-gradient(135deg,#06b6d4,#7c3aed)',
          'linear-gradient(135deg,#7c3aed,#00ff88)',
          'linear-gradient(135deg,#f59e0b,#06b6d4)'
        ];
        avatar.style.background = colors[idx % colors.length];
      }
    });

    function updateCards() {
      var searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var visible = 0;

      personCards.forEach(function (card) {
        var tags = (card.dataset.tags || '').split(' ');
        var name = card.dataset.name || '';
        var research = card.dataset.research || '';

        // Filter check: OR within a group (e.g. Academia + Industry),
        // AND across groups (e.g. Academia AND In India)
        var passesFilter = true;
        FILTER_GROUPS.forEach(function (group) {
          var groupFilters = group.filter(function (f) { return activeFilters.has(f); });
          if (groupFilters.length === 0) return;
          var matchesGroup = groupFilters.some(function (f) { return tags.indexOf(f) !== -1; });
          if (!matchesGroup) passesFilter = false;
        });

        // Search check
        var passesSearch = true;
        if (searchQuery) {
          passesSearch = name.indexOf(searchQuery) !== -1 || research.indexOf(searchQuery) !== -1;
        }

        if (passesFilter && passesSearch) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countDisplay) {
        countDisplay.textContent = visible + ' researcher' + (visible !== 1 ? 's' : '');
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.dataset.filter;

        if (filter === 'ALL') {
          activeFilters.clear();
          filterBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
        } else {
          // Deactivate ALL button
          filterBtns.forEach(function (b) {
            if (b.dataset.filter === 'ALL') b.classList.remove('active');
          });

          if (this.classList.contains('active')) {
            this.classList.remove('active');
            activeFilters.delete(filter);
            // If nothing active, reactivate ALL
            if (activeFilters.size === 0) {
              filterBtns.forEach(function (b) {
                if (b.dataset.filter === 'ALL') b.classList.add('active');
              });
            }
          } else {
            this.classList.add('active');
            activeFilters.add(filter);
          }
        }

        updateCards();
      });
    });

    // Search
    if (searchInput) {
      searchInput.addEventListener('input', updateCards);
    }

    // Initial state
    updateCards();
  }

  /* ============================================================
     RESEARCHER DETAIL MODAL
     ============================================================ */
  var modalOverlay = document.getElementById('person-modal-overlay');

  if (modalOverlay && personCards.length) {
    var modalAvatar = document.getElementById('person-modal-avatar');
    var modalName = document.getElementById('person-modal-name');
    var modalDesignation = document.getElementById('person-modal-designation');
    var modalAffiliation = document.getElementById('person-modal-affiliation');
    var modalTags = document.getElementById('person-modal-tags');
    var modalResearch = document.getElementById('person-modal-research');
    var modalFooter = document.getElementById('person-modal-footer');
    var modalCloseBtn = document.getElementById('person-modal-close');
    var lastFocused = null;

    var TAG_LABELS = {
      ACADEMIA: ['Academia', 'badge-purple'],
      INDUSTRY: ['Industry', 'badge-amber'],
      WORKING_IN_INDIA: ['In India', 'badge-green'],
      WORKING_ABROAD: ['Abroad', 'badge-cyan']
    };

    function websiteIcon() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    }

    function labIcon() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
    }

    function openModal(person, avatarBackground) {
      modalName.textContent = person.name || '';
      modalDesignation.textContent = person.designation || '';
      modalAffiliation.textContent = person.affiliation || '';

      modalAvatar.innerHTML = '';
      modalAvatar.style.background = avatarBackground || '';
      if (person.photo) {
        var img = document.createElement('img');
        img.src = person.photo;
        img.alt = person.name || '';
        img.className = 'avatar-photo';
        modalAvatar.appendChild(img);
      } else {
        var span = document.createElement('span');
        span.className = 'avatar-initials';
        span.textContent = getInitials(person.name || '');
        modalAvatar.appendChild(span);
      }

      modalTags.innerHTML = '';
      (person.tags || []).forEach(function (tag) {
        var info = TAG_LABELS[tag];
        if (!info) return;
        var el = document.createElement('span');
        el.className = 'badge ' + info[1];
        el.textContent = info[0];
        modalTags.appendChild(el);
      });

      modalResearch.innerHTML = '';
      (person.research ? person.research.split(', ') : []).forEach(function (area) {
        var el = document.createElement('span');
        el.className = 'tag tag-research';
        el.textContent = area;
        modalResearch.appendChild(el);
      });

      var footerHtml = '';
      if (person.webpage) {
        footerHtml += '<a href="' + person.webpage + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">' + websiteIcon() + ' Website</a>';
      }
      if (person.webpagelab) {
        footerHtml += '<a href="' + person.webpagelab + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">' + labIcon() + ' Lab</a>';
      }
      modalFooter.innerHTML = footerHtml;

      lastFocused = document.activeElement;
      modalOverlay.classList.add('open');
      document.body.classList.add('modal-open');
      modalCloseBtn.focus();
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    personCards.forEach(function (card) {
      function trigger() {
        var raw = card.dataset.person;
        if (!raw) return;
        var person;
        try {
          person = JSON.parse(raw);
        } catch (e) {
          return;
        }
        var avatar = card.querySelector('.person-avatar');
        openModal(person, avatar ? avatar.style.background : '');
      }

      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        trigger();
      });

      card.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
          e.preventDefault();
          trigger();
        }
      });
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }

  /* ============================================================
     RESOURCE CATEGORY MODAL
     ============================================================ */
  var RESOURCE_VISIBLE_LIMIT = 5;
  var resourceCards = document.querySelectorAll('.resource-card.capped');
  var resourceModalOverlay = document.getElementById('resource-modal-overlay');

  if (resourceModalOverlay && resourceCards.length) {
    var resourceModalIcon = document.getElementById('resource-modal-icon');
    var resourceModalTitle = document.getElementById('resource-modal-title');
    var resourceModalDesc = document.getElementById('resource-modal-desc');
    var resourceModalList = document.getElementById('resource-modal-list');
    var resourceModalCloseBtn = document.getElementById('resource-modal-close');
    var resourceLastFocused = null;

    resourceCards.forEach(function (card) {
      var links = card.querySelectorAll('.resource-list li');
      if (links.length > RESOURCE_VISIBLE_LIMIT) {
        var hint = document.createElement('span');
        hint.className = 'resource-more-hint';
        hint.textContent = '+' + (links.length - RESOURCE_VISIBLE_LIMIT) + ' more — click to view all';
        card.appendChild(hint);
      }
    });

    function openResourceModal(card) {
      var icon = card.querySelector('.resource-card-icon');
      var title = card.querySelector('h3');
      var desc = card.querySelector('p');
      var list = card.querySelector('.resource-list');

      resourceModalIcon.innerHTML = icon ? icon.innerHTML : '';
      resourceModalIcon.style.background = icon ? icon.style.background : '';
      resourceModalTitle.textContent = title ? title.textContent : '';
      resourceModalDesc.textContent = desc ? desc.textContent : '';
      resourceModalList.innerHTML = list ? list.innerHTML : '';

      resourceLastFocused = document.activeElement;
      resourceModalOverlay.classList.add('open');
      document.body.classList.add('modal-open');
      resourceModalCloseBtn.focus();
    }

    function closeResourceModal() {
      resourceModalOverlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (resourceLastFocused && typeof resourceLastFocused.focus === 'function') resourceLastFocused.focus();
    }

    resourceCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        openResourceModal(card);
      });

      card.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
          e.preventDefault();
          openResourceModal(card);
        }
      });
    });

    resourceModalCloseBtn.addEventListener('click', closeResourceModal);

    resourceModalOverlay.addEventListener('click', function (e) {
      if (e.target === resourceModalOverlay) closeResourceModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && resourceModalOverlay.classList.contains('open')) closeResourceModal();
    });
  }

  /* ============================================================
     SHUFFLE FEATURED PEOPLE (home page only)
     ============================================================ */
  var featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    var cards = Array.from(featuredGrid.querySelectorAll('.person-card'));
    // Fisher-Yates shuffle
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = cards[i]; cards[i] = cards[j]; cards[j] = tmp;
    }
    // Re-append in shuffled order, show only first 6
    cards.forEach(function (card, i) {
      card.style.display = i < 6 ? '' : 'none';
      featuredGrid.appendChild(card);
    });
  }

  /* ============================================================
     STAGGER ANIMATION ON CARDS
     ============================================================ */
  var animCards = document.querySelectorAll('.person-card, .post-card, .resource-card');
  animCards.forEach(function (card, i) {
    card.style.animationDelay = (i * 60) + 'ms';
  });

  /* ============================================================
     NAVBAR SCROLL SHADOW
     ============================================================ */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
      } else {
        header.style.boxShadow = '';
      }
    }, { passive: true });
  }

})();
