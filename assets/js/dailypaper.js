// Daily Paper - arXiv Paper Fetcher
// This file should be placed at /assets/js/dailypaper.js

(function() {
  "use strict";
  
  console.log("[DailyPaper] Script loaded");
  
  // Wait for DOM ready
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  
  ready(function() {
    console.log("[DailyPaper] DOM ready, initializing...");
    
    // Get elements
    var categorySelect = document.getElementById("category-select");
    var maxResultsSelect = document.getElementById("max-results");
    var searchInput = document.getElementById("search-input");
    var fetchBtn = document.getElementById("fetch-btn");
    var loading = document.getElementById("loading");
    var loadingText = document.getElementById("loading-text");
    var errorMessage = document.getElementById("error-message");
    var papersList = document.getElementById("papers-list");
    var statsSection = document.getElementById("stats-section");
    var totalCount = document.getElementById("total-count");
    var filteredCount = document.getElementById("filtered-count");
    var lastUpdated = document.getElementById("last-updated");
    var clearFiltersBtn = document.getElementById("clear-filters");
    var loadMoreContainer = document.getElementById("load-more-container");
    var loadMoreBtn = document.getElementById("load-more-btn");
    var keywordTags = document.querySelectorAll(".keyword-tag");
    
    // Check elements
    if (!fetchBtn) {
      console.error("[DailyPaper] ERROR: fetch-btn not found!");
      return;
    }
    
    console.log("[DailyPaper] All elements found");
    
    // State
    var allPapers = [];
    var displayedPapers = [];
    var activeKeywords = [];
    var currentPage = 0;
    var papersPerPage = 20;
    
    // Keyword tag clicks
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
    
    // Clear filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", function() {
        activeKeywords = [];
        searchInput.value = "";
        for (var i = 0; i < keywordTags.length; i++) {
          keywordTags[i].classList.remove("active");
        }
        currentPage = 0;
        filterPapers();
      });
    }
    
    // Search input
    var searchTimer = null;
    searchInput.addEventListener("input", function() {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function() {
        currentPage = 0;
        filterPapers();
      }, 300);
    });
    
    // Category change
    categorySelect.addEventListener("change", function() {
      currentPage = 0;
      filterPapers();
    });
    
    // Load more
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function() {
        currentPage++;
        showPapers();
      });
    }
    
    // FETCH BUTTON
    fetchBtn.addEventListener("click", function() {
      console.log("[DailyPaper] Fetch button clicked!");
      doFetch();
    });
    
    console.log("[DailyPaper] Event listeners attached");
    
    // Main fetch function
    function doFetch() {
      var category = categorySelect.value;
      var maxResults = maxResultsSelect.value;
      
      console.log("[DailyPaper] Fetching category=" + category + ", max=" + maxResults);
      
      // UI updates
      loading.style.display = "block";
      loadingText.textContent = "Connecting to arXiv...";
      errorMessage.style.display = "none";
      papersList.innerHTML = "";
      statsSection.style.display = "none";
      loadMoreContainer.style.display = "none";
      fetchBtn.disabled = true;
      fetchBtn.textContent = "Loading...";
      
      // Build URL
      var baseUrl = "https://export.arxiv.org/api/query";
      var query;
      if (category === "all") {
        query = "cat:cs.CV+OR+cat:cs.CL+OR+cat:cs.LG+OR+cat:cs.AI";
      } else {
        query = "cat:" + category;
      }
      var arxivUrl = baseUrl + "?search_query=" + query + "&start=0&max_results=" + maxResults + "&sortBy=submittedDate&sortOrder=descending";
      
      console.log("[DailyPaper] arXiv URL: " + arxivUrl);
      
      // Proxies to try
      var proxies = [
        "https://api.allorigins.win/raw?url=" + encodeURIComponent(arxivUrl),
        "https://corsproxy.io/?" + encodeURIComponent(arxivUrl),
        "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(arxivUrl)
      ];
      
      tryProxy(0);
      
      function tryProxy(idx) {
        if (idx >= proxies.length) {
          showError("Failed to fetch papers. All servers are unavailable. Please try again later.");
          return;
        }
        
        var url = proxies[idx];
        console.log("[DailyPaper] Trying proxy " + (idx + 1) + "/" + proxies.length);
        loadingText.textContent = "Trying server " + (idx + 1) + "/" + proxies.length + "...";
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.timeout = 25000;
        
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              var text = xhr.responseText;
              console.log("[DailyPaper] Response received, length: " + text.length);
              
              if (text.indexOf("<entry>") !== -1) {
                var papers = parseXML(text);
                console.log("[DailyPaper] Parsed " + papers.length + " papers");
                
                if (papers.length > 0) {
                  allPapers = papers;
                  totalCount.textContent = papers.length;
                  lastUpdated.textContent = new Date().toLocaleString();
                  currentPage = 0;
                  filterPapers();
                  finishLoading();
                  return;
                }
              }
              
              console.log("[DailyPaper] Invalid response, trying next");
              tryProxy(idx + 1);
            } else {
              console.log("[DailyPaper] HTTP " + xhr.status + ", trying next");
              tryProxy(idx + 1);
            }
          }
        };
        
        xhr.onerror = function() {
          console.log("[DailyPaper] Network error, trying next");
          tryProxy(idx + 1);
        };
        
        xhr.ontimeout = function() {
          console.log("[DailyPaper] Timeout, trying next");
          tryProxy(idx + 1);
        };
        
        xhr.send();
      }
    }
    
    function parseXML(text) {
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
          var summary = summaryEl ? summaryEl.textContent.trim() : "";
          
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
              abstract: summary,
              authors: authors,
              published: published,
              categories: categories
            });
          }
        } catch (e) {
          console.log("[DailyPaper] Parse error: " + e.message);
        }
      }
      
      return papers;
    }
    
    function filterPapers() {
      var searchVal = searchInput.value.toLowerCase();
      var searchTerms = searchVal.split(/[\s,]+/).filter(function(t) { return t.length > 0; });
      var allTerms = searchTerms.concat(activeKeywords.map(function(k) { return k.toLowerCase(); }));
      var cat = categorySelect.value;
      
      displayedPapers = allPapers.filter(function(paper) {
        // Category filter
        if (cat !== "all") {
          var hasCat = false;
          for (var i = 0; i < paper.categories.length; i++) {
            if (paper.categories[i] === cat) {
              hasCat = true;
              break;
            }
          }
          if (!hasCat) return false;
        }
        
        // Keyword filter
        if (allTerms.length > 0) {
          var text = (paper.title + " " + paper.abstract + " " + paper.authors.join(" ")).toLowerCase();
          var found = false;
          for (var j = 0; j < allTerms.length; j++) {
            if (text.indexOf(allTerms[j]) !== -1) {
              found = true;
              break;
            }
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
        papersList.innerHTML = '<div class="init-message"><p>📭 No papers found. Try different filters.</p></div>';
        loadMoreContainer.style.display = "none";
        return;
      }
      
      for (var i = 0; i < toShow.length; i++) {
        var card = createCard(toShow[i], allTerms);
        papersList.appendChild(card);
      }
      
      loadMoreContainer.style.display = (end < displayedPapers.length) ? "block" : "none";
    }
    
    function createCard(paper, terms) {
      var title = escapeHTML(paper.title);
      var abstract = escapeHTML(paper.abstract);
      
      // Highlight
      for (var i = 0; i < terms.length; i++) {
        if (terms[i]) {
          var re = new RegExp("(" + escapeRegex(terms[i]) + ")", "gi");
          title = title.replace(re, '<span class="highlight">$1</span>');
          abstract = abstract.replace(re, '<span class="highlight">$1</span>');
        }
      }
      
      var date = paper.published ? new Date(paper.published).toLocaleDateString() : "N/A";
      var authorsStr = paper.authors.length > 0 ? paper.authors.join(", ") : "N/A";
      var catsStr = paper.categories.slice(0, 3).join(", ");
      var safeId = paper.id.replace(/[^a-zA-Z0-9]/g, "_");
      var absUrl = "https://arxiv.org/abs/" + paper.id;
      var pdfUrl = "https://arxiv.org/pdf/" + paper.id + ".pdf";
      
      var card = document.createElement("div");
      card.className = "paper-card";
      
      var html = '';
      html += '<h3 class="paper-title"><a href="' + absUrl + '" target="_blank">' + title + '</a></h3>';
      html += '<div class="paper-meta"><span>📅 ' + date + '</span><span>🏷️ ' + catsStr + '</span></div>';
      html += '<div class="paper-authors"><strong>Authors:</strong> ' + escapeHTML(authorsStr) + '</div>';
      html += '<div class="paper-abstract" id="abs_' + safeId + '">' + abstract + '</div>';
      html += '<button class="expand-btn" data-id="abs_' + safeId + '">Show more ▼</button>';
      html += '<div class="paper-links">';
      html += '<a href="' + absUrl + '" class="paper-link arxiv" target="_blank">📄 arXiv</a>';
      html += '<a href="' + pdfUrl + '" class="paper-link pdf" target="_blank">📥 PDF</a>';
      html += '</div>';
      
      card.innerHTML = html;
      
      // Expand button
      var btn = card.querySelector(".expand-btn");
      btn.addEventListener("click", function() {
        var targetId = this.getAttribute("data-id");
        var absEl = document.getElementById(targetId);
        if (absEl.classList.contains("expanded")) {
          absEl.classList.remove("expanded");
          this.textContent = "Show more ▼";
        } else {
          absEl.classList.add("expanded");
          this.textContent = "Show less ▲";
        }
      });
      
      return card;
    }
    
    function escapeHTML(str) {
      if (!str) return "";
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
    
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    
    function showError(msg) {
      loading.style.display = "none";
      fetchBtn.disabled = false;
      fetchBtn.textContent = "🔄 Fetch Papers";
      errorMessage.textContent = msg;
      errorMessage.style.display = "block";
    }
    
    function finishLoading() {
      loading.style.display = "none";
      fetchBtn.disabled = false;
      fetchBtn.textContent = "🔄 Fetch Papers";
    }
    
    console.log("[DailyPaper] Initialization complete!");
  });
  
})();
