/**
 * PORTFOLIO APPLICATION LOGIC
 * Features:
 * 1. Hero Live Forecasting Widget (Chart.js)
 * 2. Real-time Model Simulator / Sandbox
 * 3. Case Studies Filter & Detail Modal
 * 4. Smooth Navigation & Intersection Observer
 * 5. Interactive Contact Form with Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroForecaster();
  initSimulator();
  initProjectFiltersAndModal();
  initNavigation();
  initContactForm();
});

/* ==========================================================================
   1. HERO INTERACTIVE FORECASTER WIDGET
   ========================================================================== */

let heroChart = null;

const HERO_DATASETS = {
  retail: {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov (F)', 'Dec (F)', 'Jan (F)', 'Feb (F)'],
    historical: [2400, 2750, 2900, 3150, 2980, 3400, null, null, null, null],
    forecast: [null, null, null, null, null, 3400, 3850, 4420, 3950, 4200],
    upperBound: [null, null, null, null, null, 3400, 4050, 4700, 4250, 4550],
    lowerBound: [null, null, null, null, null, 3400, 3650, 4140, 3650, 3850],
    mape: '94.8%',
    trend: '+23.5%',
    rmse: '0.041'
  },
  server: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00 (F)', '21:00 (F)', '00:00 (F)', '03:00 (F)'],
    historical: [420, 380, 510, 890, 1150, 1280, null, null, null, null],
    forecast: [null, null, null, null, null, 1280, 1340, 1100, 750, 460],
    upperBound: [null, null, null, null, null, 1280, 1420, 1190, 820, 520],
    lowerBound: [null, null, null, null, null, 1280, 1260, 1010, 680, 400],
    mape: '96.2%',
    trend: '+12.1%',
    rmse: '0.028'
  },
  energy: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun (F)', 'Mon (F)', 'Tue (F)', 'Wed (F)'],
    historical: [48.2, 51.0, 49.8, 53.4, 52.1, 44.5, null, null, null, null],
    forecast: [null, null, null, null, null, 44.5, 43.0, 52.8, 54.1, 53.5],
    upperBound: [null, null, null, null, null, 44.5, 45.2, 55.4, 56.8, 56.0],
    lowerBound: [null, null, null, null, null, 44.5, 40.8, 50.2, 51.4, 51.0],
    mape: '95.6%',
    trend: '+4.8%',
    rmse: '0.035'
  }
};

function initHeroForecaster() {
  const ctx = document.getElementById('heroForecastChart');
  if (!ctx) return;

  const datasetSelect = document.getElementById('heroDatasetSelect');
  const modelSelect = document.getElementById('heroModelSelect');

  const initialData = HERO_DATASETS.retail;

  heroChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: initialData.labels,
      datasets: [
        {
          label: 'Upper Confidence (95%)',
          data: initialData.upperBound,
          borderColor: 'transparent',
          backgroundColor: 'rgba(139, 92, 246, 0.12)',
          fill: '+1',
          pointRadius: 0,
          tension: 0.35
        },
        {
          label: 'Lower Confidence (95%)',
          data: initialData.lowerBound,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          pointRadius: 0,
          tension: 0.35
        },
        {
          label: 'Historical Data',
          data: initialData.historical,
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.15)',
          borderWidth: 2.5,
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#07090e',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35
        },
        {
          label: 'Predicted Forecast',
          data: initialData.forecast,
          borderColor: '#c084fc',
          borderDash: [5, 5],
          borderWidth: 2.5,
          pointBackgroundColor: '#c084fc',
          pointBorderColor: '#07090e',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d121d',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              if (context.parsed.y === null) return '';
              return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });

  // Event listener for dataset change
  if (datasetSelect) {
    datasetSelect.addEventListener('change', (e) => {
      const selected = HERO_DATASETS[e.target.value] || HERO_DATASETS.retail;
      updateHeroChart(selected);
    });
  }

  if (modelSelect) {
    modelSelect.addEventListener('change', () => {
      const selectedKey = datasetSelect ? datasetSelect.value : 'retail';
      const baseData = HERO_DATASETS[selectedKey];
      // Simulate slightly different model variations
      updateHeroChart(baseData);
    });
  }
}

