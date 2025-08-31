# Campus Connect SmartLearn - Class Diagram

## Project Overview
A comprehensive Learning Management System (LMS) built with React, TypeScript, and Supabase, featuring role-based dashboards for students, teachers, and administrators.

## Core Architecture

### 1. Authentication & User Management
```
useAuth Hook
├── User (Supabase Auth)
├── Profile (custom user data)
└── UserRole (student/teacher/admin)

Relationships:
- useAuth manages User, Profile, and UserRole
- User has one Profile
- User has one UserRole
```

### 2. Course Management System
```
useCourses Hook
├── Course
│   ├── id, title, description
│   ├── instructor_id (FK to User)
│   └── is_active, timestamps
└── Enrollment
    ├── student_id (FK to User)
    ├── course_id (FK to Course)
    └── status (active/completed/dropped)

CourseCard Component
├── CourseThumbnail
├── CourseStats
└── CourseActions

Relationships:
- Course has many Enrollments
- User (instructor) has many Courses
- User (student) has many Enrollments
- CourseCard displays Course data
```

### 3. Assignment Management
```
useAssignments Hook
├── Assignment
│   ├── course_id (FK to Course)
│   ├── title, description, instructions
│   ├── deadline, file constraints
│   └── timestamps
└── AssignmentSubmission
    ├── assignment_id (FK to Assignment)
    ├── student_id (FK to User)
    ├── file details, grade, feedback
    └── timestamps

useAssignmentSubmissions Hook
├── manages submissions
├── handles grading
└── tracks submission status

Relationships:
- Course has many Assignments
- Assignment has many Submissions
- User (student) has many Submissions
```

### 4. Messaging System
```
useMessages Hook
├── Conversation
│   ├── participant1_id (FK to User)
│   ├── participant2_id (FK to User)
│   └── last_message_at
└── Message
    ├── sender_id (FK to User)
    ├── recipient_id (FK to User)
    ├── content, timestamps
    └── read status

useWebSocketMessages Hook
├── real-time messaging
├── course conversations
└── direct messaging

Relationships:
- Conversation has many Messages
- User participates in many Conversations
- Message belongs to one Conversation
```

### 5. Dashboard Architecture
```
DashboardRouter (Main Router)
├── StudentDashboard
├── TeacherDashboard
└── AdminDashboard

DashboardLayout (Base Layout)
├── AppSidebar (Navigation)
├── DashboardNavbar (Header)
└── Main Content Area

Relationships:
- DashboardRouter routes to role-specific dashboards
- All dashboards extend DashboardLayout
- DashboardLayout contains navigation and header
```

### 6. Analytics & Reporting
```
useStudentAnalytics Hook
├── student progress data
├── performance metrics
└── course completion stats

useTeacherAnalytics Hook
├── course statistics
├── student performance data
└── enrollment analytics

AnalyticsDashboard Component
├── charts and visualizations
├── data export functionality
└── real-time updates

Relationships:
- Analytics hooks provide data to dashboards
- AnalyticsDashboard displays aggregated data
```

### 7. Calendar & Events
```
useCalendarEvents Hook
├── CalendarEvent
│   ├── title, description
│   ├── start_time, end_time
│   ├── user_id (FK to User)
│   ├── course_id (FK to Course)
│   └── event_type (assignment/exam/meeting)

Relationships:
- User has many CalendarEvents
- Course can have many CalendarEvents
- Events can be course-specific or personal
```

### 8. File Management
```
useCourseMaterials Hook
├── PDFMaterial
│   ├── course_id (FK to Course)
│   ├── file details (name, URL, size)
│   ├── upload metadata
│   └── access permissions

Relationships:
- Course has many PDFMaterials
- PDFMaterial belongs to one Course
- Materials are managed per course
```

## Key Design Patterns

### 1. Custom Hooks Pattern
- **useAuth**: Centralized authentication state
- **useCourses**: Course data management
- **useMessages**: Messaging functionality
- **useAssignments**: Assignment lifecycle management

### 2. Component Composition
- **CourseCard**: Composed of smaller components (Thumbnail, Stats, Actions)
- **DashboardLayout**: Reusable layout with sidebar and navbar
- **Role-based rendering**: Different content based on user role

### 3. State Management
- **React Query**: Server state management
- **Local State**: Component-specific state
- **Supabase**: Real-time subscriptions and data persistence

### 4. Routing Strategy
- **Protected Routes**: Authentication-based access control
- **Role-based Routing**: Different dashboards for different user types
- **Dynamic Routing**: Course-specific pages and messaging

## Data Flow

```
User Authentication → Role Determination → Dashboard Routing
         ↓
    Data Fetching (Courses, Assignments, Messages)
         ↓
    Component Rendering with Role-specific Content
         ↓
    Real-time Updates via WebSocket/Subscriptions
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Real-time)
- **State Management**: React Query + Custom Hooks
- **Routing**: React Router v6
- **Build Tool**: Vite

## Security Features

- **Role-based Access Control (RBAC)**
- **Protected API endpoints**
- **User authentication via Supabase Auth**
- **Course enrollment validation**
- **File upload restrictions**

This architecture provides a scalable, maintainable foundation for the LMS with clear separation of concerns, reusable components, and robust data management patterns. 