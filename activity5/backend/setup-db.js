const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS act5_blog');
    
    // Use the database
    await connection.query('USE act5_blog');

    // Drop existing posts table if it exists
    await connection.query('DROP TABLE IF EXISTS posts');

    // Create accounts table if not exists (this is our users table)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create posts table with correct foreign key reference to accounts
    await connection.query(`
      CREATE TABLE posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES accounts(userID)
      )
    `);

    // Create comments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES accounts(userID)
      )
    `);

    console.log('Database and tables created successfully');
    await connection.end();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();