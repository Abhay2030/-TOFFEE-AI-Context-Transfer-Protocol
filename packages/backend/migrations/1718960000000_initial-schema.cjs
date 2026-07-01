/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    -- Users
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        auth_provider VARCHAR(20) DEFAULT 'email',
        plan_tier VARCHAR(20) DEFAULT 'free',
        mfa_enabled BOOLEAN DEFAULT false,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Toffee Bundles
    CREATE TABLE toffee_bundles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(255),
        source_platform VARCHAR(50) NOT NULL,
        source_model VARCHAR(100),
        compression_profile VARCHAR(20) DEFAULT 'standard',
        token_count_original INT NOT NULL,
        token_count_bundle INT NOT NULL,
        compression_ratio DECIMAL(4,3),
        s3_key VARCHAR(500),
        tags TEXT[] DEFAULT '{}',
        is_public BOOLEAN DEFAULT false,
        version INT DEFAULT 1,
        parent_id UUID REFERENCES toffee_bundles(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX idx_bundles_user ON toffee_bundles(user_id);
    CREATE INDEX idx_bundles_tags ON toffee_bundles USING GIN(tags);

    -- Share Links
    CREATE TABLE share_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bundle_id UUID REFERENCES toffee_bundles(id) ON DELETE CASCADE,
        created_by UUID REFERENCES users(id),
        token VARCHAR(64) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        expires_at TIMESTAMPTZ NOT NULL,
        access_count INT DEFAULT 0,
        max_access INT DEFAULT 100,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Injection Events
    CREATE TABLE injection_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        bundle_id UUID REFERENCES toffee_bundles(id),
        target_platform VARCHAR(50) NOT NULL,
        tokens_injected INT NOT NULL,
        injection_mode VARCHAR(20),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Token Usage
    -- Standard table (partitioning can be added later if needed for scale)
    CREATE TABLE token_usage_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        event_type VARCHAR(30) NOT NULL,
        tokens_consumed INT NOT NULL,
        api_cost_usd DECIMAL(10,6),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Audit Log
    CREATE TABLE audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        action_type VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50),
        resource_id UUID,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX idx_audit_user ON audit_log(user_id, created_at);
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS audit_log;
    DROP TABLE IF EXISTS token_usage_log;
    DROP TABLE IF EXISTS injection_events;
    DROP TABLE IF EXISTS share_links;
    DROP TABLE IF EXISTS toffee_bundles;
    DROP TABLE IF EXISTS users;
  `);
};
