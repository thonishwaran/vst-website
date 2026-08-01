/* ----------------------------------------------------
   VST Tech Solutions - Client-Side Application JavaScript
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbar();
  fetchServices();
  fetchPortfolio();
  initAIChat();
  initContactForm();
  initNewsletterForm();
});

/* ----------------------------------------------------
   1. Floating Particle Canvas Background
   ---------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 20), 65);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(255, 215, 0, ' : 'rgba(0, 242, 254, '
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect nearby particles with glowing lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.25 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

/* ----------------------------------------------------
   2. Sticky Navbar & Mobile Drawer
   ---------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

/* ----------------------------------------------------
   3. Fetch & Render Services
   ---------------------------------------------------- */
async function fetchServices() {
  const container = document.getElementById('services-container');
  if (!container) return;

  try {
    const res = await fetch('/api/services');
    const json = await res.json();

    if (json.success && json.data) {
      container.innerHTML = json.data.map(service => `
        <div class="service-card">
          <div class="service-icon">${service.icon}</div>
          <h3 class="service-title">${service.title}</h3>
          <p class="service-desc">${service.shortDesc}</p>
          
          <div class="service-tags">
            ${service.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>

          <div class="service-link" onclick="openServiceModal('${service.id}')">
            <span>Explore Architecture</span> ➔
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error fetching services:', err);
  }
}

function openServiceModal(serviceId) {
  showToast(`Selected Service Domain. Click "Get Started" to scope your project!`, 'info');
}

/* ----------------------------------------------------
   4. Fetch & Filter Portfolio Projects
   ---------------------------------------------------- */
let allProjects = [];

async function fetchPortfolio() {
  const container = document.getElementById('portfolio-container');
  if (!container) return;

  try {
    const res = await fetch('/api/portfolio');
    const json = await res.json();

    if (json.success && json.data) {
      allProjects = json.data;
      renderPortfolio('all');
      initPortfolioFilters();
    }
  } catch (err) {
    console.error('Error fetching portfolio:', err);
  }
}

function renderPortfolio(filterCategory) {
  const container = document.getElementById('portfolio-container');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === filterCategory);

  container.innerHTML = filtered.map(item => `
    <div class="portfolio-card">
      <div class="portfolio-banner" style="background: ${item.imageBg}">
        <span class="badge" style="border-color: ${item.accentColor}; color: ${item.accentColor}">
          ${item.client}
        </span>
      </div>
      <div class="portfolio-content">
        <h4>${item.title}</h4>
        <p>${item.summary}</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(btn.dataset.filter);
    });
  });
}

/* ----------------------------------------------------
   5. Fetch & Render Testimonials
   ---------------------------------------------------- */
