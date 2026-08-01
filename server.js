const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname)));

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'VST Tech Solutions Backend API',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// 2. Business Statistics Endpoint
app.get('/api/stats', (req, res) => {
  const inquiriesCount = db.getInquiries().length;
  res.json({
    success: true,
    data: {
      projectsCompleted: 120 + inquiriesCount,
      happyClients: 48,
      satisfactionRate: '99.4%',
      avgTurnaroundDays: 14,
      aiAutomationsDeployed: 35
    }
  });
});

// 3. Services API
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'web-dev',
        icon: '🌐',
        title: 'Web Engineering & SaaS',
        shortDesc: 'Custom high-performance web platforms, SaaS portals, & API ecosystems.',
        fullDesc: 'We build ultra-fast, modern web applications using modern architectures. Scalable frontend designs paired with resilient cloud microservices.',
        technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS / Custom CSS3'],
        features: ['Sub-second Load Times', 'Enterprise Security', 'SEO & Analytics Optimization', 'Progressive Web App (PWA)']
      },
      {
        id: 'mobile-dev',
        icon: '📱',
        title: 'Native & Cross-Platform Mobile',
        shortDesc: 'Android & iOS mobile applications designed for high user engagement and scale.',
        fullDesc: 'Crafting responsive mobile experiences with slick fluid UI animations, offline synchronization, and native device capabilities.',
        technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
        features: ['Biometric Authentication', 'Push Notifications', 'Offline-First Sync', 'App Store & Play Store Deployment']
      },
      {
        id: 'ai-solutions',
        icon: '🤖',
        title: 'AI & Automation Ecosystems',
        shortDesc: 'Custom AI chatbots, LLM integration, workflow automation, & predictive models.',
        fullDesc: 'Transforming business operations using cutting-edge Artificial Intelligence. Automate client interactions, analyze data patterns, and deploy autonomous AI agents.',
        technologies: ['Python', 'OpenAI / Gemini APIs', 'LangChain', 'TensorFlow', 'Vector DBs'],
        features: ['Custom AI Assistant Bots', 'Automated Lead Qualification', 'Document Intelligence & Extraction', '24/7 Intelligent Customer Support']
      },
      {
        id: 'cloud-devops',
        icon: '☁️',
        title: 'Cloud Infrastructure & DevOps',
        shortDesc: 'Architecting resilient cloud pipelines, serverless backends, and CI/CD automation.',
        fullDesc: 'Streamlining deployment workflows with containerized microservices and automated infrastructure management for zero-downtime scaling.',
        technologies: ['AWS', 'Docker', 'Kubernetes', 'Nginx', 'GitHub Actions'],
        features: ['Auto-Scaling Clusters', 'Zero-Downtime Releases', 'Database Clustering', '24/7 Monitoring & Alerting']
      }
    ]
  });
});

// 4. Portfolio Projects API
app.get('/api/portfolio', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'p1',
        category: 'ai',
        title: 'OmniAI Workflow Assistant',
        client: 'Global Logistics Corp',
        imageBg: 'linear-gradient(135deg, #1e1035 0%, #0d1b2a 100%)',
        accentColor: '#ab47bc',
        summary: 'Automated logistics dispatching reducing operational delay by 64%.',
        tags: ['AI Agents', 'NLP', 'Node.js', 'Python']
      },
      {
        id: 'p2',
        category: 'web',
        title: 'FinEdge Wealth Dashboard',
        client: 'FinEdge Capital',
        imageBg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        accentColor: '#00e676',
        summary: 'Real-time stock portfolio tracker processing 50k events/second.',
        tags: ['Web Engineering', 'WebSockets', 'ChartJS', 'Express']
      },
      {
        id: 'p3',
        category: 'mobile',
        title: 'PulseFit Pro iOS & Android App',
        client: 'PulseFit Health',
        imageBg: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
        accentColor: '#ff9100',
        summary: 'Health tracking platform with Bluetooth smart device synchronization.',
        tags: ['Mobile App', 'Flutter', 'HealthKit', 'Firebase']
      },
      {
        id: 'p4',
        category: 'web',
        title: 'Apex Marketplace Platform',
        client: 'Apex Retail',
        imageBg: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
        accentColor: '#ffd700',
        summary: 'Multi-vendor e-commerce platform serving over 200,000 monthly active users.',
        tags: ['E-Commerce', 'Node.js', 'Stripe', 'Redis']
      }
    ]
  });
});

// 5. Testimonials API
app.get('/api/testimonials', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 't1',
        name: 'David Vance',
        role: 'CTO, FinEdge Capital',
        avatar: '👨‍💼',
        content: 'VST Tech Solutions completely revamped our digital stack. Their attention to design detail and backend performance is second to none!',
        rating: 5
      },
      {
        id: 't2',
        name: 'Elena Rostova',
        role: 'Head of Operations, OmniLogistics',
        avatar: '👩‍💻',
        content: 'The custom AI automation bot created by VST Tech saved our support team over 120 hours per month. Flawless execution and communication.',
        rating: 5
      },
      {
        id: 't3',
        name: 'Marcus Thorne',
        role: 'Founder, PulseFit',
        avatar: '🚀',
        content: 'Building our mobile app with VST Tech was the best decision we made. We hit #1 in our app store category within 3 weeks of launch.',
        rating: 5
      }
    ]
  });
});

