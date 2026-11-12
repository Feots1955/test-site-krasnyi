// Герой по компоненту ink-orbit-hero, перенесён с React на чистый JavaScript:
// сменяющаяся строка заголовка.
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
})()
