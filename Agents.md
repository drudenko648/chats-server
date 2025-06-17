# AGENTS.md — AI Companion Development Guide

## 🎯 Purpose

This document defines how AI coding assistants (e.g. ChatGPT, GitHub Copilot, Cody, Tabnine) contribute to the **NestJS + GraphQL + Prisma + Supabase chat backend**. It outlines architecture conventions, code standards, and the review process to ensure generated code is consistent, secure, and maintainable.

---

## ⚡ Project Overview

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Web Framework | **NestJS**                                    |
| API Style     | **GraphQL** (code-first decorators)           |
| Database ORM  | **Prisma** (PostgreSQL on Supabase)           |
| Realtime      | **Socket.IO Gateway** (NestJS)                |
| Auth          | **JWT** (argon2id preferred, bcrypt fallback) |
| Testing       | **Jest** (unit + e2e)                         |

### Folder Structure

```
src/
 ├── auth/
 ├── users/
 ├── chats/
 ├── messages/
 ├── socket/
 ├── prisma/
 └── common/
```

---

## ✨ Coding Standards

1. **Language:** TypeScript with strict mode.
2. **Architecture:** One module per domain; constructor injection; common guards/pipes in `common/`.
3. **GraphQL:** Code-first with clear DTO suffixes (`Input`, `Args`, `Object`). Auto-generate schema file.
4. **Prisma:**
   - Keep schema in `schema.prisma`; define `@@unique` constraints explicitly.
   - Use `prisma migrate dev --create-only` for migrations and review before applying.
5. **Passwords:** Hash with `argon2id` (use `bcrypt` only if argon2 is unsupported). Never store plain text.
6. **Validation:** Use global `ValidationPipe` with `transform: true`; annotate DTOs with `class-validator`.
7. **Testing:** Place e2e tests in `test/`; unit tests near source code when small.
8. **Lint/Format:** Use ESLint and Prettier with project configuration.

---

## 🤖 AI Generation Guidelines

| Stage              | AI Companion May                                      | AI Companion Must Not                                          |
| ------------------ | ----------------------------------------------------- | -------------------------------------------------------------- |
| **Scaffolding**    | Generate modules, DTOs, resolvers, guards, migrations | Create files outside `src/` or `test/` without approval        |
| **Implementation** | Implement logic, write tests, document code           | Make breaking API changes silently (must add TODO and comment) |
| **Refactoring**    | Propose improvements via PR comments                  | Rename public types or fields without review                   |

Additional notes:

- One PR = one feature; keep changes reviewable.
- Public methods require JSDoc for clarity.
- Critical paths (auth, send message) need both success and failure tests.
- Mark AI-generated TODOs as `// TODO(ai): description`.

---

## 🔒 Security & Privacy

- Use environment variables for secrets (via `process.env`).
- Sanitize and validate all incoming data. Never trust Socket.IO payloads by default.
- Rate-limit authentication endpoints.
- Store refresh tokens (if introduced) hashed in the database.

---

## 🔑 Commit & PR Conventions

- Use **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.).
- Write clear PR descriptions, referencing related issues or tasks.
- Ensure `npm run lint` and `npm run test` pass before merging.

---

## ⚙️ AI Contribution Workflow

1. Review this file before generating code.
2. Map the task to the appropriate module(s).
3. Generate code, tests, and documentation together.
4. Validate output with `npm run start:dev`, `npm run test`, `npm run lint`.
5. Commit with a proper message and submit for human review.

---

## ✅ AI PR Checklist

-

---

## 📚 Reference Resources

- NestJS GraphQL code-first documentation
- NestJS WebSocket Gateway guide
- NestJS ValidationPipe documentation
- Prisma many-to-many relations
- Prisma with Supabase guide
- Argon2 and bcrypt password hashing best practices
- NestJS testing fundamentals
- Conventional Commits specification

Refer to these resources if implementation details are unclear.

---

*End of AGENTS.md*

