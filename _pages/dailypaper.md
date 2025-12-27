---
layout: archive
title: "Daily Paper"
permalink: /dailypaper/
author_profile: true
---

<div id="arxiv-container">
  <div class="arxiv-header">
    <h2>📚 Daily arXiv Paper Tracker</h2>
    <p class="arxiv-subtitle">Automatically fetches and filters newly released research papers based on keywords</p>
  </div>

  <!-- Controls Section -->
  <div class="arxiv-controls">
    <div class="control-group">
      <label for="category-select">Category:</label>
      <select id="category-select">
        <option value="cs.CV">Computer Vision (cs.CV)</option>
        <option value="cs.CL">Computation and Language (cs.CL)</option>
        <option value="cs.LG">Machine Learning (cs.LG)</option>
        <option value="cs.AI">Artificial Intelligence (cs.AI)</option>
        <option value="cs.RO">Robotics (cs.RO)</option>
        <option value="cs.IR">Information Retrieval (cs.IR)</option>
        <option value="stat.ML">Statistics - Machine Learning (stat.ML)</option>
        <option value="eess.IV">Image and Video Processing (eess.IV)</option>
      </select>
    </div>
    
    <div class="control-group">
      <label for="max-results">Max Results:</label>
      <select id="max-results">
        <option value="20">20</option>
        <option value="50" selected>50</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>
    </div>
    
    <div class="control-group">
      <label for="search-input">🔍 Filter Keywords:</label>
      <input type="text" id="search-input" placeholder="e.g., transformer, diffusion, LLM...">
    </div>
    
    <button id="fetch-btn" class="fetch-button">
      <span class="btn-icon">🔄</span> Fetch Papers
    </button>
  </div>

  <!-- Keyword Tags Section -->
  <div class="keyword-section">
    <h4>Quick Filter Tags:</h4>
    <div class="keyword-tags">
      <span class="keyword-tag" data-keyword="transformer">Transformer</span>
      <span class="keyword-tag" data-keyword="diffusion">Diffusion</span>
      <span class="keyword-tag" data-keyword="LLM">LLM</span>
      <span class="keyword-tag" data-keyword="multimodal">Multimodal</span>
      <span class="keyword-tag" data-keyword="vision">Vision</span>
      <span class="keyword-tag" data-keyword="language">Language</span>
      <span class="keyword-tag" data-keyword="generation">Generation</span>
      <span class="keyword-tag" data-keyword="detection">Detection</span>
      <span class="keyword-tag" data-keyword="segmentation">Segmentation</span>
      <span class="keyword-tag" data-keyword="reinforcement">RL</span>
      <span class="keyword-tag" data-keyword="3D">3D</span>
      <span class="keyword-tag" data-keyword="video">Video</span>
    </div>
  </div>

  <!-- Statistics Section -->
  <div id="stats-section" class="stats-section" style="display: none;">
    <span id="total-count">Total: 0</span>
    <span id="filtered-count">Showing: 0</span>
    <span id="last-updated">Last Updated: -</span>
  </div>

  <!-- Loading Indicator -->
  <div id="loading" class="loading" style="display: none;">
    <div class="spinner"></div>
    <p>Fetching papers from arXiv...</p>
  </div>

  <!-- Error Message -->
  <div id="error-message" class="error-message" style="display: none;"></div>

  <!-- Papers List -->
  <div id="papers-list" class="papers-list"></div>
</div>

<style>
/* Container Styles */
#arxiv-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.arxiv-header {
  text-align: center;
  margin-bottom: 30px;
}

.arxiv-header h2 {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.arxiv-subtitle {
  color: #666;
  font-size: 1.1em;
}

/* Controls Section */
.arxiv-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
}

.control-group select,
.control-group input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
}

.control-group input {
  min-width: 250px;
}

.control-group select:focus,
.control-group input:focus {
  outline: none;
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.1);
}

