#!/usr/bin/env python3
"""
Update the index file that lists all available daily paper files.
"""

import json
import os
from datetime import datetime, timezone

DATA_DIR = "assets/data/arxiv/daily"
INDEX_FILE = "assets/data/arxiv/index.json"

def main():
    """Scan daily files and create index."""
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(INDEX_FILE), exist_ok=True)
    
    # Find all daily JSON files
    daily_files = []
    
    if os.path.exists(DATA_DIR):
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".json") and filename != "latest.json":
                date_str = filename.replace(".json", "")
                filepath = os.path.join(DATA_DIR, filename)
                
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    
                    daily_files.append({
                        "date": date_str,
                        "filename": filename,
                        "path": f"/assets/data/arxiv/daily/{filename}",
                        "total_count": data.get("total_count", 0),
                        "categories": data.get("categories", []),
                        "fetched_at": data.get("fetched_at", "")
                    })
                except Exception as e:
                    print(f"Error reading {filename}: {e}")
    
    # Sort by date (newest first)
    daily_files.sort(key=lambda x: x["date"], reverse=True)
    
    # Create index
    index_data = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "total_days": len(daily_files),
        "latest_date": daily_files[0]["date"] if daily_files else None,
        "oldest_date": daily_files[-1]["date"] if daily_files else None,
        "days": daily_files
    }
    
    # Save index
    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    
    print(f"Index updated: {len(daily_files)} days")
    print(f"Saved to: {INDEX_FILE}")

if __name__ == "__main__":
    main()
