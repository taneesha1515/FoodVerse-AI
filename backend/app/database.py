import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config import settings

_db_initialized = False

def get_db_connection():
    global _db_initialized
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    if not _db_initialized:
        init_db(conn)
        _db_initialized = True
    return conn

def init_db(existing_conn=None):
    conn = existing_conn or sqlite3.connect(settings.DATABASE_PATH)
    cursor = conn.cursor()
    
    # Table for Scan / Audit History (all epics)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module TEXT NOT NULL, -- 'nutrition', 'freshness', 'hygiene', 'cooking'
        title TEXT NOT NULL,
        summary TEXT,
        image_url TEXT,
        data_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Table for Saved Recipes & Meal Plans
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL, -- 'recipe', 'meal_plan'
        title TEXT NOT NULL,
        plan_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    if not existing_conn:
        conn.close()

# Auto-initialize on import
init_db()

def save_scan_record(module: str, title: str, summary: str, data: Dict[str, Any], image_url: Optional[str] = None) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO scan_history (module, title, summary, image_url, data_json) VALUES (?, ?, ?, ?, ?)",
        (module, title, summary, image_url, json.dumps(data))
    )
    conn.commit()
    record_id = cursor.lastrowid
    conn.close()
    return record_id

def get_recent_scans(limit: int = 50, module: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if module:
        cursor.execute("SELECT * FROM scan_history WHERE module = ? ORDER BY created_at DESC LIMIT ?", (module, limit))
    else:
        cursor.execute("SELECT * FROM scan_history ORDER BY created_at DESC LIMIT ?", (limit,))
    
    rows = cursor.fetchall()
    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "module": row["module"],
            "title": row["title"],
            "summary": row["summary"],
            "image_url": row["image_url"],
            "data": json.loads(row["data_json"]),
            "created_at": row["created_at"]
        })
    conn.close()
    return results

def delete_scan_record(record_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scan_history WHERE id = ?", (record_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted
