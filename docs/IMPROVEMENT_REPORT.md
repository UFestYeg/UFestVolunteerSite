# UFest Volunteer Site — Improvement Report

_Generated as a triage backlog after the 2026 dependency upgrade. Findings are grouped by theme and prioritized **High / Medium / Low**. Each item lists the affected file(s), why it matters, and a suggested fix. Line numbers are approximate and may drift as the code changes._

> Status snapshot: A test suite was just added (72 frontend Vitest tests + 70 Django tests, all passing) and the GitHub Actions CI workflow was rewritten to run them on every PR. Several items below relate to gaps surfaced while building those tests.
>
> **Implementation pass (pending review, uncommitted):** H-1, H-2, M-1, H-3, H-4, M-2, M-3, M-4, M-5, M-6, L-1, L-2, M-8, M-9, M-10 are implemented. All 70 backend + 74 frontend tests still pass; `tsc --noEmit` is clean. Remaining: the L-3..L-7 backlog.
>
> **Follow-up pass (committed on `dependency-upgrade-2026`):** L-5 (profile completeness indicator), L-4 (volunteer iCal/ICS export), and L-6 (test coverage) addressed. L-5: `getIncompleteProfileFields` util + unit tests, and a warning in the submit-request popover linking to the profile edit page. L-4: authenticated `api/my_schedule.ics` endpoint returning the volunteer's accepted shifts as a VCALENDAR, plus an "Add to calendar" download button on My Schedule. L-6: added an `apiUtils` test suite, Django tests for the admin daily check-in CSV export, and end-to-end customer-flow tests (`src/flows.test.tsx`) covering protected-route gating, login, signup, and category browsing. Remaining: L-3, L-7.

---

## 1. Security

### ✅ H-1 — CORS allows all origins (DONE)
- **Where:** `backend/settings.py:167` — `CORS_ALLOW_ALL_ORIGINS = True` (the scoped `CORS_ALLOWED_ORIGINS` whitelist on line 166 is commented out).
- **Why it matters:** Any website can make authenticated cross-origin requests to the API. Combined with cookie auth this is a CSRF/data-exfiltration risk in production.
- **Fix:** Enable `CORS_ALLOWED_ORIGINS = ["https://www.volunteer.ufest.ca", "https://volunteer.ufest.ca"]` and remove `CORS_ALLOW_ALL_ORIGINS`. Use `http://localhost:3000` only when `DEBUG`.

### ✅ H-2 — `DEBUG` defaults to True (DONE)
- **Where:** `backend/settings.py:29` — `DEBUG = os.getenv("DEBUG") != "False"`.
- **Why it matters:** Any environment that doesn't set `DEBUG` _exactly_ to the string `"False"` runs with debug on — leaking stack traces and settings. Fail-open is the wrong default for a security-sensitive flag.
- **Fix:** Default to off: `DEBUG = os.getenv("DEBUG", "False") == "True"`.

### ✅ M-1 — `ALLOWED_HOSTS` missing the apex domain (DONE)
- **Where:** `backend/settings.py:31` — `["127.0.0.1", "www.volunteer.ufest.ca"]`.
- **Why it matters:** Requests to `volunteer.ufest.ca` (no `www`) would be rejected; localhost dev host names may also be missing.
- **Fix:** Add `volunteer.ufest.ca` (and `localhost` for dev) or drive the list from an env var.

---

## 2. Error Handling & Robustness

### ✅ H-3 — API failures are swallowed instead of shown to users (DONE)
- **Where:** `src/store/actions/volunteer.ts` thunks (e.g. ~L171, L232, L277, L303) — five `// TODO: send notification and redirect` comments where the `.catch` only `console.log`s. Compare with `src/store/actions/user.ts` which does call `enqueueSnackbar`.
- **Why it matters:** When a category/role/event fetch or a request action fails, the user sees nothing — the UI just appears empty or stuck.
- **Fix:** Standardize a `.catch` that parses `error.response?.data` (reuse `buildErrorMessage`) and calls `enqueueSnackbar(...)`. Apply to every API thunk.

### ✅ H-4 — Debug output left in production code (DONE)
- **Frontend `console.*`:** `src/components/PositionRequestPage/PositionRequestPage.tsx` (~L144, L203–204, L266–280), `src/components/Calendar/RequestEvent.tsx` (~L90, L106–119), `src/components/Calendar/MySchedule.tsx` (~L165–167), `src/store/actions/volunteer.ts` (~L165–230), `src/serviceWorker.ts`.
- **Backend `print(...)`:** `user_profile/views.py:39`, `volunteer_categories/api/views.py` (~L69, L121, L187, L191, L196), `volunteer_categories/admin.py` (~L329–364), `volunteer_categories/api/serializers.py` (~L124, L205). These emit noise during the test run (`perform update`, `Unexpected error: ...`).
- **Why it matters:** Clutters logs, can leak data, and signals incomplete error handling.
- **Fix:** Remove the `console.*`/`print` calls or replace with the Python `logging` module / a frontend logger gated on environment.

