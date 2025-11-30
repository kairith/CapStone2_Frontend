# Class Management - Standard Structure Documentation

## Overview

This document defines the standardized structure for the Class Management System, aligned with CADT Institute of Digital Technology's timetable format.

## Standard Class Structure

### Core Fields

#### Academic Hierarchy

```typescript
{
  year: number; // Academic year (1-4)
  term: number; // Academic term (1-2)
  generation: string; // Student generation (e.g., "9")
  group: string; // Group identifier (e.g., "G1")
}
```

#### Class Information

```typescript
{
  subject: string; // Course subject name
  code: string; // Course code (e.g., "CS302")
  classType: string; // Type: 'Theory Class' | 'Lab Class' | 'Seminar' | 'Workshop' | 'Capstone Project'
  department: string; // Department (e.g., "Computer Science")
}
```

#### Scheduling

```typescript
{
  dayOfWeek: string[];   // Array of days (e.g., ["Monday", "Wednesday"])
  startTime: string;     // Start time (format: "HH:MM-HH:MM")
  endTime: string;       // End time (format: "HH:MM-HH:MM")
  schedule: string;      // Human-readable schedule (e.g., "Mon/Wed 08:00-17:00")
  room: string;          // Classroom/location
}
```

#### Instructor & Students

```typescript
{
  lecturerId: number; // Instructor ID
  lecturerName: string; // Instructor full name
  students: number; // Total enrolled students
  attendance: number; // Attendance rate (0-100)
}
```

#### Metadata

```typescript
{
  id: number; // Unique identifier
  status: string; // 'active' | 'inactive'
  semester: string; // Semester name (e.g., "Fall 2024")
  color: string; // Display color (hex)
  description: string; // Course description
  sessions: number; // Total sessions planned
}
```

## Complete Interface

```typescript
export interface Class {
  // Unique Identifier
  id: number;

  // Course Information
  subject: string;
  code: string;
  classType:
    | "Theory Class"
    | "Lab Class"
    | "Seminar"
    | "Workshop"
    | "Capstone Project";
  department: string;
  description?: string;

  // Academic Context
  year: number; // 1-4
  term: number; // 1-2
  generation: string; // Student cohort
  group: string; // Class group

  // Instructor
  lecturerId: number;
  lecturerName: string;

  // Schedule
  dayOfWeek: string[]; // ["Monday", "Wednesday", "Friday"]
  startTime: string; // "08:00-09:30"
  endTime: string; // "15:30-17:00"
  schedule: string; // "Mon/Wed/Fri 08:00-17:00"
  room: string;

  // Enrollment & Performance
  students: number;
  attendance: number; // Percentage
  sessions?: number;

  // Status
  status: "active" | "inactive";
  semester: string;
  color: string;
}
```

## Time Slot Standards

### Available Time Slots

Following CADT Institute timetable format:

```
07:45-08:00
08:00-09:30
09:30-11:20
11:20-12:10
12:10-13:40
13:40-13:50
13:50-15:20
15:30-17:00
```

### Day Options

```
Monday, Tuesday, Wednesday, Thursday, Friday
```

## Class Type Standards

### Theory Class

