# HRMS Backend - Human Resource Management System

A complete Node.js backend API for managing employees, teams, and organisations with authentication and audit logging.

## Features

- ✅ Organisation management with multi-tenancy
- ✅ JWT authentication with secure password hashing
- ✅ Full CRUD operations for employees and teams
- ✅ Many-to-many relationship between employees and teams
- ✅ Comprehensive audit logging for all operations
- ✅ SQLite3 database (easy setup, no external DB required)
- ✅ RESTful API design
- ✅ Error handling and input validation

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** SQLite3
- **Authentication:** JWT + bcrypt
- **Other:** dotenv, cors



## Installation

### 1. Clone or Create Project Directory

```bash
mkdir hrms-backend
cd hrms-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

### 4. Initialize Database

Run the setup script to create all database tables:

```bash
npm run setup
```

This creates `hrms.db` file with all necessary tables.

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register Organisation & Admin User
```http
POST /api/auth/register
Content-Type: application/json

{
  "orgName": "Acme Corporation",
  "adminName": "John Doe",
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Organisation and admin user created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "admin@acme.com",
    "organisationId": 1,
    "organisationName": "Acme Corporation"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Employee Endpoints

All employee endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

#### List All Employees
```http
GET /api/employees
```

#### Get Single Employee
```http
GET /api/employees/:id
```

#### Create Employee
```http
POST /api/employees
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@acme.com",
  "phone": "+1234567890"
}
```

#### Update Employee
```http
PUT /api/employees/:id
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith-Johnson",
  "email": "jane.johnson@acme.com",
  "phone": "+1234567890"
}
```

#### Delete Employee
```http
DELETE /api/employees/:id
```

### Team Endpoints

#### List All Teams
```http
GET /api/teams
```

Response includes employee count and list for each team.

#### Get Single Team
```http
GET /api/teams/:id
```

#### Create Team
```http
POST /api/teams
Content-Type: application/json

{
  "name": "Engineering",
  "description": "Software development team"
}
```

#### Update Team
```http
PUT /api/teams/:id
Content-Type: application/json

{
  "name": "Engineering & DevOps",
  "description": "Updated description"
}
```

#### Delete Team
```http
DELETE /api/teams/:id
```

#### Assign Employee(s) to Team
```http
POST /api/teams/:teamId/assign
Content-Type: application/json

// Single employee
{
  "employeeId": 5
}

// Or multiple employees
{
  "employeeIds": [5, 7, 9]
}
```

#### Unassign Employee from Team
```http
DELETE /api/teams/:teamId/unassign
Content-Type: application/json

{
  "employeeId": 5
}
```

### Audit Log Endpoints

#### Get Logs
```http
GET /api/logs?limit=100
```

Returns audit trail of all operations (login, logout, CRUD operations, assignments).

## Database Schema

### Tables

- **organisations** - Company/organisation records
- **users** - User accounts (linked to organisations)
- **employees** - Employee records
- **teams** - Team records
- **employee_teams** - Many-to-many join table
- **logs** - Audit trail for all operations

### Key Features

- Foreign key constraints for data integrity
- Cascade deletes for employee-team relationships
- Automatic timestamps on all tables
- JSON metadata storage for flexible logging

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"orgName":"Test Corp","adminName":"Admin","email":"admin@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}'

# Create employee (use token from login)
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@test.com"}'
```

### Using Postman

1. Import the endpoints listed above
2. Set up an environment variable for the token
3. Use `{{token}}` in Authorization headers

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 8-hour expiration
- Organisation-level data isolation
- SQL injection protection via parameterized queries
- CORS enabled for frontend integration

## Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development mode
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Audit Logging

Every significant action is logged:

- User login/logout
- Organisation creation
- Employee CRUD operations
- Team CRUD operations
- Employee-team assignments/unassignments

Logs include:
- User who performed the action
- Action type
- Timestamp
- Relevant metadata (IDs, names, changes)

## Development Tips

### Database Reset

To reset the database:

```bash
rm hrms.db
npm run setup
```

### View Database

Use SQLite

```bash
sqlite3 hrms.db
.tables
SELECT * FROM users;
```

### Hot Reload

Use `npm run dev` with nodemon for automatic server restart on file changes.

## Deployment

### Environment Variables for Production

```bash
PORT=5000
JWT_SECRET=use_a_strong_random_string_here
NODE_ENV=production
```

### Deployment Platforms

- **Heroku:** Add Procfile with `web: node src/index.js`
- **Railway:** Automatically detects Node.js
- **Render:** Use build command `npm install` and start command `npm start`
- **VPS:** Use PM2 for process management

### Database in Production

For production, consider:
- Using PostgreSQL or MySQL instead of SQLite
- Regular database backups
- Connection pooling
- Read replicas for scaling

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env or kill the process
lsof -ti:5000 | xargs kill
```

**Database locked:**
```bash
# Close all connections or restart server
```

**JWT errors:**
- Ensure JWT_SECRET is set in .env
- Check token expiration (7 days)

## License

ISC

