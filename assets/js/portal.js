/* HimalData shared helpers: CSV loading, chart setup, catalog rendering.
   Charts use Apache ECharts loaded from CDN on each page that needs it.
*/

(function () {
  "use strict";

  var PALETTE = ["#de7a1f", "#1e7d4f", "#c98f1b", "#2a7f62", "#7a4fa3", "#d95f43", "#3d6b99", "#8a8175"];

  function basePath() {
    // Works whether the page sits at /, /stories/, or /data/
    var p = window.location.pathname;
    if (p.indexOf("/stories/") !== -1 || p.indexOf("/data/") !== -1) return "../";
    return "";
  }

  // Minimal CSV parser: handles quoted fields, commas inside quotes.
  function parseCSV(text) {
    var rows = [], row = [], field = "", inQuotes = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else { field += c; }
      } else {
        if (c === '"') { inQuotes = true; }
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n" || c === "\r") {
          if (field !== "" || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
          if (c === "\r" && text[i + 1] === "\n") i++;
        } else { field += c; }
      }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return h.trim(); });
    return rows.slice(1).filter(function (r) { return r.length > 1 || r[0] !== ""; }).map(function (r) {
      var obj = {};
      headers.forEach(function (h, idx) { obj[h] = (r[idx] || "").trim(); });
      return obj;
    });
  }

  function loadCSV(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + url + ": " + res.status);
      return res.text();
    }).then(parseCSV);
  }

  function makeChart(el, option) {
    var chart = echarts.init(el, null, { renderer: "canvas" });
    chart.setOption(option);
    window.addEventListener("resize", function () { chart.resize(); });
    return chart;
  }

  function axisStyle() {
    return {
      axisLine: { lineStyle: { color: "#b9ae99" } },
      axisLabel: { color: "#4a443b", fontSize: 12 },
      splitLine: { lineStyle: { color: "#ece4d2", type: "dashed" } }
    };
  }

  // Renders the data catalog table from datasets/catalog.json
  function renderCatalog(tableBodyId) {
    var tbody = document.getElementById(tableBodyId);
    if (!tbody) return;
    fetch(basePath() + "datasets/catalog.json")
      .then(function (r) { return r.json(); })
      .then(function (items) {
        tbody.innerHTML = items.map(function (d) {
          var tags = (d.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
          return "<tr>" +
            "<td><strong>" + d.title + "</strong><br><span style='color:#8a8175;font-size:13px'>" + d.description + "</span></td>" +
            "<td>" + tags + "</td>" +
            "<td style='white-space:nowrap'>" + d.years + "</td>" +
            "<td>" + d.source + "</td>" +
            "<td><a class='download-link' href='" + basePath() + "datasets/" + d.file + "' download>CSV &#8595;</a></td>" +
            "</tr>";
        }).join("");
      })
      .catch(function () {
        tbody.innerHTML = "<tr><td colspan='5'>Could not load the catalog. Check that datasets/catalog.json exists.</td></tr>";
      });
  }

  window.HimalData = {
    palette: PALETTE,
    basePath: basePath,
    loadCSV: loadCSV,
    makeChart: makeChart,
    axisStyle: axisStyle,
    renderCatalog: renderCatalog
  };
})();
