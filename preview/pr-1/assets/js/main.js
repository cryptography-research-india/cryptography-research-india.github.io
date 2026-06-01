(function () {
  'use strict';

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

  if (filterBtns.length && personCards.length) {
    var activeFilters = new Set();

    function getInitials(name) {
      return name.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase();
    }

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

        // Filter check
        var passesFilter = true;
        if (activeFilters.size > 0) {
          passesFilter = false;
          activeFilters.forEach(function (f) {
            if (tags.indexOf(f) !== -1) passesFilter = true;
          });
        }

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
     SHUFFLE FEATURED PEOPLE (home page only)
     ============================================================ */
  var featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    var cards = Array.from(featuredGrid.querySelectorAll('.person-card'));
    // Fisher-Yates shuffle
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      featuredGrid.appendChild(cards[j]);
      var tmp = cards[i]; cards[i] = cards[j]; cards[j] = tmp;
    }
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
