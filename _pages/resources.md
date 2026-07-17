---
layout: default
title: Resources
permalink: /resources/
---

<div class="page-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <h1 class="page-hero-title">Resources</h1>
    <p class="page-hero-subtitle">Curated learning materials, courses, tools, and community resources for cryptography researchers.</p>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    <!-- Explore by Topic -->
    <div class="topic-pills">
      <span class="filter-label">Explore by topic:</span>
      {% for topic in site.data.resource-topics %}
        <a href="{{ topic.url | relative_url }}" class="filter-btn topic-pill">{{ topic.icon }} {{ topic.title }}</a>
      {% endfor %}
    </div>

    <div class="resources-grid">

      <!-- Textbooks -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(0,255,136,0.1);">
          📚
        </div>
        <h3>Textbooks</h3>
        <p>Essential reading for foundational and advanced cryptography topics.</p>
        <ul class="resource-list">
          <li><a href="https://toc.cryptobook.us/" target="_blank" rel="noopener">A Graduate Course in Applied Cryptography — Boneh & Shoup</a></li>
          <li><a href="https://www.cs.umd.edu/~jkatz/imc.html" target="_blank" rel="noopener">Introduction to Modern Cryptography — Katz & Lindell</a></li>
          <li><a href="https://www.ic.unicamp.br/~rdahab/cursos/mo421-mc889/Welcome_files/Stinson-Paterson_CryptographyTheoryAndPractice-CRC%20Press%20%282019%29.pdf" target="_blank" rel="noopener">Cryptography: Theory and Practice — Stinson</a></li>
          <li><a href="https://cacr.uwaterloo.ca/hac/" target="_blank" rel="noopener">Handbook of Applied Cryptography — Menezes et al.</a></li>
          <li><a href="https://www.wisdom.weizmann.ac.il/~oded/foc-book.html" target="_blank" rel="noopener">Foundations of Cryptography — Goldreich (Vol. I & II)</a></li>
          <li><a href="https://link.springer.com/book/10.1007/978-3-031-12164-7" target="_blank" rel="noopener">Secure Multi-Party Computation Against Passive Adversaries</a></li>
          <li><a href="https://www.iospress.com/catalog/books/applications-of-secure-multiparty-computation" target="_blank" rel="noopener">Applications of Secure Multiparty Computation</a></li>
        </ul>
      </div>

      <!-- Online Courses -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(124,58,237,0.15);">
          🎓
        </div>
        <h3>Online Courses</h3>
        <p>Free and paid courses to learn cryptography from the ground up.</p>
        <ul class="resource-list">
          <li><a href="https://www.coursera.org/learn/crypto" target="_blank" rel="noopener">Cryptography I — Stanford / Coursera (Dan Boneh)</a></li>
          <li><a href="https://www.youtube.com/@thebiuresearchcenteronappl8783/playlists" target="_blank" rel="noopener">Bar-Ilan Cryptography Winter Schools (YouTube)</a></li>
          <li><a href="https://www.youtube.com/playlist?list=PLgMDNELGJ1CbdGLyn7OrVAP-IKg-0q2U2" target="_blank" rel="noopener">Foundations of Cryptography — Ashish Choudhury</a></li>
          <li><a href="https://nptel.ac.in/courses/106108227" target="_blank" rel="noopener">Discrete Mathematics</a></li>
          <li><a href="https://www.youtube.com/watch?v=ENBhmjHXleM" target="_blank" rel="noopener">Secure Computation Part I</a></li>
        </ul>
      </div>

      <!-- Research Groups -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(6,182,212,0.12);">
          🔬
        </div>
        <h3>Research Groups</h3>
        <p>Active cryptography research groups at Indian institutions.</p>
        <ul class="resource-list">
          <li><a href="https://cris.csa.iisc.ac.in" target="_blank" rel="noopener">CRIS Lab — IISc Bangalore</a></li>
          <li><a href="https://www.tcgcrest.org/cryptology/" target="_blank" rel="noopener">Cryptography and Security Group — TCG CREST (IAI)</a></li>
          <li><a href="https://www.isical.ac.in/~crg/" target="_blank" rel="noopener">Cryptology Research Group — ISI Kolkata</a></li>
          <li><a href="https://www.csa.iisc.ac.in/~crysp/" target="_blank" rel="noopener">CrySP Lab — IISc Bangalore</a></li>
          <li><a href="https://cyberlabs.iiitkottayam.ac.in" target="_blank" rel="noopener">CyberLabs — IIIT Kottayam</a></li>
          <li><a href="https://cystar.iitm.ac.in" target="_blank" rel="noopener">CyStar — IIT Madras</a></li>
          <li><a href="http://cse.iitkgp.ac.in/resgrp/seal/" target="_blank" rel="noopener">SEAL Lab — IIT Kharagpur</a></li>
          <li><a href="https://sil.iitkgp.ac.in" target="_blank" rel="noopener">Security and Information Lab — IIT Kharagpur</a></li>
          <li><a href="https://trustlab.iitb.ac.in" target="_blank" rel="noopener">Trust Lab — IIT Bombay</a></li>
        </ul>
      </div>

      <!-- Conferences -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(245,158,11,0.12);">
          ⏰
        </div>
        <h3>Conference Deadlines</h3>
        <p>Track upcoming submission deadlines across the field.</p>
        <ul class="resource-list">
          <li><a href="https://sec-deadlines.github.io" target="_blank" rel="noopener">Security and Privacy Conference Deadlines</a></li>
          <li><a href="https://mpc-deadlines.github.io" target="_blank" rel="noopener">MPC Deadlines Hub</a></li>
          <li><a href="https://paperswithcode.co/ai-deadlines" target="_blank" rel="noopener">AI Conference Deadlines</a></li>
        </ul>
      </div>

      <!-- Software Libraries -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(0,255,136,0.1);">
          ⚙️
        </div>
        <h3>Software & Libraries</h3>
        <p>Open-source cryptography tools and frameworks.</p>
        <ul class="resource-list">
          <li><a href="https://www.cryptopp.com/" target="_blank" rel="noopener">Crypto++ — C++ Crypto Library</a></li>
          <li><a href="https://github.com/emp-toolkit/emp-tool" target="_blank" rel="noopener">EMP Toolkit — MPC Framework</a></li>
          <li><a href="https://github.com/microsoft/SEAL" target="_blank" rel="noopener">Microsoft SEAL — FHE Library</a></li>
          <li><a href="https://github.com/data61/MP-SPDZ" target="_blank" rel="noopener">MP-SPDZ — MPC Protocols</a></li>
          <li><a href="https://github.com/OpenFHE/OpenFHE-development" target="_blank" rel="noopener">OpenFHE — Fully Homomorphic Encryption</a></li>
          <li><a href="https://github.com/pyca/cryptography" target="_blank" rel="noopener">pyca/cryptography — Python Crypto Library</a></li>
        </ul>
      </div>

      <!-- Competitions & Challenges -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(124,58,237,0.15);">
          🏆
        </div>
        <h3>Competitions & Standards</h3>
        <p>Cryptography standardization efforts and competitions.</p>
        <ul class="resource-list">
          <li><a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener">NIST PQC Standardization</a></li>
          <li><a href="https://competition.cr.yp.to/" target="_blank" rel="noopener">CAESAR Competition (AEAD)</a></li>
          <li><a href="https://csrc.nist.gov/projects/lightweight-cryptography" target="_blank" rel="noopener">NIST Lightweight Cryptography</a></li>
          <li><a href="https://cryptohack.org/" target="_blank" rel="noopener">CryptoHack — Challenges & Learning</a></li>
          <li><a href="https://mysterytwister.org/" target="_blank" rel="noopener">MysteryTwister — Cipher Challenges</a></li>
        </ul>
      </div>

      <!-- Reading Lists -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(6,182,212,0.12);">
          📖
        </div>
        <h3>Reading Lists</h3>
        <p>Curated paper lists and survey resources by topic.</p>
        <ul class="resource-list">
          <li><a href="https://eprint.iacr.org/" target="_blank" rel="noopener">IACR ePrint — Latest Preprints</a></li>
          <li><a href="https://github.com/matter-labs/awesome-zero-knowledge-proofs" target="_blank" rel="noopener">Awesome ZKP — Curated ZK Resources</a></li>
          <li><a href="https://github.com/rdragos/awesome-mpc" target="_blank" rel="noopener">Awesome MPC — Reading List</a></li>
          <li><a href="https://github.com/jonaschn/awesome-he" target="_blank" rel="noopener">Awesome Homomorphic Encryption</a></li>
          <li><a href="https://pqcrypto.eu.org/docs/initial-recommendations.pdf" target="_blank" rel="noopener">PQCrypto Initial Recommendations</a></li>
        </ul>
      </div>

      <!-- Blogs & News -->
      <div class="resource-card capped glass" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="resource-card-icon" style="background:rgba(245,158,11,0.12);">
          ✍️
        </div>
        <h3>Blogs & Newsletters</h3>
        <p>Stay up to date with the cryptography research community.</p>
        <ul class="resource-list">
          <li><a href="https://blog.cryptographyengineering.com/" target="_blank" rel="noopener">A Few Thoughts on Cryptographic Engineering</a></li>
          <li><a href="https://www.schneier.com/" target="_blank" rel="noopener">Schneier on Security</a></li>
          <li><a href="https://thecryptopaper.com/" target="_blank" rel="noopener">The Crypto Paper</a></li>
          <li><a href="https://iacr.org/news/" target="_blank" rel="noopener">IACR News</a></li>
          <li><a href="https://zknewsletter.com/" target="_blank" rel="noopener">ZK Newsletter</a></li>
        </ul>
      </div>

    </div>

    <div class="glass" style="margin-top:2.5rem;border-radius:var(--radius-lg);padding:2rem;text-align:center;">
      <p style="margin-bottom:1rem;font-size:0.95rem;">Know a resource that should be listed here? Let us know!</p>
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?title=[RESOURCE]+Resource+Name"
         target="_blank" rel="noopener" class="btn btn-primary">
        Suggest a Resource
      </a>
    </div>

  </div>
</section>

<!-- Resource Category Modal -->
<div class="modal-overlay" id="resource-modal-overlay">
  <div class="resource-modal glass-strong" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title">
    <button type="button" class="modal-close" id="resource-modal-close" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="resource-modal-header">
      <div class="resource-card-icon" id="resource-modal-icon"></div>
      <h3 id="resource-modal-title"></h3>
    </div>
    <p id="resource-modal-desc"></p>
    <ul class="resource-list" id="resource-modal-list"></ul>
  </div>
</div>