function updateHeroChart(data) {
  if (!heroChart) return;
  heroChart.data.labels = data.labels;
  heroChart.data.datasets[0].data = data.upperBound;
  heroChart.data.datasets[1].data = data.lowerBound;
  heroChart.data.datasets[2].data = data.historical;
  heroChart.data.datasets[3].data = data.forecast;
  heroChart.update();

  // Update stat chips
  const mapeEl = document.getElementById('heroMape');
  const trendEl = document.getElementById('heroTrend');
  const rmseEl = document.getElementById('heroRmse');

  if (mapeEl) mapeEl.textContent = data.mape;
  if (trendEl) trendEl.textContent = data.trend;
  if (rmseEl) rmseEl.textContent = data.rmse;
}

/* ==========================================================================
   2. REAL-TIME FORECASTING SANDBOX / SIMULATOR
   ========================================================================== */

let simChart = null;

function initSimulator() {
  const canvas = document.getElementById('sandboxChart');
  if (!canvas) return;

  const trendSlider = document.getElementById('simTrend');
  const seasonSlider = document.getElementById('simSeason');
  const noiseSlider = document.getElementById('simNoise');
  const horizonSlider = document.getElementById('simHorizon');

  const trendVal = document.getElementById('simTrendVal');
  const seasonVal = document.getElementById('simSeasonVal');
  const noiseVal = document.getElementById('simNoiseVal');
  const horizonVal = document.getElementById('simHorizonVal');

  // Generate Initial Data
  const simData = generateSimulationData(
    parseFloat(trendSlider.value),
    parseFloat(seasonSlider.value),
    parseFloat(noiseSlider.value),
    parseInt(horizonSlider.value)
  );

  simChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: simData.labels,
      datasets: [
        {
          label: 'Upper Band',
          data: simData.upper,
          borderColor: 'transparent',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          fill: '+1',
          pointRadius: 0,
          tension: 0.3
        },
        {
          label: 'Lower Band',
          data: simData.lower,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          pointRadius: 0,
          tension: 0.3
        },
        {
          label: 'Historical Series',
          data: simData.hist,
          borderColor: '#38bdf8',
          borderWidth: 2,
          pointRadius: 2,
          pointBackgroundColor: '#38bdf8',
          tension: 0.3
        },
        {
          label: 'Projected Horizon',
          data: simData.fore,
          borderColor: '#8b5cf6',
          borderDash: [6, 4],
          borderWidth: 2.5,
          pointRadius: 2,
          pointBackgroundColor: '#8b5cf6',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d121d',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 12 }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });

  function updateSimulation() {
    const trend = parseFloat(trendSlider.value);
    const season = parseFloat(seasonSlider.value);
    const noise = parseFloat(noiseSlider.value);
    const horizon = parseInt(horizonSlider.value);

    trendVal.textContent = trend > 0 ? `+${trend}` : trend;
    seasonVal.textContent = `${season}x`;
    noiseVal.textContent = `${noise}%`;
    horizonVal.textContent = `${horizon} Days`;

    const nextData = generateSimulationData(trend, season, noise, horizon);
    simChart.data.labels = nextData.labels;
    simChart.data.datasets[0].data = nextData.upper;
    simChart.data.datasets[1].data = nextData.lower;
    simChart.data.datasets[2].data = nextData.hist;
    simChart.data.datasets[3].data = nextData.fore;
    simChart.update('none'); // fast update
  }

  [trendSlider, seasonSlider, noiseSlider, horizonSlider].forEach(slider => {
    slider.addEventListener('input', updateSimulation);
  });

  // Algorithm Toggle Buttons in Sandbox
  const algoBtns = document.querySelectorAll('.toggle-btn[data-model]');
  algoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      algoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSimulation();
    });
  });
}

