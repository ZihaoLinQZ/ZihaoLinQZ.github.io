#!/usr/bin/env python3
"""
Fetch latest papers from arXiv API and save to JSON files.
This script is run daily by GitHub Actions.
"""

import json
import os
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# Categories to fetch
CATEGORIES = [
    "cs.CV",   # Computer Vision
    "cs.CL",   # Computation and Language
    "cs.LG",   # Machine Learning
    "cs.AI",   # Artificial Intelligence
    "cs.RO",   # Robotics
]

MAX_RESULTS_PER_CATEGORY = 100
OUTPUT_DIR = "assets/data/arxiv/daily"

def fetch_arxiv(category, max_results=100):
    """Fetch papers from arXiv API for a given category."""
    base_url = "http://export.arxiv.org/api/query"
    params = {
        "search_query": f"cat:{category}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }
    
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    print(f"Fetching {category}: {url}")
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "DailyPaper/1.0"})
        with urllib.request.urlopen(req, timeout=60) as response:
            xml_data = response.read().decode("utf-8")
        return parse_arxiv_xml(xml_data)
    except Exception as e:
        print(f"Error fetching {category}: {e}")
        return []

def parse_arxiv_xml(xml_text):
    """Parse arXiv API XML response."""
    papers = []
    
    # Define namespace
    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "arxiv": "http://arxiv.org/schemas/atom"
    }
    
    try:
        root = ET.fromstring(xml_text)
        entries = root.findall("atom:entry", ns)
        
        for entry in entries:
            try:
                # Get ID
                id_elem = entry.find("atom:id", ns)
                arxiv_id = ""
                if id_elem is not None and id_elem.text:
                    arxiv_id = id_elem.text.split("/abs/")[-1].split("/")[-1]
                
                # Get title
                title_elem = entry.find("atom:title", ns)
                title = ""
                if title_elem is not None and title_elem.text:
                    title = " ".join(title_elem.text.split())
                
                # Get abstract
                summary_elem = entry.find("atom:summary", ns)
                abstract = ""
                if summary_elem is not None and summary_elem.text:
                    abstract = summary_elem.text.strip()
                
                # Get published date
                published_elem = entry.find("atom:published", ns)
                published = ""
                if published_elem is not None and published_elem.text:
                    published = published_elem.text
                
                # Get authors
                authors = []
                for author in entry.findall("atom:author", ns):
                    name_elem = author.find("atom:name", ns)
                    if name_elem is not None and name_elem.text:
                        authors.append(name_elem.text)
                
                # Get categories
                categories = []
                for cat in entry.findall("atom:category", ns):
                    term = cat.get("term")
                    if term:
                        categories.append(term)
                
                # Get primary category
                primary_cat_elem = entry.find("arxiv:primary_category", ns)
                primary_category = ""
                if primary_cat_elem is not None:
                    primary_category = primary_cat_elem.get("term", "")
                
                if title and arxiv_id:
                    papers.append({
                        "id": arxiv_id,
                        "title": title,
                        "abstract": abstract,
                        "authors": authors,
                        "published": published,
                        "categories": categories,
                        "primary_category": primary_category,
                        "abs_url": f"https://arxiv.org/abs/{arxiv_id}",
                        "pdf_url": f"https://arxiv.org/pdf/{arxiv_id}.pdf"
                    })
            except Exception as e:
                print(f"Error parsing entry: {e}")
                continue
                
    except ET.ParseError as e:
        print(f"XML parse error: {e}")
    
    return papers

def main():
    """Main function to fetch and save papers."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    all_papers = []
    seen_ids = set()
    
    for category in CATEGORIES:
        print(f"\n{'='*50}")
        print(f"Fetching category: {category}")
        print(f"{'='*50}")
        
        papers = fetch_arxiv(category, MAX_RESULTS_PER_CATEGORY)
        print(f"Got {len(papers)} papers from {category}")
        
        # Add papers, avoiding duplicates
        for paper in papers:
            if paper["id"] not in seen_ids:
                seen_ids.add(paper["id"])
                all_papers.append(paper)
        
        # Be nice to arXiv API
        time.sleep(3)
    
    print(f"\n{'='*50}")
    print(f"Total unique papers: {len(all_papers)}")
    print(f"{'='*50}")
    
    # Sort by published date (newest first)
    all_papers.sort(key=lambda x: x.get("published", ""), reverse=True)
    
    # Save to daily file
    output_file = os.path.join(OUTPUT_DIR, f"{today}.json")
    output_data = {
        "date": today,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "categories": CATEGORIES,
        "total_count": len(all_papers),
        "papers": all_papers
    }
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved to: {output_file}")
    
    # Also save as latest.json for quick access
    latest_file = os.path.join(OUTPUT_DIR, "latest.json")
    with open(latest_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved to: {latest_file}")

if __name__ == "__main__":
    main()
