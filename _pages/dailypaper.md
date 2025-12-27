---
layout: archive
title: "Daily Paper"
permalink: /dailypaper/
author_profile: true
---

{% raw %}
<div id="arxiv-container">
  <div class="arxiv-header">
    <h2>📚 Daily arXiv Paper Tracker</h2>
    <p class="arxiv-subtitle">Automatically fetches and filters newly released research papers</p>
  </div>

  <!-- Controls Section -->
  <div class="arxiv-controls">
    <div class="control-group">
      <label for="category-select">Category:</label>
      <select id="category-select">
        <option value="all">All Categories</option>
        <option value="cs.CV" selected>Computer Vision (cs.CV)</option>
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
      <span class="keyword-tag" data-keyword="reinforcement">RL</span>
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
    <p id="loading-text">Fetching papers from arXiv...</p>
  </div>

  <!-- Error Message -->
  <div id="error-message" class="error-message" style="display: none;"></div>

  <!-- Papers List -->
  <div id="papers-list" class="papers-list">
    <div class="no-results">
      <div class="no-results-icon">🚀</div>
      <p>Click <strong>"Fetch Papers"</strong> to load the latest papers from arXiv.</p>
    </div>
  </div>

  <!-- Load More Button -->
  <div id="load-more-container" class="load-more-container" style="display: none;">
    <button id="load-more-btn" class="load-more-btn">Load More Papers</button>
  </div>
</div>

<style>
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

.fetch-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

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

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 18px 25px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #dc2626;
}

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
}

.paper-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #4a90d9;
  transform: translateY(-2px);
}

.paper-title {
  font-size: 1.15em;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
  line-height: 1.45;
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
  gap: 18px;
  margin-bottom: 15px;
  font-size: 0.9em;
  color: #666;
}

.paper-authors {
  color: #555;
  font-size: 0.95em;
  margin-bottom: 15px;
  line-height: 1.6;
}

.paper-abstract {
  color: #444;
  font-size: 0.93em;
  line-height: 1.7;
  max-height: 100px;
  overflow: hidden;
  position: relative;
}

.paper-abstract.expanded {
  max-height: none;
}

.paper-abstract:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, white);
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
}

.paper-link.arxiv {
  background: #b31b1b;
  color: white;
}

.paper-link.pdf {
  background: #4a90d9;
  color: white;
}

.highlight {
  background: #fff3cd;
  padding: 2px 4px;
  border-radius: 3px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

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
}

.load-more-btn:hover {
  background: #4a90d9;
  color: white;
}

@media (max-width: 768px) {
  .arxiv-controls {
    flex-direction: column;
  }
  .control-group, .control-group.search-group {
    width: 100%;
  }
  .control-group select {
    width: 100%;
  }
  .fetch-button {
    width: 100%;
    justify-content: center;
  }
}
</style>

