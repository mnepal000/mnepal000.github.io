/* Committee dashboard — DEMO prototype. Tallies the demo ballot box
   stored in this browser's localStorage. */
(function () {
  "use strict";
  var LS_USED = "nc_demo_used_tokens_v1";
  var LS_BOX = "nc_demo_ballot_box_v1";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function $(id) { return document.getElementById(id); }
  function loadJSON(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }

  function render() {
    var box = loadJSON(LS_BOX, []);
    var used = loadJSON(LS_USED, []);
    $("turnout-line").textContent =
      "जम्मा मत: " + box.length + " / " + DEMO_VOTERS.length +
      " (Ballots cast: " + box.length + " of " + DEMO_VOTERS.length + " demo voters)";

    // tally: raceId -> sn -> count
    var tally = {};
    box.forEach(function (b) {
      var votes = b.votes || {};
      Object.keys(votes).forEach(function (rid) {
        tally[rid] = tally[rid] || {};
        votes[rid].forEach(function (sn) {
          tally[rid][sn] = (tally[rid][sn] || 0) + 1;
        });
      });
    });

    var res = $("results");
    res.innerHTML = "";
    NC_BALLOT.races.forEach(function (race) {
      var card = document.createElement("div");
      card.className = "card";
      var title = race.position + (race.category ? " (" + race.category + ")" : "");
      var html = "<h2>" + esc(title) + ' <span class="small muted">' + race.seats + " पद</span></h2>";
      if (race.unopposed) {
        var w = race.candidates[0];
        html += '<div class="winner-card"><strong>निर्विरोध निर्वाचित:</strong> ' +
          esc(w.name) + ' <span class="small muted">' + esc(w.nc_id) + "</span></div>";
      } else {
        var t = tally[race.id] || {};
        var rows = race.candidates.map(function (c) {
          return { c: c, votes: t[c.sn] || 0 };
        }).sort(function (a, b) { return b.votes - a.votes || a.c.sn - b.c.sn; });
        html += '<table class="results"><tr><th>क्र.</th><th>उम्मेदवार</th><th>NC ID</th><th>मत</th></tr>';
        rows.forEach(function (r, i) {
          var win = i < race.seats && r.votes > 0;
          html += '<tr' + (win ? ' class="winner"' : "") + "><td>" + r.c.sn + "</td><td>" +
            esc(r.c.name) + (win ? " ✓" : "") + "</td><td>" + esc(r.c.nc_id) + "</td><td>" +
            r.votes + "</td></tr>";
        });
        html += "</table>";
        if (!box.length) html += '<p class="muted small">अहिलेसम्म कुनै मत छैन। No ballots yet.</p>';
      }
      card.innerHTML = html;
      res.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("code-hint").textContent = DEMO_COMMITTEE_CODE;
    $("btn-unlock").addEventListener("click", function () {
      var v = $("committee-code").value.trim();
      if (v === DEMO_COMMITTEE_CODE) {
        $("gate").style.display = "none";
        $("dashboard").style.display = "";
        render();
      } else {
        var e = $("code-error");
        e.textContent = "कोड मिलेन। Incorrect code.";
        e.style.display = "";
      }
    });
    $("committee-code").addEventListener("keydown", function (e) {
      if (e.key === "Enter") $("btn-unlock").click();
    });
    $("btn-reset").addEventListener("click", function () {
      if (confirm("सबै डेमो मत र टोकन मेटाउने? Clear all demo ballots and used tokens?")) {
        localStorage.removeItem(LS_BOX);
        localStorage.removeItem(LS_USED);
        render();
      }
    });
  });
})();