function generateSimulationData(trend, season, noise, horizon) {
  const totalDays = 40 + horizon;
  const labels = [];
  const hist = [];
  const fore = [];
  const upper = [];
  const lower = [];

  let baseVal = 100;

  for (let i = 0; i < totalDays; i++) {
    const dayNum = i + 1;
    labels.push(`Day ${dayNum}`);

    // Math formulation: Trend + Seasonality (sinusoidal) + Random Gaussian noise
    const trendComp = (i * trend) * 0.8;
    const seasonComp = Math.sin((i / 7) * Math.PI * 2) * (season * 15);
    const randomNoise = (Math.random() - 0.5) * (noise * 1.2);
    const val = Math.max(10, Math.round(baseVal + trendComp + seasonComp + randomNoise));

    if (i < 40) {
      hist.push(val);
      fore.push(null);
      upper.push(null);
      lower.push(null);
    } else {
      if (i === 40) {
        fore.push(hist[39]);
        upper.push(hist[39]);
        lower.push(hist[39]);
      }
      hist.push(null);
      // Smoothed forecast
      const forecastVal = Math.round(baseVal + trendComp + seasonComp);
      fore.push(forecastVal);

      // Expanding confidence cone over horizon distance
      const spread = ((i - 40) * 1.8) + (noise * 0.6) + 8;
      upper.push(forecastVal + spread);
      lower.push(Math.max(0, forecastVal - spread));
    }
  }

  return { labels, hist, fore, upper, lower };
}

/* ==========================================================================
   3. CASE STUDIES DATA & MODAL SYSTEM
   ========================================================================== */

