# Laporan_desa

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Tech Stack](#tech-stack)
- [Firebase Setup](#firebase-setup)
- [License](#license)

## Overview
This is a **Next.js** web application with features like authentication, user reports using a map (Leaflet), and image uploading to Firebase. The app also includes a dashboard for managing reports.

## Features
- **Authentication**: Secure login and registration using **NextAuth**.
- **Report System**: Users can create reports with descriptions, locations, and images.
- **Firebase Integration**: Utilizes Firebase for data storage and image hosting.
- **Interactive Maps**: Display user report locations using **React Leaflet**.

## Installation
To get started with this project, ensure you have **Node.js** and **npm** installed. Then follow the instructions below.

### Prerequisites
- **Node.js**: Download and install from [Node.js official website](https://nodejs.org/).
- **npm**: Comes with Node.js. To check if you have npm installed, run the following command:
  ```bash
  npm -v
Dependencies
Install dependencies:

bash
Salin kode
npm install
Install Firebase SDK:

bash
Salin kode
npm install firebase
Install Leaflet and React Leaflet for interactive maps:

bash
Salin kode
npm install leaflet react react-dom react-leaflet
Install NextAuth for authentication:

bash
Salin kode
npm install next-auth
Setup
1. Firebase Configuration
Create a Firebase account and set up a project. Follow the steps in the official documentation: Firebase Documentation.

Set up Firestore and Firebase Storage in your Firebase project.

Obtain the Firebase configuration keys (API key, Auth domain, etc.), then create a .env file in the root of your project and add the following variables:

bash
Salin kode
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
2. NextAuth Configuration
Add your NEXTAUTH_URL in the .env file:
bash
Salin kode
NEXTAUTH_URL=http://localhost:3000
3. Leaflet Map Configuration
Ensure that the Leaflet CSS is loaded. Add the following to your _app.js or in your global CSS:

js
Salin kode
import 'leaflet/dist/leaflet.css';
Running the Application
To start the development server, run:

bash
Salin kode
npm run dev
The application will be available at http://localhost:3000.

Tech Stack
Framework: Next.js
Authentication: NextAuth.js
Database & Storage: Firebase Firestore & Firebase Storage
Maps: React Leaflet
CSS Framework: Tailwind CSS
Firebase Setup
Create a Firebase account if you don't have one already.
Create a new Firebase project.
Set up Firestore Database for data storage:
Go to the Firebase console -> Firestore Database -> Create a database.
Set up Firebase Storage for uploading images:
Go to the Firebase console -> Storage -> Create a storage bucket.
You can follow detailed Firebase setup instructions from their official docs: Firebase Documentation.
