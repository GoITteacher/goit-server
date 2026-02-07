# Simple Cookie-Based Auth Demo Server

This project is a minimal Express + MongoDB sample that shows how cookie-based
authentication works along with protected resources like **news posts**,
**tasks**, and **notes**. Every mutable endpoint is gated behind a JWT access
token, while refresh tokens are issued via an HttpOnly+SameSite=Strict cookie.

## Quick start

1. Copy `.env` from the example (if any) and fill in one of your MongoDB URIs
   plus the optional JWT secrets.
2. Run `npm install`.
3. Start in dev mode with `npm run dev` (Hot reload) or `npm run build` +
   `npm start`.

Cookies require HTTPS in production, so run locally over `http://localhost:3001`
and disable secure cookies by leaving `NODE_ENV` unset.

## Configuration

| Variable                   | Purpose                                           | Default              |
| -------------------------- | ------------------------------------------------- | -------------------- |
| `MONGODB_*`                | Database connection                               | See `.env`           |
| `ACCESS_TOKEN_SECRET`      | Secret used to sign short-lived JWT access tokens | `demo-access-secret` |
| `ACCESS_TOKEN_EXPIRES_IN`  | JWT lifespan (expressed as `15m`, `1h`, etc.)     | `15m`                |
| `REFRESH_TOKEN_MAX_AGE_MS` | Cookie lifespan for refresh tokens                | 1 week               |
| `PORT`                     | HTTP port                                         | `3001`               |

## Authentication overview

1. The client registers or logs in. The response body contains an `accessToken`
   (JWT) and `user` object, while a `refreshToken` cookie is issued.
2. For protected requests (`/news`, `/tasks`, `/notes`), the client attaches the
   `Authorization: Bearer <accessToken>` header.
3. When the access token expires, hit `POST /api/auth/refresh` (the cookie is
   sent automatically) to receive a new access token and refreshed cookie.
4. `POST /api/auth/logout` clears the refresh cookie + server-side token.

Access tokens are signed with `ACCESS_TOKEN_SECRET` and expire quickly; refresh
tokens are UUIDs stored in the user record and rotated on every refresh.

## API Reference

All endpoints are mounted under `/api` when running via Serverless; in
development they are direct Express routes.

The API is split into authentication-guarded and public surfaces:

- **Authentication + protected resources** – `/auth` controls login/refresh/logout, and `/news`, `/tasks`, `/notes` require a valid `Authorization: Bearer <accessToken>` header.
- **Public catalog surfaces** – `/todos` and `/public/*` stay open (no bearer token), and the catalog is organized into themed categories.

---

### Auth (/auth)

#### `POST /auth/register`

Creates a new user.

- **Body**:
  `{ "email": string, "name": string, "password": string, "typeAccount"?: "freeUser" | "paidUser" | "agencyUser" }`
- **Response**: `201`
  `{ "accessToken": string, "user": { id, name, email, typeAccount } }`
- **Cookies**: `refreshToken`, `accessToken` (HttpOnly, SameSite=Strict)

#### `POST /auth/login`

Existing users get access + refresh tokens.

- **Body**: `{ "email": string, "password": string }`
- **Response**: `200` same as register.
- **Cookies**: `refreshToken`, `accessToken` (rotated on every login; HttpOnly)

#### `POST /auth/refresh`

Uses the `refreshToken` cookie to issue a fresh access token.

- **Response**: `200` `{ "accessToken": string, "user": { ... } }`
- **Cookies**: new `refreshToken`, new `accessToken`.

#### `POST /auth/logout`

Clears the refresh token server-side and removes the cookie.

- **Response**: `204`

#### `GET /auth/me`

Returns the currently authenticated user.

- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `200` `{ "user": { ... } }`

---

### News (/news)

All news endpoints require the bearer token in the header.

#### `POST /news`

- **Body**:
  `{ topic, text, type: "updates"|"news"|"testimonials"|"video stories", typeAccount: "freeUser"|"paidUser"|"agencyUser" }`
- **Response**: `201` created news.
- The logged-in user ID is inferred from the token.

#### `GET /news`

