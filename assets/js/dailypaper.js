// Daily Paper - GitHub Actions Version
// Reads paper data from JSON files stored in the repository
// Place at: /assets/js/dailypaper.js

(function() {
  "use strict";
  
  console.log("[DailyPaper] Script loaded");
  
  // Base path for data files
  var DATA_BASE = "/assets/data/arxiv";
  var INDEX_URL = DATA_BASE + "/index.json";
  var DAILY_DIR = DATA_BASE + "/daily";
  
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  
  ready(function() {
    console.log("[DailyPaper] Initializing...");
    
    // Elements
    var dateSelect = document.getElementById("date-select");
    var prevDayBtn = document.getElementById("prev-day-btn");
    var nextDayBtn = document.getElementById("next-day-btn");
    var todayBtn = document.getElementById("today-btn");
    var dataStatus = document.getElementById("data-status");
    var categorySelect = document.getElementById("category-select");
    var searchInput = document.getElementById("search-input");
    var refreshBtn = document.getElementById("refresh-btn");
    var keywordTags = document.querySelectorAll(".keyword-tag");
    var clearFiltersBtn = document.getElementById("clear-filters");
    var loading = document.getElementById("loading");
    var loadingText = document.getElementById("loading-text");
    var errorMessage = document.getElementById("error-message");
    var papersList = document.getElementById("papers-list");
    var statsSection = document.getElementById("stats-section");
    var totalCount = document.getElementById("total-count");
    var filteredCount = document.getElementById("filtered-count");
    var currentDateEl = document.getElementById("current-date");
    var fetchTimeEl = document.getElementById("fetch-time");
    var loadMoreContainer = document.getElementById("load-more-container");
    var loadMoreBtn = document.getElementById("load-more-btn");
    
    if (!dateSelect) {
      console.error("[DailyPaper] Required elements not found!");
      return;
    }
    
    // State
    var indexData = null;
    var allPapers = [];
    var displayedPapers = [];
    var activeKeywords = [];
    var currentPage = 0;
    var papersPerPage = 20;
    var currentDateIndex = 0;
    
    // Load index first
    loadIndex();
    
    // ==================== DATA LOADING ====================
    
    function loadIndex() {
      console.log("[DailyPaper] Loading index...");
      showLoading("Loading paper archive...");
      
      fetch(INDEX_URL)
        .then(function(response) {
          if (!response.ok) throw new Error("Index not found");
          return response.json();
        })
        .then(function(data) {
          console.log("[DailyPaper] Index loaded:", data.total_days, "days");
          indexData = data;
          populateDateSelect();
          updateDataStatus();
          
          // Load latest day
          if (data.days && data.days.length > 0) {
            currentDateIndex = 0;
            loadDay(data.days[0].date);
          } else {
            hideLoading();
            showNoData("No paper data available yet. GitHub Actions will fetch papers daily.");
          }
        })
        .catch(function(err) {
          console.log("[DailyPaper] Index error:", err);
          hideLoading();
          showNoData("Paper archive not initialized yet. Run GitHub Actions to fetch papers.");
        });
    }
    
    function populateDateSelect() {
      dateSelect.innerHTML = "";
      
      if (!indexData || !indexData.days) return;
      
      var days = indexData.days;
      var currentGroup = "";
      var optgroup = null;
      
      for (var i = 0; i < days.length; i++) {
        var day = days[i];
        var groupLabel = getDateGroup(day.date);
        
        if (groupLabel !== currentGroup) {
          currentGroup = groupLabel;
          optgroup = document.createElement("optgroup");
          optgroup.label = groupLabel;
          dateSelect.appendChild(optgroup);
        }
        
        var option = document.createElement("option");
        option.value = day.date;
        option.textContent = formatDateDisplay(day.date) + " (" + day.total_count + " papers)";
        optgroup.appendChild(option);
      }
    }
    
    function getDateGroup(dateStr) {
      var today = new Date().toISOString().split("T")[0];
      var yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      var weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      
      if (dateStr === today) return "Today";
      if (dateStr === yesterday) return "Yesterday";
      if (dateStr >= weekAgo) return "This Week";
      
      // Get month/year
      var parts = dateStr.split("-");
      var months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
      return months[parseInt(parts[1]) - 1] + " " + parts[0];
    }
    
    function formatDateDisplay(dateStr) {
      var today = new Date().toISOString().split("T")[0];
      var yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
      if (dateStr === today) return "Today";
      if (dateStr === yesterday) return "Yesterday";
      
      var parts = dateStr.split("-");
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[parseInt(parts[1]) - 1] + " " + parseInt(parts[2]);
    }
    
    function updateDataStatus() {
      if (!indexData) {
        dataStatus.textContent = "No data";
        return;
      }
      
      dataStatus.textContent = indexData.total_days + " days archived";
    }
    
    function loadDay(date) {
      console.log("[DailyPaper] Loading day:", date);
      showLoading("Loading " + date + "...");
      
      var url = DAILY_DIR + "/" + date + ".json";
      
      fetch(url)
        .then(function(response) {
          if (!response.ok) throw new Error("Day data not found");
          return response.json();
        })
        .then(function(data) {
          console.log("[DailyPaper] Loaded", data.total_count, "papers for", date);
          
          allPapers = data.papers || [];
          totalCount.textContent = allPapers.length;
          currentDateEl.textContent = formatDateFull(date);
          
          if (data.fetched_at) {
            var fetchDate = new Date(data.fetched_at);
            fetchTimeEl.textContent = "Fetched: " + fetchDate.toLocaleString();
          }
          
          // Update select
          dateSelect.value = date;
          
          // Update nav buttons
          updateNavButtons();
          
          // Filter and display
          currentPage = 0;
          filterPapers();
          hideLoading();
        })
        .catch(function(err) {
          console.log("[DailyPaper] Error loading day:", err);
          hideLoading();
          showError("Failed to load papers for " + date);
        });
    }
    
    function formatDateFull(dateStr) {
      var parts = dateStr.split("-");
      var months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
      return months[parseInt(parts[1]) - 1] + " " + parseInt(parts[2]) + ", " + parts[0];
    }
    
    function updateNavButtons() {
      if (!indexData || !indexData.days) return;
      
      var days = indexData.days;
      currentDateIndex = -1;
      
      for (var i = 0; i < days.length; i++) {
        if (days[i].date === dateSelect.value) {
          currentDateIndex = i;
          break;
        }
      }
      
      prevDayBtn.disabled = (currentDateIndex >= days.length - 1);
      nextDayBtn.disabled = (currentDateIndex <= 0);
    }
    
    // ==================== EVENT LISTENERS ====================
    
    dateSelect.addEventListener("change", function() {
      if (this.value) {
        loadDay(this.value);
      }
    });
    
    prevDayBtn.addEventListener("click", function() {
      if (!indexData || !indexData.days) return;
      if (currentDateIndex < indexData.days.length - 1) {
        currentDateIndex++;
        loadDay(indexData.days[currentDateIndex].date);
      }
    });
    
    nextDayBtn.addEventListener("click", function() {
      if (!indexData || !indexData.days) return;
      if (currentDateIndex > 0) {
        currentDateIndex--;
        loadDay(indexData.days[currentDateIndex].date);
      }
    });
    
    todayBtn.addEventListener("click", function() {
      if (!indexData || !indexData.days || indexData.days.length === 0) return;
      currentDateIndex = 0;
      loadDay(indexData.days[0].date);
    });
    
    refreshBtn.addEventListener("click", function() {
      loadIndex();
    });
    
    // Keyword tags
    for (var i = 0; i < keywordTags.length; i++) {
      (function(tag) {
        tag.addEventListener("click", function() {
          var kw = this.getAttribute("data-keyword");
          var idx = activeKeywords.indexOf(kw);
          if (idx > -1) {
            activeKeywords.splice(idx, 1);
            this.classList.remove("active");
          } else {
            activeKeywords.push(kw);
            this.classList.add("active");
          }
          currentPage = 0;
          filterPapers();
        });
      })(keywordTags[i]);
    }
    
    clearFiltersBtn.addEventListener("click", function() {
      activeKeywords = [];
      searchInput.value = "";
      categorySelect.value = "all";
      for (var j = 0; j < keywordTags.length; j++) {
        keywordTags[j].classList.remove("active");
      }
      currentPage = 0;
      filterPapers();
    });
    
    var searchTimer = null;
    searchInput.addEventListener("input", function() {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function() {
        currentPage = 0;
        filterPapers();
      }, 300);
    });
    
    categorySelect.addEventListener("change", function() {
      currentPage = 0;
      filterPapers();
    });
    
    loadMoreBtn.addEventListener("click", function() {
      currentPage++;
      showPapers();
    });
    
    // ==================== FILTERING & DISPLAY ====================
    
    function filterPapers() {
      var searchVal = searchInput.value.toLowerCase();
      var searchTerms = searchVal.split(/[\s,]+/).filter(function(t) { return t.length > 0; });
      var allTerms = searchTerms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      var cat = categorySelect.value;
      
      displayedPapers = allPapers.filter(function(paper) {
        // Category filter
        if (cat !== "all") {
          var hasCat = false;
          var cats = paper.categories || [];
          for (var i = 0; i < cats.length; i++) {
            if (cats[i] === cat) hasCat = true;
          }
          if (!hasCat && paper.primary_category !== cat) return false;
        }
        
        // Keyword filter
        if (allTerms.length > 0) {
          var text = (paper.title + " " + paper.abstract + " " + (paper.authors || []).join(" ")).toLowerCase();
          var found = false;
          for (var j = 0; j < allTerms.length; j++) {
            if (text.indexOf(allTerms[j]) !== -1) found = true;
          }
          if (!found) return false;
        }
        
        return true;
      });
      
      statsSection.style.display = "flex";
      filteredCount.textContent = displayedPapers.length;
      
      currentPage = 0;
      papersList.innerHTML = "";
      showPapers();
    }
    
    function showPapers() {
      var searchVal = searchInput.value.toLowerCase();
      var searchTerms = searchVal.split(/[\s,]+/).filter(function(t) { return t.length > 0; });
      var allTerms = searchTerms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      
      var start = currentPage * papersPerPage;
      var end = start + papersPerPage;
      var toShow = displayedPapers.slice(start, end);
      
      if (toShow.length === 0 && currentPage === 0) {
        papersList.innerHTML = '<div class="no-data"><div class="no-data-icon">📭</div><p>No papers match your filters.</p></div>';
        loadMoreContainer.style.display = "none";
        return;
      }
      
      for (var i = 0; i < toShow.length; i++) {
        papersList.appendChild(createCard(toShow[i], allTerms));
      }
      
      loadMoreContainer.style.display = (end < displayedPapers.length) ? "block" : "none";
    }
    
    function createCard(paper, terms) {
      var title = escapeHTML(paper.title);
      var abstract = escapeHTML(paper.abstract || "");
      
      // Highlight search terms
      for (var i = 0; i < terms.length; i++) {
        if (terms[i]) {
          var re = new RegExp("(" + escapeRegex(terms[i]) + ")", "gi");
          title = title.replace(re, '<span class="highlight">$1</span>');
          abstract = abstract.replace(re, '<span class="highlight">$1</span>');
        }
      }
      
      var date = paper.published ? new Date(paper.published).toLocaleDateString() : "";
      var authors = paper.authors || [];
      var authorsStr = authors.length > 0 ? authors.slice(0, 5).join(", ") : "N/A";
      if (authors.length > 5) authorsStr += " et al.";
      
      var cats = paper.categories || [];
      var catsStr = cats.slice(0, 3).join(", ");
      
      var safeId = (paper.id || "").replace(/[^a-zA-Z0-9]/g, "_");
      var absUrl = paper.abs_url || ("https://arxiv.org/abs/" + paper.id);
      var pdfUrl = paper.pdf_url || ("https://arxiv.org/pdf/" + paper.id + ".pdf");
      
      var card = document.createElement("div");
      card.className = "paper-card";
      
      var html = '<h3 class="paper-title"><a href="' + absUrl + '" target="_blank" rel="noopener">' + title + '</a></h3>';
      html += '<div class="paper-meta">';
      if (date) html += '<span>📅 ' + date + '</span>';
      if (catsStr) html += '<span>🏷️ ' + catsStr + '</span>';
      html += '</div>';
      html += '<div class="paper-authors"><strong>Authors:</strong> ' + escapeHTML(authorsStr) + '</div>';
      
      if (abstract) {
        html += '<div class="paper-abstract" id="abs_' + safeId + '">' + abstract + '</div>';
        html += '<button class="expand-btn" data-id="abs_' + safeId + '">Show more ▼</button>';
      }
      
      html += '<div class="paper-links">';
      html += '<a href="' + absUrl + '" class="paper-link arxiv" target="_blank" rel="noopener">📄 arXiv</a>';
      html += '<a href="' + pdfUrl + '" class="paper-link pdf" target="_blank" rel="noopener">📥 PDF</a>';
      html += '</div>';
      
      card.innerHTML = html;
      
      // Expand button
      var btn = card.querySelector(".expand-btn");
      if (btn) {
        btn.addEventListener("click", function() {
          var targetId = this.getAttribute("data-id");
          var absEl = document.getElementById(targetId);
          if (absEl) {
            if (absEl.classList.contains("expanded")) {
              absEl.classList.remove("expanded");
              this.textContent = "Show more ▼";
            } else {
              absEl.classList.add("expanded");
              this.textContent = "Show less ▲";
            }
          }
        });
      }
      
      return card;
    }
    
    // ==================== HELPERS ====================
    
    function escapeHTML(str) {
      if (!str) return "";
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
    
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    
    function showLoading(msg) {
      loading.style.display = "block";
      loadingText.textContent = msg || "Loading...";
      errorMessage.style.display = "none";
    }
    
    function hideLoading() {
      loading.style.display = "none";
    }
    
    function showError(msg) {
      errorMessage.textContent = msg;
      errorMessage.style.display = "block";
    }
    
    function showNoData(msg) {
      papersList.innerHTML = '<div class="no-data"><div class="no-data-icon">📚</div><p>' + msg + '</p></div>';
    }
    
    console.log("[DailyPaper] Ready!");
  });
})();
