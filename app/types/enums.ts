// Enum types matching database schema

export type SessionStatus = "planned" | "completed" | "canceled" | "makeup";

export type AttendanceStatus = "present" | "late" | "absent" | "excused";

export type AttendanceMethod = "face" | "qr" | "manual";

export type DeviceType = "kiosk" | "mobile" | "web";

export type Gender = "male" | "female" | "other";

export type VerificationResult =
  | "success"
  | "fail_match"
  | "fail_liveness"
  | "fail_quality"
  | "error";

export type Role = "superadmin" | "admin";

export type Position = "professor" | "lecturer" | "assistant";

export type EnrollmentStatus = 1 | 2 | 3; // 1=enrolled, 2=dropped, 3=completed

export type OfferingStatus = 1 | 2 | 3 | 4; // 1=planned, 2=active, 3=completed, 4=canceled