// 6. Contact Form Submission (POST /api/contact)
app.post('/api/contact', (req, res) => {
  const { name, email, service, budget, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name, email, and message.'
    });
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  const newInquiry = db.addInquiry({ name, email, service, budget, message });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received. Our team will contact you within 24 hours.',
    referenceId: newInquiry.id,
    data: newInquiry
  });
});

// 7. Newsletter Subscription (POST /api/subscribe)
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  const result = db.addSubscriber(email);

  if (result.status === 'exists') {
    return res.json({
      success: true,
      message: 'You are already subscribed to VST Tech Insights!'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to VST Tech tech updates and insights!'
  });
});

// 8. Interactive Project Quote Calculation (POST /api/quote)
app.post('/api/quote', (req, res) => {
  const { serviceType, features = [], timeline, clientEmail } = req.body;

  let basePrice = 2500;
  if (serviceType === 'Web Engineering & SaaS') basePrice = 3000;
  if (serviceType === 'Native & Cross-Platform Mobile') basePrice = 4500;
  if (serviceType === 'AI & Automation Ecosystems') basePrice = 5000;
  if (serviceType === 'Cloud Infrastructure & DevOps') basePrice = 3500;

  const featureCost = (features.length || 0) * 800;
  let multiplier = 1.0;
  if (timeline === 'Rush (1-2 Weeks)') multiplier = 1.35;
  if (timeline === 'Standard (3-5 Weeks)') multiplier = 1.0;
  if (timeline === 'Flexible (6+ Weeks)') multiplier = 0.9;

  const totalEstimate = Math.round((basePrice + featureCost) * multiplier);

  const savedQuote = db.saveQuote({
    serviceType,
    features,
    timeline,
    estimatedCost: totalEstimate,
    clientEmail: clientEmail || 'Anonymous Visitor'
  });

  res.json({
    success: true,
    data: {
      quoteId: savedQuote.id,
      estimatedCost: totalEstimate,
      currency: 'USD',
      formattedEstimate: `$${totalEstimate.toLocaleString()}`,
      breakdown: {
        basePrice,
        featureAddons: featureCost,
        timelineAdjustment: `${Math.round((multiplier - 1) * 100)}%`
      }
    }
  });
});

// 9. Interactive AI Bot Chat Endpoint (POST /api/ai-chat)
app.post('/api/ai-chat', (req, res) => {
  const { message } = req.body;
  const userMsg = (message || '').toLowerCase().trim();

  let botReply = "Hello! I am VST Assistant AI 🤖. How can VST Tech Solutions help elevate your digital product today?";

  if (userMsg.includes('service') || userMsg.includes('offer') || userMsg.includes('do you do')) {
    botReply = "VST Tech specializes in 3 core engineering domains:\n1. 🌐 Web & SaaS Engineering\n2. 📱 Mobile Apps (iOS/Android)\n3. 🤖 AI Automations & LLM Bots\nWhich area are you most interested in?";
  } else if (userMsg.includes('price') || userMsg.includes('cost') || userMsg.includes('quote') || userMsg.includes('budget')) {
    botReply = "Our custom projects typically start around $2,500 - $5,000 depending on scope. You can use our live Project Quote Calculator below to build an instant estimate!";
  } else if (userMsg.includes('contact') || userMsg.includes('hire') || userMsg.includes('email') || userMsg.includes('talk')) {
    botReply = "You can send us a message right here via our Contact section below, or email our engineering director directly at hello@vsttechsolutions.com!";
  } else if (userMsg.includes('time') || userMsg.includes('how long') || userMsg.includes('duration')) {
    botReply = "Most MVP projects take 2 to 6 weeks from initial design sprint to production launch. We prioritize agile, rapid releases!";
  } else if (userMsg.includes('hello') || userMsg.includes('hi') || userMsg.includes('hey')) {
    botReply = "Greetings! Welcome to VST Tech Solutions. How can we accelerate your software roadmap?";
  } else {
    botReply = `Thanks for asking! As an automated preview bot for VST Tech Solutions, I can confirm our engineering team can build custom solutions tailored for "${message}". Would you like to submit a project inquiry?`;
  }

  db.logAIChat(message, botReply);

  res.json({
    success: true,
    reply: botReply
  });
});

// Fallback to index.html for single-page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`====================================================`);
    console.log(`🚀 VST Tech Solutions Server running on port ${port}`);
    console.log(`🌐 Local Web App: http://localhost:${port}`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);

