CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT DEFAULT 'official',
  category TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  trust_score INTEGER DEFAULT 80,
  last_checked_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  notice_hash TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL,
  organisation TEXT,
  location TEXT,
  source_url TEXT NOT NULL,
  official_pdf_url TEXT,
  stored_pdf_key TEXT,
  published_date TEXT,
  closing_date TEXT,
  eligibility TEXT,
  application_url TEXT,
  confidence_score INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending',
  publication_status TEXT DEFAULT 'draft',
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT,
  mobile TEXT,
  email TEXT,
  whatsapp_opt_in INTEGER DEFAULT 0,
  email_opt_in INTEGER DEFAULT 0,
  preferred_categories TEXT,
  preferred_locations TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  notice_id INTEGER NOT NULL,
  subscriber_id INTEGER NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_response TEXT,
  sent_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notice_category
ON notices(category);

CREATE INDEX IF NOT EXISTS idx_notice_status
ON notices(publication_status);

CREATE INDEX IF NOT EXISTS idx_notice_closing_date
ON notices(closing_date);

npx wrangler d1 execute medorbit-notices --file=schema.sql --remote