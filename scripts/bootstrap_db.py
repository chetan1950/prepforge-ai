"""Apply local SQLite schema migrations using Python's bundled sqlite driver."""
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "prisma" / "dev.db"
MIGRATIONS = ROOT / "prisma" / "migrations"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

with sqlite3.connect(DB_PATH) as connection:
    user_table = connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'User'"
    ).fetchone()
    if not user_table:
        connection.executescript(
            (MIGRATIONS / "20260923000000_init" / "migration.sql").read_text(encoding="utf-8")
        )

    interview_table = connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'InterviewPractice'"
    ).fetchone()
    if not interview_table:
        connection.executescript(
            (MIGRATIONS / "20260923000001_interview_practice" / "migration.sql").read_text(encoding="utf-8")
        )

print(f"SQLite schema ready at {DB_PATH}")
