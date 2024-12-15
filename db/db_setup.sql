-- Table for Teams
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    parent_team_id INT REFERENCES teams(id) ON DELETE SET NULL, -- Hierarchical relationship
    metadata JSONB -- Metadata like department, focus
);

-- Table for Team Members
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE, -- Active status of the member by default
    avatar_url VARCHAR(255) NOT NULL
);

-- Table for available Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Table for Member-Team-Role Relationships
CREATE TABLE team_memberships (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE, -- Link to Teams
    member_id INT REFERENCES team_members(id) ON DELETE CASCADE, -- Link to Members
    role_id INT REFERENCES roles(id) ON DELETE SET NULL, -- Member's role in the team
    UNIQUE(team_id, member_id) -- A member can belong to a team only once
);