- **Query**: pagination (`page`, `perPage`), `topic`, `type`, `typeAccount`,
  `userId`.
- **Response**: `200` `{ pagination data, news: [...] }`
- Returns items created by the authenticated user only.

#### `DELETE /news/:newsId`

- Removes your own news post.
- **Response**: `200` deleted document.

---

### Tasks (/tasks)

Protected by authentication.

#### `GET /tasks`

- **Response**: `200` `{ tasks: Task[] }`

#### `POST /tasks`

- **Body**:
  `{ "title": string, "description"?: string, "status"?: "todo"|"in-progress"|"done", "dueDate"?: ISOString }`
- **Response**: `201` `{ task }` The `userId` is always the current user.

#### `GET /tasks/:taskId`

- **Response**: `200` `{ task }`

#### `PATCH /tasks/:taskId`

- **Body**: only supplied fields are updated (`title`, `description`, `status`,
  `dueDate`).
- **Response**: `200` updated task data.

#### `DELETE /tasks/:taskId`

- **Response**: `204`

---

### Notes (/notes)

Protected resource for simple note-taking.

#### `GET /notes`

- **Response**: `200` `{ notes: Note[] }`

#### `POST /notes`

- **Body**:
  `{ "title": string, "content": string, "tags"?: string[], "archived"?: boolean }`
- **Response**: `201` `{ note }`

#### `GET /notes/:noteId`

- **Response**: `200` `{ note }`

#### `PATCH /notes/:noteId`

- **Body**: allow updating `title`, `content`, `tags`, `archived`.
- **Response**: `200` updated note.

#### `DELETE /notes/:noteId`

- **Response**: `204`

Both tasks and notes endpoints only operate on documents that belong to the
authenticated user.

---

### Todos (/todos)

Public CRUD surface that is intentionally unauthenticated. Use it for shared
lists or demo data without any bearer token.

#### Shared schema

Each todo document exposes:
`title`, `description`, `completed`, `priority` (`low`,`medium`,`high`),
`dueDate`, `category`, `tags`, plus `createdAt`/`updatedAt`.

#### `GET /todos`

- **Query**:
  `page`, `perPage`, `sortField`, `sortOrder` (`asc`/`desc`), `completed`,
  `priority`, `category`, `title`, `tag`, `dueBefore`, `dueAfter`
- **Response**: `200` `{ pagination metadata, todos: Todo[] }`
- Filtering respects partial matches (`title`, `category`) and equality for
  enumerated fields, while `dueBefore`/`dueAfter` allow range queries.

#### `POST /todos`

- **Body**: `{ title: string, description?: string, completed?: boolean, priority?: "low"|"medium"|"high", dueDate?: ISOString, category?: string, tags?: string[] }`
- **Response**: `201` `{ todo }`

#### `GET /todos/:todoId`

- Returns the todo with the matching ID.
- **Response**: `200` `{ todo }`

#### `PATCH /todos/:todoId`

- **Body**: any of the fields listed above.
- **Response**: `200` updated todo.

#### `DELETE /todos/:todoId`

- **Response**: `204`

---

### Public catalog (/public)

All `/public` endpoints are intentionally unauthenticated and expose read/write access to shared catalog data. The catalog is organized into resource-specific categories (News, Songs, Cars, Movies, Students, Lessons) and each category shares the pagination helpers (`page`, `perPage`, `sortField`, `sortOrder`) along with the filters listed per section. Sorting defaults to `createdAt`, and every list response includes pagination metadata (`page`, `perPage`, `totalPages`, `totalItems`, `hasNextPage`, `hasPreviousPage`).

#### `GET /public/news`

- **Filters**: `title`, `category`, `source`, `tags`
- **Response**: `200` `{ pagination meta, items: CatalogNews[] }`

#### `POST /public/news`

- **Body**: `{ title: string, summary: string, source: string, category: "technology"|"business"|"health"|"lifestyle"|"science"|"entertainment", publishedAt: ISOString, url?: string, tags?: string[] }`
- **Response**: `201` `{ item: CatalogNews }`

#### `GET /public/news/:newsId`

- **Response**: `200` `{ item: CatalogNews }`

#### `PUT /public/news/:newsId`