.fetch-button {
  background: linear-gradient(135deg, #4a90d9, #357abd);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.fetch-button:hover {
  background: linear-gradient(135deg, #357abd, #2a5f8f);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 217, 0.3);
}

.fetch-button:active {
  transform: translateY(0);
}

/* Keyword Tags */
.keyword-section {
  margin-bottom: 20px;
}

.keyword-section h4 {
  margin-bottom: 10px;
  color: #333;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  background: #e9ecef;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  user-select: none;
}

.keyword-tag:hover {
  background: #4a90d9;
  color: white;
}

.keyword-tag.active {
  background: #4a90d9;
  color: white;
}

/* Statistics Section */
.stats-section {
  display: flex;
  gap: 20px;
  padding: 15px 20px;
  background: #e8f4f8;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95em;
}

.stats-section span {
  color: #555;
}

/* Loading Indicator */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90d9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* Papers List */
.papers-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.paper-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.paper-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-color: #4a90d9;
}

.paper-title {
  font-size: 1.15em;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 10px;
  line-height: 1.4;
}

.paper-title a {
  color: inherit;
  text-decoration: none;
}

.paper-title a:hover {
  color: #4a90d9;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 0.9em;
  color: #666;
}

.paper-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.paper-authors {
  color: #555;
  font-size: 0.95em;
  margin-bottom: 12px;
  line-height: 1.5;
}

.paper-abstract {
  color: #444;
  font-size: 0.92em;
  line-height: 1.6;
  max-height: 100px;
  overflow: hidden;
  position: relative;
}

.paper-abstract.expanded {
  max-height: none;
}

.paper-abstract::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, white);
}

.paper-abstract.expanded::after {
  display: none;
}

.expand-btn {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 0;
  margin-top: 8px;
}

.expand-btn:hover {
  text-decoration: underline;
}

.paper-links {
  display: flex;
  gap: 12px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.paper-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85em;
  text-decoration: none;
  transition: all 0.2s ease;
}

.paper-link.arxiv {
  background: #b31b1b;
  color: white;
}

.paper-link.arxiv:hover {
  background: #8b1515;
}

.paper-link.pdf {
  background: #4a90d9;
  color: white;
}

.paper-link.pdf:hover {
  background: #357abd;
}

/* Highlight matched keywords */
.highlight {
  background: #fff3cd;
  padding: 1px 3px;
  border-radius: 3px;
}

/* No results */
.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .arxiv-controls {
    flex-direction: column;
  }
  
  .control-group select,
  .control-group input {
    width: 100%;
    min-width: auto;
  }
  
  .fetch-button {
    width: 100%;
    justify-content: center;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .paper-links {
    flex-wrap: wrap;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const categorySelect = document.getElementById('category-select');
  const maxResultsSelect = document.getElementById('max-results');
  const searchInput = document.getElementById('search-input');
  const fetchBtn = document.getElementById('fetch-btn');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const papersList = document.getElementById('papers-list');
  const statsSection = document.getElementById('stats-section');
  const totalCount = document.getElementById('total-count');
  const filteredCount = document.getElementById('filtered-count');
  const lastUpdated = document.getElementById('last-updated');
  const keywordTags = document.querySelectorAll('.keyword-tag');
  
  let allPapers = [];
  let activeKeywords = new Set();
  
  // Keyword tag click handler
  keywordTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const keyword = this.dataset.keyword;
      if (activeKeywords.has(keyword)) {
        activeKeywords.delete(keyword);
        this.classList.remove('active');
      } else {
        activeKeywords.add(keyword);
        this.classList.add('active');
      }
      filterAndDisplayPapers();
    });
  });
  
  // Search input handler
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterAndDisplayPapers, 300);
  });
  
  // Fetch button handler
  fetchBtn.addEventListener('click', fetchPapers);
  
  async function fetchPapers() {
    const category = categorySelect.value;
    const maxResults = maxResultsSelect.value;
    
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    papersList.innerHTML = '';
    statsSection.style.display = 'none';
    
    try {
      // Using the arXiv API with CORS proxy
      const baseUrl = 'https://export.arxiv.org/api/query';
      const params = new URLSearchParams({
        search_query: `cat:${category}`,
        start: 0,
        max_results: maxResults,
        sortBy: 'submittedDate',
        sortOrder: 'descending'
      });
      
      // Try fetching through a CORS proxy
      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`${baseUrl}?${params}`)}`,
        `https://corsproxy.io/?${encodeURIComponent(`${baseUrl}?${params}`)}`,
        `${baseUrl}?${params}` // Direct (might work in some cases)
      ];
      
      let response = null;
      let error = null;
      
      for (const url of proxyUrls) {
        try {
          response = await fetch(url);
          if (response.ok) break;
        } catch (e) {
          error = e;
          continue;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error('Failed to fetch from arXiv API');
      }
      
      const xmlText = await response.text();
      allPapers = parseArxivXML(xmlText);
      
      lastUpdated.textContent = `Last Updated: ${new Date().toLocaleString()}`;
      totalCount.textContent = `Total: ${allPapers.length}`;
      
      filterAndDisplayPapers();
      
    } catch (err) {
      errorMessage.textContent = `Error: ${err.message}. Please try again later.`;
      errorMessage.style.display = 'block';
    } finally {
      loading.style.display = 'none';
    }
  }
  
  function parseArxivXML(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    
    const papers = [];
    entries.forEach(entry => {
      const id = entry.querySelector('id')?.textContent || '';
      const arxivId = id.split('/abs/').pop() || id.split('/').pop();
      
      const title = entry.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const summary = entry.querySelector('summary')?.textContent?.trim() || '';
      const published = entry.querySelector('published')?.textContent || '';
      const updated = entry.querySelector('updated')?.textContent || '';
      
      const authors = Array.from(entry.querySelectorAll('author name'))
        .map(a => a.textContent)
        .join(', ');
      
      const categories = Array.from(entry.querySelectorAll('category'))
        .map(c => c.getAttribute('term'))
        .filter(Boolean);
      
      const links = {};
      entry.querySelectorAll('link').forEach(link => {
        const type = link.getAttribute('type');
        const href = link.getAttribute('href');
        if (type === 'application/pdf' || href?.includes('pdf')) {
          links.pdf = href;
        } else if (link.getAttribute('rel') === 'alternate') {
          links.abs = href;
        }
      });
      
      papers.push({
        id: arxivId,
        title,
        summary,
        authors,
        published: new Date(published),
        updated: new Date(updated),
        categories,
        links
      });
    });
    
    return papers;
  }
  
  function filterAndDisplayPapers() {
    const searchTerms = searchInput.value.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const allSearchTerms = [...searchTerms, ...Array.from(activeKeywords).map(k => k.toLowerCase())];
    
    let filteredPapers = allPapers;
    
    if (allSearchTerms.length > 0) {
      filteredPapers = allPapers.filter(paper => {
        const searchText = `${paper.title} ${paper.summary} ${paper.authors}`.toLowerCase();
        return allSearchTerms.some(term => searchText.includes(term));
      });
    }
    
    statsSection.style.display = 'flex';
    filteredCount.textContent = `Showing: ${filteredPapers.length}`;
    
    displayPapers(filteredPapers, allSearchTerms);
  }
  
  function displayPapers(papers, highlightTerms = []) {
    if (papers.length === 0) {
      papersList.innerHTML = '<div class="no-results">No papers found matching your criteria.</div>';
      return;
    }
    
    papersList.innerHTML = papers.map(paper => {
      let title = escapeHtml(paper.title);
      let summary = escapeHtml(paper.summary);
      
      // Highlight search terms
      highlightTerms.forEach(term => {
        if (term) {
          const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
          title = title.replace(regex, '<span class="highlight">$1</span>');
          summary = summary.replace(regex, '<span class="highlight">$1</span>');
        }
      });
      
      const absUrl = paper.links.abs || `https://arxiv.org/abs/${paper.id}`;
      const pdfUrl = paper.links.pdf || `https://arxiv.org/pdf/${paper.id}.pdf`;
      
      return `
        <div class="paper-card">
          <h3 class="paper-title">
            <a href="${absUrl}" target="_blank" rel="noopener">${title}</a>
          </h3>
          <div class="paper-meta">
            <span>📅 ${paper.published.toLocaleDateString()}</span>
            <span>🏷️ ${paper.categories.slice(0, 3).join(', ')}</span>
            <span>📝 ${paper.id}</span>
          </div>
          <div class="paper-authors">
            <strong>Authors:</strong> ${escapeHtml(paper.authors)}
          </div>
          <div class="paper-abstract" id="abstract-${paper.id}">
            ${summary}
          </div>
          <button class="expand-btn" onclick="toggleAbstract('${paper.id}')">
            Show more ▼
          </button>
          <div class="paper-links">
            <a href="${absUrl}" class="paper-link arxiv" target="_blank" rel="noopener">
              📄 arXiv
            </a>
            <a href="${pdfUrl}" class="paper-link pdf" target="_blank" rel="noopener">
              📥 PDF
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Make toggleAbstract available globally
  window.toggleAbstract = function(id) {
    const abstract = document.getElementById(`abstract-${id}`);
    const btn = abstract.nextElementSibling;
    if (abstract.classList.contains('expanded')) {
      abstract.classList.remove('expanded');
      btn.textContent = 'Show more ▼';
    } else {
      abstract.classList.add('expanded');
      btn.textContent = 'Show less ▲';
    }
  };
  
  // Auto-fetch on page load
  fetchPapers();
});
</script>