const CASE_STUDIES = {
  prophet: {
    title: 'OmniForecast BI — Retail Demand & Inventory Optimization',
    category: 'Forecasting & Web App',
    badge: 'Prophet + FastAPI + Modern Web UI',
    image: 'assets/images/project-prophet.jpg',
    summary: 'A full-stack predictive inventory management platform built to prevent retail stockouts and optimize warehouse capital allocation.',
    problem: 'Retail operations faced a 22% annual revenue loss due to stockouts on fast-moving consumer goods and over-stocking seasonal products.',
    solution: 'Designed and deployed an end-to-end forecasting pipeline combining Facebook Prophet for holidays & seasonality with an interactive dashboard built with responsive Vanilla JS and Chart.js, served via FastAPI backend.',
    metrics: [
      { val: '94.2%', lbl: 'Forecast Accuracy (MAPE)' },
      { val: '-34%', lbl: 'Stockout Reduction' },
      { val: '$180K', lbl: 'Est. Annual Savings' }
    ],
    tech: ['Python (Prophet, Pandas)', 'FastAPI REST API', 'JavaScript (ES6+)', 'Chart.js Custom Theme', 'PostgreSQL']
  },
  financial: {
    title: 'FinPulse — Real-Time Time Series & Anomaly Detection Engine',
    category: 'Data Analytics & Web App',
    badge: 'Time Series + Algorithmic Risk Detection',
    image: 'assets/images/project-financial.jpg',
    summary: 'Real-time financial streaming analytics dashboard that monitors price volatility and detects micro-structure anomalies using dynamic Z-scores.',
    problem: 'Traditional financial reporting tools suffered from batch delays, failing to catch high-volatility flash anomalies until hours after occurrence.',
    solution: 'Architected a sub-second streaming web dashboard with dynamic sliding window standard deviation and Bollinger band calculations, visualizing anomaly clusters with real-time audio-visual alerts.',
    metrics: [
      { val: '<120ms', lbl: 'Alert Latency' },
      { val: '10,000+', lbl: 'Ticks Analyzed / Sec' },
      { val: '98.7%', lbl: 'True Anomaly Detection Rate' }
    ],
    tech: ['Time Series Decomposition', 'WebSockets', 'Canvas API', 'Vanilla CSS Glassmorphism', 'Python Statsmodels']
  },
  energy: {
    title: 'GridFuse IoT — 24-Hour Smart Power Demand Prediction',
    category: 'Forecasting & IoT Web',
    badge: 'SARIMAX + Weather Covariates',
    image: 'assets/images/project-energy.jpg',
    summary: 'Smart grid predictive dashboard forecasting regional electricity load and balancing renewable solar/wind generation 24 hours in advance.',
    problem: 'Power distributors struggled with erratic renewable energy feed-in fluctuations and steep peak-demand grid penalties.',
    solution: 'Implemented a multi-variate SARIMAX model integrating ambient temperature, humidity, and solar irradiance APIs with interactive dispatch visualization.',
    metrics: [
      { val: '96.1%', lbl: 'Next-Day Peak Precision' },
      { val: '21%', lbl: 'Solar Contribution Optimized' },
      { val: '24 Hours', lbl: 'Lookahead Horizon' }
    ],
    tech: ['SARIMAX Modeling', 'OpenWeather API Integration', 'HTML5 Semantic UI', 'Chart.js Time Scales', 'Data Pipeline']
  },
  churn: {
    title: 'SaaS Runway & Churn Forecaster — Interactive What-If Simulator',
    category: 'Analytics & Web App',
    badge: 'Cohort Analysis + Monte Carlo',
    image: 'assets/images/project-prophet.jpg',
    summary: 'Interactive financial modeling web app for SaaS founders to simulate customer churn, MRR trajectory, and cash runway under various economic conditions.',
    problem: 'Founders and finance teams lacked dynamic scenario simulation tools, relying on brittle spreadsheets that broke when sharing with stakeholders.',
    solution: 'Created an intuitive web-based simulation engine where users drag sliders for CAC, churn rates, and expansion revenue to simulate probabilistic cash runway curves.',
    metrics: [
      { val: '1,500+', lbl: 'Scenarios Simulated' },
      { val: '100%', lbl: 'Client-Side Privacy' },
      { val: 'Zero Delay', lbl: 'Instant Interactive Math' }
    ],
    tech: ['Monte Carlo Simulation', 'JavaScript Math Engine', 'CSS Custom Properties', 'SVG Data Visuals']
  }
};

function initProjectFiltersAndModal() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Functionality
  const modal = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const openBtns = document.querySelectorAll('[data-open-modal]');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-open-modal');
      const data = CASE_STUDIES[projectKey];
      if (data) {
        populateModal(data);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function populateModal(data) {
  document.getElementById('modalImage').src = data.image;
  document.getElementById('modalBadge').textContent = data.badge;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalSummary').textContent = data.summary;
  document.getElementById('modalProblem').textContent = data.problem;
  document.getElementById('modalSolution').textContent = data.solution;

  // Metrics
  const metricsContainer = document.getElementById('modalMetrics');
  metricsContainer.innerHTML = '';
  data.metrics.forEach(m => {
    const card = document.createElement('div');
    card.className = 'modal-metric-card';
    card.innerHTML = `
      <div class="modal-metric-val">${m.val}</div>
      <div class="modal-metric-lbl">${m.lbl}</div>
    `;
    metricsContainer.appendChild(card);
  });

  // Tech list
  const techContainer = document.getElementById('modalTechList');
  techContainer.innerHTML = '';
  data.tech.forEach(t => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = t;
    techContainer.appendChild(tag);
  });
}

/* ==========================================================================
   4. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
    });
  }

  // Active section indicator on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. CONTACT FORM INTERACTION
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      alert('Mohon isi semua kolom formulir.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Mengirim Pesan...
    `;

    // Simulate network transmission
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.textContent = `Terima kasih, ${name}! Pesan Anda telah terkirim. Saya akan segera merespons ke ${email}.`;
        feedback.style.display = 'block';

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 6000);
      }
    }, 1200);
  });
}
