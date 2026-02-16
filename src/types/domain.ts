/* Core domain types for ForgeSiteDiary (M1) */

export type Priority = 'critical' | 'high' | 'normal' | 'low';

export type JobStage = 'prestart' | 'in_progress' | 'snagging' | 'complete';

export type ItemType = 'task' | 'material' | 'issue' | 'delay' | 'email';

export type ItemStatus =
  // generic
  | 'open'
  | 'in_progress'
  | 'done'
  | 'closed'
  // materials
  | 'not_ordered'
  | 'ordered'
  | 'dispatched'
  | 'delivered'
  // issues
  | 'monitoring'
  | 'resolved'
  // emails
  | 'draft'
  | 'sent';

export type UUID = string;

export interface Job {
  id: UUID;
  jobNumber: string;
  name: string;
  mainContractor: string;
  siteAddress: string;
  stage: JobStage;
  active: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface DayEntry {
  id: UUID;
  jobId: UUID;
  date: string; // YYYY-MM-DD (local)
  weather?: string;
  summary?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Item {
  id: UUID;
  jobId: UUID;
  dayEntryId: UUID;
  type: ItemType;
  title: string;
  details?: string;
  priority: Priority;
  status: ItemStatus;

  dueDate?: string; // YYYY-MM-DD
  orderByDate?: string; // YYYY-MM-DD (materials)
  requiredOnSiteDate?: string; // YYYY-MM-DD (materials)
  followUpEmailDueBy?: string; // YYYY-MM-DD (emails)
  assignedTo?: string;

  rolledFromItemId?: UUID;

  createdAt: string; // ISO
  updatedAt: string; // ISO
  closedAt?: string; // ISO
}
