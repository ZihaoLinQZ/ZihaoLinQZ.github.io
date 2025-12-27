---
layout: archive
title: "Daily Paper"
permalink: /dailypaper/
author_profile: true
---

<div id="arxiv-container">
  <div class="arxiv-header">
    <h2>📚 Daily arXiv Paper Tracker</h2>
    <p class="arxiv-subtitle">Automatically fetches and filters newly released research papers</p>
  </div>

  <!-- Data Source Toggle -->
  <div class="data-source-toggle">
    <label class="toggle-label">
      <input type="checkbox" id="use-cache" checked>
      <span class="toggle-text">Use cached data (faster)</span>
    </label>
  </div>

  <!-- Controls Section -->
  <div class="arxiv-controls">
    <div class="control-group">
      <label for="category-select">Category:</label>
      <select id="category-select">
        <option value="all">All Categories</option>
        <option value="cs.CV">Computer Vision (cs.CV)</option>
        <option value="cs.CL">Computation and Language (cs.CL)</option>
        <option value="cs.LG">Machine Learning (cs.LG)</option>
        <option value="cs.AI">Artificial Intelligence (cs.AI)</option>
        <option value="cs.RO">Robotics (cs.RO)</option>
        <option value="cs.IR">Information Retrieval (cs.IR)</option>
        <option value="stat.ML">Statistics - ML (stat.ML)</option>
        <option value="eess.IV">Image Processing (eess.IV)</option>
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
    
    <div class="control-group search-group">
      <label for="search-input">🔍 Filter Keywords:</label>
      <input type="text" id="search-input" placeholder="e.g., transformer, diffusion, LLM...">
    </div>
    
    <button id="fetch-btn" class="fetch-button">
      <span class="btn-icon">🔄</span> <span id="fetch-btn-text">Fetch Papers</span>
    </button>
  </div>

  <!-- Keyword Tags Section -->
  <div class="keyword-section">
    <h4>🏷️ Quick Filter Tags:</h4>
    <div class="keyword-tags">
      <span class="keyword-tag" data-keyword="transformer">Transformer</span>
      <span class="keyword-tag" data-keyword="diffusion">Diffusion</span>
      <span class="keyword-tag" data-keyword="LLM">LLM</span>
      <span class="keyword-tag" data-keyword="GPT">GPT</span>
      <span class="keyword-tag" data-keyword="BERT">BERT</span>
      <span class="keyword-tag" data-keyword="multimodal">Multimodal</span>
      <span class="keyword-tag" data-keyword="vision language">VLM</span>
      <span class="keyword-tag" data-keyword="generation">Generation</span>
      <span class="keyword-tag" data-keyword="detection">Detection</span>
      <span class="keyword-tag" data-keyword="segmentation">Segmentation</span>
      <span class="keyword-tag" data-keyword="video">Video</span>
      <span class="keyword-tag" data-keyword="3D">3D</span>
      <span class="keyword-tag" data-keyword="point cloud">Point Cloud</span>
      <span class="keyword-tag" data-keyword="NeRF">NeRF</span>
      <span class="keyword-tag" data-keyword="GAN">GAN</span>
      <span class="keyword-tag" data-keyword="reinforcement">RL</span>
      <span class="keyword-tag" data-keyword="self-supervised">Self-Supervised</span>
      <span class="keyword-tag" data-keyword="contrastive">Contrastive</span>
    </div>
    <button id="clear-filters" class="clear-btn">Clear All Filters</button>
  </div>

  <!-- Statistics Section -->
  <div id="stats-section" class="stats-section" style="display: none;">
    <div class="stat-item">
      <span class="stat-label">Total:</span>
      <span id="total-count" class="stat-value">0</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Showing:</span>
      <span id="filtered-count" class="stat-value">0</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Last Updated:</span>
      <span id="last-updated" class="stat-value">-</span>
    </div>
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

  <!-- Load More Button -->
  <div id="load-more-container" class="load-more-container" style="display: none;">
    <button id="load-more-btn" class="load-more-btn">Load More Papers</button>
  </div>
</div>

<style>
/* Container Styles */
#arxiv-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.arxiv-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.arxiv-header h2 {
  font-size: 2.2em;
  color: #1a1a2e;
  margin-bottom: 10px;
  font-weight: 700;
}

