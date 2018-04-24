function GameManager () {
  this.score = 0
  this.matrix = []
  this.moveAble = false
}

// To initialize the game
GameManager.prototype.init = function () {
  this.score = 0
  this.moveAble = false
  this.updateScore(0)

  // Remove all the numberCells
  removeElementsByClass('number-cell')

  for (var i = 0; i < 4; i++) {
    this.matrix[i] = []
    for (var j = 0; j < 4; j++) {
      this.matrix[i][j] = {}
      this.matrix[i][j].value = 0
    }
  }

  // Get the two initial tiles
  var i1, i2, j1, j2
  do {
    i1 = getRandom(3)
    i2 = getRandom(3)
    j1 = getRandom(3)
    j2 = getRandom(3)
  } while (i1 === i2 && j1 === j2)

  this.updateMatrix(2, i1, j1)
  this.updateMatrix(2, i2, j2)
  this.drawCell(i1, j1)
  this.drawCell(i2, j2)

  this.keyboard()
}

GameManager.prototype.drawCell = function (i, j) {
  var value = this.matrix[i][j].value
  var numberCell = document.createElement('div')
  var numberCellInner = document.createElement('div')
  var numberSpan = document.createElement('span')
  var container = document.getElementsByClassName('container')[0]
  numberCell.classList.add('number-cell')
  numberCell.classList.add('p' + i + j)
  numberCellInner.classList.add('number-cell-inner')
  numberCellInner.classList.add('n' + value)
  numberSpan.innerText = value
  numberCellInner.appendChild(numberSpan)
  numberCell.appendChild(numberCellInner)
  container.appendChild(numberCell)
}

// Listen to keyboard
GameManager.prototype.keyboard = function () {
  var that = this
  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]
    var direction = that.direction
    var keyCode = e.keyCode

    switch (keyCode) {
      case 39: // Right
        that.moveAble = false
        that.moveRight()
        that.newCell()
        that.checkLose()
        break
      case 40: // Down
        that.moveAble = false
        that.moveDown()
        that.newCell()
        that.checkLose()
        break
      case 37: // Left
        that.moveAble = false
        that.moveLeft()
        that.newCell()
        that.checkLose()
        break
      case 38: // Up
        that.moveAble = false
        that.moveUp()
        that.newCell()
        that.checkLose()
        break
    }
    console.log(that.matrix)
  }
}


// To add new cell in the available area
GameManager.prototype.newCell = function () {
  var len, index
  var ableArr = []
  if (this.moveAble !== true) {
    console.log('Move to other directions!')
    return
  }
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (this.matrix[i][j].value === 0) {
        ableArr.push([i, j])
      }
    }
  }
  len = ableArr.length
  if (len > 0) {
    index = getRandom(len)
    i = ableArr[index][0]
    j = ableArr[index][1]
    this.updateMatrix(2, i, j)
    this.drawCell(i, j)
  } else {
    console.log('No available cells!')
  }
}

GameManager.prototype.moveDown = function () {
  var i, j, k, n
  for (i = 0; i < 4; i++) {
    n = 3
    for (j = 3; j >= 0; j--) {
      if (this.matrix[i][j].value === 0) {
        continue
      }
      k = j + 1

      while (k <= n) {
        if (this.matrix[i][k].value === 0) {
          if (k === n || (this.matrix[i][k + 1].value !== 0 && this.matrix[i][k + 1].value !== this.matrix[i][j].value)) {
            this.moveCell(i, j, i, k)
          }
          k++

        } else {
          if (this.matrix[i][k].value === this.matrix[i][j].value) {
            this.mergeCells(i, j, i, k)
            n--
          }
          break
        }
      }
    }
  }
}

GameManager.prototype.moveUp = function () {
  var i, j, k, n
  for (i = 0; i < 4; i++) {
    n = 0
    for (j = 0; j < 4; j++) {
      if (this.matrix[i][j].value === 0) {
        continue
      }
      k = j - 1

      while (k >= n) {
        if (this.matrix[i][k].value === 0) {
          if (k === n || (this.matrix[i][k - 1].value !== 0 && this.matrix[i][k - 1].value !== this.matrix[i][j].value)) {
            this.moveCell(i, j, i, k)
          }
          k--
        } else {
          if (this.matrix[i][k].value === this.matrix[i][j].value) {
            this.mergeCells(i, j, i, k)
            n++
          }
          break
        }
      }
    }
  }
}

