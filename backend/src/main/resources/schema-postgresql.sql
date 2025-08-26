-- FAQ System Database Schema for PostgreSQL
-- Execute this script to create the database structure

-- Create database (run as superuser)
-- CREATE DATABASE faqdb;
-- CREATE USER faq_user WITH PASSWORD 'faq_password';
-- GRANT ALL PRIVILEGES ON DATABASE faqdb TO faq_user;

-- Connect to faqdb and run the following:

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    answer VARCHAR(3000) NOT NULL,
    tags TEXT[], -- PostgreSQL array type
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    author VARCHAR(255) DEFAULT 'System',
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(active);
CREATE INDEX IF NOT EXISTS idx_faqs_priority ON faqs(priority);
CREATE INDEX IF NOT EXISTS idx_faqs_view_count ON faqs(view_count);
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_faqs_question_search ON faqs USING gin(to_tsvector('portuguese', question));
CREATE INDEX IF NOT EXISTS idx_faqs_answer_search ON faqs USING gin(to_tsvector('portuguese', answer));
CREATE INDEX IF NOT EXISTS idx_categories_name_search ON categories USING gin(to_tsvector('portuguese', name));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();