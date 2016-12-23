var Note = function (selector, tuner) {
  this.tuner = tuner
  this.$root = document.querySelector(selector)
  this.$mask = this.$root.querySelector('.note-mask')
  this.$note = this.$root.querySelector('.note-name')
  this.$noteNames = this.$root.querySelector('.note-names')
  this.$frequency = this.$root.querySelector('.note-frequency')
  this.$notes = []
  this.$notesMap = {}
  this.initNotes()
}

Note.prototype.initNotes = function () {
  var minNumbered = 2
  var maxNumbered = 5
  for (var numbered = minNumbered; numbered <= maxNumbered; numbered += 1) {
    for (var n = 0; n < 12; n += 1) {
      var $note = document.createElement('div')
      $note.className = 'note-name'
      $note.dataset.name = this.tuner.noteStrings[n]
      $note.dataset.value = 12 * (numbered + 1) + n
      $note.dataset.numbered = numbered
      $note.dataset.frequency = this.tuner.getStandardFrequency($note.dataset.value)
      $note.innerHTML = $note.dataset.name[0] +
        '<span class="note-sharp">' + ($note.dataset.name[1] || '') + '</span>' +
        '<span class="note-numbered">' + $note.dataset.numbered + '</span>'
      this.$noteNames.appendChild($note)
      this.$notes.push($note)
      this.$notesMap[$note.dataset.value] = $note
    }
  }

  var self = this
  this.$notes.forEach(function ($note) {
    $note.addEventListener('click', function () {
      var $active = self.$noteNames.querySelector('.active')
      if ($active == this) {
        self.tuner.stop()
        $active.classList.remove('active')
      } else {
        self.tuner.play(this.dataset.frequency)
        self.update($note.dataset)
      }
    })
  })
}

Note.prototype.active = function ($note) {
  this.clearActive()
  $note.classList.add('active')
  this.$noteNames.scrollLeft = $note.offsetLeft - (this.$noteNames.clientWidth - $note.clientWidth) / 2
}

Note.prototype.clearActive = function () {
  var $active = this.$noteNames.querySelector('.active')
  if ($active) {
    $active.classList.remove('active')
  }
}

Note.prototype.update = function (note) {
  if (note.value in this.$notesMap) {
    this.active(this.$notesMap[note.value])
    this.$frequency.childNodes[0].textContent = parseFloat(note.frequency).toFixed(1)
  }
}

Note.prototype.setAutoMode = function (active) {
  if (active) {
    this.$mask.style.display = 'block'
  } else {
    this.clearActive()
    this.$mask.style.display = 'none'
  }
}
