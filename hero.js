// Герой по компоненту ink-orbit-hero, перенесён с React на чистый JavaScript:
// сменяющаяся строка заголовка и диалог с прогоном.
(function () {
  "use strict"

  var motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  var reduced = motion.matches
  if (motion.addEventListener) motion.addEventListener("change", function () { reduced = motion.matches })

  /* ------------------------------------------------ строка заголовка */
  var ACCENTS = ["жизнь в утопии", "как задумывали", "как вышло"]
  var acc = document.getElementById("ih-acc")
  var wordIx = 0
  setInterval(function () {
    if (reduced || document.hidden) return
    var cur = acc.firstElementChild
    cur.classList.add("ih-word-out")
    setTimeout(function () {
      wordIx = (wordIx + 1) % ACCENTS.length
      var next = document.createElement("span")
      next.className = "ih-word"
      next.textContent = ACCENTS[wordIx]
      acc.replaceChild(next, acc.firstElementChild)
    }, 420)
  }, 3600)

  /* ------------------------------------------------ диалог с прогоном */
  var STEPS = [
    { label: "ОГАС", href: "https://dzen.ru/a/arjOECN9xwWIlTs6", detail: "Задумывали сеть от предприятий до Москвы. Вышло «лоскутное одеяло» ценой в 20 миллиардов рублей." },
    { label: "Кукуруза", href: "https://dzen.ru/a/ar-zTzdT9mbPyPm9", detail: "Задумывали корм для скота, больше молока и мяса. СССР едва не утонул в початках." },
    { label: "Номенклатура", href: "https://dzen.ru/a/aq_lQMfq0jMRvxae", detail: "Задумывали общество равных. 750 тысяч жили отдельно от 280 миллионов." },
    { label: "Всё бесплатно", href: "https://dzen.ru/a/as3M9vfDGRDByFdn", detail: "Задумывали квартиру, медицину и вуз бесплатно. За всё бесплатное платил сам гражданин." },
  ]
  var PER = 1.8
  var TOTAL = STEPS.length * PER
  var CHECK = '<svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.4 4.8 9 10 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  var modal = document.getElementById("ih-modal")
  var openBtn = document.getElementById("ih-open")
  var closeBtn = document.getElementById("ih-close")
  var replayBtn = document.getElementById("ih-replay")
  var statusEl = document.getElementById("ih-status-text")
  var liveDot = document.getElementById("ih-live")
  var bar = document.getElementById("ih-bar")
  var foot = document.getElementById("ih-foot")
  var list = document.getElementById("ih-steps")
  var stepEls = STEPS.map(function (s, i) {
    var li = document.createElement("li")
    li.className = "ih-step"
    var ix = document.createElement("span")
    ix.className = "ih-step-ix"
    var box = document.createElement("div")
    var a = document.createElement("a")
    a.href = s.href
    a.target = "_blank"
    a.rel = "noopener"
    a.textContent = s.label
    var p = document.createElement("p")
    p.textContent = s.detail
    box.appendChild(a)
    box.appendChild(p)
    li.appendChild(ix)
    li.appendChild(box)
    list.appendChild(li)
    return { li: li, ix: ix, i: i, state: "" }
  })

  var demoRaf = 0
  function seconds(v) { return v.toFixed(1).replace(".", ",") + " с" }
  function paint(elapsed) {
    var done = elapsed >= TOTAL
    statusEl.textContent = (done ? "План выполнен за " : "План выполняется: ") + seconds(elapsed)
    liveDot.hidden = done
    bar.style.width = (elapsed / TOTAL) * 100 + "%"
    foot.textContent = done ? "Подробности в статьях, названия сверху - это ссылки." : "Сидите, план выполняется сам."
    replayBtn.disabled = !done
    stepEls.forEach(function (s) {
      var state = elapsed >= (s.i + 1) * PER ? "done" : elapsed >= s.i * PER ? "run" : "wait"
      if (state === s.state) return
      s.state = state
      s.li.setAttribute("data-state", state)
      if (state === "done") s.ix.innerHTML = CHECK
      else if (state === "run") s.ix.innerHTML = '<i class="ih-spin"></i>'
      else s.ix.textContent = String(s.i + 1)
    })
  }
  function play() {
    cancelAnimationFrame(demoRaf)
    if (reduced) { paint(TOTAL); return }
    var t0 = performance.now()
    var tick = function (now) {
      var e = Math.min(TOTAL, (now - t0) / 1000)
      paint(e)
      if (e < TOTAL) demoRaf = requestAnimationFrame(tick)
    }
    paint(0)
    demoRaf = requestAnimationFrame(tick)
  }
  function closeDemo() {
    if (modal.hidden) return
    cancelAnimationFrame(demoRaf)
    modal.hidden = true
    document.removeEventListener("keydown", onDemoKey)
    openBtn.focus()
  }
  function onDemoKey(e) {
    if (e.key === "Escape") { closeDemo(); return }
    if (e.key !== "Tab") return
    var f = modal.querySelectorAll("a[href],button:not([disabled])")
    var first = f[0]
    var last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
  openBtn.addEventListener("click", function () {
    modal.hidden = false
    closeBtn.focus()
    document.addEventListener("keydown", onDemoKey)
    play()
  })
  closeBtn.addEventListener("click", closeDemo)
  replayBtn.addEventListener("click", play)
  modal.addEventListener("mousedown", function (e) { if (e.target === modal) closeDemo() })
})()
