# QR Code Attendance System

Android-based attendance tracking application with QR code technology.

## Description

An innovative system for educational institutions to manage event attendance using QR code scanning, supporting both mobile and web interfaces for students and staff.

## Getting Started

### Dependencies

-   Node.js
-   PostgreSQL
-   Android Studio

### Environment Configuration

1. Copy `.env.example` to `.env`
2. Update configuration values:

```
PORT=3000
PG_USER=your_database_user
PG_HOST=your_database_host
PG_DATABASE=attendance
PG_PASSWORD=your_database_password
PG_PORT=5432
JWT_SECRET=your_secret_key
```

### Technologies Used

-   Node.js & Express
-   Android (Java)
-   PostgreSQL
-   JWT Authentication
-   Bcrypt

## API Endpoints

### Authentication

-   `POST /api/auth/login`
    -   User login
    -   No prior authentication required

### Events

-   `GET /api/events`

    -   Retrieve all events
    -   Returns event list with attendance status

-   `POST /api/events`
    -   Create new event
    -   Supports class assignments

### Attendance

-   `POST /api/attendance/entry`

    -   Record event entry
    -   Validates QR code and event date

-   `POST /api/attendance/exit`

    -   Record event exit
    -   Validates QR code and event date

-   `GET /api/attendance/:eventId`
    -   Retrieve attendance records
    -   Returns detailed attendance information

### Classes

-   `GET /api/classes`
    -   List all classes

## Key Features

-   User Authentication (Student/Staff)
-   Event Management
-   QR Code Generation
-   QR Code Scanning
-   Date-Based Validation
-   Attendance Tracking

## User Roles

-   Staff: Create events, scan QR codes
-   Students: Generate QR codes, view events

## Database Design

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

## License

No specific license applied.
