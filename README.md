# QR Code Attendance System

#### Video Demo:

<URL>

#### Description:

This Android application provides a QR code-based attendance system for educational institutions. It allows students to generate unique QR codes for event attendance and enables staff to scan these codes to record attendance. The system includes both a mobile application built with Java/Android and a Node.js backend server.

## Features

-   **User Authentication**: Secure login system with role-based access (student/staff)
-   **Event Management**: Staff can create and manage events
-   **QR Code Generation**: Students can generate unique QR codes for attendance
-   **QR Code Scanning**: Staff can scan QR codes to record attendance
-   **Date Validation**: QR codes are only valid on the event date
-   **Attendance Tracking**: View and manage attendance records

## Project Structure

### Android Application

```
app/
├── activities/
│   ├── LoginActivity       # User authentication screen
│   ├── MainActivity        # Main application screen
│   └── QRScannerActivity   # QR code scanning functionality
├── api/
│   ├── ApiClient          # Retrofit configuration
│   └── ApiService         # API endpoint definitions
├── fragments/
│   ├── AttendanceFragment   # Attendance records view
│   ├── CreateEventFragment  # Event creation form
│   └── EventsFragment       # Event listing
├── models/
│   ├── AttendanceRecord    # Attendance data model
│   ├── AttendanceRequest   # Attendance API request model
│   ├── AttendanceResponse  # Attendance API response model
│   ├── ClassResponse       # Class data model
│   ├── CreateEventRequest  # Event creation request model
│   ├── Event              # Event data model
│   ├── EventResponse      # Event API response model
│   ├── LoginRequest       # Login request model
│   ├── LoginResponse      # Login response model
│   └── User               # User data model
└── utils/
    ├── SharedPrefManager     # Session and data management
    ├── AttendanceAdapter     # Attendance list adapter
    ├── AttendanceApplication # Application class
    ├── EventAdapter          # Event list adapter
    ├── GroupedAttendanceAdapter # Grouped attendance view adapter
    └── LoadingDialog         # Loading state UI component
```

### Node.js Server

```
Attendance-App/
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   ├── attendanceController.js  # Attendance record management
│   ├── authController.js        # User authentication logic
│   └── eventController.js       # Event management logic
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── node_modules/            # Node.js dependencies
├── .env                     # Environment variables
└── index.js                # Main server entry point
```

## Technical Decisions

### Authentication

The system uses JWT (JSON Web Tokens) for authentication. This choice was made because:

-   Stateless authentication reduces server load
-   Easy to implement across different platforms
-   Secure token-based system
-   Efficient for mobile applications

### QR Code Implementation

For QR code functionality:

-   Generation: Students generate codes containing event and user IDs
-   Validation: Codes are only valid on the event date

### Database Design

```mermaid
erDiagram
    class {
        int id PK
        string name
        text description
    }

    users {
        int id PK
        string name
        string email
        string password_hash
        int class_id FK
        user_role role
    }

    event {
        int id PK
        string title
        text description
        date date
        time start_time
        time end_time
        timestamp created_at
    }

    event_class {
        int event_id PK, FK
        int class_id PK, FK
    }

    attendance {
        int event_id PK, FK
        int user_id PK, FK
        attendance_status entry_status
        attendance_status exit_status
    }

    class ||--o{ users : has
    class ||--o{ event_class : participates
    event ||--o{ event_class : includes
    event ||--o{ attendance : tracks
    users ||--o{ attendance : records
```

## API Endpoints

### Authentication

-   `POST /api/auth/login`
    -   Authenticate user with email and password
    -   Returns JWT token and user info
    -   No token required

### Events

-   `GET /api/events`
    -   Get all events with attendance status
    -   Requires authentication token
-   `POST /api/events`
    -   Create new event
    -   Requires staff authentication
    -   Includes class assignments

### Attendance

-   `POST /api/attendance/entry`
    -   Record entry attendance via QR scan
    -   Requires staff authentication
-   `POST /api/attendance/exit`
    -   Record exit attendance via QR scan
    -   Requires staff authentication
-   `GET /api/attendance/:eventId`
    -   Get attendance records for specific event
    -   Requires staff authentication

### Classes

-   `GET /api/classes`
    -   Get list of all classes
    -   Requires authentication token

## Installation and Setup

### Android Application

1. Clone the repository
2. Open in Android Studio
3. Update `BASE_URL` in `ApiClient.java`
4. Build and run the application

### Node.js Server

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Initialize database with schema
4. Run server: `npm start`

## Environment Variables

```
PORT=3000
PG_USER=your_database_user
PG_HOST=your_database_host
PG_DATABASE="attendance"
PG_PASSWORD=your_database_password
PG_PORT=5432
JWT_SECRET=your_secret_key
```

## Usage

1. Students:
    - Log in to the web interface.
    - View event details and generate a unique QR code for attendance.
2. Staff:
    - Log in to the Android app.
    - Create new events, view attendance records, and scan QR codes for entry and exit tracking.

## Future Improvements

-   Web-app for event management
-   Push notifications for attendance reminders.
-   Export attendance data as PDF or CSV.
-   Integration with Google Calendar for event scheduling.

### Acknowledgments

This project was built as a CS50 final project. Special thanks to the CS50 team for inspiring and guiding this learning journey.
