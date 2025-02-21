# Secure Login Service - Project Aim

## 1. Project Overview
The project is a modular JWT Authentication System that provides authentication and user management services for client websites and apps. You will handle all the core functionalities (like token generation, user management, and email sending) yourself, without relying on third-party services for email, SMS, or social logins.

## 2. Key Components
Your system will include the following core modules:

### Backend Service
**Role:** Handles user authentication, token generation, and management.
**Technology:** Python with Django and Django REST Framework (DRF).

### Database
**Role:** Stores user data, tokens, API keys, and any other necessary data.
**Technology:** SQL (PostgreSQL, MySQL) or NoSQL (MongoDB).

### Email Service
**Role:** Sends verification emails, password reset links, and possibly magic links.
**Technology:** Python's smtplib (no third-party email service).

### Token Management
**Role:** Handles JWT generation, validation, and expiration.
**Technology:** pyjwt or djangorestframework-simplejwt.

### Admin Dashboard
**Role:** Allows clients to manage their settings, monitor activity, and configure authentication features.
**Technology:** Django Admin or custom frontend.

### Role-Based Access Control (RBAC):
**Role:** Manage user roles and permissions.
**Technology:** Custom middleware or Django’s built-in permissions system.

### Optional Features (Minimal External Dependency)
- Passwordless login using magic links or OTPs.
- Social login (optional, if you wish to implement it yourself, or you can skip this).

## 3. High-Level Architecture
Visualize the architecture like this:

```
+------------------+       +----------------+
|  Client Website  | <---> |  RESTful APIs  | <--> Database
|  or Mobile App   |       +----------------+
+------------------+             |
         ^                      Token Management
         |                        (JWT)
         |
+------------------+
| Client Dashboard | <---> Admin APIs
+------------------+
```

- **Client Website or Mobile App:** Frontend apps integrate your service.
- **RESTful APIs:** Exposed endpoints for login, signup, and token management.
- **Token Management:** Manages JWT generation and validation.
- **Client Dashboard:** A web-based interface to manage client settings.
- **Database:** Stores user data, tokens, and API keys.

## 4. Step-by-Step Development (Minimal External Dependencies)

### Backend Service
#### Set Up Django Project
```bash
django-admin startproject auth_service
cd auth_service
python manage.py startapp authentication
```

#### Install Dependencies
```bash
pip install djangorestframework djangorestframework-simplejwt psycopg2-binary
```

#### Create Authentication Endpoints
- **Login (/api/auth/login/):** Handles login, generates and returns JWTs (access and refresh).
- **Register (/api/auth/register/):** Handles user registration (without third-party services).
- **Token Refresh (/api/auth/token/refresh/):** Handles token refresh using refresh tokens.
- **Logout (/api/auth/logout/):** Invalidate the JWT refresh token.

### Token Management
Use **pyjwt** or **djangorestframework-simplejwt** to generate, validate, and refresh JWTs.

### Email Service (Without External APIs)
Instead of relying on external services like SendGrid or Twilio, you can use Python’s built-in **smtplib** to send emails.

#### Send Email (for verification, password reset, etc.):
```python
import smtplib
from email.mime.text import MIMEText

def send_email(to_email, subject, body):
    sender_email = "your_email@example.com"
    sender_password = "your_password"
    smtp_server = "smtp.example.com"  # Your own SMTP server

    msg = MIMEText(body, 'html')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    with smtplib.SMTP(smtp_server, 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
```
Set up your own SMTP server or use free options like Gmail’s SMTP for sending emails. (For more advanced setups, you could configure a service like Postfix for email delivery).

### Database
Design the database to store:
- **User Data:** id, email, password, is_active, email_verified.
- **Tokens:** Store access tokens, refresh tokens, and possibly blacklisted tokens for invalidation.

### Role-Based Access Control (RBAC)
#### Define User Roles:
- **Admin:** Can manage users and settings.
- **User:** Can only access their own data.

#### Middleware for Role-Based Permissions:
Implement custom middleware to check permissions based on user roles.

#### Django Permissions:
Use Django’s built-in permissions framework for role management.

### Admin Dashboard
- **Client Registration:** Let clients register their application and get an API key.
- **Authentication Settings:** Let clients configure their login options (e.g., enable passwordless login).
- **User Management:** Provide functionalities to view registered users, reset passwords, and configure roles.

### Frontend SDKs (Web and Mobile)
#### Web SDK:
A JavaScript library that:
- Stores JWTs in cookies or localStorage.
- Handles login/logout requests.
- Calls REST APIs for authentication.

#### Mobile SDK (Optional):
Mobile SDKs for React Native or Flutter to integrate authentication into mobile apps.

### Testing
Write unit tests for all your APIs, token management, and email-sending logic.

### Deployment
Deploy the service to a cloud provider or use your own server for hosting.
For scalability, use Docker or Kubernetes.

## 5. APIs for Client Integration
Your system will expose these APIs to client apps:

- **POST /api/auth/register/:** User registration.
- **POST /api/auth/login/:** Login and get JWTs.
- **POST /api/auth/token/refresh/:** Refresh the access token.
- **POST /api/auth/logout/:** Logout and invalidate refresh tokens.

These APIs can be consumed by any client (web or mobile) to handle the authentication flow.

## 6. Example Scenarios
#### Client Website:
- The client integrates your SDK for JWT management.
- Users log in via email/password, and JWT tokens are used for secure communication.

#### Mobile App:
- The mobile app integrates your APIs to handle login and manage user sessions with JWTs.

#### Admin Dashboard:
- The client accesses the dashboard to configure the authentication system and manage their users.

## 7. Final Product
At the end, you will have:

- A backend service handling JWT authentication, user management, and email services.
- A frontend SDK for easy integration into websites and apps.
- An admin dashboard for clients to manage authentication settings and users.

By building everything yourself (with minimal external dependencies), you will learn about email handling, JWT authentication, and user management, which will provide deep technical knowledge for scaling and customizing the system further.