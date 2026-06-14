CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE organization (
    id_organization UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    id_legal_person VARCHAR(20)
);

CREATE TABLE users (
id_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rut VARCHAR(12),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL, 
    account_status VARCHAR(20),  
    admin_observations TEXT,
    token_version INT NOT NULL DEFAULT 1,
    id_organization UUID,

    CONSTRAINT fk_users_organization
        FOREIGN KEY (id_organization)
        REFERENCES organization (id_organization)
);

CREATE TABLE user_addresses (
    id_address UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    alias VARCHAR(50) NOT NULL,
    full_address VARCHAR(255) NOT NULL,

    CONSTRAINT fk_address_user
        FOREIGN KEY (id_user)
        REFERENCES users (id_user) ON DELETE CASCADE
);

CREATE TABLE emergency_contacts (
    id_contact UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,

    CONSTRAINT fk_contact_user
        FOREIGN KEY (id_user)
        REFERENCES users (id_user) ON DELETE CASCADE
);

CREATE TABLE route (
	id_route UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_supervisor UUID,
    route_name VARCHAR(100) NOT NULL,
    description TEXT,
    starting_datetime TIMESTAMP,
    ending_datetime TIMESTAMP,
    min_volunteers INT,
    max_capacity INT,
    starting_latitude DECIMAL(10,8),
    starting_longitude DECIMAL(11,8),
    ending_latitude DECIMAL(10,8),
    ending_longitude DECIMAL(11,8),
    transport_type VARCHAR(50),
    distance_meters DECIMAL(10,2),
    base_points JSONB,
    street_geometry JSONB,
    status VARCHAR(30), 

    CONSTRAINT fk_route_supervisor
        FOREIGN KEY (id_supervisor)
        REFERENCES users (id_user)
);

CREATE TABLE route_enrollment (
    id_route UUID NOT NULL,
    id_volunteer UUID NOT NULL,
    enrollment_date TIMESTAMP,
    activity_type VARCHAR(50),
    confirmation_status VARCHAR(50),

    PRIMARY KEY (id_route, id_volunteer),

    CONSTRAINT fk_enrollment_route
        FOREIGN KEY (id_route)
        REFERENCES route (id_route),

    CONSTRAINT fk_enrollment_volunteer
        FOREIGN KEY (id_volunteer)
        REFERENCES users (id_user)
);

CREATE TABLE location_updates (
    id_location UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    id_route UUID NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    sos_active SMALLINT NOT NULL DEFAULT 0,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_location_user
        FOREIGN KEY (id_user)
        REFERENCES users (id_user),

    CONSTRAINT fk_location_route
        FOREIGN KEY (id_route)
        REFERENCES route (id_route)
);

CREATE TABLE organization_documents (
    id_document UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_organization UUID NOT NULL,
    file_name VARCHAR(100) NOT NULL,
    content_base64 TEXT,
    document_status VARCHAR(30), 
    verification_notes TEXT,
    approval_date DATE,

    CONSTRAINT fk_orgdoc_organization
        FOREIGN KEY (id_organization)
        REFERENCES organization (id_organization)
);

CREATE INDEX idx_users_organization ON users (id_organization);
CREATE INDEX idx_route_supervisor ON route (id_supervisor);
CREATE INDEX idx_enrollment_route ON route_enrollment (id_route);
CREATE INDEX idx_enrollment_volunteer ON route_enrollment (id_volunteer);
CREATE INDEX idx_location_user ON location_updates (id_user);
CREATE INDEX idx_location_route ON location_updates (id_route);
CREATE INDEX idx_orgdoc_organization ON organization_documents (id_organization);