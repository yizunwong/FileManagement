# File Management System - User Manual

## Introduction

The **File Management System** is a web-based application developed using Vue 3 and Vite. It enables users to upload, manage, and organize their files efficiently. This manual provides a step-by-step guide to using the system, from setup to basic operations.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Project Setup](#project-setup)
3. [User Interface Overview](#user-interface-overview)
4. [Features and Operations](#features-and-operations)
   - [Login](#login)
   - [File Upload](#file-upload)
   - [File Management](#file-management)

## System Requirements

- **Operating System:** Windows, macOS, or Linux
- **Browser:** Chrome, Edge, Firefox, or Safari
- **Node.js:** Version 16 or higher
- **NPM:** Version 8 or higher


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development
this will run the backend and frontend together by using concurrently lib
```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## User Interface Overview
The application consists of the following sections:

1. Login Page and Register
A simple form where users can enter their credentials to log in and register
2. Dashboard
Displays a the overview of the file managemnet system which indicate the total file, total public, total storage used by user,
total file shared with users
3. My Files
Enables users to select and upload files.
Resolves conflicts if a file with the same name already exists which provide them either overwrite or add as new file
4. Public Files
Enables users to view the file has be shared by other user in public
5. Shared Files
Enables users to view the file has be shared with other user
6. Error/Success Dialogs
Displays user-friendly messages for errors (e.g., missing file) and successful operations (e.g., upload completed).


## Features and Operations
1. ## Login
Open the Login Page.
Enter your username and password.
Click the Login button to access the dashboard.

2. ## File Upload
Navigate to the Upload Section.
Click on the Choose File button and select a file from your system.
Click the Upload button to upload the file.
If a file with the same name exists, the system will prompt you to resolve the conflict by either overwrite
or add as new file.

3. ## File Management
View your uploaded files in the Dashboard Table.
Each file entry provides the following actions:
View: Open the file.
Delete: Remove the file from the system.
Share: Share the file.