async function fetchTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  try {
    const res = await fetch('/api/testimonials');
    const json = await res.json();

    if (json.success && json.data) {
      container.innerHTML = json.data.map(item => `
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"${item.content}"</p>
          <div class="testimonial-user">
            <div class="user-avatar">${item.avatar}</div>
            <div style="text-align: left;">
              <strong style="color: #fff; font-size: 1rem;">${item.name}</strong>
              <div style="color: var(--text-muted); font-size: 0.85rem;">${item.role}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  }
}

/* ----------------------------------------------------
   6. Interactive AI Bot Chat Assistant
   ---------------------------------------------------- */
function initAIChat() {
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-chat-input');
  const messagesBox = document.getElementById('chat-messages');

  if (!form || !input || !messagesBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    // Append User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.textContent = message;
    messagesBox.appendChild(userDiv);
    input.value = '';
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Show Typing Indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot';
    typingDiv.textContent = 'VST AI is typing...';
    messagesBox.appendChild(typingDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const json = await res.json();

      messagesBox.removeChild(typingDiv);

      if (json.success) {
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-msg bot';
        botDiv.textContent = json.reply;
        messagesBox.appendChild(botDiv);
        messagesBox.scrollTop = messagesBox.scrollHeight;
      }
    } catch (err) {
      typingDiv.textContent = "Apologies, I encountered a network hiccup. Please try asking again!";
    }
  });
}

/* ----------------------------------------------------
   7. Interactive Project Quote Calculator
   ---------------------------------------------------- */
function initQuoteCalculator() {
  const serviceSelect = document.getElementById('calc-service');
  const timelineSelect = document.getElementById('calc-timeline');
  const addons = document.querySelectorAll('.calc-addon');
  const priceDisplay = document.getElementById('calc-price-display');
  const saveBtn = document.getElementById('btn-save-quote');

  if (!serviceSelect || !priceDisplay) return;

  function calculate() {
    let basePrice = 3000;
    const serviceVal = serviceSelect.value;
    if (serviceVal.includes('Mobile')) basePrice = 4500;
    if (serviceVal.includes('AI')) basePrice = 5000;
    if (serviceVal.includes('Cloud')) basePrice = 3500;

    let addonCount = 0;
    addons.forEach(chk => {
      if (chk.checked) addonCount++;
    });

    let multiplier = 1.0;
    if (timelineSelect.value.includes('Rush')) multiplier = 1.35;
    if (timelineSelect.value.includes('Flexible')) multiplier = 0.9;

    const total = Math.round((basePrice + addonCount * 800) * multiplier);
    priceDisplay.textContent = `$${total.toLocaleString()}`;
    return total;
  }

  serviceSelect.addEventListener('change', calculate);
  timelineSelect.addEventListener('change', calculate);
  addons.forEach(chk => chk.addEventListener('change', calculate));

  calculate();

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const selectedAddons = Array.from(addons)
        .filter(c => c.checked)
        .map(c => c.value);

      const estimatedCost = calculate();

      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceType: serviceSelect.value,
            features: selectedAddons,
            timeline: timelineSelect.value
          })
        });
        const json = await res.json();

        if (json.success) {
          showToast(`Quote #${json.data.quoteId} saved! Pre-filling project inquiry...`, 'success');
          
          // Auto fill contact form service
          const contactService = document.getElementById('contact-service');
          if (contactService) {
            contactService.value = serviceSelect.value.includes('AI') ? 'AI Solutions' 
              : serviceSelect.value.includes('Mobile') ? 'App Development' : 'Web Development';
          }

          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        showToast('Error saving quote estimate.', 'error');
      }
    });
  }
}

/* ----------------------------------------------------
   8. Main Contact Form Submission
   ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const service = document.getElementById('contact-service').value;
    const budget = document.getElementById('contact-budget').value;
    const message = document.getElementById('contact-message').value.trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, budget, message })
      });

      const json = await res.json();

      if (json.success) {
        showToast(`🎉 ${json.message} (Ref ID: ${json.referenceId})`, 'success');
        form.reset();
      } else {
        showToast(`⚠️ ${json.message}`, 'error');
      }
    } catch (err) {
      showToast('❌ Server error processing contact form. Please try again.', 'error');
    }
  });
}

/* ----------------------------------------------------
   9. Newsletter Form Submission
   ---------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const json = await res.json();

      if (json.success) {
        showToast(`✨ ${json.message}`, 'success');
        emailInput.value = '';
      } else {
        showToast(`⚠️ ${json.message}`, 'error');
      }
    } catch (err) {
      showToast('❌ Server error processing subscription.', 'error');
    }
  });
}

/* ----------------------------------------------------
   10. Animated Counter on Scroll
   ---------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const pos = statsSection.getBoundingClientRect();
    if (pos.top < window.innerHeight && pos.bottom >= 0 && !started) {
      started = true;
      statNumbers.forEach(stat => {
        const target = +stat.dataset.target;
        let count = 0;
        const increment = Math.ceil(target / 40);

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            stat.textContent = target + '+';
            clearInterval(timer);
          } else {
            stat.textContent = count;
          }
        }, 40);
      });
    }
  });
}

/* ----------------------------------------------------
   Toast Notification Helper
   ---------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.style.borderLeftColor = '#ef4444';
  if (type === 'success') toast.style.borderLeftColor = '#10b981';

  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = '0.3s';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 4500);
}