### ✅ M-2 — No React error boundary (DONE)
- **Where:** `src/App.tsx` wraps routes with no `ErrorBoundary`; none exists in the codebase.
- **Why it matters:** A single render error unmounts the whole SPA and shows a blank screen with no recovery.
- **Fix:** Add an `ErrorBoundary` around `<BaseRouter />` that renders a friendly fallback and logs the error.

### ✅ M-3 — Broad `except Exception` / bare `except` that print-and-reraise (DONE)
- **Where:** `volunteer_categories/api/views.py:68–69` and `volunteer_categories/api/serializers.py:123–124` (catch generic `Exception`, `print`, re-raise); bare/broad excepts in `volunteer_categories/admin.py:49`, `:330` and `volunteer_categories/tasks.py:35`.
- **Why it matters:** Hides the real error type/context and silently ignores failures (e.g. in scheduled tasks).
- **Fix:** Catch specific exceptions, log with context, and avoid swallowing failures in cron/tasks.

### ✅ M-4 — Ad-hoc axios configuration (DONE)
- **Where:** `axios.defaults.headers...` mutated inline in ~15 places across `src/store/actions/*.ts`.
- **Why it matters:** Repetitive, easy to get out of sync, and there is no central place to handle 401/403 or token refresh.
- **Fix:** Create a shared axios instance with request/response interceptors (attach token + CSRF, centralize error handling).

---

## 3. UX & Design

### ✅ M-5 — Theme accessibility: white secondary text + non-responsive headings (DONE)
- **Where:** `src/styles/Theme.tsx` — `palette.text.secondary` is set to `#fff`, which caused the white-on-white "View" label already patched in `RoleSelectPage`. The file also uses the deprecated `adaptV4Theme` wrapper, and defines very large headings (h1 ≈ 8.6rem, h2 ≈ 5.4rem).
- **Why it matters:** The white secondary color will keep biting any MUI component that defaults to secondary text (contrast/WCAG failures); oversized headings overflow on mobile.
- **Fix:** Use a dark secondary text color (or computed contrast), drop `adaptV4Theme` for native MUI v5 theme syntax, and use responsive typography (`responsiveFontSizes` or breakpoint-based sizes).

### ✅ M-6 — Inconsistent loading states (DONE)
- **Where:** `Loading` is wired in `PositionRequestPage`, `MySchedule`, `VolunteerScheduleSummary`, but `src/components/VolunteerCategoryList/VolunteerCategoryList.tsx` renders the list without checking the `loading` flag.
- **Why it matters:** Users may see an empty or stale list before data loads, which reads as "broken".
- **Fix:** Gate list rendering on the reducer `loading` flag and show a spinner/skeleton.

### ✅ L-1 — Missing empty states (partly DONE)
- **Where:** `VolunteerCategoryList.tsx` (no "no categories" message); calendar views lack an obvious empty fallback. `VolunteerScheduleSummary` does this well ("No scheduled activities found").
- **Fix:** Add empty-state messaging to list/table/calendar views.

### ✅ L-2 — MUI `Grid direction` warning (DONE)
- **Where:** `CalendarToolbar` — `direction` prop used without `container`, producing a console warning.
- **Fix:** Add `container` or remove `direction`. _(Done: added `container width="auto"` to the flex-end `Grid` in `CalendarToolbar.tsx`.)_

---

## 4. Features & Gaps

### ✅ M-7 — Volunteer "withdraw request" UI (already implemented)
- **Where:** `src/components/Calendar/RequestEvent.tsx` — each scheduled request shows a Cancel (✕) icon that opens a "Delete Request" confirmation popover, calls `DELETE VolunteerUrls.REQUESTS_DETAILS(...)`, and shows a success/error snackbar. A `tooLateToDelete()` guard disables withdrawal past the cutoff.
- **Note:** Earlier audit incorrectly flagged this as missing; it exists in MySchedule/calendar. No action needed beyond the existing debug-`console.*` cleanup in this file (see H-4).

### 🟢 L-3 — Notification preferences / unsubscribe
- Users can't opt in/out of emails and templates lack an unsubscribe link (`templates/account/email/`). Consider a settings page + unsubscribe handling.

### � L-4 — Admin reporting & calendar export (PARTIAL — ICS export DONE)
- Admin currently exports only the daily check-in CSV (`templates/admin/export_daily_checkin_form.html`). Consider volunteer summaries / capacity views, and an iCal/ICS export so volunteers can sync shifts to Google/Outlook.
- **Fix (ICS export):** Added an authenticated `GET api/my_schedule.ics` endpoint (`MyScheduleICSView` in `volunteer_categories/api/views.py`) that returns the logged-in volunteer's `ACCEPTED` shifts as a valid `text/calendar` VCALENDAR (one `VEVENT` per accepted request, UTC timestamps, escaped fields). A new "Add to calendar" button on the My Schedule page (`src/components/Calendar/MySchedule.tsx`) downloads the `.ics` via an authenticated blob request. Covered by 4 Django tests (auth required, accepted-only, own-shifts-only). Admin summary/capacity reporting views remain outstanding.

