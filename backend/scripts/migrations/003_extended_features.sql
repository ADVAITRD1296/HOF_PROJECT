-- 003_extended_features.sql
-- Migration for Shareable Case Card and Journey Tracker

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table for Case Cards (Feature 1)
CREATE TABLE IF NOT EXISTS case_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Optional link to user table if it exists
    case_summary TEXT NOT NULL,
    case_title TEXT NOT NULL,
    applicable_sections TEXT[] NOT NULL,
    key_steps JSONB NOT NULL, -- Array of action steps
    user_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shareable_link TEXT NOT NULL -- Format: /case/{id}
);

-- 2. Table for Journeys (Feature 4)
CREATE TABLE IF NOT EXISTS journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT, -- User ID or session_id as specified
    session_id TEXT,
    case_type TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    status TEXT DEFAULT 'initiated',
    current_step INTEGER DEFAULT 1,
    steps_completed JSONB DEFAULT '[]'::jsonb, -- Array of objects: {step_name, step_status, notes, timestamp}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public lookup of case cards
CREATE INDEX IF NOT EXISTS idx_case_cards_id ON case_cards(id);

-- Index for user journeys
CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_session_id ON journeys(session_id);
