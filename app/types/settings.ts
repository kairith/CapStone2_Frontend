// System settings
export interface Setting {
  id: number;
  global_id: string;
  key: string;
  value?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SettingFormData {
  key: string;
  value?: string;
  description?: string;
}

// Common setting keys (for type safety)
export type SettingKey =
  | "system.timezone"
  | "system.language"
  | "attendance.auto_mark_absent"
  | "attendance.late_threshold_minutes"
  | "attendance.allow_early_checkin_minutes"
  | "session.auto_complete_after_hours"
  | "notification.email_enabled"
  | "notification.sms_enabled"
  | "biometric.similarity_threshold"
  | "biometric.liveness_threshold";
