#!/usr/bin/env python3
"""
Fetch daily arXiv papers and save as JSON for the Daily Paper page.
This script is designed to be run via GitHub Actions.
"""

import json
import os
from datetime import datetime, timedelta
import urllib.request
import xml.etree.ElementTree as ET
from typing import List, Dict, Optional

# Configuration - modify these according to your interests
CATEGORIES = [
    "cs.CV",    # Computer Vision
    "cs.CL",    # Computation and Language
    "cs.LG",    # Machine Learning
    "cs.AI",    # Artificial Intelligence
]

MAX_RESULTS = 100  # Maximum papers to fetch per category
OUTPUT_DIR = "_data/arxiv"  # Output directory for JSON files

# Optional: Keywords to highlight or filter
KEYWORDS = [
    "transformer", "diffusion", "llm", "large language model",
    "multimodal", "vision", "generation", "detection", "segmentation",
    "3d", "video", "image", "neural", "deep learning"
]


def fetch_arxiv_papers(category: str, max_results: int = 100) -> List[Dict]:
    """Fetch papers from arXiv API for a specific category."""
    
    base_url = "http://export.arxiv.org/api/query"
    query = f"cat:{category}"
    
    params = {
        "search_query": query,
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }
    
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    url = f"{base_url}?{query_string}"
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            xml_data = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching {category}: {e}")
        return []
    
    return parse_arxiv_xml(xml_data)


def parse_arxiv_xml(xml_data: str) -> List[Dict]:
    """Parse arXiv API XML response."""
    
    # Define namespaces
    namespaces = {
        'atom': 'http://www.w3.org/2005/Atom',
        'arxiv': 'http://arxiv.org/schemas/atom'
    }
    
    papers = []
    
    try:
        root = ET.fromstring(xml_data)
        
        for entry in root.findall('atom:entry', namespaces):
            paper = {}
            
            # Extract ID
            id_elem = entry.find('atom:id', namespaces)
            if id_elem is not None:
                paper['id'] = id_elem.text.split('/')[-1]
                paper['url'] = id_elem.text
            
            # Extract title
            title_elem = entry.find('atom:title', namespaces)
            if title_elem is not None:
                paper['title'] = ' '.join(title_elem.text.split())
            
            # Extract summary/abstract
            summary_elem = entry.find('atom:summary', namespaces)
            if summary_elem is not None:
                paper['abstract'] = summary_elem.text.strip()
            
            # Extract authors
            authors = []
            for author in entry.findall('atom:author', namespaces):
                name_elem = author.find('atom:name', namespaces)
                if name_elem is not None:
                    authors.append(name_elem.text)
            paper['authors'] = authors
            
            # Extract dates
            published = entry.find('atom:published', namespaces)
            if published is not None:
                paper['published'] = published.text
            
            updated = entry.find('atom:updated', namespaces)
            if updated is not None:
                paper['updated'] = updated.text
            
            # Extract categories
            categories = []
            for cat in entry.findall('atom:category', namespaces):
                term = cat.get('term')
                if term:
                    categories.append(term)
            paper['categories'] = categories
            
            # Extract links
            for link in entry.findall('atom:link', namespaces):
                link_type = link.get('type', '')
                href = link.get('href', '')
                if 'pdf' in link_type or 'pdf' in href:
                    paper['pdf_url'] = href
                elif link.get('rel') == 'alternate':
                    paper['abs_url'] = href
            
            # Add PDF URL if not found
            if 'pdf_url' not in paper and 'id' in paper:
                paper['pdf_url'] = f"https://arxiv.org/pdf/{paper['id']}.pdf"
            
            if 'abs_url' not in paper and 'id' in paper:
                paper['abs_url'] = f"https://arxiv.org/abs/{paper['id']}"
            
            papers.append(paper)
    
    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
    
    return papers


def check_keywords(paper: Dict, keywords: List[str]) -> List[str]:
    """Check which keywords appear in the paper title or abstract."""
    matched = []
    text = (paper.get('title', '') + ' ' + paper.get('abstract', '')).lower()
    
    for keyword in keywords:
        if keyword.lower() in text:
            matched.append(keyword)
    
    return matched


def main():
    """Main function to fetch and save papers."""
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    all_papers = []
    seen_ids = set()
    
    print(f"Fetching papers from categories: {CATEGORIES}")
    
    for category in CATEGORIES:
        print(f"  Fetching {category}...")
        papers = fetch_arxiv_papers(category, MAX_RESULTS)
        
        for paper in papers:
            paper_id = paper.get('id', '')
            if paper_id and paper_id not in seen_ids:
                # Add matched keywords
                paper['matched_keywords'] = check_keywords(paper, KEYWORDS)
                all_papers.append(paper)
                seen_ids.add(paper_id)
        
        print(f"    Found {len(papers)} papers")
    
    print(f"Total unique papers: {len(all_papers)}")
    
    # Sort by published date (newest first)
    all_papers.sort(key=lambda x: x.get('published', ''), reverse=True)
    
    # Save all papers
    output_file = os.path.join(OUTPUT_DIR, "papers.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'updated': datetime.utcnow().isoformat() + 'Z',
            'total': len(all_papers),
            'categories': CATEGORIES,
            'papers': all_papers
        }, f, ensure_ascii=False, indent=2)
    
    print(f"Saved to {output_file}")
    
    # Save daily snapshot
    today = datetime.utcnow().strftime('%Y-%m-%d')
    daily_file = os.path.join(OUTPUT_DIR, f"papers-{today}.json")
    with open(daily_file, 'w', encoding='utf-8') as f:
        json.dump({
            'date': today,
            'updated': datetime.utcnow().isoformat() + 'Z',
            'total': len(all_papers),
            'papers': all_papers
        }, f, ensure_ascii=False, indent=2)
    
    print(f"Saved daily snapshot to {daily_file}")
    
    # Clean up old daily files (keep last 7 days)
    cleanup_old_files(OUTPUT_DIR, days=7)


def cleanup_old_files(directory: str, days: int = 7):
    """Remove daily JSON files older than specified days."""
    cutoff = datetime.utcnow() - timedelta(days=days)
    
    for filename in os.listdir(directory):
        if filename.startswith('papers-') and filename.endswith('.json'):
            try:
                date_str = filename.replace('papers-', '').replace('.json', '')
                file_date = datetime.strptime(date_str, '%Y-%m-%d')
                
                if file_date < cutoff:
                    filepath = os.path.join(directory, filename)
                    os.remove(filepath)
                    print(f"Removed old file: {filename}")
            except ValueError:
                continue


if __name__ == "__main__":
    main()
