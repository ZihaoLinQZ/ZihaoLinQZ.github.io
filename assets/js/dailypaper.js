// Daily Paper - Combined Live Fetch + Archive
// Place at: /assets/js/dailypaper.js

(function() {
  "use strict";
  
  console.log("[DailyPaper] Loading...");
  
  var DATA_BASE = "/assets/data/arxiv";
  var INDEX_URL = DATA_BASE + "/index.json";
  var DAILY_DIR = DATA_BASE + "/daily";
  
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  
  ready(function() {
    console.log("[DailyPaper] Init");
    
    // === Elements ===
    var tabLive = document.getElementById("tab-live");
    var tabArchive = document.getElementById("tab-archive");
    var panelLive = document.getElementById("panel-live");
    var panelArchive = document.getElementById("panel-archive");
    
    var liveCategory = document.getElementById("live-category");
    var liveMax = document.getElementById("live-max");
    var fetchBtn = document.getElementById("fetch-btn");
    
    var archiveStatus = document.getElementById("archive-status");
    var dateSelect = document.getElementById("date-select");
    var prevBtn = document.getElementById("prev-day-btn");
    var nextBtn = document.getElementById("next-day-btn");
    var latestBtn = document.getElementById("latest-btn");
    
    var categoryFilter = document.getElementById("category-filter");
    var searchInput = document.getElementById("search-input");
    var keywordTags = document.querySelectorAll(".keyword-tag");
    var clearFiltersBtn = document.getElementById("clear-filters");
    
    var statsSection = document.getElementById("stats-section");
    var totalCount = document.getElementById("total-count");
    var filteredCount = document.getElementById("filtered-count");
    var dataSourceInfo = document.getElementById("data-source-info");
    
    var loading = document.getElementById("loading");
    var loadingText = document.getElementById("loading-text");
    var errorMessage = document.getElementById("error-message");
    var papersList = document.getElementById("papers-list");
    var loadMoreContainer = document.getElementById("load-more-container");
    var loadMoreBtn = document.getElementById("load-more-btn");
    
    if (!fetchBtn) {
      console.error("[DailyPaper] Elements missing!");
      return;
    }
    
    // === State ===
    var allPapers = [];
    var displayedPapers = [];
    var activeKeywords = [];
    var currentPage = 0;
    var papersPerPage = 20;
    var indexData = null;
    var currentDateIdx = 0;
    var currentMode = "live"; // "live" or "archive"
    
    // === Tab Switching ===
    tabLive.addEventListener("click", function() {
      currentMode = "live";
      tabLive.classList.add("active");
      tabArchive.classList.remove("active");
      panelLive.style.display = "block";
      panelArchive.style.display = "none";
    });
    
    tabArchive.addEventListener("click", function() {
      currentMode = "archive";
      tabArchive.classList.add("active");
      tabLive.classList.remove("active");
      panelArchive.style.display = "block";
      panelLive.style.display = "none";
      
      if (!indexData) {
        loadArchiveIndex();
      }
    });
    
    // === Live Fetch ===
    fetchBtn.addEventListener("click", function() {
      doLiveFetch();
    });
    
    function doLiveFetch() {
      var category = liveCategory.value;
      var maxResults = liveMax.value;
      
      console.log("[DailyPaper] Live fetch:", category, maxResults);
      
      showLoading("Fetching from arXiv...");
      hideError();
      papersList.innerHTML = "";
      statsSection.style.display = "none";
      loadMoreContainer.style.display = "none";
      fetchBtn.disabled = true;
      fetchBtn.textContent = "Fetching...";
      
      var baseUrl = "https://export.arxiv.org/api/query";
      var query = category === "all" 
        ? "cat:cs.CV+OR+cat:cs.CL+OR+cat:cs.LG+OR+cat:cs.AI+OR+cat:cs.RO"
        : "cat:" + category;
      var arxivUrl = baseUrl + "?search_query=" + query + "&start=0&max_results=" + maxResults + "&sortBy=submittedDate&sortOrder=descending";
      
      var proxies = [
        "https://api.allorigins.win/raw?url=" + encodeURIComponent(arxivUrl),
        "https://corsproxy.io/?" + encodeURIComponent(arxivUrl),
        "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(arxivUrl)
      ];
      
      tryProxy(0);
      
      function tryProxy(idx) {
        if (idx >= proxies.length) {
          hideLoading();
          showError("Failed to fetch. All servers unavailable.");
          fetchBtn.disabled = false;
          fetchBtn.textContent = "🔄 Fetch from arXiv";
          return;
        }
        
        loadingText.textContent = "Trying server " + (idx + 1) + "/" + proxies.length + "...";
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", proxies[idx], true);
        xhr.timeout = 25000;
        
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 && xhr.responseText.indexOf("<entry>") !== -1) {
              var papers = parseArxivXML(xhr.responseText);
              if (papers.length > 0) {
                allPapers = papers;
                totalCount.textContent = papers.length;
                dataSourceInfo.textContent = "🌐 Live from arXiv";
                dataSourceInfo.style.display = "inline";
                currentPage = 0;
                filterPapers();
                hideLoading();
                fetchBtn.disabled = false;
                fetchBtn.textContent = "🔄 Fetch from arXiv";
                console.log("[DailyPaper] Fetched", papers.length, "papers");
                return;
              }
            }
            tryProxy(idx + 1);
          }
        };
        
        xhr.onerror = function() { tryProxy(idx + 1); };
        xhr.ontimeout = function() { tryProxy(idx + 1); };
        xhr.send();
      }
    }
    
    function parseArxivXML(text) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/xml");
      var entries = doc.getElementsByTagName("entry");
      var papers = [];
      
      for (var i = 0; i < entries.length; i++) {
        try {
          var entry = entries[i];
          var idEl = entry.getElementsByTagName("id")[0];
          var id = idEl ? idEl.textContent : "";
          var arxivId = id.split("/abs/").pop() || id.split("/").pop() || "";
          
          var titleEl = entry.getElementsByTagName("title")[0];
          var title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
          
          var summaryEl = entry.getElementsByTagName("summary")[0];
          var abstract = summaryEl ? summaryEl.textContent.trim() : "";
          
          var publishedEl = entry.getElementsByTagName("published")[0];
          var published = publishedEl ? publishedEl.textContent : "";
          
          var authorEls = entry.getElementsByTagName("author");
          var authors = [];
          for (var j = 0; j < authorEls.length; j++) {
            var nameEl = authorEls[j].getElementsByTagName("name")[0];
            if (nameEl) authors.push(nameEl.textContent);
          }
          
          var catEls = entry.getElementsByTagName("category");
          var categories = [];
          for (var k = 0; k < catEls.length; k++) {
            var term = catEls[k].getAttribute("term");
            if (term) categories.push(term);
          }
          
          if (title && arxivId) {
            papers.push({
              id: arxivId,
              title: title,
              abstract: abstract,
              authors: authors,
              published: published,
              categories: categories
            });
          }
        } catch (e) {}
      }
      
      return papers;
    }
    
    // === Archive ===
    function loadArchiveIndex() {
      showLoading("Loading archive index...");
      archiveStatus.textContent = "Loading...";
      
      fetch(INDEX_URL)
        .then(function(r) {
          if (!r.ok) throw new Error("Not found");
          return r.json();
        })
        .then(function(data) {
          indexData = data;
          archiveStatus.textContent = data.total_days + " days archived";
          populateDateSelect();
          hideLoading();
          
          if (data.days && data.days.length > 0) {
            currentDateIdx = 0;
            loadArchiveDay(data.days[0].date);
          } else {
            papersList.innerHTML = '<div class="no-data"><div class="no-data-icon">📭</div><p>No archive data yet.</p><p>Run GitHub Actions to start collecting papers.</p></div>';
          }
        })
        .catch(function(e) {
          hideLoading();
          archiveStatus.textContent = "No archive found";
          papersList.innerHTML = '<div class="no-data"><div class="no-data-icon">📭</div><p>Archive not initialized.</p><p>Run GitHub Actions workflow first, or use Live Fetch.</p></div>';
        });
    }
    
    function populateDateSelect() {
      dateSelect.innerHTML = "";
      if (!indexData || !indexData.days) return;
      
      var days = indexData.days;
      for (var i = 0; i < days.length; i++) {
        var d = days[i];
        var opt = document.createElement("option");
        opt.value = d.date;
        opt.textContent = formatDate(d.date) + " (" + d.total_count + " papers)";
        dateSelect.appendChild(opt);
      }
    }
    
    function formatDate(ds) {
      var today = new Date().toISOString().split("T")[0];
      var yest = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (ds === today) return "Today";
      if (ds === yest) return "Yesterday";
      var p = ds.split("-");
      var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return m[parseInt(p[1])-1] + " " + parseInt(p[2]) + ", " + p[0];
    }
    
    function loadArchiveDay(date) {
      showLoading("Loading " + date + "...");
      
      fetch(DAILY_DIR + "/" + date + ".json")
        .then(function(r) {
          if (!r.ok) throw new Error("Not found");
          return r.json();
        })
        .then(function(data) {
          allPapers = data.papers || [];
          totalCount.textContent = allPapers.length;
          dataSourceInfo.textContent = "📂 Archive: " + formatDate(date);
          dataSourceInfo.style.display = "inline";
          dateSelect.value = date;
          updateNavBtns();
          currentPage = 0;
          filterPapers();
          hideLoading();
        })
        .catch(function(e) {
          hideLoading();
          showError("Failed to load " + date);
        });
    }
    
    function updateNavBtns() {
      if (!indexData || !indexData.days) return;
      var days = indexData.days;
      currentDateIdx = -1;
      for (var i = 0; i < days.length; i++) {
        if (days[i].date === dateSelect.value) {
          currentDateIdx = i;
          break;
        }
      }
      prevBtn.disabled = currentDateIdx >= days.length - 1;
      nextBtn.disabled = currentDateIdx <= 0;
    }
    
    dateSelect.addEventListener("change", function() {
      if (this.value) loadArchiveDay(this.value);
    });
    
    prevBtn.addEventListener("click", function() {
      if (indexData && indexData.days && currentDateIdx < indexData.days.length - 1) {
        currentDateIdx++;
        loadArchiveDay(indexData.days[currentDateIdx].date);
      }
    });
    
    nextBtn.addEventListener("click", function() {
      if (indexData && indexData.days && currentDateIdx > 0) {
        currentDateIdx--;
        loadArchiveDay(indexData.days[currentDateIdx].date);
      }
    });
    
    latestBtn.addEventListener("click", function() {
      if (indexData && indexData.days && indexData.days.length > 0) {
        currentDateIdx = 0;
        loadArchiveDay(indexData.days[0].date);
      }
    });
    
    // === Filtering ===
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
      categoryFilter.value = "all";
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
    
    categoryFilter.addEventListener("change", function() {
      currentPage = 0;
      filterPapers();
    });
    
    loadMoreBtn.addEventListener("click", function() {
      currentPage++;
      showPapers();
    });
    
    function filterPapers() {
      var searchVal = searchInput.value.toLowerCase();
      var terms = searchVal.split(/[\s,]+/).filter(function(t) { return t; });
      var allTerms = terms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      var cat = categoryFilter.value;
      
      displayedPapers = allPapers.filter(function(p) {
        if (cat !== "all") {
          var found = false;
          var cats = p.categories || [];
          for (var i = 0; i < cats.length; i++) {
            if (cats[i] === cat) found = true;
          }
          if (!found) return false;
        }
        
        if (allTerms.length > 0) {
          var txt = (p.title + " " + p.abstract + " " + (p.authors||[]).join(" ")).toLowerCase();
          var match = false;
          for (var j = 0; j < allTerms.length; j++) {
            if (txt.indexOf(allTerms[j]) !== -1) match = true;
          }
          if (!match) return false;
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
      var terms = searchInput.value.toLowerCase().split(/[\s,]+/).filter(function(t) { return t; });
      var allTerms = terms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      
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
      
      loadMoreContainer.style.display = end < displayedPapers.length ? "block" : "none";
    }
    
    function createCard(paper, terms) {
      var title = escapeHTML(paper.title);
      var abstract = escapeHTML(paper.abstract || "");
      
      for (var i = 0; i < terms.length; i++) {
        if (terms[i]) {
          var re = new RegExp("(" + escapeRegex(terms[i]) + ")", "gi");
          title = title.replace(re, '<span class="highlight">$1</span>');
          abstract = abstract.replace(re, '<span class="highlight">$1</span>');
        }
      }
      
      var date = paper.published ? new Date(paper.published).toLocaleDateString() : "";
      var authors = paper.authors || [];
      var authStr = authors.length > 0 ? authors.slice(0, 5).join(", ") : "N/A";
      if (authors.length > 5) authStr += " et al.";
      var cats = (paper.categories || []).slice(0, 3).join(", ");
      var safeId = (paper.id || "").replace(/[^a-zA-Z0-9]/g, "_");
      var absUrl = "https://arxiv.org/abs/" + paper.id;
      var pdfUrl = "https://arxiv.org/pdf/" + paper.id + ".pdf";
      
      var card = document.createElement("div");
      card.className = "paper-card";
      
      var html = '<h3 class="paper-title"><a href="' + absUrl + '" target="_blank">' + title + '</a></h3>';
      html += '<div class="paper-meta">';
      if (date) html += '<span>📅 ' + date + '</span>';
      if (cats) html += '<span>🏷️ ' + cats + '</span>';
      html += '</div>';
      html += '<div class="paper-authors"><strong>Authors:</strong> ' + escapeHTML(authStr) + '</div>';
      if (abstract) {
        html += '<div class="paper-abstract" id="abs_' + safeId + '">' + abstract + '</div>';
        html += '<button class="expand-btn" data-id="abs_' + safeId + '">Show more ▼</button>';
      }
      html += '<div class="paper-links">';
      html += '<a href="' + absUrl + '" class="paper-link arxiv" target="_blank">📄 arXiv</a>';
      html += '<a href="' + pdfUrl + '" class="paper-link pdf" target="_blank">📥 PDF</a>';
      html += '</div>';
      
      card.innerHTML = html;
      
      var btn = card.querySelector(".expand-btn");
      if (btn) {
        btn.addEventListener("click", function() {
          var el = document.getElementById(this.getAttribute("data-id"));
          if (el) {
            if (el.classList.contains("expanded")) {
              el.classList.remove("expanded");
              this.textContent = "Show more ▼";
            } else {
              el.classList.add("expanded");
              this.textContent = "Show less ▲";
            }
          }
        });
      }
      
      return card;
    }
    
    // === Helpers ===
    function escapeHTML(s) {
      if (!s) return "";
      var d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }
    
    function escapeRegex(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    
    function showLoading(msg) {
      loading.style.display = "block";
      loadingText.textContent = msg || "Loading...";
    }
    
    function hideLoading() {
      loading.style.display = "none";
    }
    
    function showError(msg) {
      errorMessage.textContent = msg;
      errorMessage.style.display = "block";
    }
    
    function hideError() {
      errorMessage.style.display = "none";
    }
    
    console.log("[DailyPaper] Ready!");
  });
})();