.arxiv-subtitle {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

/* Data Source Toggle */
.data-source-toggle {
  margin-bottom: 20px;
  text-align: center;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95em;
  color: #555;
}

.toggle-label input {
  width: 18px;
  height: 18px;
}

/* Controls Section */
.arxiv-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-group.search-group {
  flex: 1;
  min-width: 200px;
}

.control-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
}

.control-group select,
.control-group input {
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
}

.control-group select {
  min-width: 180px;
}

.control-group input {
  width: 100%;
}

.control-group select:focus,
.control-group input:focus {
  outline: none;
  border-color: #4a90d9;
  box-shadow: 0 0 0 4px rgba(74, 144, 217, 0.15);
}

.fetch-button {
  background: linear-gradient(135deg, #4a90d9, #357abd);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 217, 0.3);
}

.fetch-button:hover {
  background: linear-gradient(135deg, #357abd, #2a5f8f);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 144, 217, 0.4);
}

.fetch-button:active {
  transform: translateY(0);
}

.fetch-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Keyword Tags */
.keyword-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.keyword-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1em;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.keyword-tag {
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  user-select: none;
  border: 2px solid transparent;
}

.keyword-tag:hover {
  background: #4a90d9;
  color: white;
  transform: translateY(-1px);
}

.keyword-tag.active {
  background: #4a90d9;
  color: white;
  border-color: #357abd;
}

.clear-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  color: #666;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #fee2e2;
  border-color: #dc2626;
  color: #dc2626;
}

/* Statistics Section */
.stats-section {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  padding: 18px 25px;
  background: linear-gradient(135deg, #e8f4f8, #dbeafe);
  border-radius: 10px;
  margin-bottom: 25px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  color: #555;
  font-size: 0.9em;
}

.stat-value {
  font-weight: 600;
  color: #1a1a2e;
}

/* Loading Indicator */
.loading {
  text-align: center;
  padding: 50px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90d9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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
  padding: 18px 25px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #dc2626;
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
  border-radius: 14px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
}

.paper-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #4a90d9;
  transform: translateY(-2px);
}

.paper-card.has-keywords::before {
  content: '🔥';
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.2em;
}

.paper-title {
  font-size: 1.2em;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
  line-height: 1.45;
}

.paper-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.paper-title a:hover {
  color: #4a90d9;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 15px;
  font-size: 0.9em;
  color: #666;
}

.paper-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.paper-authors {
  color: #555;
  font-size: 0.95em;
  margin-bottom: 15px;
  line-height: 1.6;
}

.paper-authors strong {
  color: #333;
}

.paper-abstract {
  color: #444;
  font-size: 0.93em;
  line-height: 1.7;
  max-height: 120px;
  overflow: hidden;
  position: relative;
  transition: max-height 0.3s ease;
}

.paper-abstract.expanded {
  max-height: 2000px;
}

.paper-abstract::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(transparent, white);
  pointer-events: none;
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
  padding: 8px 0;
  margin-top: 5px;
  font-weight: 500;
}

.expand-btn:hover {
  text-decoration: underline;
}

.paper-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.paper-keyword {
  background: #fff3cd;
  color: #856404;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.paper-links {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #eee;
}

.paper-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.88em;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.paper-link.arxiv {
  background: #b31b1b;
  color: white;
}

.paper-link.arxiv:hover {
  background: #8b1515;
  transform: translateY(-1px);
}

.paper-link.pdf {
  background: #4a90d9;
  color: white;
}

.paper-link.pdf:hover {
  background: #357abd;
  transform: translateY(-1px);
}

