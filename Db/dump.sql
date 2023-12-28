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
    img VARCHAR(100),
    FOREIGN KEY (users_id) REFERENCES "users"(users_id)
);

-- Tạo bảng Guard
CREATE TABLE Guard (
    guard_id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    firstname VARCHAR(100),
	lastname VARCHAR(100),
    dob DATE,
	status INT,
	phone VARCHAR(15),
	gender boolean,
    address VARCHAR(200),
    img VARCHAR(100),
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
    companyname VARCHAR(100),
    customer_id INT,
    manager_id INT,
	service VARCHAR(255),
	address VARCHAR(100),
	country VARCHAR(100),
    quantity INT,
	booking_date timestamp,
    total_amount DECIMAL(10, 2),
	status INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (manager_id) REFERENCES Manager(manager_id)
);
Create Table DetailBooking(
	detail_booking_id SERIAL PRIMARY KEY,
	bookingName VARCHAR(100),
	time_start timestamp,
	time_end timestamp,
	FOREIGN KEY (bookingName) REFERENCES Booking(bookingName)
);
Create Table BookingGuard(
	bookingguardid SERIAL PRIMARY KEY,
	bookingName VARCHAR(100),
	guard_id INT NOT NULL,
	time_end timestamp,
	FOREIGN KEY (bookingName) REFERENCES Booking(bookingName),
	FOREIGN KEY (guard_id) REFERENCES Guard(guard_id)
);
CREATE TABLE Calendar (
    calendar_id SERIAL PRIMARY KEY,
    bookingName VARCHAR(100) NOT NULL,
    customer_id INT NOT NULL,
    guard_id INT,
    time_start timestamp,
    status INT,
    time_checkin timestamp,
    FOREIGN KEY (bookingName) REFERENCES Booking(bookingName),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (guard_id) REFERENCES Guard(guard_id)
);
CREATE TABLE Feedback (
    feedback_id SERIAL PRIMARY KEY,
    bookingName VARCHAR(100) NOT NULL,
    customer_id INT NOT NULL,
    guard_id INT NOT NULL,
    rating INT,
    comment TEXT,
    FOREIGN KEY (bookingName) REFERENCES Booking(bookingName),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (guard_id) REFERENCES Guard(guard_id)
);
-- Tạo bảng Payment
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    bookingName VARCHAR(100) NOT NULL,
    total DECIMAL(10, 2),
    payment_date timestamp,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (bookingName) REFERENCES Booking(bookingName)
);
CREATE TABLE News (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    publish_date timestamp,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES Manager(manager_id)
);
CREATE TABLE NotiCus (
    noticus_id SERIAL PRIMARY KEY,
    customer_id INT,
    guard_id INT,
    bookingname VARCHAR(100) NOT NULL,
    content TEXT,
    publish_date timestamp,
    manager_id INT,
    type VARCHAR(100),
    time_start timestamp,
    time_end timestamp
);
CREATE TABLE NotiGuard (
    noticus_id SERIAL PRIMARY KEY,
    customer_id INT,
    guard_id INT,
    bookingname VARCHAR(100) NOT NULL,
    content TEXT,
    publish_date timestamp,
    manager_id INT,
    type VARCHAR(100),
    time_start timestamp,
    time_end timestamp
);
CREATE TABLE NotiManager (
    noticus_id SERIAL PRIMARY KEY,
    customer_id INT,
    guard_id INT,
    bookingname VARCHAR(100) NOT NULL,
    content TEXT,
    publish_date timestamp,
    manager_id INT,
    type VARCHAR(100),
    time_start timestamp,
    time_end timestamp
);
