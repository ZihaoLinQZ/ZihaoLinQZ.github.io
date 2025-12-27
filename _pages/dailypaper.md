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
      <label for="search-input">🔍 Filter:</label>
      <input type="text" id="search-input" placeholder="e.g., transformer, diffusion...">
    </div>
    
    <button id="fetch-btn" class="fetch-button">🔄 Fetch Papers</button>
  </div>

  <div class="keyword-section">
    <h4>🏷️ Quick Filter Tags:</h4>
    <div class="keyword-tags">
      <span class="keyword-tag" data-keyword="transformer">Transformer</span>
      <span class="keyword-tag" data-keyword="diffusion">Diffusion</span>
      <span class="keyword-tag" data-keyword="LLM">LLM</span>
      <span class="keyword-tag" data-keyword="GPT">GPT</span>
      <span class="keyword-tag" data-keyword="multimodal">Multimodal</span>
      <span class="keyword-tag" data-keyword="vision language">VLM</span>
      <span class="keyword-tag" data-keyword="generation">Generation</span>
      <span class="keyword-tag" data-keyword="detection">Detection</span>
      <span class="keyword-tag" data-keyword="segmentation">Segmentation</span>
      <span class="keyword-tag" data-keyword="video">Video</span>
      <span class="keyword-tag" data-keyword="3D">3D</span>
      <span class="keyword-tag" data-keyword="reinforcement">RL</span>
    </div>
    <button id="clear-filters" class="clear-btn">Clear Filters</button>
  </div>

  <div id="stats-section" class="stats-section" style="display: none;">
    <span>Total: <strong id="total-count">0</strong></span>
    <span>Showing: <strong id="filtered-count">0</strong></span>
    <span>Updated: <strong id="last-updated">-</strong></span>
  </div>

  <div id="loading" class="loading" style="display: none;">
    <div class="spinner"></div>
    <p id="loading-text">Fetching papers...</p>
  </div>

  <div id="error-message" class="error-message" style="display: none;"></div>

  <div id="papers-list" class="papers-list">
    <div class="init-message">
      <p>👆 Click <strong>Fetch Papers</strong> to load the latest papers from arXiv.</p>
    </div>
  </div>

  <div id="load-more-container" style="display: none; text-align: center; padding: 20px;">
    <button id="load-more-btn" class="fetch-button">Load More</button>
  </div>
</div>

<link rel="stylesheet" href="/assets/css/dailypaper.css">
<script src="/assets/js/dailypaper.js"></script>
