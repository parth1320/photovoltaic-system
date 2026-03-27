# Full-Stack Audit — Photovoltaic System

> Audited: `frontend/` (React 18, CRA) · `backend/` (Node.js / Express / Mongoose)  
> Date: 2026-03-27

---

## 1. Deprecated / Misused React Patterns

### 1.1 `window.location.href` instead of React Router navigation

| File | Line | Issue |
|------|------|-------|
| [Login.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Login.js#L34) | 34 | `window.location.href = "/dashboard"` — triggers a full page reload, bypassing React Router's SPA navigation and losing React state |
| [Register.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Register.js#L33) | 33 | Same pattern |
| [Profile.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Profile.js#L45) | 45 | `window.location.href(...)` — **runtime crash**: `href` is a string, not a function |

**Fix:** Replace with `useNavigate()` from `react-router-dom`.

```diff
- window.location.href = "/dashboard";
+ const navigate = useNavigate();
+ navigate("/dashboard");
```

---

### 1.2 `useCallback` with empty deps wrapping a non-stable function

| File | Line | Issue |
|------|------|-------|
| [Dashboard.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Dashboard.js#L15-L25) | 15–25 | `fetchProjects` memoised with `[]` — correct, but `userId` is read from `localStorage` at **module scope** (line 8), not inside React state. Changes to the stored ID won't trigger a re-fetch. |
| [ProjectDetails.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/project/ProjectDetails.js#L41-L55) | 41–55 | `fetchProducts` is defined as a plain `async` arrow function **without** `useCallback`, but it is listed in the `useEffect` dependency array on line 55. This creates a **new function reference every render** → **infinite fetch loop**. |

**Fix for `fetchProducts`:**

```diff
- const fetchProducts = async () => { ... };
+ const fetchProducts = useCallback(async () => { ... }, []);

  useEffect(() => {
    fetchProject();
    fetchProducts();
  }, [fetchProject, fetchProducts]);
```

**Fix for module-scope `localStorage` reads:**

```diff
- const userId = localStorage.getItem("id");  // module-level, never updates
  const Dashboard = () => {
+   const userId = localStorage.getItem("id"); // inside component
```

---

### 1.3 `response.json()` called twice in Login & Register

| File | Lines | Issue |
|------|-------|-------|
| [Login.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Login.js#L29-L42) | 29–42 | `response.json()` is consumed inside the `if (response.ok)` block on line 30, then called **again** on line 41 — the second call throws because the body stream is already consumed. |
| [Register.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Register.js#L32-L39) | 32–39 | Same pattern. |

```diff
  if (response.ok) {
    const { token, id } = await response.json();
    ...
- }
- const data = await response.json(); // ← stream already consumed
- console.log(data);
+ }
```

---

### 1.4 Key prop using array index

| File | Line | Issue |
|------|-------|-------|
| [ProjectDetails.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/project/ProjectDetails.js#L172) | 172 | `key={index}` — causes React reconciliation bugs when list items are reordered or deleted |

**Fix:** Use `key={product._id}`.

---

### 1.5 Checking `response.statusText` instead of `response.status`

`response.statusText` (`"OK"`, `"Created"`) is **not reliable** across browsers/environments (HTTP/2 omits it entirely). 

| File | Lines |
|------|-------|
| [Dashboard.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Dashboard.js#L36) | 36 |
| [ProjectDetails.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/project/ProjectDetails.js#L105) | 105, 122 |

**Fix:** Check `response.status === 200` or use Axios's `response.status`.

---

### 1.6 `alert()` — deprecated UX anti-pattern

| File | Line |
|------|------|
| [Profile.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Profile.js#L44) | 44 |

`alert()` blocks the main thread and is unstyled. Use `react-toastify`'s `toast.success()` (already a dependency) instead.

---

### 1.7 Dead / commented-out code in production

[ProjectDetails.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/project/ProjectDetails.js#L231-L414) contains **185 lines of commented-out duplicate component code** (lines 231–414) and an empty `editProductHandler` stub (line 133). These should be removed before any migration.

---

### 1.8 `react-scripts` (Create React App) — deprecated toolchain

The project uses `react-scripts@5.0.1`, which is **no longer maintained** (CRA was officially deprecated in early 2023). It relies on Webpack 5 with no active security patching.

**Migration target:** Vite + `@vitejs/plugin-react` or Next.js App Router (see Section 3).

---

## 2. Node.js / Backend Security Flaws

### 🔴 CRITICAL — 2.1 Hardcoded JWT secret in source code

| File | Lines |
|------|-------|
| [authorization.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/backend/middleware/authorization.js#L11) | 11 |
| [users.js (route)](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/backend/routes/users.js#L31-L58) | 31, 58 |

The secret `"4$98Ys2a#Pq1!bD3"` is committed to source control. Anyone with repo access can forge valid tokens.

**Fix:** Move to environment variables.
```js
// .env
JWT_SECRET=<long-random-256-bit-key>

// usage
jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
jwt.verify(token, process.env.JWT_SECRET, callback);
```

---

### 🔴 CRITICAL — 2.2 Hardcoded MongoDB connection string with credentials

| File | Line |
|------|------|
| [server.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/backend/server.js#L11-L12) | 11–12 |

The Atlas URI `mongodb+srv://parthkakadiya320:parth1320@cluster0...` contains live credentials checked into git. This is a **credential leak** — rotate the Atlas password immediately and migrate to `.env`.

```js
const URI = process.env.MONGODB_URI;
```

---

### 🔴 CRITICAL — 2.3 Hardcoded OpenWeatherMap API key

| File | Line |
|------|------|
| [cronjob.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/backend/utils/cronjob.js#L13) | 13 |

`apiKey = "5a032b93152809eb63bb7c23f246adef"` is a live key in source. Any usage beyond the free tier quota will be billed to the owner's account.

**Fix:** `process.env.OPENWEATHER_API_KEY`

---

### 🟠 HIGH — 2.4 JWT tokens with no expiry (`expiresIn` missing)

Tokens issued in [users.js](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/backend/routes/users.js#L31) never expire. A stolen token grants permanent access until the user's account is deleted. 

**Fix:**
```js
jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
```

---

### 🟠 HIGH — 2.5 Authorization middleware crashes on missing token

```js
// authorization.js L4–5
const token = req.headers.authorization;
const extratedToken = token.replace("Bearer ", "");
```

If the `Authorization` header is absent, `token` is `undefined` → `.replace()` throws a **500 Internal Server Error** instead of a 401. The `!extratedToken` guard on line 7 is **never reached**.

**Fix:**
```js
const token = req.headers.authorization;
if (!token) return res.status(401).json({ error: "No token provided" });
const extratedToken = token.replace("Bearer ", "");
```

---

### 🟠 HIGH — 2.6 CORS configured with wildcard — no origin restriction

```js
// server.js L30
app.use(cors());
```

With default options, `cors()` allows **any origin**. In production, this exposes the API to cross-site requests from any domain.

**Fix:**
```js
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
```

---

### 🟠 HIGH — 2.7 Project & report routes have no authentication

`/allproject/:id`, `/project/:id` (GET/POST/PUT/DELETE), `/generate-report/...` and the cron utilities have **no `verifyToken` middleware**. Any unauthenticated client can CRUD any user's projects or download reports.

**Fix:** Add `verifyToken` to all project/report routes:
```js
router.get("/allproject/:id", verifyToken, async (req, res) => { ... });
router.delete("/:id", verifyToken, async (req, res) => { ... });
```

---

### 🟠 HIGH — 2.8 Broken HTTP method for user update route

```js
// routes/users.js L86
router.post("/userUpdate/:id", verifyToken, async ...);
```

The frontend calls this with `.put(...)` ([Profile.js L29](file:///c:/Users/parth/OneDrive/Desktop/Projects/react-applications/photovoltaic-system/frontend/src/pages/Profile.js#L29)). The server is registered as `POST`, so every profile update silently hits a 404/405. Rename to `router.put`.

---

### 🟡 MEDIUM — 2.9 Missing `helmet` middleware (security headers)

No HTTP security headers (CSP, X-Frame-Options, HSTS, etc.) are set. Install and use `helmet`:

```js
const helmet = require("helmet");
app.use(helmet());
```

---

### 🟡 MEDIUM — 2.10 No rate limiting on auth endpoints

`/login` and `/register` have no rate limiting, making them vulnerable to brute-force attacks. Install `express-rate-limit`:

```js
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use("/login", authLimiter);
app.use("/register", authLimiter);
```

---

### 🟡 MEDIUM — 2.11 `useNewUrlParser` / `useUnifiedTopology` deprecated options

```js
// server.js L15-L18
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
```

These options are **no-ops in Mongoose 7+** (the installed version). They generate deprecation warnings. Remove them:

```js
mongoose.connect(process.env.MONGODB_URI);
```

---

### 🟡 MEDIUM — 2.12 `fs` package installed unnecessarily

`"fs": "^0.0.1-security"` is a dummy/security-placeholder package in `package.json`. The built-in Node.js `fs` module should be used directly — no install required. Remove this dependency.

---

### 🟡 MEDIUM — 2.13 No input validation / sanitization

No middleware (e.g. `express-validator`, `zod`, `joi`) validates request bodies. MongoDB ObjectId params are passed directly to `findById()` — a malformed ID causes an unhandled `CastError` (returns a 500 instead of a 400).

---

### 🟡 MEDIUM — 2.14 `jsonwebtoken` installed on the client-side frontend

`"jsonwebtoken": "^9.0.0"` is in `frontend/package.json`. JWT verification must **never happen in the browser** — it can be bypassed. Remove it from the frontend. The frontend only needs to store and transmit the token, not verify it.

---

### 🟡 MEDIUM — 2.15 Cronjob logic bug — `startingTime` uses `Date` object as Unix timestamp

```js
// cronjob.js L45
const startingTime = Math.floor(project.createdAt / 1000);
```

`project.createdAt` is a `Date` object. `Date / 1000` coerces it via `.valueOf()` which returns milliseconds — so `Math.floor` of that divided by 1000 is correct. However this **only works by accident** due to JS type coercion. Clarify intent:

```js
const startingTime = Math.floor(new Date(project.createdAt).getTime() / 1000);
```

---

## 3. Migration Path to React Server Components (RSC)

> React Server Components require a **framework** — either Next.js 13+ App Router (recommended) or a custom Vite/RSC setup. Since this project is on CRA, a two-phase migration is advised.

### Phase 1 — Migrate from CRA to Next.js App Router

```
Current: CRA (react-scripts) + Express backend
Target:  Next.js 14 App Router + Express backend (unchanged initially)
```

#### Step-by-step

1. **Scaffold Next.js alongside the existing app:**
   ```bash
   npx create-next-app@latest frontend-next --app --ts --no-tailwind
   ```

2. **Move pages:** Map each `src/pages/*.js` to the `app/` directory.

   | CRA route | Next.js App Router file |
   |-----------|------------------------|
   | `/` (Auth) | `app/page.tsx` |
   | `/login` | `app/login/page.tsx` |
   | `/register` | `app/register/page.tsx` |
   | `/dashboard` | `app/dashboard/page.tsx` |
   | `/dashboard/projects/:id` | `app/dashboard/projects/[id]/page.tsx` |
   | `/dashboard/create` | `app/dashboard/create/page.tsx` |
   | `/dashboard/profile` | `app/dashboard/profile/page.tsx` |
   | `/dashboard/visualmap/:id` | `app/dashboard/visualmap/[id]/page.tsx` |

3. **Replace `react-scripts start` with `next dev`.**

---

### Phase 2 — Introduce Server Components

Identify which components **can be Server Components** (no browser APIs, no hooks, no event handlers):

| Component/Page | RSC Candidate? | Reason |
|---------------|----------------|--------|
| `Dashboard.js` — project list | ✅ Yes | Data-fetch at render time; no client interactivity beyond navigation |
| `ProjectDetails.js` — project header, product table | ✅ Yes (partially) | Read-only data display; action buttons stay as Client Components |
| `Profile.js` — display section | ✅ Yes | Read-only display |
| `Login.js` / `Register.js` | ❌ No | Form state, event handlers |
| `Auth.js` | ❌ No | `useState` toggle |
| `VisualMap.js` | ❌ No | Map library requires `window` / DOM |

#### Example: Dashboard as a Server Component

```tsx
// app/dashboard/page.tsx — Server Component (no "use client")
import { cookies } from "next/headers";

async function getProjects(userId: string) {
  const res = await fetch(`${process.env.API_URL}/allproject/${userId}`, {
    headers: { Authorization: `Bearer ${cookies().get("token")?.value}` },
    cache: "no-store", // always fresh
  });
  return res.json();
}

export default async function DashboardPage() {
  const userId = cookies().get("userId")?.value ?? "";
  const projects = await getProjects(userId);

  return (
    <main>
      <h1>Dashboard</h1>
      {/* ProjectCard is a Client Component for interactive delete/nav */}
      {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
    </main>
  );
}
```

```tsx
// app/dashboard/_components/ProjectCard.tsx
"use client";
import { useRouter } from "next/navigation";

export function ProjectCard({ project }) {
  const router = useRouter();
  const handleDelete = async () => { /* ... */ };
  return ( /* card JSX */ );
}
```

---

### Phase 3 — Eventual: Route Handlers replace Express (optional)

Once on Next.js you can consolidate the Express backend into **Next.js Route Handlers** (`app/api/...`):

```
app/api/login/route.ts      ← replaces POST /login
app/api/projects/route.ts   ← replaces GET/POST /project/:id
app/api/report/route.ts     ← replaces GET /generate-report/...
```

This removes the separate Express server entirely, simplifies deployment, and allows edge-compatible middleware.

---

## 4. Quick-Win Priority Matrix

| Priority | Issue | Effort |
|----------|-------|--------|
| 🔴 P0 | Rotate MongoDB credentials & API key; move to `.env` | 30 min |
| 🔴 P0 | Move JWT secret to `.env`; add `expiresIn` | 15 min |
| 🔴 P0 | Fix auth middleware crash on missing token | 5 min |
| 🟠 P1 | Add `verifyToken` to all project/report routes | 30 min |
| 🟠 P1 | Fix `router.post → router.put` for userUpdate | 5 min |
| 🟠 P1 | Replace `cors()` wildcard with origin whitelist | 10 min |
| 🟠 P1 | Add `helmet` | 5 min |
| 🟠 P1 | Replace `window.location.href` with `useNavigate` | 15 min |
| 🟠 P1 | Fix double `response.json()` calls | 10 min |
| 🟡 P2 | Add rate limiting to auth routes | 20 min |
| 🟡 P2 | Add input validation (`express-validator` or `zod`) | 1–2 hrs |
| 🟡 P2 | Remove `jsonwebtoken` from frontend | 5 min |
| 🟡 P2 | Remove `fs` dummy package, deprecated Mongoose options | 5 min |
| 🟡 P2 | Fix `fetchProducts` infinite loop (missing `useCallback`) | 10 min |
| 🔵 P3 | Migrate from CRA → Next.js App Router (Phase 1) | 2–4 days |
| 🔵 P3 | Introduce Server Components for data-only pages (Phase 2) | 1–2 days |
