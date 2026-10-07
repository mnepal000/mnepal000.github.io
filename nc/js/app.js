/* NC Convention Voting — DEMO prototype app logic.
   Demo only: voter roll is fictitious, ballot box is this browser's
   localStorage. A production system must do all of this server-side. */
(function () {
  "use strict";

  var LS_USED = "nc_demo_used_tokens_v1";
  var LS_BOX = "nc_demo_ballot_box_v1";

  var state = {
    voter: null,
    selections: {},   // raceId -> array of candidate sn
    raceOrder: [],    // votable race ids in nav order
    currentRace: null
  };

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
  function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function show(viewId) {
    ["view-login", "view-ballot", "view-review", "view-receipt"].forEach(function (v) {
      $(v).style.display = (v === viewId) ? "" : "none";
    });
    window.scrollTo(0, 0);
  }

  /* ---------- demo sign-in links ---------- */
  function baseURL() {
    var u = window.location.href.split("?")[0].split("#")[0];
    return u;
  }
  function renderDemoLinks() {
    var box = $("demo-links");
    box.innerHTML = "";
    DEMO_VOTERS.forEach(function (v) {
      var a = document.createElement("a");
      a.className = "token-link";
      a.href = baseURL() + "?token=" + encodeURIComponent(v.token);
      var label = document.createElement("span");
      label.textContent = v.name + " (" + v.nc_id + ") — single sign-in link";
      var small = document.createElement("small");
      small.textContent = a.href;
      a.appendChild(label);
      a.appendChild(small);
      box.appendChild(a);
    });
    $("committee-code-hint").textContent = DEMO_COMMITTEE_CODE;
  }

  function getQueryToken() {
    var m = /[?&]token=([^&#]+)/.exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function findVoter(token) {
    for (var i = 0; i < DEMO_VOTERS.length; i++) {
      if (DEMO_VOTERS[i].token === token) return DEMO_VOTERS[i];
    }
    return null;
  }

  function loginError(msg) {
    var e = $("login-error");
    e.textContent = msg;
    e.style.display = msg ? "" : "none";
  }

  function attemptLogin(token, name, ncId) {
    loginError("");
    var voter = findVoter((token || "").trim());
    if (!voter) { loginError("टोकन मिलेन। Token not recognized."); return; }
    if (name && name.trim() !== voter.name && name.trim() !== voter.name_en) {
      loginError("नाम टोकनसँग मिलेन। Name does not match this token."); return;
    }
    if (ncId && ncId.trim().toUpperCase() !== voter.nc_id.toUpperCase()) {
      loginError("एनसी मतदाता नं. मिलेन। Voter ID does not match this token."); return;
    }
    var used = loadJSON(LS_USED, []);
    if (used.indexOf(voter.token) !== -1) {
      loginError("यो टोकन प्रयोग भइसक्यो (एकल प्रयोग मात्र)। This single-use token was already used."); return;
    }
    state.voter = voter;
    state.selections = {};
    $("voter-line").textContent = voter.name + " · " + voter.nc_id;
    buildBallot();
    show("view-ballot");
    // clean token from URL without reload
    try { window.history.replaceState({}, document.title, baseURL()); } catch (e) {}
  }

  /* ---------- ballot ---------- */
  function votableRaces() {
    return NC_BALLOT.races.filter(function (r) { return !r.unopposed; });
  }
  function raceById(id) {
    for (var i = 0; i < NC_BALLOT.races.length; i++) {
      if (NC_BALLOT.races[i].id === id) return NC_BALLOT.races[i];
    }
    return null;
  }
  function groupOf(race) {
    var p = race.position || "";
    if (/^(सभापति|बरिष्ठ उपसभापति|उपसभापति|महामन्त्री|सहमहामन्त्री|सह-महामन्त्री)/.test(p)) return "पदाधिकारी (Office bearers)";
    var m = /^(केन्द्रीय सदस्य)(.*)$/.exec(p);
    if (m) {
      var rest = (m[2] || "").replace(/^[\s(]+|[)\s]+$/g, "").trim();
      return rest ? "केन्द्रीय सदस्य — " + rest : "केन्द्रीय सदस्य";
    }
    return "अन्य";
  }

  function buildBallot() {
    var nav = $("race-nav");
    nav.innerHTML = "";
    var picker = $("race-picker-mobile");
    picker.innerHTML = "";
    state.raceOrder = [];
    var lastGroup = null, lastPickerGroup = null, optgroup = null;
    NC_BALLOT.races.forEach(function (race) {
      var g = groupOf(race);
      if (g !== lastGroup) {
        var gh = document.createElement("div");
        gh.className = "nav-group";
        gh.textContent = g;
        nav.appendChild(gh);
        lastGroup = g;
      }
      if (g !== lastPickerGroup) {
        optgroup = document.createElement("optgroup");
        optgroup.label = g;
        picker.appendChild(optgroup);
        lastPickerGroup = g;
      }
      var label = race.position + (race.category ? " · " + race.category : "");
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.race = race.id;
      b.innerHTML = '<span class="tick" style="display:none">✓ </span>' + esc(label);
      if (race.unopposed) {
        b.innerHTML += ' <span class="small muted">(निर्विरोध)</span>';
      }
      b.addEventListener("click", function () { showRace(race.id); });
      nav.appendChild(b);
      var o = document.createElement("option");
      o.value = race.id;
      o.textContent = label + (race.unopposed ? " (निर्विरोध)" : "");
      optgroup.appendChild(o);
      if (!race.unopposed) state.raceOrder.push(race.id);
    });
    showRace(state.raceOrder[0]);
    updateProgress();
  }

  function showRace(raceId) {
    state.currentRace = raceId;
    var picker = $("race-picker-mobile");
    if (picker) picker.value = raceId;
    var race = raceById(raceId);
    var navBtns = $("race-nav").querySelectorAll("button[data-race]");
    for (var i = 0; i < navBtns.length; i++) {
      navBtns[i].classList.toggle("active", navBtns[i].dataset.race === raceId);
    }
    var d = $("race-detail");
    d.innerHTML = "";
    var head = document.createElement("div");
    head.className = "race-head";
    var title = race.position + (race.category ? " (" + race.category + ")" : "");
    head.innerHTML = "<h2>" + esc(title) + "</h2>" +
      '<div><span class="seats-pill">' + race.seats + " पद (seats)" + "</span> " +
      '<span class="small muted">' + esc(race.position_en || "") + "</span></div>";
    d.appendChild(head);

    if (race.unopposed) {
      var w = race.candidates[0];
      var wc = document.createElement("div");
      wc.className = "winner-card";
      wc.innerHTML = "<strong>निर्विरोध निर्वाचित (Elected unopposed)</strong><br>" +
        esc(w.name) + ' <span class="id">' + esc(w.nc_id) + "</span>";
      d.appendChild(wc);
      return;
    }

    var searchWrap = document.createElement("div");
    searchWrap.innerHTML = '<label class="field" style="margin-top:0">उम्मेदवार खोज्नुहोस् (Search candidates)' +
      '<input type="text" id="cand-search" placeholder="नाम लेख्नुहोस्…" autocomplete="off"></label>';
    d.appendChild(searchWrap);
    var list = document.createElement("div");
    list.id = "cand-list";
    d.appendChild(list);

    var sel = state.selections[raceId] || [];
    function renderList(filter) {
      list.innerHTML = "";
      var shown = 0;
      race.candidates.forEach(function (c) {
        if (filter && c.name.indexOf(filter) === -1) return;
        shown++;
        var row = document.createElement("label");
        row.className = "cand" + (sel.indexOf(c.sn) !== -1 ? " selected" : "");
        var input = document.createElement("input");
        input.type = race.seats === 1 ? "radio" : "checkbox";
        input.name = "race-" + raceId;
        input.checked = sel.indexOf(c.sn) !== -1;
        input.addEventListener("change", function () {
          if (race.seats === 1) {
            state.selections[raceId] = [c.sn];
          } else {
            var arr = state.selections[raceId] || [];
            if (input.checked) {
              if (arr.length >= race.seats) {
                input.checked = false;
                alert("अधिकतम " + race.seats + " जना मात्र छान्न मिल्छ। You may select at most " + race.seats + ".");
                return;
              }
              arr.push(c.sn);
            } else {
              arr = arr.filter(function (x) { return x !== c.sn; });
            }
            state.selections[raceId] = arr;
          }
          sel = state.selections[raceId] || [];
          renderList($("cand-search").value.trim());
          updateProgress();
          markNavDone();
        });
        var txt = document.createElement("span");
        txt.innerHTML = '<span class="nm">' + esc(c.sn) + ". " + esc(c.name) + "</span><br>" +
          '<span class="id">NC ID: ' + esc(c.nc_id) + "</span>";
        row.appendChild(input);
        row.appendChild(txt);
        list.appendChild(row);
      });
      if (!shown) {
        list.innerHTML = '<p class="muted">कुनै उम्मेदवार भेटिएन। No candidates match.</p>';
      }
      var counter = document.createElement("p");
      counter.className = "small muted";
      counter.textContent = "छनोट: " + sel.length + " / " + race.seats + " (Selected)";
      list.insertBefore(counter, list.firstChild);
    }
    $("cand-search").addEventListener("input", function (e) {
      renderList(e.target.value.trim());
    });
    renderList("");
    // Make the race change visible: scroll the race detail back into view.
    try { d.scrollIntoView({ block: "start" }); } catch (e) { window.scrollTo(0, 0); }
  }

  function markNavDone() {
    var navBtns = $("race-nav").querySelectorAll("button[data-race]");
    for (var i = 0; i < navBtns.length; i++) {
      (function (btn) {
        var race = raceById(btn.dataset.race);
        if (!race || race.unopposed) return;
        var sel = state.selections[race.id] || [];
        var tick = btn.querySelector(".tick");
        var done = sel.length > 0;
        btn.classList.toggle("done", done);
        if (tick) tick.style.display = done ? "" : "none";
      })(navBtns[i]);
    }
  }

  function updateProgress() {
    var done = 0;
    state.raceOrder.forEach(function (id) {
      if ((state.selections[id] || []).length > 0) done++;
    });
    $("progress-label").textContent =
      "प्रगति: " + done + " / " + state.raceOrder.length + " दौडमा मतदान (races with selections)";
    $("progress-fill").style.width = (state.raceOrder.length ? (done / state.raceOrder.length * 100) : 0) + "%";
  }

  function stepRace(dir) {
    var i = state.raceOrder.indexOf(state.currentRace);
    var n = i + dir;
    if (n >= 0 && n < state.raceOrder.length) showRace(state.raceOrder[n]);
  }

  /* ---------- review & submit ---------- */
  function candName(race, sn) {
    for (var i = 0; i < race.candidates.length; i++) {
      if (race.candidates[i].sn === sn) return race.candidates[i].name;
    }
    return "?";
  }
  function buildReview() {
    var box = $("review-list");
    box.innerHTML = "";
    state.raceOrder.forEach(function (id) {
      var race = raceById(id);
      var sel = state.selections[id] || [];
      var div = document.createElement("div");
      div.className = "review-race";
      var names = sel.length
        ? sel.map(function (sn) { return candName(race, sn); }).join(", ")
        : "— (छनोट छैन / no selection)";
      div.innerHTML = "<h3>" + esc(race.position + (race.category ? " · " + race.category : "")) +
        ' <span class="small muted">(' + race.seats + " पद)</span></h3>" +
        "<div>" + esc(names) + "</div>";
      box.appendChild(div);
    });
  }

  function submitBallot() {
    var box = loadJSON(LS_BOX, []);
    var receipt = "";
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (var i = 0; i < 8; i++) receipt += chars.charAt(Math.floor(Math.random() * chars.length));
    // Demo privacy: store ballot without voter name; token recorded only as "used".
    box.push({ receipt: receipt, at: new Date().toISOString(), votes: state.selections });
    saveJSON(LS_BOX, box);
    var used = loadJSON(LS_USED, []);
    used.push(state.voter.token);
    saveJSON(LS_USED, used);
    $("receipt-code").textContent = receipt;
    show("view-receipt");
  }

  /* ---------- wire up ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderDemoLinks();
    // Wire every button first, so the token auto-login path below gets working buttons too.
    $("btn-login").addEventListener("click", function () {
      attemptLogin($("login-token").value, $("login-name").value, $("login-ncid").value);
    });
    $("race-picker-mobile").addEventListener("change", function (e) {
      showRace(e.target.value);
    });
    $("btn-logout").addEventListener("click", function () {
      state.voter = null; state.selections = {};
      show("view-login");
    });
    $("btn-prev-race").addEventListener("click", function () { stepRace(-1); });
    $("btn-next-race").addEventListener("click", function () { stepRace(1); });
    $("btn-review").addEventListener("click", function () { buildReview(); show("view-review"); });
    $("btn-back-ballot").addEventListener("click", function () { show("view-ballot"); });
    $("btn-submit").addEventListener("click", function () {
      if (confirm("मत पेश गर्ने? Submit your ballot? This demo records it in this browser only.")) submitBallot();
    });
    $("btn-done").addEventListener("click", function () {
      state.voter = null; state.selections = {};
      $("login-name").value = ""; $("login-ncid").value = ""; $("login-token").value = "";
      show("view-login");
    });
    // Token auto-login runs last, after all buttons are wired.
    var qt = getQueryToken();
    if (qt) {
      $("login-token").value = qt;
      var v = findVoter(qt);
      if (v) { $("login-name").value = v.name; $("login-ncid").value = v.nc_id; }
      attemptLogin(qt, "", "");
    }
  });
})();
