-- Tạo bảng User
CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    role INT NOT NULL,
    email VARCHAR(50) NOT NULL,
    passwd VARCHAR(255) NOT NULL
);

-- Tạo bảng Customer
CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    firstname VARCHAR(100),
	lastname VARCHAR(100),
	phone VARCHAR(15),
    dob DATE,
	gender boolean,
    address VARCHAR(200),
    img BYTEA,
    FOREIGN KEY (users_id) REFERENCES "users"(users_id)
);

-- Tạo bảng Guard
CREATE TABLE Guard (
    guard_id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    firstname VARCHAR(100),
	lastname VARCHAR(100),
    dob DATE,
	phone VARCHAR(15),
	gender boolean,
    address VARCHAR(200),
    img BYTEA,
    salary DECIMAL,
    FOREIGN KEY (users_id) REFERENCES "users"(users_id)
);

-- Tạo bảng Manager
CREATE TABLE Manager (
    manager_id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES "users"(users_id)
);

-- Tạo bảng Booking
CREATE TABLE Booking (
    bookingName VARCHAR(100)PRIMARY KEY,
    customer_id INT NOT NULL,
    manager_id INT NOT NULL,
	service VARCHAR(255),
	address VARCHAR(100),
	country VARCHAR(100),
    quantity INT,
	booking_date DATETIME,
    total_amount DECIMAL(10, 2),
	status VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (manager_id) REFERENCES Manager(manager_id)
);
Create Table DetailBooking (
	detail_booking_id SERIAL PRIMARY KEY,
	bookingName VARCHAR(100),
	time_start DATETIME,
	time_end DATETIME
	FOREIGN KEY (bookingName) REFERENCES Booking(bookingName),
)
CREATE TABLE Calendar (
    calendar_id SERIAL PRIMARY KEY,
    bookingName VARCHAR(100) NOT NULL,
    customer_id INT NOT NULL,
    guard_id INT NOT NULL,
    time_start DATETIME,
    status VARCHAR(10),
    time_checkin DATETIME,
    FOREIGN KEY (bookingName) REFERENCES Booking(bookingName),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (guard_id) REFERENCES Guard(guard_id)
);
CREATE TABLE Feedback (
    feedback_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    customer_id INT NOT NULL,
    guard_id INT NOT NULL,
    rating INT,
    comment TEXT,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (guard_id) REFERENCES Guard(guard_id)
);
-- Tạo bảng Payment
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    booking_id INT NOT NULL,
    total DECIMAL(10, 2),
    payment_date DATE,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);
CREATE TABLE News (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    publish_date DATE,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES Manager(manager_id)
);