# Human Resource Management System - Frontend

This is the frontend application for the Human Resource Management System (HRMS), developed using React, React Router, and Tailwind CSS. It provides the user interface for managing employees, teams, activity logs, and authentication.

## Features

- User authentication with protected routes
- Employee management: add, update, delete, and search employees
- Team management: create, edit, delete teams and assign employees
- Activity logs with search and pagination
- Responsive design with desktop and mobile navigation

## Tech Stack

- React 18+
- React Router v6
- Axios for HTTP requests
- Tailwind CSS for styling
- React Icons for icons
- Hosted frontend on Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or higher) and npm/yarn installed
- Backend API running and accessible with proper URL and authentication token

### Installation


1. Install dependencies:

npm install

or
yarn

text

2. Create a `.env` file in the root (optional) to define environment variables, e.g.:

REACT_APP_API_URL='https://human-resource-management-system-c8rg.onrender.com/api/'

text

3. Start the development server:

npm start

or
yarn start

text

Your app should be running at `http://localhost:3000`.

## Usage

- Visit `/login` to sign in.
- Navigate through Dashboard, Employees, Teams, and Logs via the navigation bar.
- Use the floating action button to add new employees.
- Manage teams and assign employees.
- Search and paginate activity logs.

## Deployment

- The project is deployed on Vercel.
- To avoid 404 errors on page refresh or direct URL access, add a `vercel.json` file in the project root with the following:

{
"rewrites": [
{ "source": "/(.*)", "destination": "/index.html" }
]
}

text

This enables Single Page Application (SPA) routing to work properly on Vercel.

## Folder Structure

/src
/components # Reusable UI components (Header, AddEmployee, EditEmployee, etc.)
/pages # Application pages (Dashboard, Employee, Teams, Logs, LoginPage)
/context # React Context for global state (AppContext)
/assets # Images, icons, logos
/App.css # Global CSS styles
/App.js # Main React component with routing

text

## Known Issues

- Make sure your token is stored and properly loaded to prevent unauthorized access.
- Always verify your backend API URL and endpoints.

## Contributing

Feel free to open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.

---
