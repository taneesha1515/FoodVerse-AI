from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.database import get_recent_scans, delete_scan_record

router = APIRouter(prefix="/history", tags=["Audit & Scan History"])

@router.get("")
def list_history(
    limit: int = Query(50, ge=1, le=100),
    module: Optional[str] = Query(None)
):
    return get_recent_scans(limit=limit, module=module)

@router.delete("/{record_id}")
def remove_history(record_id: int):
    success = delete_scan_record(record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"status": "success", "deleted_id": record_id}
