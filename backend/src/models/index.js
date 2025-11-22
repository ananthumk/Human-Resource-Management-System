const { dbRun, dbGet, dbAll } = require('../db');

// Organisation Model
const Organisation = {
  create: async (name) => {
    const result = await dbRun('INSERT INTO organisations (name) VALUES (?)', [name]);
    return { id: result.id, name };
  },
  
  findById: async (id) => {
    return await dbGet('SELECT * FROM organisations WHERE id = ?', [id]);
  }
};

// User Model
const User = {
  create: async (organisationId, email, passwordHash, name) => {
    const result = await dbRun(
      'INSERT INTO users (organisation_id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [organisationId, email, passwordHash, name]
    );
    return { id: result.id, organisationId, email, name };
  },
  
  findByEmail: async (email) => {
    return await dbGet('SELECT * FROM users WHERE email = ?', [email]);
  },
  
  findById: async (id) => {
    return await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  }
};

// Employee Model
const Employee = {
  create: async (organisationId, firstName, lastName, email, phone) => {
    const result = await dbRun(
      'INSERT INTO employees (organisation_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [organisationId, firstName, lastName, email, phone]
    );
    return { id: result.id, organisationId, firstName, lastName, email, phone };
  },
  
  findAll: async (organisationId) => {
    return await dbAll('SELECT * FROM employees WHERE organisation_id = ?', [organisationId]);
  },
  
  findById: async (id, organisationId) => {
    return await dbGet(
      'SELECT * FROM employees WHERE id = ? AND organisation_id = ?',
      [id, organisationId]
    );
  },
  
  update: async (id, organisationId, firstName, lastName, email, phone) => {
    await dbRun(
      'UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ? AND organisation_id = ?',
      [firstName, lastName, email, phone, id, organisationId]
    );
    return { id, firstName, lastName, email, phone };
  },
  
  delete: async (id, organisationId) => {
    const result = await dbRun(
      'DELETE FROM employees WHERE id = ? AND organisation_id = ?',
      [id, organisationId]
    );
    return result.changes > 0;
  },
  
  getTeams: async (employeeId, organisationId) => {
    return await dbAll(
      `SELECT t.* FROM teams t
       INNER JOIN employee_teams et ON t.id = et.team_id
       WHERE et.employee_id = ? AND t.organisation_id = ?`,
      [employeeId, organisationId]
    );
  }
};

// Team Model
const Team = {
  create: async (organisationId, name, description) => {
    const result = await dbRun(
      'INSERT INTO teams (organisation_id, name, description) VALUES (?, ?, ?)',
      [organisationId, name, description]
    );
    return { id: result.id, organisationId, name, description };
  },
  
  findAll: async (organisationId) => {
    return await dbAll('SELECT * FROM teams WHERE organisation_id = ?', [organisationId]);
  },
  
  findById: async (id, organisationId) => {
    return await dbGet(
      'SELECT * FROM teams WHERE id = ? AND organisation_id = ?',
      [id, organisationId]
    );
  },
  
  update: async (id, organisationId, name, description) => {
    await dbRun(
      'UPDATE teams SET name = ?, description = ? WHERE id = ? AND organisation_id = ?',
      [name, description, id, organisationId]
    );
    return { id, name, description };
  },
  
  delete: async (id, organisationId) => {
    const result = await dbRun(
      'DELETE FROM teams WHERE id = ? AND organisation_id = ?',
      [id, organisationId]
    );
    return result.changes > 0;
  },
  
  getEmployees: async (teamId, organisationId) => {
    return await dbAll(
      `SELECT e.* FROM employees e
       INNER JOIN employee_teams et ON e.id = et.employee_id
       WHERE et.team_id = ? AND e.organisation_id = ?`,
      [teamId, organisationId]
    );
  },
  
  assignEmployee: async (teamId, employeeId) => {
    try {
      await dbRun(
        'INSERT INTO employee_teams (team_id, employee_id) VALUES (?, ?)',
        [teamId, employeeId]
      );
      return true;
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return false; // Already assigned
      }
      throw err;
    }
  },
  
  unassignEmployee: async (teamId, employeeId) => {
    const result = await dbRun(
      'DELETE FROM employee_teams WHERE team_id = ? AND employee_id = ?',
      [teamId, employeeId]
    );
    return result.changes > 0;
  }
};

// Log Model
const Log = {
  create: async (organisationId, userId, action, meta) => {
    const metaJson = meta ? JSON.stringify(meta) : null;
    await dbRun(
      'INSERT INTO logs (organisation_id, user_id, action, meta) VALUES (?, ?, ?, ?)',
      [organisationId, userId, action, metaJson]
    );
  },
  
  findAll: async (organisationId, limit = 100) => {
    const logs = await dbAll(
      'SELECT * FROM logs WHERE organisation_id = ? ORDER BY timestamp DESC LIMIT ?',
      [organisationId, limit]
    );
    return logs.map(log => ({
      ...log,
      meta: log.meta ? JSON.parse(log.meta) : null
    }));
  }
};

module.exports = {
  Organisation,
  User,
  Employee,
  Team,
  Log
};