- **Body**: same shape as POST (allows partial updates).
- **Response**: `200` updated `{ item: CatalogNews }`

#### `DELETE /public/news/:newsId`

- **Response**: `204`

#### `GET /public/songs`

- **Filters**: `title`, `artist`, `genre`, `language`, `label`, `releaseYear`
- **Response**: `200` `{ pagination meta, items: Song[] }`

#### `POST /public/songs`

- **Body**: `{ title: string, artist: string, album?: string, genre: string, releaseYear: number, durationSeconds: number, label?: string, language?: string }`
- **Response**: `201` `{ item: Song }`

#### `GET /public/songs/:songId`

- **Response**: `200` `{ item: Song }`

#### `PUT /public/songs/:songId`

- **Body**: same as POST (allows partial updates).
- **Response**: `200` updated `{ item: Song }`

#### `DELETE /public/songs/:songId`

- **Response**: `204`

#### `GET /public/cars`

- **Filters**: `make`, `model`, `color`, `fuelType`, `year`, `price`
- **Response**: `200` `{ pagination meta, items: Car[] }`

#### `POST /public/cars`

- **Body**: `{ make: string, model: string, year: number, color: string, price: number, mileage?: number, fuelType: "gasoline"|"diesel"|"electric"|"hybrid", description?: string }`
- **Response**: `201` `{ item: Car }`

#### `GET /public/cars/:carId`

- **Response**: `200` `{ item: Car }`

#### `PUT /public/cars/:carId`

- **Body**: same as POST (allows partial updates).
- **Response**: `200` updated `{ item: Car }`

#### `DELETE /public/cars/:carId`

- **Response**: `204`

#### `GET /public/movies`

- **Filters**: `title`, `director`, `genre`, `language`, `releaseYear`, `rating`
- **Response**: `200` `{ pagination meta, items: Movie[] }`

#### `POST /public/movies`

- **Body**: `{ title: string, director: string, genre: string, releaseYear: number, durationMinutes: number, rating?: number, language?: string, summary?: string }`
- **Response**: `201` `{ item: Movie }`

#### `GET /public/movies/:movieId`

- **Response**: `200` `{ item: Movie }`

#### `PUT /public/movies/:movieId`

- **Body**: same as POST (allows partial updates).
- **Response**: `200` updated `{ item: Movie }`

#### `DELETE /public/movies/:movieId`

- **Response**: `204`

#### `GET /public/students`

- **Filters**: `firstName`, `lastName`, `major`, `cohortYear`, `gpa`, `enrolled`
- **Response**: `200` `{ pagination meta, items: Student[] }`

#### `POST /public/students`

- **Body**: `{ firstName: string, lastName: string, major: string, cohortYear: number, gpa?: number, enrolled?: boolean }`
- **Response**: `201` `{ item: Student }`

#### `GET /public/students/:studentId`

- **Response**: `200` `{ item: Student }`

#### `PUT /public/students/:studentId`

- **Body**: same as POST (allows partial updates).
- **Response**: `200` updated `{ item: Student }`

#### `DELETE /public/students/:studentId`

- **Response**: `204`

#### `GET /public/lessons`

- **Filters**: `title`, `subject`, `level`, `teacher`, `durationMinutes`
- **Response**: `200` `{ pagination meta, items: Lesson[] }`

#### `POST /public/lessons`

- **Body**: `{ title: string, subject: string, level?: "beginner"|"intermediate"|"advanced", teacher: string, durationMinutes: number, publishedAt: ISOString, summary?: string }`
- **Response**: `201` `{ item: Lesson }`

#### `GET /public/lessons/:lessonId`

- **Response**: `200` `{ item: Lesson }`

#### `PUT /public/lessons/:lessonId`

- **Body**: same as POST (allows partial updates).
- **Response**: `200` updated `{ item: Lesson }`

#### `DELETE /public/lessons/:lessonId`

- **Response**: `204`

---

## Swagger documentation

Visit `GET /docs` to explore the full catalog API through an interactive Swagger UI. The underlying OpenAPI JSON payload is served from `/docs/openapi.json`, which is the same definition that powers the UI.