/* Highlight matched keywords */
.highlight {
  background: linear-gradient(120deg, #fff3cd 0%, #ffeeba 100%);
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
}

/* No results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

/* Load More */
.load-more-container {
  text-align: center;
  padding: 30px 0;
}

.load-more-btn {
  background: white;
  border: 2px solid #4a90d9;
  color: #4a90d9;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #4a90d9;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .arxiv-controls {
    flex-direction: column;
    padding: 20px;
  }
  
  .control-group,
  .control-group.search-group {
    width: 100%;
  }
  
  .control-group select {
    width: 100%;
    min-width: auto;
  }
  
  .fetch-button {
    width: 100%;
    justify-content: center;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .paper-links {
    flex-wrap: wrap;
  }
  
  .paper-meta {
    flex-direction: column;
    gap: 8px;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  /* Add dark mode styles if needed */
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const categorySelect = document.getElementById('category-select');
  const maxResultsSelect = document.getElementById('max-results');
  const searchInput = document.getElementById('search-input');
  const fetchBtn = document.getElementById('fetch-btn');
  const fetchBtnText = document.getElementById('fetch-btn-text');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const papersList = document.getElementById('papers-list');
  const statsSection = document.getElementById('stats-section');
  const totalCount = document.getElementById('total-count');
  const filteredCount = document.getElementById('filtered-count');
  const lastUpdated = document.getElementById('last-updated');
  const keywordTags = document.querySelectorAll('.keyword-tag');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const useCacheCheckbox = document.getElementById('use-cache');
  const loadMoreContainer = document.getElementById('load-more-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  // State
  let allPapers = [];
  let displayedPapers = [];
  let activeKeywords = new Set();
  let currentPage = 0;
  const papersPerPage = 20;
  
  // Event Listeners
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
      currentPage = 0;
      filterAndDisplayPapers();
    });
  });
  
  clearFiltersBtn.addEventListener('click', function() {
    activeKeywords.clear();
    searchInput.value = '';
    keywordTags.forEach(tag => tag.classList.remove('active'));
    currentPage = 0;
    filterAndDisplayPapers();
  });
  
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 0;
      filterAndDisplayPapers();
    }, 300);
  });
  
  categorySelect.addEventListener('change', function() {
    currentPage = 0;
    filterAndDisplayPapers();
  });
  
  fetchBtn.addEventListener('click', fetchPapers);
  
  loadMoreBtn.addEventListener('click', function() {
    currentPage++;
    appendPapers();
  });
  
  // Fetch Papers
  async function fetchPapers() {
    const useCache = useCacheCheckbox.checked;
    const category = categorySelect.value;
    const maxResults = maxResultsSelect.value;
    
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    papersList.innerHTML = '';
    statsSection.style.display = 'none';
    loadMoreContainer.style.display = 'none';
    fetchBtn.disabled = true;
    fetchBtnText.textContent = 'Loading...';
    
    try {
      if (useCache) {
        // Try to load from cached JSON first
        const cachedData = await fetchCachedData();
        if (cachedData) {
          allPapers = cachedData.papers;
          lastUpdated.textContent = new Date(cachedData.updated).toLocaleString();
        } else {
          // Fall back to live API
          allPapers = await fetchFromArxivAPI(category, maxResults);
          lastUpdated.textContent = new Date().toLocaleString();
        }
      } else {
        allPapers = await fetchFromArxivAPI(category, maxResults);
        lastUpdated.textContent = new Date().toLocaleString();
      }
      
      totalCount.textContent = allPapers.length;
      currentPage = 0;
      filterAndDisplayPapers();
      
    } catch (err) {
      console.error('Error:', err);
      errorMessage.textContent = `Error: ${err.message}. Please try again.`;
      errorMessage.style.display = 'block';
    } finally {
      loading.style.display = 'none';
      fetchBtn.disabled = false;
      fetchBtnText.textContent = 'Fetch Papers';
    }
  }
  
  async function fetchCachedData() {
    try {
      // Try to load the cached JSON file
      const response = await fetch('/assets/data/arxiv/papers.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log('No cached data available, using live API');
    }
    return null;
  }
  
  async function fetchFromArxivAPI(category, maxResults) {
    const baseUrl = 'https://export.arxiv.org/api/query';
    const query = category === 'all' ? '' : `cat:${category}`;
    
    const params = new URLSearchParams({
      search_query: query || 'cat:cs.CV OR cat:cs.CL OR cat:cs.LG OR cat:cs.AI',
      start: 0,
      max_results: maxResults,
      sortBy: 'submittedDate',
      sortOrder: 'descending'
    });
    
    // Try multiple CORS proxies
    const proxyUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`${baseUrl}?${params}`)}`,
      `https://corsproxy.io/?${encodeURIComponent(`${baseUrl}?${params}`)}`,
      `${baseUrl}?${params}`
    ];
    
    let response = null;
    
    for (const url of proxyUrls) {
      try {
        response = await fetch(url);
        if (response.ok) break;
      } catch (e) {
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error('Failed to fetch from arXiv API. Please try again later.');
    }
    
    const xmlText = await response.text();
    return parseArxivXML(xmlText);
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
      
      const authors = Array.from(entry.querySelectorAll('author name'))
        .map(a => a.textContent);
      
      const categories = Array.from(entry.querySelectorAll('category'))
        .map(c => c.getAttribute('term'))
        .filter(Boolean);
      
      papers.push({
        id: arxivId,
        title,
        abstract: summary,
        authors,
        published: published,
        categories,
        abs_url: `https://arxiv.org/abs/${arxivId}`,
        pdf_url: `https://arxiv.org/pdf/${arxivId}.pdf`
      });
    });
    
    return papers;
  }
  
  function filterAndDisplayPapers() {
    const searchTerms = searchInput.value.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const allSearchTerms = [...searchTerms, ...Array.from(activeKeywords).map(k => k.toLowerCase())];
    const selectedCategory = categorySelect.value;
    
    displayedPapers = allPapers.filter(paper => {
      // Category filter
      if (selectedCategory !== 'all' && !paper.categories?.includes(selectedCategory)) {
        return false;
      }
      
      // Keyword filter
      if (allSearchTerms.length > 0) {
        const searchText = `${paper.title} ${paper.abstract} ${paper.authors?.join(' ')}`.toLowerCase();
        return allSearchTerms.some(term => searchText.includes(term));
      }
      
      return true;
    });
    
    statsSection.style.display = 'flex';
    filteredCount.textContent = displayedPapers.length;
    
    currentPage = 0;
    papersList.innerHTML = '';
    appendPapers();
  }
  
  function appendPapers() {
    const searchTerms = searchInput.value.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const allSearchTerms = [...searchTerms, ...Array.from(activeKeywords).map(k => k.toLowerCase())];
    
    const start = currentPage * papersPerPage;
    const end = start + papersPerPage;
    const papersToShow = displayedPapers.slice(start, end);
    
    if (papersToShow.length === 0 && currentPage === 0) {
      papersList.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📭</div>
          <p>No papers found matching your criteria.</p>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      `;
      loadMoreContainer.style.display = 'none';
      return;
    }
    
    papersToShow.forEach(paper => {
      const card = createPaperCard(paper, allSearchTerms);
      papersList.appendChild(card);
    });
    
    // Show/hide load more button
    loadMoreContainer.style.display = end < displayedPapers.length ? 'block' : 'none';
  }
  
  function createPaperCard(paper, highlightTerms) {
    let title = escapeHtml(paper.title);
    let abstract = escapeHtml(paper.abstract);
    
    // Highlight search terms
    highlightTerms.forEach(term => {
      if (term) {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        title = title.replace(regex, '<span class="highlight">$1</span>');
        abstract = abstract.replace(regex, '<span class="highlight">$1</span>');
      }
    });
    
    const hasMatchedKeywords = highlightTerms.length > 0;
    const publishedDate = paper.published ? new Date(paper.published).toLocaleDateString() : 'N/A';
    const authorsDisplay = Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors;
    
    const card = document.createElement('div');
    card.className = `paper-card${hasMatchedKeywords ? ' has-keywords' : ''}`;
    card.innerHTML = `
      <h3 class="paper-title">
        <a href="${paper.abs_url}" target="_blank" rel="noopener">${title}</a>
      </h3>
      <div class="paper-meta">
        <span>📅 ${publishedDate}</span>
        <span>🏷️ ${(paper.categories || []).slice(0, 3).join(', ')}</span>
        <span>📝 ${paper.id}</span>
      </div>
      <div class="paper-authors">
        <strong>Authors:</strong> ${escapeHtml(authorsDisplay)}
      </div>
      <div class="paper-abstract" id="abstract-${paper.id}">
        ${abstract}
      </div>
      <button class="expand-btn" onclick="toggleAbstract('${paper.id}')">
        Show more ▼
      </button>
      <div class="paper-links">
        <a href="${paper.abs_url}" class="paper-link arxiv" target="_blank" rel="noopener">
          📄 arXiv
        </a>
        <a href="${paper.pdf_url}" class="paper-link pdf" target="_blank" rel="noopener">
          📥 PDF
        </a>
      </div>
    `;
    
    return card;
  }
  
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Global function for abstract toggle
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
