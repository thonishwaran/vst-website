const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

const initialData = {
  inquiries: [
    {
      id: 'INQ-1001',
      name: 'Sarah Connor',
      email: 'sarah@techfuture.io',
      service: 'AI Solutions',
      budget: '$5,000 - $10,000',
      message: 'Looking to automate our customer service workflow with a custom AI bot.',
      status: 'New',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'INQ-1002',
      name: 'Alex Rivera',
      email: 'alex@fintechglobal.com',
      service: 'Web Development',
      budget: '$10,000+',
      message: 'Need a high-performance web dashboard with real-time financial analytics.',
      status: 'In Review',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  subscribers: [
    { id: 'SUB-1', email: 'tech.lead@innovate.co', subscribedAt: new Date().toISOString() }
  ],
  quotes: [
    {
      id: 'Q-501',
      serviceType: 'Mobile App Development',
      features: ['User Auth', 'Push Notifications', 'Payment Gateway'],
      timeline: '4-6 Weeks',
      estimatedCost: 7500,
      clientEmail: 'client@example.com',
      createdAt: new Date().toISOString()
    }
  ],
  ai_chats: []
};

// Initialize DB file if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

const db = {
  // Inquiries
  getInquiries: () => readDB().inquiries || [],
  addInquiry: (inquiryData) => {
    const data = readDB();
    const newInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: inquiryData.name,
      email: inquiryData.email,
      service: inquiryData.service || 'General Inquiry',
      budget: inquiryData.budget || 'Not Specified',
      message: inquiryData.message,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    data.inquiries.unshift(newInquiry);
    writeDB(data);
    return newInquiry;
  },

  // Newsletter Subscribers
  getSubscribers: () => readDB().subscribers || [],
  addSubscriber: (email) => {
    const data = readDB();
    const existing = data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { status: 'exists', subscriber: existing };
    }
    const newSub = {
      id: `SUB-${data.subscribers.length + 1}`,
      email,
      subscribedAt: new Date().toISOString()
    };
    data.subscribers.push(newSub);
    writeDB(data);
    return { status: 'created', subscriber: newSub };
  },

  // Project Quotes
  saveQuote: (quoteData) => {
    const data = readDB();
    const newQuote = {
      id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      ...quoteData,
      createdAt: new Date().toISOString()
    };
    data.quotes.unshift(newQuote);
    writeDB(data);
    return newQuote;
  },

  // AI Chat Logs
  logAIChat: (userMsg, botReply) => {
    const data = readDB();
    const chatLog = {
      id: `CHAT-${Date.now()}`,
      userMsg,
      botReply,
      timestamp: new Date().toISOString()
    };
    if (!data.ai_chats) data.ai_chats = [];
    data.ai_chats.unshift(chatLog);
    // Keep max 100 recent chats
    if (data.ai_chats.length > 100) data.ai_chats.pop();
    writeDB(data);
    return chatLog;
  }
};

module.exports = db;
