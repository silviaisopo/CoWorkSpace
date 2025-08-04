-- Users Table: Stores user information, including their role.
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' -- Can be 'user' or 'manager'
);

-- Locations Table: Stores information about each coworking location.
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES users(id) -- A location can have a dedicated manager.
);

-- Workspaces Table: Describes the different types of spaces available at a location.
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- e.g., 'Private Room', 'Flex Desk', 'Meeting Room'
    capacity INTEGER NOT NULL,
    price_per_hour NUMERIC(10, 2) NOT NULL
);

-- Services Table: Lists all possible services that can be offered.
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Workspace_Services Join Table: Maps which services are available for each workspace (many-to-many).
CREATE TABLE workspace_services (
    workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (workspace_id, service_id)
);

-- Bookings Table: Stores booking information.
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' -- e.g., 'pending', 'confirmed', 'cancelled'
);

-- Payments Table: Stores payment details for each booking.
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'completed', -- e.g., 'pending', 'completed', 'failed'
    transaction_id VARCHAR(255) -- To store the ID from the payment gateway.
);