<script>
(function() {
  'use strict';
  
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    console.log('[DailyPaper] Initializing...');
    
    // Get DOM elements
    var categorySelect = document.getElementById('category-select');
    var maxResultsSelect = document.getElementById('max-results');
    var searchInput = document.getElementById('search-input');
    var fetchBtn = document.getElementById('fetch-btn');
    var fetchBtnText = document.getElementById('fetch-btn-text');
    var loading = document.getElementById('loading');
    var loadingText = document.getElementById('loading-text');
    var errorMessage = document.getElementById('error-message');
    var papersList = document.getElementById('papers-list');
    var statsSection = document.getElementById('stats-section');
    var totalCount = document.getElementById('total-count');
    var filteredCount = document.getElementById('filtered-count');
    var lastUpdated = document.getElementById('last-updated');
    var keywordTags = document.querySelectorAll('.keyword-tag');
    var clearFiltersBtn = document.getElementById('clear-filters');
    var loadMoreContainer = document.getElementById('load-more-container');
    var loadMoreBtn = document.getElementById('load-more-btn');
    
    // Check if elements exist
    if (!fetchBtn) {
      console.error('[DailyPaper] Fetch button not found!');
      return;
    }
    
    console.log('[DailyPaper] Elements found, setting up...');
    
    // State
    var allPapers = [];
    var displayedPapers = [];
    var activeKeywords = [];
    var currentPage = 0;
    var papersPerPage = 20;
    
    // Setup keyword tags
    keywordTags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        var keyword = this.getAttribute('data-keyword');
        var index = activeKeywords.indexOf(keyword);
        if (index > -1) {
          activeKeywords.splice(index, 1);
          this.classList.remove('active');
        } else {
          activeKeywords.push(keyword);
          this.classList.add('active');
        }
        currentPage = 0;
        filterAndDisplayPapers();
      });
    });
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', function() {
      activeKeywords = [];
      searchInput.value = '';
      keywordTags.forEach(function(tag) {
        tag.classList.remove('active');
      });
      currentPage = 0;
      filterAndDisplayPapers();
    });
    
    // Search input
    var searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        currentPage = 0;
        filterAndDisplayPapers();
      }, 300);
    });
    
    // Category change
    categorySelect.addEventListener('change', function() {
      currentPage = 0;
      filterAndDisplayPapers();
    });
    
    // FETCH BUTTON - Main event
    fetchBtn.addEventListener('click', function() {
      console.log('[DailyPaper] Fetch button clicked!');
      fetchPapers();
    });
    
    // Load more
    loadMoreBtn.addEventListener('click', function() {
      currentPage++;
      appendPapers();
    });
    
    // Fetch papers function
    function fetchPapers() {
      console.log('[DailyPaper] fetchPapers() called');
      
      var category = categorySelect.value;
      var maxResults = maxResultsSelect.value;
      
      // Show loading
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      papersList.innerHTML = '';
      statsSection.style.display = 'none';
      loadMoreContainer.style.display = 'none';
      fetchBtn.disabled = true;
      fetchBtnText.textContent = 'Loading...';
      loadingText.textContent = 'Fetching papers from arXiv...';
      
      // Build arXiv API URL
      var baseUrl = 'https://export.arxiv.org/api/query';
      var query = category === 'all' ? 'cat:cs.CV+OR+cat:cs.CL+OR+cat:cs.LG+OR+cat:cs.AI' : 'cat:' + category;
      var arxivUrl = baseUrl + '?search_query=' + query + '&start=0&max_results=' + maxResults + '&sortBy=submittedDate&sortOrder=descending';
      
      console.log('[DailyPaper] arXiv URL:', arxivUrl);
      
      // CORS proxies to try
      var proxies = [
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(arxivUrl),
        'https://corsproxy.io/?' + encodeURIComponent(arxivUrl),
        'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(arxivUrl)
      ];
      
      tryFetch(proxies, 0);
    }
    
    function tryFetch(proxies, index) {
      if (index >= proxies.length) {
        showError('All proxies failed. Please try again later.');
        return;
      }
      
      var proxyUrl = proxies[index];
      console.log('[DailyPaper] Trying proxy ' + (index + 1) + '/' + proxies.length);
      loadingText.textContent = 'Trying server ' + (index + 1) + '/' + proxies.length + '...';
      
      // Create XMLHttpRequest for better compatibility
      var xhr = new XMLHttpRequest();
      xhr.open('GET', proxyUrl, true);
      xhr.timeout = 20000; // 20 second timeout
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          var xmlText = xhr.responseText;
          console.log('[DailyPaper] Got response, length:', xmlText.length);
          
          if (xmlText.indexOf('<entry>') !== -1) {
            var papers = parseArxivXML(xmlText);
            console.log('[DailyPaper] Parsed papers:', papers.length);
            
            if (papers.length > 0) {
              allPapers = papers;
              totalCount.textContent = papers.length;
              lastUpdated.textContent = new Date().toLocaleString();
              currentPage = 0;
              filterAndDisplayPapers();
              hideLoading();
              return;
            }
          }
          console.log('[DailyPaper] Invalid response, trying next proxy');
          tryFetch(proxies, index + 1);
        } else {
          console.log('[DailyPaper] HTTP error:', xhr.status);
          tryFetch(proxies, index + 1);
        }
      };
      
      xhr.onerror = function() {
        console.log('[DailyPaper] Network error');
        tryFetch(proxies, index + 1);
      };
      
      xhr.ontimeout = function() {
        console.log('[DailyPaper] Timeout');
        tryFetch(proxies, index + 1);
      };
      
      xhr.send();
    }
    
    function parseArxivXML(xmlText) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      var entries = xmlDoc.querySelectorAll('entry');
      var papers = [];
      
      entries.forEach(function(entry) {
        try {
          var idEl = entry.querySelector('id');
          var id = idEl ? idEl.textContent : '';
          var arxivId = id.split('/abs/').pop() || id.split('/').pop() || '';
          
          var titleEl = entry.querySelector('title');
          var title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
          
          var summaryEl = entry.querySelector('summary');
          var summary = summaryEl ? summaryEl.textContent.trim() : '';
          
          var publishedEl = entry.querySelector('published');
          var published = publishedEl ? publishedEl.textContent : '';
          
          var authorEls = entry.querySelectorAll('author name');
          var authors = [];
          authorEls.forEach(function(a) {
            authors.push(a.textContent);
          });
          
          var categoryEls = entry.querySelectorAll('category');
          var categories = [];
          categoryEls.forEach(function(c) {
            var term = c.getAttribute('term');
            if (term) categories.push(term);
          });
          
          if (title && arxivId) {
            papers.push({
              id: arxivId,
              title: title,
              abstract: summary,
              authors: authors,
              published: published,
              categories: categories,
              abs_url: 'https://arxiv.org/abs/' + arxivId,
              pdf_url: 'https://arxiv.org/pdf/' + arxivId + '.pdf'
            });
          }
        } catch (e) {
          console.log('[DailyPaper] Error parsing entry:', e);
        }
      });
      
      return papers;
    }
    
    function filterAndDisplayPapers() {
      var searchTerms = searchInput.value.toLowerCase().split(/[\s,]+/).filter(function(t) { return t; });
      var allTerms = searchTerms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      var selectedCategory = categorySelect.value;
      
      displayedPapers = allPapers.filter(function(paper) {
        // Category filter
        if (selectedCategory !== 'all') {
          if (!paper.categories || paper.categories.indexOf(selectedCategory) === -1) {
            return false;
          }
        }
        
        // Keyword filter
        if (allTerms.length > 0) {
          var searchText = (paper.title + ' ' + paper.abstract + ' ' + paper.authors.join(' ')).toLowerCase();
          var found = false;
          for (var i = 0; i < allTerms.length; i++) {
            if (searchText.indexOf(allTerms[i]) !== -1) {
              found = true;
              break;
            }
          }
          return found;
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
      var searchTerms = searchInput.value.toLowerCase().split(/[\s,]+/).filter(function(t) { return t; });
      var allTerms = searchTerms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      
      var start = currentPage * papersPerPage;
      var end = start + papersPerPage;
      var papersToShow = displayedPapers.slice(start, end);
      
      if (papersToShow.length === 0 && currentPage === 0) {
        papersList.innerHTML = '<div class="no-results"><div class="no-results-icon">📭</div><p>No papers found matching your criteria.</p></div>';
        loadMoreContainer.style.display = 'none';
        return;
      }
      
      papersToShow.forEach(function(paper) {
        var card = createPaperCard(paper, allTerms);
        papersList.appendChild(card);
      });
      
      loadMoreContainer.style.display = end < displayedPapers.length ? 'block' : 'none';
    }
    
    function createPaperCard(paper, highlightTerms) {
      var title = escapeHtml(paper.title);
      var abstract = escapeHtml(paper.abstract);
      
      // Highlight terms
      highlightTerms.forEach(function(term) {
        if (term) {
          var regex = new RegExp('(' + escapeRegex(term) + ')', 'gi');
          title = title.replace(regex, '<span class="highlight">$1</span>');
          abstract = abstract.replace(regex, '<span class="highlight">$1</span>');
        }
      });
      
      var publishedDate = paper.published ? new Date(paper.published).toLocaleDateString() : 'N/A';
      var authorsDisplay = paper.authors ? paper.authors.join(', ') : 'N/A';
      var categoriesDisplay = paper.categories ? paper.categories.slice(0, 3).join(', ') : '';
      var safeId = paper.id.replace(/[^a-zA-Z0-9]/g, '_');
      
      var card = document.createElement('div');
      card.className = 'paper-card';
      
      var html = '<h3 class="paper-title"><a href="' + paper.abs_url + '" target="_blank">' + title + '</a></h3>';
      html += '<div class="paper-meta"><span>📅 ' + publishedDate + '</span><span>🏷️ ' + categoriesDisplay + '</span></div>';
      html += '<div class="paper-authors"><strong>Authors:</strong> ' + escapeHtml(authorsDisplay) + '</div>';
      html += '<div class="paper-abstract" id="abstract-' + safeId + '">' + abstract + '</div>';
      html += '<button class="expand-btn" data-target="abstract-' + safeId + '">Show more ▼</button>';
      html += '<div class="paper-links">';
      html += '<a href="' + paper.abs_url + '" class="paper-link arxiv" target="_blank">📄 arXiv</a>';
      html += '<a href="' + paper.pdf_url + '" class="paper-link pdf" target="_blank">📥 PDF</a>';
      html += '</div>';
      
      card.innerHTML = html;
      
      // Add expand button handler
      var expandBtn = card.querySelector('.expand-btn');
      expandBtn.addEventListener('click', function() {
        var targetId = this.getAttribute('data-target');
        var abstractEl = document.getElementById(targetId);
        if (abstractEl.classList.contains('expanded')) {
          abstractEl.classList.remove('expanded');
          this.textContent = 'Show more ▼';
        } else {
          abstractEl.classList.add('expanded');
          this.textContent = 'Show less ▲';
        }
      });
      
      return card;
    }
    
    function escapeHtml(text) {
      if (!text) return '';
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function showError(msg) {
      loading.style.display = 'none';
      fetchBtn.disabled = false;
      fetchBtnText.textContent = 'Fetch Papers';
      errorMessage.textContent = msg;
      errorMessage.style.display = 'block';
    }
    
    function hideLoading() {
      loading.style.display = 'none';
      fetchBtn.disabled = false;
      fetchBtnText.textContent = 'Fetch Papers';
    }
    
    console.log('[DailyPaper] Setup complete!');
  }
})();
</script>
{% endraw %}
