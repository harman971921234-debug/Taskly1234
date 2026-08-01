/* ===================================================
   TASKLY — Coming Soon Website
   Application JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Loader =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });

  // Safety fallback — hide loader after 3s regardless
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 3000);

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const scrollIndicator = document.getElementById('scroll-indicator');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide scroll indicator
    if (scrollIndicator && window.scrollY > 200) {
      scrollIndicator.style.opacity = '0';
    } else if (scrollIndicator) {
      scrollIndicator.style.opacity = '';
    }
  });

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ===== Mobile Navigation =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileNav() {
    mobileToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', toggleMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileNav();
    });
  });

  // ===== Learn More Modal =====
  const learnMoreBtn = document.getElementById('learn-more-btn');
  const footerLearnMore = document.getElementById('footer-learn-more');
  const learnMoreModal = document.getElementById('learn-more-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCtaBtn = document.getElementById('modal-cta-btn');

  function openModal() {
    if (learnMoreModal) {
      learnMoreModal.classList.add('active');
      learnMoreModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (learnMoreModal) {
      learnMoreModal.classList.remove('active');
      learnMoreModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (learnMoreBtn) learnMoreBtn.addEventListener('click', openModal);
  if (footerLearnMore) footerLearnMore.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (learnMoreModal) {
    learnMoreModal.addEventListener('click', (e) => {
      if (e.target === learnMoreModal) closeModal();
    });
  }

  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && learnMoreModal && learnMoreModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== Countdown Timer =====
  // Set launch date to October 12 at 12:00 PM
  const nowObj = new Date();
  let targetYear = nowObj.getFullYear();
  let launchDate = new Date(targetYear, 9, 12, 12, 0, 0); // Month 9 = October
  if (launchDate.getTime() < nowObj.getTime()) {
    launchDate = new Date(targetYear + 1, 9, 12, 12, 0, 0);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;

    if (distance <= 0) {
      document.getElementById('countdown-days').textContent = '00';
      document.getElementById('countdown-hours').textContent = '00';
      document.getElementById('countdown-minutes').textContent = '00';
      document.getElementById('countdown-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== Newsletter Subscription Form =====
  const subscribeForm = document.getElementById('subscribe-form');
  const subscribeEmail = document.getElementById('subscribe-email');
  const subscribeBtn = document.getElementById('subscribe-btn');
  const subscribeMessage = document.getElementById('subscribe-message');

  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = subscribeEmail.value.trim();
    if (!email) return;

    // Show loading
    const btnText = subscribeBtn.querySelector('.btn-text');
    const btnLoader = subscribeBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    subscribeBtn.disabled = true;

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      // Store in localStorage instead of backend
      const subscribers = JSON.parse(localStorage.getItem('taskly_subscribers') || '[]');
      if (subscribers.find(sub => sub.email === email)) {
        subscribeMessage.textContent = 'This email is already subscribed!';
        subscribeMessage.className = 'form-message error';
      } else {
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('taskly_subscribers', JSON.stringify(subscribers));
        
        subscribeMessage.textContent = 'You\'re on the list! We\'ll notify you when Taskly launches.';
        subscribeMessage.className = 'form-message success';
        subscribeEmail.value = '';
        celebrateSuccess(subscribeForm);
      }
    } catch (err) {
      subscribeMessage.textContent = 'An error occurred. Please try again.';
      subscribeMessage.className = 'form-message error';
    } finally {
      btnText.style.display = '';
      btnLoader.style.display = 'none';
      subscribeBtn.disabled = false;
    }
  });

  // ===== Contact Form =====
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const contactMessageStatus = document.getElementById('contact-message-status');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) return;

    // Show loading
    const btnText = contactSubmitBtn.querySelector('.btn-text');
    const btnLoader = contactSubmitBtn.querySelector('.btn-loader');
    const btnArrow = contactSubmitBtn.querySelector('.btn-arrow');
    btnText.style.display = 'none';
    if (btnArrow) btnArrow.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    contactSubmitBtn.disabled = true;

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      // Store in localStorage instead of backend
      const messages = JSON.parse(localStorage.getItem('taskly_messages') || '[]');
      messages.push({ name, email, subject, message, date: new Date().toISOString() });
      localStorage.setItem('taskly_messages', JSON.stringify(messages));

      contactMessageStatus.textContent = 'Message received! We\'ll get back to you soon.';
      contactMessageStatus.className = 'form-message success';
      contactForm.reset();
      celebrateSuccess(contactForm);
    } catch (err) {
      contactMessageStatus.textContent = 'An error occurred. Please try again.';
      contactMessageStatus.className = 'form-message error';
    } finally {
      btnText.style.display = '';
      if (btnArrow) btnArrow.style.display = '';
      btnLoader.style.display = 'none';
      contactSubmitBtn.disabled = false;
    }
  });

  // ===== Scroll Reveal Animations =====
  const revealElements = [
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.section-header'),
    document.querySelector('.newsletter-wrapper'),
    document.querySelector('.contact-info'),
    document.querySelector('.contact-form-wrapper'),
    document.getElementById('hero-heading'),
    document.getElementById('hero-description'),
    document.getElementById('hero-cta'),
    document.getElementById('hero-visual'),
    document.getElementById('coming-soon-badge'),
  ].filter(Boolean);

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 0.05}s`;
    revealObserver.observe(el);
  });

  // ===== Features Grid Stagger =====
  const featuresGrid = document.querySelector('.features-grid');
  if (featuresGrid) {
    featuresGrid.classList.add('stagger-reveal');
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    gridObserver.observe(featuresGrid);
  }

  // ===== Success Celebration (particle burst) =====
  function celebrateSuccess(target) {
    const rect = target.getBoundingClientRect();
    const colors = ['#C8FF00', '#ffffff', '#d4ff33', '#a0cc00'];

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 6 + 3}px;
        height: ${Math.random() * 6 + 3}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        pointer-events: none;
        z-index: 9999;
        transition: all ${Math.random() * 0.8 + 0.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 300}px`;
        particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 200 - 100}px`;
        particle.style.opacity = '0';
        particle.style.transform = `scale(0)`;
      });

      setTimeout(() => particle.remove(), 1500);
    }
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Parallax on Hero Card =====
  const heroCard = document.querySelector('.hero-card');
  if (heroCard && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroCard.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
  }

  // ===== Private Admin Spreadsheet & Excel Export =====
  const adminModal = document.getElementById('admin-modal');
  const adminModalCloseBtn = document.getElementById('admin-modal-close-btn');
  const adminTableBody = document.getElementById('admin-table-body');
  const exportExcelBtn = document.getElementById('export-excel-btn');
  const clearDataBtn = document.getElementById('clear-data-btn');

  function openAdminModal() {
    if (!adminModal) return;
    renderAdminTable();
    adminModal.classList.add('active');
    adminModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('active');
    adminModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (adminModalCloseBtn) adminModalCloseBtn.addEventListener('click', closeAdminModal);
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });
  }

  // Trigger Admin Modal on Ctrl + Shift + E or URL hash #admin
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      openAdminModal();
    }
    if (e.key === 'Escape' && adminModal && adminModal.classList.contains('active')) {
      closeAdminModal();
    }
  });

  if (window.location.hash === '#admin') {
    openAdminModal();
  }

  function getAllEntries() {
    const subscribers = JSON.parse(localStorage.getItem('taskly_subscribers') || '[]');
    const messages = JSON.parse(localStorage.getItem('taskly_messages') || '[]');

    const all = [
      ...subscribers.map(sub => ({
        date: sub.date ? new Date(sub.date).toLocaleString() : 'N/A',
        type: 'Newsletter',
        name: 'N/A',
        email: sub.email || '',
        subject: 'N/A',
        message: 'N/A'
      })),
      ...messages.map(msg => ({
        date: msg.date ? new Date(msg.date).toLocaleString() : 'N/A',
        type: 'Contact Form',
        name: msg.name || 'N/A',
        email: msg.email || '',
        subject: msg.subject || 'N/A',
        message: msg.message || 'N/A'
      }))
    ];

    return all;
  }

  function renderAdminTable() {
    const entries = getAllEntries();
    if (!adminTableBody) return;

    if (entries.length === 0) {
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; color: var(--color-text-muted); padding: 24px;">
            No entries collected yet. Submit a test form on the site to see it appear here!
          </td>
        </tr>
      `;
      return;
    }

    adminTableBody.innerHTML = entries.map(entry => `
      <tr>
        <td>${entry.date}</td>
        <td><span class="tag-badge ${entry.type === 'Newsletter' ? 'tag-newsletter' : 'tag-contact'}">${entry.type}</span></td>
        <td><strong>${escapeHtml(entry.name)}</strong></td>
        <td><a href="mailto:${escapeHtml(entry.email)}" style="color: var(--color-accent);">${escapeHtml(entry.email)}</a></td>
        <td>${escapeHtml(entry.subject)}</td>
        <td>${escapeHtml(entry.message)}</td>
      </tr>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  // Export Data as Excel CSV Spreadsheet
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', () => {
      const entries = getAllEntries();
      if (entries.length === 0) {
        alert('No data to export yet!');
        return;
      }

      let csv = 'Date & Time,Form Type,Name,Email,Subject,Message\n';
      entries.forEach(item => {
        const row = [
          `"${item.date.replace(/"/g, '""')}"`,
          `"${item.type.replace(/"/g, '""')}"`,
          `"${item.name.replace(/"/g, '""')}"`,
          `"${item.email.replace(/"/g, '""')}"`,
          `"${item.subject.replace(/"/g, '""')}"`,
          `"${item.message.replace(/"/g, '""')}"`
        ];
        csv += row.join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Taskly_Leads_Spreadsheet_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Clear All Data
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all collected entries? This cannot be undone.')) {
        localStorage.removeItem('taskly_subscribers');
        localStorage.removeItem('taskly_messages');
        renderAdminTable();
      }
    });
  }
});
