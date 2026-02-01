CREATE TABLE
    donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        donor_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        how VARCHAR(15) NOT NULL,
        donation_date DATETIME,
        remark VARCHAR(255),
        verified BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
    );