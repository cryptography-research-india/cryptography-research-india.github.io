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
     CLIPBOARD COPY (shared helper — used by the researcher modal's
     Copy Email button and the share buttons' Copy Link button)
     ============================================================ */
  function copyTextToClipboard(text, onSuccess, onFail) {
    // Fallback for browsers/contexts that reject the async Clipboard API
    // (no permission granted, insecure context, older browser). execCommand
    // is deprecated but still works synchronously inside a real user
    // gesture, which every caller of this function is.
    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess, function () {
        if (fallbackCopy()) onSuccess(); else onFail();
      });
    } else if (fallbackCopy()) {
      onSuccess();
    } else {
      onFail();
    }
  }

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

    // Topic codes (MPC, ZKP, ...) form their own OR-group, read directly off
    // whatever buttons are actually on the page — the canonical list lives
    // in _data/topics.yml, not duplicated here.
    var topicFilterBtns = document.querySelectorAll('.topic-filter-pills [data-filter]');
    if (topicFilterBtns.length) {
      FILTER_GROUPS.push(Array.prototype.map.call(topicFilterBtns, function (b) {
        return b.dataset.filter;
      }));
    }

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

    function linkedinIcon() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
    }

    function copyIcon() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    }

    function checkIcon() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    }

    function openModal(person, avatarBackground, card) {
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

      modalFooter.innerHTML = '';

      function addLink(href, label, iconSvg) {
        if (!href) return;
        var a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'btn btn-ghost btn-sm';
        a.innerHTML = iconSvg + ' ' + label;
        modalFooter.appendChild(a);
      }

      addLink(person.webpage, 'Website', websiteIcon());
      addLink(person.webpagelab, 'Lab', labIcon());
      addLink(person.scholar, 'Google Scholar', websiteIcon());
      addLink(person.dblp, 'DBLP', websiteIcon());
      if (person.orcid) {
        var orcidHref = /^https?:\/\//.test(person.orcid) ? person.orcid : 'https://orcid.org/' + person.orcid;
        addLink(orcidHref, 'ORCID', websiteIcon());
      }
      addLink('https://eprint.iacr.org/search?q=' + encodeURIComponent(person.name || ''), 'ePrint', websiteIcon());
      addLink(person.linkedin, 'LinkedIn', linkedinIcon());

      // Email is deliberately never present in `person` — it's excluded from
      // the data-person JSON blob (see person-card.html and
      // _plugins/person_filters.rb) so it never sits in plain HTML. It's
      // decoded here, only at the moment this specific modal opens, from the
      // card's own base64 attribute, and rendered as copy-to-clipboard rather
      // than a mailto: link or visible text.
      var emailEnc = card ? card.dataset.emailEnc : '';
      if (emailEnc) {
        var email = '';
        try { email = atob(emailEnc); } catch (e) { email = ''; }
        if (email) {
          var copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'btn btn-ghost btn-sm';
          copyBtn.innerHTML = copyIcon() + ' Copy Email';

          copyBtn.addEventListener('click', function () {
            copyTextToClipboard(email, function () {
              copyBtn.innerHTML = checkIcon() + ' Copied!';
              setTimeout(function () {
                copyBtn.innerHTML = copyIcon() + ' Copy Email';
              }, 1800);
            }, function () {
              copyBtn.innerHTML = 'Copy failed — ' + email;
            });
          });
          modalFooter.appendChild(copyBtn);
        }
      }

      if (card && card.dataset.slug) {
        history.replaceState(null, '', '#' + card.dataset.slug);
      }

      lastFocused = document.activeElement;
      modalOverlay.classList.add('open');
      document.body.classList.add('modal-open');
      modalCloseBtn.focus();
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (location.hash) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function openCardModal(card) {
      var raw = card.dataset.person;
      if (!raw) return;
      var person;
      try {
        person = JSON.parse(raw);
      } catch (e) {
        return;
      }
      var avatar = card.querySelector('.person-avatar');
      openModal(person, avatar ? avatar.style.background : '', card);
    }

    // Each card is a real <a href="/people/#slug"> (see person-card.html) so
    // it works with no JS at all — right-click/middle-click/ctrl-click all
    // behave exactly as a link should, and on pages without a modal (the
    // homepage's featured grid) it's just a normal navigation to that
    // person's deep-linked profile. Here, where a modal exists, the click is
    // intercepted to open it in place instead of navigating away. Native
    // anchor behavior already fires this same 'click' handler for Enter, so
    // no separate keydown handling is needed.
    personCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        openCardModal(card);
      });
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });

    // Deep-linkable profiles: /people/#slug (or the homepage's featured
    // grid, which uses the same cards) opens that researcher's modal
    // directly on load.
    if (location.hash) {
      var initialSlug = decodeURIComponent(location.hash.slice(1));
      for (var ci = 0; ci < personCards.length; ci++) {
        if (personCards[ci].dataset.slug === initialSlug) {
          openCardModal(personCards[ci]);
          break;
        }
      }
    }
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

  /* ============================================================
     SHARE BUTTONS — Copy Link
     (the X/LinkedIn/WhatsApp buttons are plain share-intent links
     and need no JS; only Copy Link needs one)
     ============================================================ */
  document.querySelectorAll('.share-btn-copy').forEach(function (btn) {
    var url = btn.getAttribute('data-share-url');
    if (!url) return;

    btn.addEventListener('click', function () {
      copyTextToClipboard(url, function () {
        btn.classList.add('copied');
        btn.setAttribute('aria-label', 'Link copied');
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.setAttribute('aria-label', 'Copy link');
        }, 1800);
      }, function () {
        btn.setAttribute('aria-label', 'Copy failed — select and copy the URL manually');
      });
    });
  });

})();
