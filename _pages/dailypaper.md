---
layout: archive
title: "Daily Paper"
permalink: /dailypaper/
author_profile: true
---

<div id="arxiv-container">
  <div class="arxiv-header">
    <h2>📚 Daily arXiv Paper Tracker</h2>
    <p class="arxiv-subtitle">Auto-fetched daily via GitHub Actions • Data stored permanently</p>
  </div>

  <!-- Date Selection Section -->
  <div class="date-section">
    <div class="date-header">
      <h4>📅 Select Date</h4>
      <span id="data-status" class="data-status">Loading...</span>
    </div>
    <div class="date-controls">
      <button id="prev-day-btn" class="nav-btn">◀ Previous</button>
      <select id="date-select">
        <option value="">Loading dates...</option>
      </select>
      <button id="next-day-btn" class="nav-btn">Next ▶</button>
      <button id="today-btn" class="today-btn">Today</button>
    </div>
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
      </select>
    </div>
    
    <div class="control-group search-group">
      <label for="search-input">🔍 Filter:</label>
      <input type="text" id="search-input" placeholder="e.g., transformer, diffusion, LLM...">
    </div>
    
    <button id="refresh-btn" class="fetch-button">🔄 Refresh</button>
  </div>

  <!-- Quick Filter Tags -->
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
      <span class="keyword-tag" data-keyword="BERT">BERT</span>
      <span class="keyword-tag" data-keyword="NeRF">NeRF</span>
      <span class="keyword-tag" data-keyword="GAN">GAN</span>
    </div>
    <button id="clear-filters" class="clear-btn">Clear Filters</button>
  </div>

  <!-- Statistics -->
  <div id="stats-section" class="stats-section" style="display: none;">
    <span>📊 Total: <strong id="total-count">0</strong></span>
    <span>👁️ Showing: <strong id="filtered-count">0</strong></span>
    <span>📅 Date: <strong id="current-date">-</strong></span>
    <span id="fetch-time" class="fetch-time"></span>
  </div>

  <!-- Loading -->
  <div id="loading" class="loading" style="display: none;">
    <div class="spinner"></div>
    <p id="loading-text">Loading papers...</p>
  </div>

  <!-- Error -->
  <div id="error-message" class="error-message" style="display: none;"></div>

  <!-- Papers List -->
  <div id="papers-list" class="papers-list">
    <div class="init-message">
      <div class="init-icon">📚</div>
      <p>Loading paper archive...</p>
    </div>
  </div>

  <!-- Load More -->
  <div id="load-more-container" style="display: none; text-align: center; padding: 20px;">
    <button id="load-more-btn" class="fetch-button">Load More</button>
  </div>
</div>

<link rel="stylesheet" href="/assets/css/dailypaper.css">
<script src="/assets/js/dailypaper.js"></script>
