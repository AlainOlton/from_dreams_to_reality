# Product Overview

**Internship Monitoring & Connecting System** — a full-stack web platform that bridges students, companies, academic supervisors, site supervisors, and admins throughout the internship lifecycle.

## Core Capabilities

- **Internship listings** — companies post openings; students browse, bookmark, and apply
- **Application tracking** — status pipeline from APPLIED → ACCEPTED/REJECTED, with interview scheduling
- **Enrollment & monitoring** — tracks both academic placements and professional internships
- **Logbook & attendance** — students submit daily/weekly logbook entries; supervisors approve them
- **Evaluations** — midterm and final evaluations by supervisors; self-assessments by students
- **Messaging** — real-time conversations between participants via Socket.IO
- **Notifications** — in-app notifications for key events (application updates, evaluation due, etc.)
- **Reports** — generated PDF/Excel reports (logbook summaries, evaluations, placement analytics, certificates)

## User Roles

| Role | Description |
|------|-------------|
| `STUDENT` | Applies for internships, submits logbooks, completes self-assessments |
| `COMPANY` | Posts internship listings, manages applications |
| `ACADEMIC_SUPERVISOR` | Monitors students, approves logbooks, submits evaluations |
| `SITE_SUPERVISOR` | On-site supervision, evaluations, task assignment |
| `ADMIN` | Platform administration, report generation, user management |

## Internship Types

- **ACADEMIC** — institution-placed internships, monitoring-focused
- **PROFESSIONAL** — company-listed internships with full application workflow
