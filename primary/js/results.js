/* नतिजा पृष्ठ तर्क (Results logic) : समिति कोडबाट मात्र देखिने */
(function () {
  "use strict";

  var app = document.getElementById("app");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function getBallots() {
    try { return JSON.parse(localStorage.getItem("lpd_ballots") || "[]"); }
    catch (e) { return []; }
  }

  function renderGate(error) {
    app.innerHTML =
      '<div class="card"><h2>निर्वाचन समिति कोड <span class="en">(Committee code)</span></h2>' +
      "<p>नतिजा हेर्न निर्वाचन समितिको कोड हाल्नुहोस्। <span class='en'>(Enter the election committee code to view results.)</span></p>" +
      '<input class="code-input" id="codeInput" type="text" autocomplete="off" placeholder="जस्तै: SAMITI-2083">' +
      (error ? '<p class="warn">' + esc(error) + "</p>" : "") +
      '<button class="btn btn-primary" id="btnView">नतिजा हेर्नुहोस् <span class="en">(View results)</span></button>' +
      '<p class="muted small">डेमो कोड: <strong>SAMITI-2083</strong></p></div>';

    var tryView = function () {
      var val = document.getElementById("codeInput").value.trim();
      if (val === DEMO.committeeCode) { renderResults(); }
      else { renderGate("कोड मिलेन। कृपया सही कोड हाल्नुहोस्। (Wrong code. Please try again.)"); }
    };
    document.getElementById("btnView").addEventListener("click", tryView);
    document.getElementById("codeInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryView();
    });
  }

  function renderResults() {
    var ballots = getBallots();
    var html = '<div class="card"><h2>प्राइमरी नतिजा <span class="en">(Primary results)</span></h2>' +
      "<p>कुल खसेको मतपत्र <span class='en'>(Total ballots)</span>: <strong>" + ballots.length + "</strong></p>";

    if (ballots.length === 0) {
      html += '<p class="muted">अहिलेसम्म कुनै मत खसेको छैन। पहिले मतदान गर्नुहोस्। <span class="en">(No votes cast yet.)</span></p>';
    }

    DEMO.races.forEach(function (r) {
      var seats = r.seats || 1;
      var counts = {};
      r.candidates.forEach(function (c) { counts[c.id] = 0; });
      ballots.forEach(function (b) {
        var p = b.selections && b.selections[r.id];
        var arr = Array.isArray(p) ? p : (p ? [p] : []);
        arr.forEach(function (id) {
          if (counts.hasOwnProperty(id)) counts[id]++;
        });
      });
      var rows = r.candidates.map(function (c) {
        return { id: c.id, name: c.name, votes: counts[c.id] };
      }).sort(function (a, b) { return b.votes - a.votes; });
      var winIds = {};
      rows.slice(0, seats).forEach(function (row) {
        if (row.votes > 0) winIds[row.id] = true;
      });

      html += "<h3>" + esc(r.title) + ' <span class="en">(' + esc(r.titleEn) + ")</span></h3>";
      html += '<div class="table-scroll"><table class="results"><thead><tr>' +
        "<th>उम्मेदवार <span class='en'>(Candidate)</span></th>" +
        "<th>मत <span class='en'>(Votes)</span></th>" +
        "<th>प्रतिशत <span class='en'>(%)</span></th></tr></thead><tbody>";
      rows.forEach(function (row) {
        var pct = ballots.length ? Math.round((row.votes / ballots.length) * 100) : 0;
        var win = winIds[row.id] ? ' class="winner"' : "";
        html += "<tr" + win + "><td>" + esc(row.name) +
          (win ? ' <span class="tag">विजेता <span class="en">(Winner)</span></span>' : "") +
          "</td><td>" + row.votes + "</td><td>" + pct + "%</td></tr>";
      });
      html += "</tbody></table></div>";
      if (seats > 1) {
        html += '<p class="muted small">यो दौडमा ' + seats + ' सिट भएकाले शीर्ष ' + seats +
          ' उम्मेदवार विजयी हुन्छन्। <span class="en">(Top ' + seats + " win this multi-seat race.)</span></p>";
      }
    });

    html += '<div class="btn-row">' +
      '<button class="btn btn-ghost" id="btnReset">डेमो रिसेट गर्नुहोस् <span class="en">(Reset demo)</span></button>' +
      "</div>" +
      '<p class="muted small">रिसेटले यस ब्राउजरका सबै डेमो मत मेटाउँछ। <span class="en">(Reset clears all demo votes in this browser.)</span></p></div>';
    app.innerHTML = html;
    window.scrollTo(0, 0);

    document.getElementById("btnReset").addEventListener("click", function () {
      if (!window.confirm("सबै डेमो मत मेटाउने? (Delete all demo votes?)")) return;
      try {
        localStorage.removeItem("lpd_ballots");
        DEMO.voters.forEach(function (v) {
          localStorage.removeItem("lpd_voted_" + v.code);
        });
      } catch (e) { /* बेवास्ता */ }
      renderResults();
    });
  }

  renderGate(null);
})();
