# Product Readiness OS SQLite Practice Database

This folder contains SQL files for creating a small local SQLite database based on the Product Readiness OS demo.

The goal is to practice SQL using realistic product operations data: feedback intake, classification, severity, clusters, owner routing, routed tasks, readiness tracking, and launch risks.

This database is currently a **local learning and practice artifact**. It is not connected to the live Product Readiness OS demo.

---

## Folder Structure

Recommended repo structure:

```text
db/
  product-readiness-os.sqlite

sql/
  product-readiness-os/
    001_schema.sql
    002_seed_data.sql
    003_practice_queries.sql
    README.md
```

Generated local database files should live under `db/` and are ignored by Git.

---

## Script Order

Run the scripts in this order:

1. `001_schema.sql` - creates the local practice tables.
2. `002_seed_data.sql` - inserts fictional Product Readiness OS sample data.
3. `003_practice_queries.sql` - contains example queries for practicing analysis.

Example SQLite workflow:

```bash
sqlite3 db/product-readiness-os.sqlite < sql/product-readiness-os/001_schema.sql
sqlite3 db/product-readiness-os.sqlite < sql/product-readiness-os/002_seed_data.sql
sqlite3 db/product-readiness-os.sqlite < sql/product-readiness-os/003_practice_queries.sql
```

---

## Scope

- This is a learning database for SQL practice.
- It uses fictional sample data only.
- It is not connected to the Next.js Product Readiness OS route.
- It is not a backend for the portfolio demo.
- It should not be described as production infrastructure.

## Public Repo Notes

- Commit the SQL scripts and this README.
- Do not commit generated `.sqlite`, `.sqlite-journal`, `.sqlite-wal`, or `.sqlite-shm` files.
- Keep the live demo contract documented in the root `README.md`, `SPEC.md`, and `DECISIONS.md`.
