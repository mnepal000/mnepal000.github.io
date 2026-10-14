/* प्राइमरी मतपत्र तर्क (Ballot logic) : एकल र बहु-सिट दौड दुवै */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var voterLine = document.getElementById("voterLine");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var params = new URLSearchParams(window.location.search);
  var code = params.get("v");
  var voter = null;
  for (var i = 0; i < DEMO.voters.length; i++) {
    if (DEMO.voters[i].code === code) { voter = DEMO.voters[i]; break; }
  }

  function votedKey() { return "lpd_voted_" + code; }
  function getReceipt() {
    try { return localStorage.getItem(votedKey()); } catch (e) { return null; }
  }

  if (!voter) {
    voterLine.textContent = "";
    app.innerHTML =
      '<div class="card"><h2>अमान्य मतदाता कोड <span class="en">(Invalid voter code)</span></h2>' +
      '<p>मतदान गर्न मुख्य पृष्ठबाट आफ्नो डेमो मतदाता छान्नुहोस्।</p>' +
      '<a class="btn btn-primary" href="index.html">मुख्य पृष्ठ <span class="en">(Home)</span></a></div>';
    return;
  }

  voterLine.innerHTML = esc(voter.name) + " : वडा नं. " + voter.ward +
    ' <span class="en">(Ward ' + voter.ward + ")</span>";

  var existing = getReceipt();
  if (existing) {
    app.innerHTML =
      '<div class="card receipt"><h2>मतदान भइसक्यो <span class="en">(Already voted)</span></h2>' +
      '<p>तपाईंले यस डेमोमा मतदान गरिसक्नुभएको छ। <span class="en">(You have already voted in this demo.)</span></p>' +
      '<p>रसिद नम्बर <span class="en">(Receipt no.)</span>:</p>' +
      '<div class="code">' + esc(existing) + '</div>' +
      '<a class="btn btn-ghost" href="index.html">मुख्य पृष्ठ <span class="en">(Home)</span></a></div>';
    return;
  }

  var state = { raceIdx: 0, selections: {}, mode: "vote", filter: "" };

  function race() { return DEMO.races[state.raceIdx]; }
  function totalRaces() { return DEMO.races.length; }
  function seatsOf(r) { return r.seats || 1; }
  function picksOf(raceId) {
    var p = state.selections[raceId];
    if (Array.isArray(p)) return p;
    return p ? [p] : [];
  }
  function candName(raceId, candId) {
    for (var r = 0; r < DEMO.races.length; r++) {
      if (DEMO.races[r].id !== raceId) continue;
      var cs = DEMO.races[r].candidates;
      for (var c = 0; c < cs.length; c++) {
        if (cs[c].id === candId) return cs[c].name;
      }
    }
    return "";
  }

  function renderJump() {
    var html = '<select class="race-jump" id="raceJump" aria-label="दौड छान्नुहोस् (Choose race)">';
    DEMO.races.forEach(function (r, idx) {
      html += '<option value="' + idx + '"' + (idx === state.raceIdx ? " selected" : "") + ">" +
        esc(r.title) + "</option>";
    });
    return html + "</select>";
  }

  function candCard(r, c, sel) {
    var seats = seatsOf(r);
    var inputType = seats > 1 ? "checkbox" : "radio";
    return '<label class="cand"><input type="' + inputType + '" name="pick" value="' + c.id + '"' +
      (sel.indexOf(c.id) !== -1 ? " checked" : "") + ">" +
      '<span class="box"><span class="radio"></span>' +
      '<span><span class="cname">' + esc(c.name) + "</span>" +
      '<span class="tag">काल्पनिक <span class="en">(Fictional)</span></span></span></span></label>';
  }

  function renderRace() {
    var r = race();
    var seats = seatsOf(r);
    var sel = picksOf(r.id);
    var html = '<div class="card">';
    html += '<p class="progress">दौड ' + (state.raceIdx + 1) + " / " + totalRaces() +
      ' <span class="en">(Race ' + (state.raceIdx + 1) + " of " + totalRaces() + ")</span></p>";
    html += renderJump();
    html += '<h2 class="race-title">' + esc(r.title) + ' <span class="en">(' + esc(r.titleEn) + ")</span></h2>";
    html += '<p class="muted">' + esc(r.note) + "</p>";
    if (seats > 1) {
      html += '<p><strong>अधिकतम ' + seats + ' जनासम्म छान्नुहोस् ' +
        '<span class="en">(Choose up to ' + seats + ")</span></strong></p>";
    }
    html += '<input class="search" id="candSearch" type="search" placeholder="उम्मेदवार खोज्नुहोस् (Search candidates)" value="' + esc(state.filter) + '">';
    html += '<div class="cand-list" id="candList">';
    r.candidates.forEach(function (c) {
      if (state.filter && c.name.indexOf(state.filter) === -1) return;
      html += candCard(r, c, sel);
    });
    html += "</div>";
    html += '<p class="warn" id="pickWarn"></p>';
    html += '<div class="race-nav">';
    if (state.raceIdx > 0) {
      html += '<button class="btn btn-ghost" id="btnPrev">&larr; अघिल्लो <span class="en">(Back)</span></button>';
    }
    if (state.raceIdx < totalRaces() - 1) {
      html += '<button class="btn btn-primary" id="btnNext">अर्को <span class="en">(Next)</span> &rarr;</button>';
    } else {
      html += '<button class="btn btn-primary" id="btnReview">समीक्षा <span class="en">(Review)</span> &rarr;</button>';
    }
    html += "</div></div>";
    app.innerHTML = html;

    document.getElementById("raceJump").addEventListener("change", function (e) {
      state.raceIdx = parseInt(e.target.value, 10);
      state.filter = "";
      renderRace();
    });
    document.getElementById("candSearch").addEventListener("input", function (e) {
      state.filter = e.target.value.trim();
      renderListOnly(true);
    });
    bindPickInputs(r);

    var prev = document.getElementById("btnPrev");
    if (prev) prev.addEventListener("click", function () {
      state.raceIdx--; state.filter = ""; renderRace();
    });
    var next = document.getElementById("btnNext");
    if (next) next.addEventListener("click", function () { advance(false); });
    var rev = document.getElementById("btnReview");
    if (rev) rev.addEventListener("click", function () { advance(true); });
  }

  function bindPickInputs(r) {
    app.querySelectorAll('input[name="pick"]').forEach(function (p) {
      p.addEventListener("change", function () { toggleSelect(r, p); });
    });
  }

  function syncChecks(r) {
    var sel = picksOf(r.id);
    app.querySelectorAll('input[name="pick"]').forEach(function (n) {
      n.checked = sel.indexOf(n.value) !== -1;
    });
  }

  function toggleSelect(r, input) {
    var seats = seatsOf(r);
    var sel = picksOf(r.id);
    var id = input.value;
    var at = sel.indexOf(id);
    var warnEl = document.getElementById("pickWarn");
    if (at !== -1) {
      if (seats === 1) { syncChecks(r); return; }
      sel.splice(at, 1);
    } else {
      if (seats === 1) { sel = [id]; }
      else {
        if (sel.length >= seats) {
          warnEl.textContent = "अधिकतम " + seats + " जना मात्र छान्न सकिन्छ। " +
            "(You can choose up to " + seats + ".)";
          syncChecks(r);
          return;
        }
        sel.push(id);
      }
    }
    state.selections[r.id] = sel;
    warnEl.textContent = "";
    syncChecks(r);
  }

  function renderListOnly(keepFilterFocus) {
    var r = race();
    var sel = picksOf(r.id);
    var list = document.getElementById("candList");
    var html = "";
    r.candidates.forEach(function (c) {
      if (state.filter && c.name.indexOf(state.filter) === -1) return;
      html += candCard(r, c, sel);
    });
    list.innerHTML = html;
    bindPickInputs(r);
    if (keepFilterFocus) {
      var s = document.getElementById("candSearch");
      s.focus();
      s.setSelectionRange(s.value.length, s.value.length);
    }
  }

  function advance(toReview) {
    var r = race();
    var sel = picksOf(r.id);
    if (sel.length === 0) {
      document.getElementById("pickWarn").textContent =
        "कृपया कम्तीमा एक उम्मेदवार छान्नुहोस्। (Please choose at least one candidate.)";
      return;
    }
    if (toReview) { state.mode = "review"; renderReview(); }
    else { state.raceIdx++; state.filter = ""; renderRace(); }
  }

  function renderReview() {
    var html = '<div class="card"><h2>आफ्नो मत समीक्षा गर्नुहोस् <span class="en">(Review your ballot)</span></h2>' +
      '<p class="muted">सबै छनोट जाँच्नुहोस्। सच्याउनु परे <strong>सच्याउनुहोस्</strong> थिच्नुहोस्।</p>';
    DEMO.races.forEach(function (r, idx) {
      var picks = picksOf(r.id).map(function (id) { return candName(r.id, id); }).join(", ");
      html += '<div class="review-row"><div><div class="rname">' + esc(r.title) +
        ' <span class="en">(' + esc(r.titleEn) + ")</span></div>" +
        '<div class="rpick">' + esc(picks) + "</div></div>" +
        '<button class="linklike" data-edit="' + idx + '">सच्याउनुहोस् <span class="en">(Edit)</span></button></div>';
    });
    html += '<div class="btn-row">' +
      '<button class="btn btn-ghost" id="btnBackToVote">&larr; मतपत्रमा फर्कनुहोस् <span class="en">(Back to ballot)</span></button>' +
      '<button class="btn btn-accent" id="btnSubmit">मत पेश गर्नुहोस् <span class="en">(Submit vote)</span></button>' +
      "</div></div>";
    app.innerHTML = html;

    app.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.raceIdx = parseInt(b.getAttribute("data-edit"), 10);
        state.mode = "vote"; state.filter = ""; renderRace();
      });
    });
    document.getElementById("btnBackToVote").addEventListener("click", function () {
      state.mode = "vote"; renderRace();
    });
    document.getElementById("btnSubmit").addEventListener("click", function () {
      askConfirm(
        "मत पेश गर्ने? (Submit your vote?)",
        "के तपाईं आफ्नो मत पेश गर्न निश्चित हुनुहुन्छ? (Are you sure you want to submit your vote?)",
        "हो, पेश गर्नुहोस् (Yes, submit)",
        function () {
          askConfirm(
            "अन्तिम चेतावनी (Final warning)",
            "यो अन्तिम निर्णय हो। पेश गरेपछि मत सच्याउन सकिँदैन। (This is final. You cannot change your vote after submitting.)",
            "पक्का, पेश गर्नुहोस् (Confirm, submit)",
            submitBallot
          );
        }
      );
    });
  }

  var modalBack = document.getElementById("modalBack");
  var modalTitle = document.getElementById("modalTitle");
  var modalText = document.getElementById("modalText");
  var modalYes = document.getElementById("modalYes");
  var modalNo = document.getElementById("modalNo");

  function askConfirm(title, text, yesLabel, onYes) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalYes.innerHTML = esc(yesLabel);
    modalBack.classList.add("open");
    var done = function (fn) {
      modalBack.classList.remove("open");
      modalYes.onclick = null; modalNo.onclick = null;
      if (fn) fn();
    };
    modalYes.onclick = function () { done(onYes); };
    modalNo.onclick = function () { done(null); };
  }

  function submitBallot() {
    var receipt = "NP-" + Date.now().toString(36).toUpperCase().slice(-6);
    var ballot = {
      code: code, name: voter.name, ward: voter.ward,
      selections: state.selections, receipt: receipt, ts: new Date().toISOString()
    };
    try {
      var all = JSON.parse(localStorage.getItem("lpd_ballots") || "[]");
      all.push(ballot);
      localStorage.setItem("lpd_ballots", JSON.stringify(all));
      localStorage.setItem(votedKey(), receipt);
    } catch (e) { /* भण्डारण असफल भए पनि रसिद देखाउने */ }
    app.innerHTML =
      '<div class="card receipt"><h2>धन्यवाद! <span class="en">(Thank you!)</span></h2>' +
      '<p>तपाईंको मत दर्ता भयो। <span class="en">(Your vote has been recorded.)</span></p>' +
      "<p>रसिद नम्बर <span class='en'>(Receipt no.)</span>:</p>" +
      '<div class="code">' + esc(receipt) + "</div>" +
      '<p class="muted small">यो डेमो रसिद हो। मत तपाईंको ब्राउजरमा मात्र सुरक्षित छ।</p>' +
      '<a class="btn btn-ghost" href="index.html">मुख्य पृष्ठ <span class="en">(Home)</span></a></div>';
    window.scrollTo(0, 0);
  }

  renderRace();
})();