### ✅ L-5 — Profile completeness indicator (DONE)
- Required fields exist on `UserProfile` but the UI doesn't flag an incomplete profile before a volunteer submits a request.
- **Fix (done):** `getIncompleteProfileFields` (in `src/utils.ts`, unit-tested) flags missing first/last name, email, emergency contact, and age (for under-18s). `PositionRequestPage`'s submit-request popover now shows a warning with a link to the profile edit page when the volunteer's profile is incomplete.

---

## 5. Code Quality & Tech Debt

### ✅ M-8 — Pervasive `any` typing (DONE)
- **Where:** Reducers (`action: any`, `error: any | null`), `PositionRequestPage.tsx`, `RequestEvent.tsx`, `RoleSelectPage.tsx`.
- **Why it matters:** Defeats TypeScript safety and makes refactors risky.
- **Fix:** Introduce typed action unions and domain interfaces (role, event, request). _(Done: each reducer now takes a public `AnyAction` param cast once to its discriminated `*ActionType` union so the switch narrows and every helper is typed to the exact action it handles; reducer `error` fields tightened from `any | null` to `string | null`. Tightening `error` exposed loosely-typed state hooks: `useAuthInfo`/`useUserInfo`/`useVolunteerInfo` now return `as const` tuples for precise per-position types, which surfaced and fixed dead `error.reponse` typo code in `EventsCategoryView.tsx`/`EventsDetailView.tsx`.)_

### ✅ M-9 — DB access during app initialization (RuntimeWarning) (DONE)
- **Where:** Surfaces on every `manage.py test` run ("Accessing the database during app initialization is discouraged"). Likely originates from an `AppConfig.ready()` / module import in `volunteer_categories` (check `apps.py`, `cron.py`, `tasks.py`, `admin.py`).
- **Why it matters:** Querying at import time is fragile (fails on fresh DBs/migrations) and slows startup.
- **Fix:** Move queries out of import/`ready()` into lazy callables. _(Done: root cause was `DailyCheckinForm.selected_date = forms.ChoiceField(choices=date_choices())` in `volunteer_categories/admin.py`, which ran the `EventDate` query at class-definition/import time. Changed to pass the `date_choices` callable so MUI/Django evaluates choices lazily.)_

### ✅ M-10 — `UserSerializer.update` skips falsy values (DONE)
- **Where:** `user_profile/serializers.py` uses `if age:` / `if t_shirt_size:`, so an explicit `0`/empty value is silently ignored.
- **Why it matters:** Edge-case data loss; surprising update semantics.
- **Fix:** Check `is not None` / presence in `validated_data` instead of truthiness.

### � L-6 — Test coverage gaps (post-additions)
- Now covered: reducers, store utils, `src/utils`, auth action creators/thunks, `apiUtils` (auth headers, API error-message extraction, 401 interceptor), a few components, and end-to-end customer-flow tests (`src/flows.test.tsx`: protected-route gating, login → profile edit, signup → confirmation, browse categories → request page) that drive the real router + store + pages with only `axios` mocked; Django models/serializers/api/context-processor, the volunteer iCal/ICS export endpoint, and the admin daily check-in CSV export.
- Still thin: deep per-component coverage (PasswordReset*, ProfileEditPage internals, Calendar internals), network/error branches of thunks, remaining admin views, and a backend end-to-end request flow (create → accept → check-in export).

---

## 6. Performance

### 🟢 L-7 — Heavy date libraries
- `moment` + `moment-range` add significant bundle weight. `date-fns` is already a dependency.
- **Fix:** Migrate non-calendar date logic to `date-fns`/`day.js`; keep `react-big-calendar`.

### ✅ Already good
- `with_requests` endpoint uses `Prefetch` to avoid N+1 (`volunteer_categories/api/views.py`).
- `getMappedVolunteerRoles` collapses three calls into one optimized endpoint (with a Promise.all fallback).
- Models define sensible DB indexes (`volunteer_categories/models.py`).

---

## Suggested triage order

**Do first (High):** H-1 CORS, H-2 DEBUG default, H-3 surface API errors, H-4 strip debug output, M-2 error boundary.

**Next (Medium):** M-3 specific exceptions, M-4 axios interceptor, M-5 theme a11y, M-6 loading states, M-8 typing, M-9 init-time DB access, M-10 serializer update semantics.

**Backlog (Low):** notification prefs, admin reporting/iCal, profile completeness, empty states, Grid warning, date-lib migration, expand test coverage.
