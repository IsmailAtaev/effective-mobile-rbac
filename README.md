# Effective Mobile RBAC API

API for managing users, roles, and permissions using **ts-rest** and **PostgreSQL**.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
NODE_ENV=test

PORT=3000
HOST=127.0.0.1

JWT_SECRET='JWT_SECRET'

DB_NAME=database_name
DB_USERNAME=database_user
DB_PASSWORD=database_password
DB_ROOT_PASSWORD=database_root_password
DB_PORT=5464 # or 5432 (5464 - docker, 5432 - local)

COOKIE_SECRET='COOKIE_SECRET'
COOKIE_HTTP_ONLY='true'
COOKIE_SECURE='true'
COOKIE_SAME_SITE='none'

EMAIL_HOST=smtp.mail.ru
EMAIL_PORT=465
EMAIL_ADDRESS=your_email_address@mail.ru
EMAIL_PASSWORD=your_email_password

ALLOWED_ORIGINS='http://localhost:5173, http://127.0.0.1:5173,'
```

### Run

```bash
npm run dev
```

## 📂 Project Structure

```text
src/
├── api/                    # ts-rest contracts and zod schemas
├── app/                    # Application modules (routes, controllers, services)
│   ├── router.ts           # Global router
│   └── user/               # User and Auth management modules
├── infra/                  # Infrastructure (database, migrations, environment)
├── utils/                  # Utility functions (mailer, hashing, errors)
└── index.ts                # Application entry point
```

## 🛠️ Tech Stack

- **Framework**: Express with [ts-rest](https://ts-rest.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Query Builder**: [Kysely](https://kysely.dev/) with kysely-ctl and kysely-codegen
- **Authentication**: JWT, bcrypt
- **Mailing**: Nodemailer (SMTP)
- **Validation**: Zod
- **Testing**: Jest

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset code
- `POST /api/auth/forgot-password-verify` - Verify reset code and set new password

### Users

- `GET /api/users` - List all users (with pagination and search)
- `POST /api/users` - Create a new user (Admin only)
- `GET /api/users/:id` - Get user by ID (Self or Admin)
- `PUT /api/users/:id` - Update user (Self can edit format, Admin can edit all)
- `DELETE /api/users/:id` - Delete user (Self or Admin)
- `POST /api/users/:id/change-password` - Force change user password (Admin only)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with watch mode
npm run test:watch
```

## 📝 License

ISC