GameManager.prototype.moveLeft = function () {
  var i, j, k, n

  for (j = 0; j < 4; j++) {
    n = 0
    for (i = 0; i < 4; i++) {
      if (this.matrix[i][j].value === 0) {
        continue
      }
      k = i - 1

      while (k >= n) {
        if (this.matrix[k][j].value === 0) {
          if (k === n || (this.matrix[k - 1][j].value !== 0 && this.matrix[k - 1][j].value !== this.matrix[i][j].value)) {
            this.moveCell(i, j, k, j)
          }
          k--
        } else {
          if (this.matrix[k][j].value === this.matrix[i][j].value) {
            this.mergeCells(i, j, k, j)
            n++
          }
          break
        }
      }
    }
  }
}

GameManager.prototype.moveRight = function () {
  var i, j, k, n

  for (j = 0; j < 4; j++) {
    n = 3
    for (i = 3; i >= 0; i--) {
      if (this.matrix[i][j].value === 0) {
        continue
      }
      k = i + 1
      while (k <= n) {
        if (this.matrix[k][j].value === 0) {
          if (k === n || (this.matrix[k + 1][j].value !== 0 && this.matrix[k + 1][j].value !== this.matrix[i][j].value)) {
            this.moveCell(i, j, k, j)
          }
          k++
        } else {
          if (this.matrix[k][j].value === this.matrix[i][j].value) {
            this.mergeCells(i, j, k, j)
            n--
          }
          break
        }
      }
    }
  }
}
// To update the Matrix
GameManager.prototype.updateMatrix = function (num, i, j) {
  this.matrix[i][j].oldValue = this.matrix[i][j].value
  this.matrix[i][j].value = num
}

GameManager.prototype.moveCell = function (i1, j1, i2, j2) {
  this.matrix[i2][j2].value = this.matrix[i1][j1].value
  this.matrix[i1][j1].value = 0
  this.moveAble = true
  var cellElement = document.getElementsByClassName('p' + i1 + j1)[0]
  cellElement.classList.remove('p' + i1 + j1)
  cellElement.classList.add('p' + i2 + j2)
}

GameManager.prototype.mergeCells = function (i1, j1, i2, j2) {
  var original = this.matrix[i2][j2].value
  var newValue = original * 2
  var cellElement2 = document.getElementsByClassName('p' + i2 + j2)[0]
  var cellElement1 = document.getElementsByClassName('p' + i1 + j1)[0]
  var cellElementInner = cellElement1.getElementsByClassName('number-cell-inner')[0]
  this.moveAble = true
  this.matrix[i2][j2].value = newValue
  this.matrix[i1][j1].value = 0

  setTimeout(function () {
    cellElement2.parentNode.removeChild(cellElement2)
    cellElement1.classList.remove('p' + i1 + j1)
    cellElement1.classList.add('p' + i2 + j2)
    cellElementInner.classList.remove('n' + original)
    cellElementInner.classList.add('n' + newValue)
    cellElementInner.innerHTML = '<span>' + newValue + '</span>'
  }, 100)

  this.updateScore(newValue)
  if (newValue === 2048) {
    window.alert('You win!')
    this.init()
  }
}

GameManager.prototype.updateScore = function (newValue) {
  var scoreContainer = document.getElementById('score')
  this.score += newValue
  scoreContainer.innerText = 'Score: ' + this.score
}

GameManager.prototype.checkLose = function () {
  var i, j, temp
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      temp = this.matrix[i][j].value
      if (temp === 0) {
        return false
      }
      if (this.matrix[i + 1] && (this.matrix[i + 1][j].value === temp)) {
        return false
      }
      if ((this.matrix[i][j + 1] !== undefined) && (this.matrix[i][j + 1].value === temp)) {
        return false
      }
    }
  }
  window.alert('you lose!')
  this.init()
  return true
}

// Get the random number between 0 and n
function getRandom (n) {
  return Math.floor(Math.random() * n)
}

function removeElementsByClass (className, root) {
  var rootVar = root || document
  var elements = rootVar.getElementsByClassName(className)
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0])
  }
}

var g = new GameManager()
g.init()
