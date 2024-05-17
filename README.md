# Oauth2.0 Client Application: hospital1.medbook

## Description

---

The hospital1.medbook.com client application is designed to interact with the accounts.medbook.com server to manage and update user medical data securely. This application leverages OAuth 2.0 for authentication and authorization to ensure secure access and modification of user information.

The client application communicates with the accounts.medbook server. You can find the server repository here: [accounts.medbook.com](https://github.com/amuliawijaya23/accounts.medbook)

## Functionality

---

1. Request Authentication:

- The client initiates the authentication process by redirecting users to the server.
- Users log in using their credentials.
- Upon successful login, users are redirected back to the client application with an authorization code.

2. Request Authorization for Reading User Medication:

- The client requests read access to the user's medication data.
- The user is prompted to approve the access request, ensuring they are aware of and consent to the data being shared.
- Once approved, the client receives an access token that allows it to fetch and display the user's medication information securely.

3. Request Authorization for Updating User Medication:

- The client requests write access to specific user medication data (e.g., updating the dosage of a medication).
- The user is prompted to approve this specific update action, adhering to the principle of least privilege.
- Upon user approval, the client receives an access token that permits the update operation, which is then executed securely.

## Tech Stack

---

- **Express:** A minimal and flexible Node.js web application framework used for building the backend services.
- **MongoDB:** A NoSQL database used to store user data, including medical records and OAuth tokens.
- **Passport:** An authentication middleware for Node.js, used to implement OAuth 2.0 strategies for secure authentication and authorization.
- **Axios:** A promise-based HTTP client for the browser and Node.js, used to make HTTP requests to the accounts.medbook.com server for fetching and updating user data.

## Prerequisites

---

Ensure you have the following installed on your machine:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)

---

### Step 1: Clone the Repository

Clone the GitHub repository to your local machine:

```
git clone git@github.com:amuliawijaya23/hospital1.medbook.git

cd hospital1.medbook
```

### Step 2: Install Dependencies

Install all the necessary dependencies for the application:

```
npm install
```

### Step 3: Set Up Environment Variables

Create a .env file in the root directory of the project by copying the provided .env.example file:

```
cp .env.example .env
```

### Step 4: Start the Application

Start the application using the following command:

```
npm run dev
```

---

### Home Page

![Home Page](/assets/home-page.png)

### Login Page

![Login Page](/assets/login-page.png)

### Server Login Page

![Server Login Page](/assets/server-login-page.png)

### Authorization Decision Page

![Auth Decision](/assets//authorization-page.png)

### Home Page (Authenticated)

![Home Page Authenticated](/assets/home-page-authenticated.png)

### User Medication

![User Medication](/assets/user-medication-page.png)

### Medication Form

![Medication Form](/assets/medication-form-page.png)

### Updated User Medication

![Updated User](/assets//updated-user-medication.png)
