-- Test data for FAQ application
-- This file is loaded during test execution to populate the H2 database

-- Insert test categories
INSERT INTO categories (id, name, description, display_order, active, created_at, updated_at) VALUES
(1, 'General Questions', 'General questions about our services', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Technical Support', 'Technical support and troubleshooting', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Billing', 'Billing and payment related questions', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Account Management', 'Account setup and management', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Inactive Category', 'This category is inactive for testing', 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test FAQs
INSERT INTO faqs (id, question, answer, category_id, tags, priority, active, view_count, helpful_count, not_helpful_count, created_at, updated_at) VALUES
(1, 'What is this service?', 'This is a comprehensive FAQ management system that helps organizations manage their frequently asked questions efficiently.', 1, 'service,general,introduction', 1, true, 150, 45, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'How do I get started?', 'To get started, simply create an account and follow our step-by-step onboarding guide. You can access it from the main dashboard.', 1, 'getting-started,onboarding,guide', 2, true, 120, 38, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'How do I reset my password?', 'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions sent to your email.', 2, 'password,reset,login,security', 1, true, 200, 67, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Why is my application not working?', 'If your application is not working, please check your internet connection, clear your browser cache, and try again. If the problem persists, contact our support team.', 2, 'troubleshooting,application,support', 2, true, 89, 23, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'How do I update my billing information?', 'You can update your billing information by going to Account Settings > Billing and clicking on "Update Payment Method".', 3, 'billing,payment,account,update', 1, true, 75, 19, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'What payment methods do you accept?', 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.', 3, 'payment,methods,credit-card,paypal', 2, true, 95, 28, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'How do I change my email address?', 'To change your email address, go to Account Settings > Profile and update your email. You will need to verify the new email address.', 4, 'email,account,profile,change', 1, true, 60, 15, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Can I delete my account?', 'Yes, you can delete your account by going to Account Settings > Privacy and clicking on "Delete Account". Please note that this action is irreversible.', 4, 'account,delete,privacy,irreversible', 3, true, 45, 12, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Is my data secure?', 'Yes, we take data security very seriously. All data is encrypted in transit and at rest, and we follow industry best practices for security.', 1, 'security,data,encryption,privacy', 1, true, 180, 52, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'How do I contact support?', 'You can contact our support team through the Help Center, by email at support@example.com, or through the live chat feature available 24/7.', 2, 'support,contact,help,chat,email', 1, true, 110, 31, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'What are your business hours?', 'Our customer support is available 24/7. Our business development team is available Monday to Friday, 9 AM to 6 PM EST.', 1, 'business-hours,support,availability', 2, true, 85, 22, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Do you offer refunds?', 'Yes, we offer a 30-day money-back guarantee for all our services. Please contact our billing team to process your refund request.', 3, 'refund,money-back,guarantee,billing', 1, true, 70, 18, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'How do I upgrade my plan?', 'You can upgrade your plan at any time by going to Account Settings > Subscription and selecting a higher tier plan.', 3, 'upgrade,plan,subscription,tier', 2, true, 55, 14, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Can I export my data?', 'Yes, you can export your data in various formats (CSV, JSON, XML) from the Data Export section in your account settings.', 4, 'export,data,csv,json,xml', 2, true, 40, 10, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Inactive FAQ for testing', 'This FAQ is inactive and should not appear in public searches.', 5, 'inactive,test', 1, false, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequences for H2 database
ALTER SEQUENCE categories_seq RESTART WITH 6;
ALTER SEQUENCE faqs_seq RESTART WITH 16;

-- Create indexes for better search performance in tests
CREATE INDEX IF NOT EXISTS idx_faqs_question_search ON faqs(question);
CREATE INDEX IF NOT EXISTS idx_faqs_answer_search ON faqs(answer);
CREATE INDEX IF NOT EXISTS idx_faqs_tags_search ON faqs(tags);
CREATE INDEX IF NOT EXISTS idx_faqs_category_active ON faqs(category_id, active);
CREATE INDEX IF NOT EXISTS idx_faqs_view_count ON faqs(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_helpful_count ON faqs(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON categories(active, display_order);

-- Insert some additional test data for pagination and search testing
INSERT INTO faqs (question, answer, category_id, tags, priority, active, view_count, helpful_count, not_helpful_count, created_at, updated_at) VALUES
('Search Test Question Alpha', 'This is a search test answer with keyword alpha for testing search functionality.', 1, 'search,test,alpha', 3, true, 5, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Search Test Question Beta', 'This is a search test answer with keyword beta for testing search functionality.', 1, 'search,test,beta', 3, true, 3, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Search Test Question Gamma', 'This is a search test answer with keyword gamma for testing search functionality.', 2, 'search,test,gamma', 3, true, 7, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pagination Test Question 1', 'This is pagination test content number 1.', 1, 'pagination,test', 3, true, 1, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pagination Test Question 2', 'This is pagination test content number 2.', 1, 'pagination,test', 3, true, 2, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Commit the transaction
COMMIT;