(function () {
    let imgs = document.querySelectorAll('.puzzle-img')
    let items = document.querySelectorAll('.puzzle-item')
    let randomPuzzles = document.querySelectorAll('.puzzles-random')
    let puzzles = document.querySelector('.puzzles')
    let content = document.querySelector('.puzzles-content')
    let title = document.querySelector('.puzzle-title')
    let shuffleButton = document.querySelector('.btn-primary')
    let againButton = document.querySelector('.btn-secondary')
    let count = 0
  
    let dragStart = function (e) {
      if (e.target.parentNode.getAttribute('class').includes('gather')) return
      items.forEach(item => {
        item.style.borderColor = 'rgba(255, 255, 255, 0.3)'
      })
      setTimeout(() => {
        this.classList.add('invisible')
      }, 100);
      let id = e.target.id
  
      // 傳送 id 到 drop
      e.dataTransfer.setData('id', id)
  
    }
  
    let dragEnd = function () {
      this.className = 'puzzle-img'
    }
  
    let dragOver = function (e) {
      e.preventDefault()
      this.classList.add('hovered')
    }
  
    let dragLeave = function () {
      this.classList.remove('hovered')
    }
  
    let dragDrop = function (e) {
      this.classList.remove('hovered')
      randomPuzzles.forEach((random) => {
        if (random.children.length <= 1) {
          random.style.cursor = 'default'
        }
      })
      // 拖曳過來的 img
      let dragId = e.dataTransfer.getData('id')
      let dragPuzzle = document.getElementById(dragId)
      if (dragPuzzle === null) return
  
      // 準備放下的 LI 區塊 
      let dropId = e.target.id
      let dropParent = document.getElementById(dropId)
  
      if (dropParent.nodeName === 'LI') {
        dropParent.append(dragPuzzle)
      }
    }
  
    let shuffleHandler = function (e) {
      count = 0
  
      // 禁止圖片拖曳
      imgs.forEach(img => {
        img.setAttribute('draggable', false)
      })
  
      items.forEach(item => {
        item.style.borderColor = 'transparent'
        if (!item.hasChildNodes()) {
          // Random swap child nodes
          for (let i = 0; i < 100; i++) {
            let n = Math.floor(Math.random() * 9)
            let m = Math.floor(Math.random() * 9)
            let randomParentN = imgs[n].parentNode
            let randomParentM = imgs[m].parentNode
            randomParentN.append(imgs[m])
            randomParentM.append(imgs[n])
          }
        } else {
          // 若網格裡有拼圖，清空網格並 append 到原本隨機位子 
          item.classList.add('gather')
          item.style.borderColor = 'transparent'
          item.innerHTML = ''
          for (let i = 0; i < randomPuzzles.length; i++) {
            const random = randomPuzzles[i];
            for (let j = 0; j < imgs.length; j++) {
              const img = imgs[j];
              if (j === i) {
                random.append(img)
              }
            }
          }
          setTimeout(() => {
            item.classList.remove('gather')
          }, 3000)
        }
      })
      randomPuzzles.forEach(random => {
        random.classList.add('gather')
        setTimeout(() => {
          random.classList.remove('gather')
        }, 2000);
      })
    }
  
    let checkId = (e) => {
      if (e.target.nodeName !== 'LI') return
      let item = e.target
      let itemId = item.getAttribute('id')
      let puzzle = e.target.querySelector('.puzzle-img')
      let puzzleId = puzzle.getAttribute('id')
  
      let matchItemId = itemId.charAt(itemId.length - 1)
      let matchPuzzleId = puzzleId.charAt(puzzleId.length - 1)
  
      if (matchItemId === matchPuzzleId) {
        item.classList.add('correct')
        puzzle.setAttribute('draggable', false)
        puzzle.style.cursor = 'default'
        count++
        setTimeout(() => {
          item.classList.remove('correct')
        }, 400);
        console.log('count', count)
  
        if (count > 8) {
          title.classList.remove('move-in')
          shuffleButton.classList.remove('move-in')
  
          setTimeout(() => {
            puzzles.style.boxShadow = '0px 0px 30px 0px rgba(255, 255, 255, 1)'
            puzzles.style.borderColor = "white"
            puzzles.classList.add('puzzles-glow')
          }, 200);
          setTimeout(() => {
            puzzles.classList.add('puzzles-move')
          }, 200);
          setTimeout(() => {
            content.style.display = 'flex';
            content.classList.add('show')
            content.style.zIndex = "99999"
          }, 800);
        }
      }
    }
  
    let playAgain = function () {
      count = 0
      content.classList.add('fade-out')
      content.style.zIndex = "1"
  
      puzzles.style.boxShadow = "0px 0px 0px transparent"
      puzzles.style.borderColor = "transparent"
      puzzles.classList.remove('puzzles-glow')
  
      randomPuzzles.forEach((random) => {
        random.style.cursor = 'pointer'
        setTimeout(() => {
          puzzles.classList.remove('puzzles-move')
          shuffleHandler()
          random.classList.add('gather')
          content.style.display = 'none';
        }, 300);
        setTimeout(() => {
          random.classList.remove('gather')
          content.classList.remove('fade-out')
        }, 2000);
      })
  
      setTimeout(() => {
        title.style.opacity = 1
        shuffleButton.style.opacity = 1
        title.classList.add('move-in')
        shuffleButton.classList.add('move-in')
        imgs.forEach(img => {
          img.style.cursor = 'pointer'
        })
      }, 4500);
    }
  
    let init = function () {
      imgs.forEach(img => {
        img.setAttribute('draggable', true)
      })
  
      randomPuzzles.forEach(random => {
        random.classList.add('gather')
        setTimeout(() => {
          random.classList.remove('gather')
        }, 2000);
        setTimeout(() => {
          title.classList.add('move-in')
          shuffleButton.classList.add('move-in')
        }, 3000);
      })
    }
  
    let checkTransition = function (e) {
      if (e.target.getAttribute('class').includes('gather')) {
        imgs.forEach(img => {
          img.setAttribute('draggable', false)
          console.log('能否拖曳', img.getAttribute('draggable'))
        })
      } else {
        setTimeout(() => {
          imgs.forEach(img => {
            img.setAttribute('draggable', true)
            console.log('能否拖曳', img.getAttribute('draggable'))
          })
        }, 2500);
      }
    }
  
    imgs.forEach(img => {
      img.addEventListener('dragstart', dragStart)
      img.addEventListener('dragend', dragEnd)
    })
  
    items.forEach(item => {
      item.addEventListener('dragover', dragOver)
      item.addEventListener('drop', dragDrop)
      item.addEventListener('dragleave', dragLeave)
      item.addEventListener('drop', checkId)
      item.addEventListener('transitionend', checkTransition)
    })
  
    // 洗牌時禁止拖曳拼圖
    randomPuzzles.forEach(random => {
      random.addEventListener('transitionend', checkTransition)
    })
  
    againButton.addEventListener('click', playAgain)
    shuffleButton.addEventListener('click', shuffleHandler)
    window.addEventListener('load', init)
  })()