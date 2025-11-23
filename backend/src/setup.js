const { db } = require('./db');

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create organisations table
      db.run(`
        CREATE TABLE IF NOT EXISTS organisations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          organisation_id INTEGER NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organisation_id) REFERENCES organisations(id)
        )
      `);

      // Create employees table
      db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          organisation_id INTEGER NOT NULL,
          first_name TEXT,
          last_name TEXT,
          email TEXT,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organisation_id) REFERENCES organisations(id)
        )
      `);

      // Create teams table
      db.run(`
        CREATE TABLE IF NOT EXISTS teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          organisation_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organisation_id) REFERENCES organisations(id)
        )
      `);

      // Create employee_teams join table
      db.run(`
        CREATE TABLE IF NOT EXISTS employee_teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          employee_id INTEGER NOT NULL,
          team_id INTEGER NOT NULL,
          assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
          FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
          UNIQUE(employee_id, team_id)
        )
      `);

      // Create logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          organisation_id INTEGER,
          user_id INTEGER,
          action TEXT NOT NULL,
          meta TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('All tables created successfully');
          resolve();
        }
      });
    });
  });
};

// Run setup if executed directly (npm run setup)
if (require.main === module) {
  createTables()
    .then(() => {
      console.log(' Database setup complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error(' Setup failed:', err);
      process.exit(1);
    });
}


module.exports = { createTables };