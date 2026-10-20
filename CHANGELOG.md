# Changelog

## 2.0.0 — UI redesign (2026-10-20)

What changed from the thesis version, and why. The purpose, the functional requirements RF01–RF10, the tech
stack and the layered architecture are unchanged.

### Design and user experience

- **New visual identity**: design tokens (colour, type, radius) in `styles.css`, Figtree and IBM Plex Mono,
  and the bridge-arch logo with the medical cross as keystone. *Why:* the thesis used ad-hoc colours (violet
  buttons, red for "finalized") and duplicated CSS classes; every colour now has exactly one meaning.
- **One layout shell per role** instead of two stacked navbars: a sidebar (drawer on small screens) for
  doctors, a simple top bar for patients.
- **Doctor worklist**: greeting, KPI tiles, status filters with counts, search, sort, table on wide screens and
  cards on phones. Filtering is done on the client after a single request.
- **Report editor**: status stepper, exam table with reference ranges and Low / High / Borderline / Normal
  flags, a finalization checklist that explains why "Finalize" is blocked, a confirmation step, and a timeline.
- **Patient area**: plain-language status ("Ready" instead of "Finalized"), a summary headline, an explainer of
  how a report works and printable reports (PDF via the browser). Patients no longer see draft values.
- **Statistics**: KPI tiles and accessible HTML/CSS charts replace the pie charts.
- **Feedback**: toasts, skeleton loaders, empty and error states on every page.

### Internationalisation

- **English and Italian** with runtime switching, saved per browser, `<html lang>` kept in sync, dates and
  numbers formatted with `Intl`. The Italian dictionary is type-checked against the English one, so a missing
  translation fails the build. Backend errors are translated through stable error codes.

### Accessibility (WCAG 2.1 AA)

- Skip link, landmarks, `aria-current` navigation, visible focus ring (5.6:1 instead of the mockup's 1.6:1),
  44 px touch targets, labelled fields with linked error messages, native `<dialog>` for modals (focus trap,
  Esc, focus restore), status always shown as text as well as colour, reduced motion respected.
- Verified with axe-core on every page and dialog, and for horizontal overflow from 360 px to 1440 px.

### Backend

- **Security fix**: the API only checked that a user was signed in. Patients could read other patients'
  reports by id, create reports and edit exams. Write operations, statistics and the user list now require
  the doctor role, and patients receive 404 for reports that are not theirs.
- **Sign-in**: credentials are kept in `sessionStorage` unless "Remember me" is ticked (previously always
  `localStorage`), an expired session signs the user out, and the browser's native login prompt no longer
  appears.
- **Consistent errors**: a `@RestControllerAdvice` returns `{status, code, message, path, fieldErrors}` with
  400/401/403/404/409 instead of 500 for every failure. Generic `RuntimeException`s became specific exceptions.
- **Reference ranges**: `Exam` gained optional `refMin` / `refMax`; DTOs are validated with Bean Validation.
- **Statistics**: average time to finalize, exam counts, out-of-range exams and reports per week.
- **Demo data**: the seeder creates patients, doctors and reports in every state with realistic lab values.
- **Fixes**: first and last names are no longer unique columns; the outcome column holds 2000 characters;
  services are transactional; the auditor lookup no longer fails on anonymous requests; Swagger UI declares
  HTTP Basic.

### Developer experience

- `./mvnw` works on a fresh clone (the wrapper configuration was git-ignored) and `package-lock.json` is
  committed for reproducible installs.
- Unit and integration tests: Vitest on the frontend, JUnit 5 on the backend.
- README in English with setup for the terminal, IntelliJ IDEA and Eclipse.

### Removed

- `ng2-charts` and `chart.js` (replaced by CSS charts), the random stock avatars (replaced by initials
  avatars), the `HasRole` directive and the thesis styles.
