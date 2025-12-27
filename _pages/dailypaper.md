---
layout: archive
title: "Daily Paper"
permalink: /dailypaper/
author_profile: true
---

<div id="arxiv-container">
  <div class="arxiv-header">
    <h2>📚 Daily arXiv Paper Tracker</h2>
    <p class="arxiv-subtitle">Auto-fetched daily via GitHub Actions • Browse historical archives</p>
  </div>

  <!-- Data Source Tabs -->
  <div class="source-tabs">
    <button id="tab-live" class="source-tab active">🌐 Live Fetch</button>
    <button id="tab-archive" class="source-tab">📂 Archive</button>
  </div>

  <!-- Live Fetch Panel -->
  <div id="panel-live" class="source-panel">
    <div class="live-controls">
      <div class="control-group">
        <label for="live-category">Category:</label>
        <select id="live-category">
          <option value="all">All Categories</option>
          <option value="cs.CV" selected>Computer Vision (cs.CV)</option>
          <option value="cs.CL">Computation and Language (cs.CL)</option>
          <option value="cs.LG">Machine Learning (cs.LG)</option>
          <option value="cs.AI">Artificial Intelligence (cs.AI)</option>
          <option value="cs.RO">Robotics (cs.RO)</option>
        </select>
      </div>
      <div class="control-group">
        <label for="live-max">Max Results:</label>
        <select id="live-max">
          <option value="30">30</option>
          <option value="50" selected>50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
      </div>
      <button id="fetch-btn" class="fetch-button">🔄 Fetch from arXiv</button>
    </div>
  </div>

  <!-- Archive Panel -->
  <div id="panel-archive" class="source-panel" style="display: none;">
    <div class="archive-controls">
      <div class="archive-header">
        <span id="archive-status">Loading archive...</span>
      </div>
      <div class="date-controls">
        <button id="prev-day-btn" class="nav-btn">◀ Prev</button>
        <select id="date-select">
          <option value="">Loading...</option>
        </select>
        <button id="next-day-btn" class="nav-btn">Next ▶</button>
        <button id="latest-btn" class="today-btn">Latest</button>
      </div>
    </div>
  </div>

  <!-- Filter Controls (shared) -->
  <div class="arxiv-controls">
    <div class="control-group">
      <label for="category-filter">Filter Category:</label>
      <select id="category-filter">
        <option value="all">All Categories</option>
        <option value="cs.CV">Computer Vision (cs.CV)</option>
        <option value="cs.CL">Computation and Language (cs.CL)</option>
        <option value="cs.LG">Machine Learning (cs.LG)</option>
        <option value="cs.AI">Artificial Intelligence (cs.AI)</option>
        <option value="cs.RO">Robotics (cs.RO)</option>
      </select>
    </div>
    <div class="control-group search-group">
      <label for="search-input">🔍 Search:</label>
      <input type="text" id="search-input" placeholder="transformer, diffusion, LLM...">
    </div>
  </div>

  <!-- Quick Tags -->
  <div class="keyword-section">
    <h4>🏷️ Quick Filters:</h4>
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
      <span class="keyword-tag" data-keyword="NeRF">NeRF</span>
      <span class="keyword-tag" data-keyword="reinforcement">RL</span>
    </div>
    <button id="clear-filters" class="clear-btn">Clear Filters</button>
  </div>

  <!-- Stats -->
  <div id="stats-section" class="stats-section" style="display: none;">
    <span>📊 Total: <strong id="total-count">0</strong></span>
    <span>👁️ Showing: <strong id="filtered-count">0</strong></span>
    <span id="data-source-info" class="data-source-info"></span>
  </div>

  <!-- Loading -->
  <div id="loading" class="loading" style="display: none;">
    <div class="spinner"></div>
    <p id="loading-text">Loading...</p>
  </div>

  <!-- Error -->
  <div id="error-message" class="error-message" style="display: none;"></div>

  <!-- Papers -->
  <div id="papers-list" class="papers-list">
    <div class="init-message">
      <div class="init-icon">📚</div>
      <p>Click <strong>🔄 Fetch from arXiv</strong> to load latest papers</p>
      <p>Or switch to <strong>📂 Archive</strong> to browse saved history</p>
    </div>
  </div>

  <!-- Load More -->
  <div id="load-more-container" style="display: none; text-align: center; padding: 20px;">
    <button id="load-more-btn" class="fetch-button">Load More</button>
  </div>
</div>

<link rel="stylesheet" href="/assets/css/dailypaper.css">
<script src="/assets/js/dailypaper.js"></script>
