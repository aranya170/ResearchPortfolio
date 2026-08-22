-- Aranya Portfolio PostgreSQL Schema

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site Profile / Intro Sector
CREATE TABLE IF NOT EXISTS site_profile (
    id SERIAL PRIMARY KEY,
    greeting VARCHAR(100) DEFAULT 'Hi there! I''m',
    name VARCHAR(150) DEFAULT 'Aranya Kishor Das',
    subtitle VARCHAR(255) DEFAULT 'AI Researcher & Robotics Enthusiast',
    subtitle_suffix VARCHAR(255) DEFAULT 'dedicated to Intelligent Systems.',
    description TEXT,
    cv_url VARCHAR(500) DEFAULT '/assets/My_CV.pdf',
    show_robot BOOLEAN DEFAULT TRUE,
    show_stars BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- About Sector
CREATE TABLE IF NOT EXISTS about_section (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) DEFAULT 'About Me',
    profile_image VARCHAR(500) DEFAULT '/assets/Aranya Kishor Das.png',
    name VARCHAR(150) DEFAULT 'Aranya Kishor Das',
    role VARCHAR(255) DEFAULT 'Undergraduate Researcher & Club President',
    affiliation VARCHAR(255) DEFAULT 'United International University',
    core_focus VARCHAR(255) DEFAULT 'Deep Learning, Autonomous Robotics, Kinematics',
    location VARCHAR(255) DEFAULT 'Dhaka, Bangladesh',
    paragraphs JSONB DEFAULT '[]'::jsonb,
    pillars JSONB DEFAULT '[]'::jsonb,
    timeline_link_text VARCHAR(255) DEFAULT 'View my timeline to learn more about my unique journey',
    contact_button_text VARCHAR(100) DEFAULT 'Get in Touch',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'Software', 'Research', etc.
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    github VARCHAR(500),
    website VARCHAR(500),
    medium VARCHAR(500),
    tableau VARCHAR(500),
    dataset VARCHAR(500),
    tags JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Files (Code viewer tabs / Readmes / SQL / Notebooks)
CREATE TABLE IF NOT EXISTS project_files (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'notebook', 'code', 'website'
    content TEXT,
    language VARCHAR(100) DEFAULT 'markdown',
    sort_order INT DEFAULT 0
);

-- Experience / Job History
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    descriptions JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Timeline Milestones
CREATE TABLE IF NOT EXISTS timeline_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    year VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'startup', -- 'startup', 'statistics', 'education', 'research', 'career'
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tech Stack
CREATE TABLE IF NOT EXISTS tech_stack (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    icon_name VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT '#64D98A',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Inbound Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Global Site Settings & Socials
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