- Primarily lecture-based
- Standard classroom setting
- Color: Blue (#2196F3)

### Lab Class

- Hands-on practical work
- Computer lab or specialized facility
- Color: Green (#4CAF50)

### Seminar

- Discussion and presentation format
- Guest speakers or student presentations
- Color: Purple (#9C27B0)

### Workshop

- Interactive skill-building sessions
- Project-based learning
- Color: Orange (#FF9800)

### Capstone Project

- Final year project course
- Multi-day scheduling
- Intensive mentorship
- Color: Red (#F44336)

## Example Data

### Example 1: Theory Class

```json
{
  "id": 1,
  "subject": "Quantum Computing",
  "code": "CS301",
  "lecturerId": 2,
  "lecturerName": "Ms. Heng Sovanmonyuth",
  "classType": "Theory Class",
  "year": 4,
  "term": 1,
  "group": "G1",
  "generation": "9",
  "dayOfWeek": ["Tuesday"],
  "startTime": "08:00-09:30",
  "endTime": "11:20-12:10",
  "schedule": "Tuesday 08:00-11:20",
  "room": "A201",
  "students": 45,
  "attendance": 92,
  "status": "active",
  "semester": "Fall 2024",
  "color": "#1e3a8a",
  "description": "Introduction to quantum computing principles",
  "sessions": 28,
  "department": "Computer Science"
}
```

### Example 2: Capstone Project

```json
{
  "id": 6,
  "subject": "Capstone Project II",
  "code": "CP402",
  "lecturerId": 1,
  "lecturerName": "Dr. Duch Dynit",
  "classType": "Capstone Project",
  "year": 4,
  "term": 1,
  "group": "G1",
  "generation": "9",
  "dayOfWeek": ["Monday", "Wednesday", "Thursday", "Friday"],
  "startTime": "08:00-09:30",
  "endTime": "17:00-17:00",
  "schedule": "Mon/Wed/Thu/Fri 08:00-17:00",
  "room": "Project Room",
  "students": 45,
  "attendance": 95,
  "status": "active",
  "semester": "Fall 2024",
  "color": "#ea580c",
  "description": "Final year capstone project",
  "sessions": 30,
  "department": "Computer Science"
}
```

## Form Field Requirements

### Required Fields

- ✅ Subject
- ✅ Code
- ✅ Lecturer ID
- ✅ Class Type
- ✅ Year (1-4)
- ✅ Term (1-2)
- ✅ Group
- ✅ Generation
- ✅ Day of Week (at least one)
- ✅ Start Time
- ✅ End Time
- ✅ Room
- ✅ Students
- ✅ Department

### Optional Fields

- Description
- Semester (auto-generated from Year/Term)
- Color (auto-generated)
- Status (defaults to 'active')
- Sessions

## Validation Rules

### Year

- Type: Integer
- Range: 1-4
- Required: Yes

### Term

- Type: Integer
- Range: 1-2
- Required: Yes

### Class Type

- Type: String Enum
- Options: 'Theory Class', 'Lab Class', 'Seminar', 'Workshop', 'Capstone Project'
- Required: Yes

### Day of Week

- Type: String Array
- Options: Monday through Friday
- Required: At least one day
- Multiple selection allowed

### Time Slots

- Format: "HH:MM-HH:MM"
- Must match standard time slots
- End time must be after start time

### Students

- Type: Integer
- Range: 1-200
- Required: Yes

### Attendance

- Type: Integer
- Range: 0-100
- Unit: Percentage
- Auto-calculated from actual data

## Filter Options

### Admin Interface Filters

1. **Search**: Subject, Code, Lecturer name
2. **Year**: All, 1, 2, 3, 4
3. **Term**: All, 1, 2
4. **Class Type**: All, Theory Class, Lab Class, Seminar, Workshop, Capstone Project
5. **Status**: All, Active, Inactive
6. **Generation**: All, 9, 10, 11, 12
7. **Department**: All, Computer Science, Information Technology

## Usage Guidelines

### Creating a New Class

1. Select Year and Term
2. Choose Class Type
3. Fill in subject and code
4. Assign lecturer
5. Set group and generation
6. Select day(s) of week
7. Choose time slots from dropdown
8. Assign room
9. Set student count
10. Add description (optional)

### Schedule String Format

The `schedule` field should be auto-generated from `dayOfWeek`, `startTime`, and `endTime`:

```javascript
// Single day
"Tuesday 08:00-11:20";

// Multiple days
"Mon/Wed/Fri 08:00-17:00";

// Full day seminar
"Wednesday (Full Day)";
```

### Color Coding

Colors should be assigned based on class type or auto-generated:

- Theory: Blue spectrum (#1e3a8a, #2563eb)
- Lab: Green spectrum (#16a34a, #22c55e)
- Seminar: Purple spectrum (#7c3aed, #a855f7)
- Workshop: Orange spectrum (#ea580c, #f97316)
- Capstone: Red spectrum (#dc2626, #ef4444)

## Migration Notes

### From Old Structure to New Structure

Old structure fields removed:

- ❌ `semester` as primary filter (now generated from year/term)

New structure fields added:

- ✅ `year` - Academic year
- ✅ `term` - Academic term
- ✅ `classType` - Type of class
- ✅ `dayOfWeek` - Array of scheduled days
- ✅ `startTime` - Start time slot
- ✅ `endTime` - End time slot

Changed fields:

- `department` - Now required (was optional)

## Best Practices

### Data Consistency

1. Always set all required fields
2. Use standard time slots from the list
3. Generate schedule string from structured data
4. Match lecturer names to IDs correctly
5. Validate year/term combinations

### UI/UX

1. Show Year/Term prominently (e.g., "Y4/T1")
2. Color-code class types consistently
3. Display full schedule with days and times
4. Group by generation and group in student views
5. Allow filtering by multiple criteria

### Performance

1. Index by year, term, generation, group for fast queries
2. Cache computed statistics (total students, attendance)
3. Pre-filter by active status in most views
4. Use pagination for large class lists

## File Structure

### Type Definitions

`app/types/class.ts` - TypeScript interfaces

### Mock Data

`app/mock/classes.json` - Sample class data (7 classes for Gen 9, Year 4, Term 1)

### Components

- `app/components/admin/ClassForm.vue` - Create/Edit form
- `app/pages/admin/classes/index.vue` - Admin management
- `app/pages/lecturer/class.vue` - Lecturer view
- `app/pages/student/classes.vue` - Student view

### Services

- `app/services/classes.ts` - API service layer
- `app/stores/useClassStore.ts` - Pinia state management

## Version History

- v2.0.0 (Current) - Standardized structure with Year/Term/Type
- v1.0.0 - Initial implementation with basic semester structure
