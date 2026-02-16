# M1 — Data Model + Rollover Engine (Spec)

## Core entities
### Job
- id (uuid)
- jobNumber
- name
- mainContractor
- siteAddress
- stage (prestart|in_progress|snagging|complete)
- active (bool)
- createdAt, updatedAt

### DayEntry
- id (uuid)
- jobId (fk)
- date (YYYY-MM-DD, local)
- weather (optional)
- summary (text)

### Item (universal)
Used for: tasks, materials, issues, delays, follow-up emails.
- id (uuid)
- jobId (fk)
- dayEntryId (fk, the day it was created/last updated)
- type (task|material|issue|delay|email)
- title (short)
- details (long)
- priority (critical|high|normal|low)
- status (open|in_progress|done|ordered|delivered|resolved|sent|closed)  # depends on type
- dueDate (optional)
- orderByDate (materials only, optional)
- requiredOnSiteDate (materials only, optional)
- followUpEmailDueBy (email only, optional)
- assignedTo (optional)
- createdAt, updatedAt
- closedAt (optional)

## Rollover Rules (daily)
When creating a new DayEntry for a Job:
Carry forward Items where:
- type=task and status != done
- type=material and status != delivered
- type=issue and status != resolved
- type=delay and status != closed
- type=email and status != sent

Rollover behavior:
- New DayEntry created for date D
- Carried items get duplicated as new rows linked to DayEntry(D) (keeps history)
- Original item remains linked to its original DayEntry
- Fields retained: type/title/details/priority/status/due dates/assignedTo
- Add system note: rolledFromItemId

## Dashboard queries (later)
- Overdue: dueDate < today and status not closed
- Materials: orderByDate within 48h or overdue
- Emails: followUpEmailDueBy within 48h or overdue
