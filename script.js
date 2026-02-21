    let progress = 0;
    const progressBar = document.getElementById('progress');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainMenu = document.getElementById('mainMenu');
    function loadProgress() {
      if (progress < 100) {
        progress += 1;
        progressBar.style.width = progress + '%';
        document.getElementById('loadingText').innerText = `SMILE! ${progress}%`;
        setTimeout(loadProgress, 50);
      } else {
        loadingScreen.classList.remove('active');
        mainMenu.classList.add('active');
      }
    }
    loadProgress();

    function showScreen(screenId) {
      document.querySelectorAll('.container > div').forEach(screen => {
        screen.classList.remove('active');
      });
      document.getElementById(screenId).classList.add('active');
      if (screenId === 'messageScreen') {
        currentMessageIndex = 0;
        displayMessage();
      }
      if (screenId !== 'tetrisScreen' && gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
      }
      if (screenId !== 'musicScreen') {
        const audio = document.getElementById('audioPlayer');
        if (audio && isPlaying) {
          audio.pause();
          isPlaying = false;
          document.getElementById('playPauseBtn').textContent = '▶️';
        }
      } else {
        initMusicScreen();
      }
    }

    const screenOrder = ['messageScreen', 'galleryScreen', 'printScreen', 'musicScreen', 'tetrisScreen'];
    function nextScreen(currentScreenId) {
      const currentIndex = screenOrder.indexOf(currentScreenId);
      if (currentIndex >= 0 && currentIndex < screenOrder.length - 1) {
        showScreen(screenOrder[currentIndex + 1]);
      }
    }

    const messages = [
      'Hi Beb,\nHappy Birthday!\nI pray that you win in life, achieve all your dreams and get everything you want,\nI want to see u at the top, becoming the person you\'ve always wanted to be, i\'ll support you so loudly and proudly that you won\'t hear the voices of those who doubted u,\njust you know that i\'m here for u and i believe in u with all my heart.\n \nI love you🤍🤍🤍',
    ];
    let currentMessageIndex = 0;

    function displayMessage() {
      const messageContent = document.getElementById('messageContent');
      if (messageContent) {
        messageContent.innerHTML = messages[currentMessageIndex].replace(/\n/g, '<br>');
        messageContent.style.animation = 'none';
        void messageContent.offsetWidth;
        messageContent.style.animation = 'fadeIn 0.5s ease-in';
      } else {
        console.error('Element #messageContent not found');
      }
    }

    function nextMessage() {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      displayMessage();
    }

    function skipMessages() {
      showScreen('galleryScreen');
    }

    function startPrinting() {
      const polaroidContainer = document.querySelector('.gallery-screen .polaroid-container');
      const mainText = document.querySelector('.gallery-screen .main-text');
      const printBtn = document.querySelector('.gallery-screen .print-btn');
      if (polaroidContainer && mainText && printBtn) {
        mainText.style.display = 'none';
        printBtn.style.display = 'none';
        polaroidContainer.style.display = 'flex';
      }
    }

    const songs = [
      { title: 'No Idea', artist: 'Don Toliver', duration: '02:33', src: 'songs/noidea.mp3', cover: 'images/nocover.jpg' },
      { title: 'God\'s Plan', artist: 'Drake', duration: '03:19', src: 'songs/godsplan.mp3', cover: 'images/godscover.jpg' },
      { title: 'Vibez', artist: 'Dababy', duration: '02:25', src: 'songs/vibez.mp3', cover: 'images/vibezcover.jpg' },
      { title: 'Congratulations', artist: 'Post Malone, Quavo', duration: '03:40', src: 'songs/congratulations.mp3', cover: 'images/congratulationscover.png' },
      { title: 'Congratulations (feat. Bilal)', artist: 'Mac Miller, Bilal', duration: '04:23', src: 'songs/congratulations(feat.bilal).mp3', cover: 'images/congratulations(feat.bilal)cover.jpg' }
    ];

    const audioPlayer = document.getElementById('audioPlayer');
    const musicProgress = document.getElementById('musicProgress');
    let isPlaying = false;
    let currentSongIndex = 0;

    function updateTrackInfo() {
      if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
        document.getElementById('songTitle').textContent = songs[currentSongIndex].title;
        document.getElementById('songArtist').textContent = songs[currentSongIndex].artist;
        document.getElementById('albumCover').src = songs[currentSongIndex].cover;
        document.getElementById('totalTime').textContent = songs[currentSongIndex].duration;
        audioPlayer.src = songs[currentSongIndex].src;
        audioPlayer.load();
      }
    }

    function playPause() {
      if (isPlaying) {
        audioPlayer.pause();
        document.getElementById('playPauseBtn').textContent = '▶️';
      } else {
        if (audioPlayer.src) {
          audioPlayer.load();
          audioPlayer.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Gagal memutar. Pastikan file MP3 ada di folder "songs/" dan cover ada di "images/". Cek nama file!');
          });
          document.getElementById('playPauseBtn').textContent = '⏸️';
        } else {
          console.error('No audio source set');
          alert('Sumber audio belum disetel. Cek file MP3!');
        }
      }
      isPlaying = !isPlaying;
    }

    function prevTrack() {
      if (currentSongIndex > 0) {
        currentSongIndex--;
        updateTrackInfo();
        if (isPlaying) audioPlayer.play();
      }
    }

    function nextTrack() {
      if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateTrackInfo();
        if (isPlaying) audioPlayer.play();
      }
    }

    function selectSong(index) {
      currentSongIndex = index;
      updateTrackInfo();
      if (isPlaying) audioPlayer.play();
    }

    audioPlayer.addEventListener('timeupdate', () => {
      const currentTime = audioPlayer.currentTime;
      const duration = audioPlayer.duration || 0;
      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
      musicProgress.style.width = progressPercent + '%';
      const currentMinutes = Math.floor(currentTime / 60);
      const currentSeconds = Math.floor(currentTime % 60);
      document.getElementById('currentTime').textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
      document.getElementById('totalTime').textContent = new Date(audioPlayer.duration * 1000).toISOString().substr(14, 5);
    });

    audioPlayer.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      alert('Error memuat file audio. Cek file di "songs/"!');
    });

    function initMusicScreen() {
      updateTrackInfo();
      const audio = document.getElementById('audioPlayer');
      if (audio && audio.readyState >= 1) {
        document.getElementById('totalTime').textContent = new Date(audio.duration * 1000).toISOString().substr(14, 5);
      } else {
        document.getElementById('totalTime').textContent = songs[currentSongIndex].duration;
      }
    }

    function updateProgress() {
      audioPlayer.currentTime = 0;
      document.getElementById('currentTime').textContent = '0:00';
    }

    const grid = document.getElementById('gameGrid');
    const gridCells = [];
    for (let i = 0; i < 200; i++) {
      const div = document.createElement('div');
      gridCells.push(div);
      grid.appendChild(div);
    }

    const tetrominoes = [
      [[1,1,1,1]],
      [[1,1],[1,1]],
      [[0,1,0],[1,1,1]],
      [[0,1,1],[1,1,0]],
      [[1,1,0],[0,1,1]],
      [[1,0,0],[1,1,1]],
      [[0,0,1],[1,1,1]]
    ];
    const colors = ['#00FFFF', '#FFFF00', '#FF00FF', '#00FF00', '#FF0000', '#0000FF', '#FFA500'];

    let currentTetromino = null;
    let currentColor = null;
    let currentPosition = 0;
    let gameInterval = null;
    let isGameRunning = false;
    let score = 0;
    let lines = 0;

    function createTetromino() {
      const index = Math.floor(Math.random() * tetrominoes.length);
      currentTetromino = tetrominoes[index].map(row => [...row]);
      currentColor = colors[index];
      currentPosition = 4;
      return { tetromino: currentTetromino, color: currentColor };
    }

    function drawTetromino() {
      gridCells.forEach(cell => {
        if (!cell.classList.contains('locked')) cell.style.backgroundColor = '#1e1e1e';
      });
      if (currentTetromino) {
        for (let row = 0; row < currentTetromino.length; row++) {
          for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
              const cellIndex = currentPosition + (row * 10) + col;
              if (cellIndex >= 0 && cellIndex < 200) {
                gridCells[cellIndex].style.backgroundColor = currentColor;
              }
            }
          }
        }
      }
    }

    function lockTetromino() {
      if (currentTetromino) {
        for (let row = 0; row < currentTetromino.length; row++) {
          for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
              const cellIndex = currentPosition + (row * 10) + col;
              if (cellIndex >= 0 && cellIndex < 200) {
                gridCells[cellIndex].classList.add('locked');
              }
            }
          }
        }
      }
    }

    function checkLines() {
      for (let row = 19; row >= 0; row--) {
        let isFull = true;
        for (let col = 0; col < 10; col++) {
          const cellIndex = row * 10 + col;
          if (!gridCells[cellIndex].classList.contains('locked')) {
            isFull = false;
            break;
          }
        }
        if (isFull) {
          lines++;
          document.getElementById('lines').textContent = lines;
          score += 10;
          document.getElementById('score').textContent = score;
          for (let r = row; r > 0; r--) {
            for (let c = 0; c < 10; c++) {
              const cellIndex = r * 10 + c;
              const aboveIndex = (r - 1) * 10 + c;
              gridCells[cellIndex].style.backgroundColor = gridCells[aboveIndex].style.backgroundColor;
              gridCells[cellIndex].classList.toggle('locked', gridCells[aboveIndex].classList.contains('locked'));
            }
          }
          for (let c = 0; c < 10; c++) {
            const cellIndex = c;
            gridCells[cellIndex].style.backgroundColor = '#1e1e1e';
            gridCells[cellIndex].classList.remove('locked');
          }
          row++;
        }
      }
    }

    function startGame() {
      if (!isGameRunning) {
        isGameRunning = true;
        score = 0;
        lines = 0;
        document.getElementById('score').textContent = score;
        document.getElementById('level').textContent = 1;
        document.getElementById('lines').textContent = lines;
        gridCells.forEach(cell => {
          cell.style.backgroundColor = '#1e1e1e';
          cell.classList.remove('locked');
        });
        currentTetromino = null;
        gameInterval = setInterval(moveDown, 500);
        spawnTetromino();
      }
    }

    function spawnTetromino() {
      const { tetromino, color } = createTetromino();
      currentTetromino = tetromino;
      currentColor = color;
      currentPosition = 4;
      let canSpawn = true;
      for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
          if (currentTetromino[row][col]) {
            const cellIndex = currentPosition + (row * 10) + col;
            if (cellIndex >= 0 && cellIndex < 200 && gridCells[cellIndex].classList.contains('locked')) {
              canSpawn = false;
              break;
            }
          }
        }
        if (!canSpawn) break;
      }
      if (!canSpawn) {
        gameOver();
        return;
      }
      drawTetromino();
    }

    function moveDown() {
      if (isGameRunning && currentTetromino) {
        let canMove = true;
        for (let row = currentTetromino.length - 1; row >= 0; row--) {
          for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
              const newIndex = currentPosition + (row * 10) + col + 10;
              if (newIndex >= 200 || (newIndex >= 0 && gridCells[newIndex].classList.contains('locked'))) {
                canMove = false;
                break;
              }
            }
          }
          if (!canMove) break;
        }
        if (canMove) {
          currentPosition += 10;
        } else {
          lockTetromino();
          checkLines();
          currentTetromino = null;
          spawnTetromino();
        }
        drawTetromino();
      }
    }

    function moveLeft() {
      if (isGameRunning && currentTetromino) {
        let canMove = true;
        for (let row = 0; row < currentTetromino.length; row++) {
          for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
              const newIndex = currentPosition + (row * 10) + col - 1;
              if (newIndex < 0 || Math.floor(newIndex / 10) !== Math.floor((currentPosition + (row * 10) + col) / 10) || (newIndex >= 0 && gridCells[newIndex].classList.contains('locked'))) {
                canMove = false;
                break;
              }
            }
          }
          if (!canMove) break;
        }
        if (canMove) {
          currentPosition--;
          drawTetromino();
        }
      }
    }

    function moveRight() {
      if (isGameRunning && currentTetromino) {
        let canMove = true;
        for (let row = 0; row < currentTetromino.length; row++) {
          for (let col = currentTetromino[row].length - 1; col >= 0; col--) {
            if (currentTetromino[row][col]) {
              const newIndex = currentPosition + (row * 10) + col + 1;
              if (newIndex >= 200 || Math.floor(newIndex / 10) !== Math.floor((currentPosition + (row * 10) + col) / 10) || (newIndex >= 0 && gridCells[newIndex].classList.contains('locked'))) {
                canMove = false;
                break;
              }
            }
          }
          if (!canMove) break;
        }
        if (canMove) {
          currentPosition++;
          drawTetromino();
        }
      }
    }

    function rotate() {
      if (isGameRunning && currentTetromino) {
        const original = currentTetromino;
        const n = Math.max(original.length, original[0].length);
        const rotated = Array(n).fill().map(() => Array(n).fill(0));
        for (let i = 0; i < original.length; i++) {
          for (let j = 0; j < original[i].length; j++) {
            rotated[j][n - 1 - i] = original[i][j];
          }
        }
        let minRow = n, maxRow = 0, minCol = n, maxCol = 0;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (rotated[i][j]) {
              minRow = Math.min(minRow, i);
              maxRow = Math.max(maxRow, i);
              minCol = Math.min(minCol, j);
              maxCol = Math.max(maxCol, j);
            }
          }
        }
        const newHeight = maxRow - minRow + 1;
        const newWidth = maxCol - minCol + 1;
        const normalized = Array(newHeight).fill().map(() => Array(newWidth).fill(0));
        for (let i = minRow; i <= maxRow; i++) {
          for (let j = minCol; j <= maxCol; j++) {
            if (rotated[i][j]) {
              normalized[i - minRow][j - minCol] = 1;
            }
          }
        }
        let canRotate = true;
        for (let row = 0; row < normalized.length; row++) {
          for (let col = 0; col < normalized[row].length; col++) {
            if (normalized[row][col]) {
              const cellIndex = currentPosition + (row * 10) + col;
              if (cellIndex < 0 || cellIndex >= 200 || Math.floor(cellIndex / 10) !== Math.floor((currentPosition + (row * 10) + col) / 10) || (cellIndex >= 0 && gridCells[cellIndex].classList.contains('locked'))) {
                canRotate = false;
                break;
              }
            }
          }
          if (!canRotate) break;
        }
        if (canRotate) {
          currentTetromino = normalized;
          drawTetromino();
        }
      }
    }

    function gameOver() {
      clearInterval(gameInterval);
      isGameRunning = false;
      showScreen('gameOverScreen');
    }

    function showSpecialGameOver() {
      showScreen('specialGameOverScreen');
    }

    function confirmGameOver() {
      showScreen('tetrisScreen');
      gridCells.forEach(cell => {
        cell.style.backgroundColor = '#1e1e1e';
        cell.classList.remove('locked');
      });
      isGameRunning = false;
    }

    document.addEventListener('keydown', (event) => {
      if (document.getElementById('tetrisScreen').classList.contains('active') && isGameRunning) {
        switch (event.key) {
          case 'ArrowLeft':
            moveLeft();
            break;
          case 'ArrowRight':
            moveRight();
            break;
          case 'ArrowDown':
            moveDown();
            break;
          case 'ArrowUp':
            rotate();
            break;
        }
      }
      if (document.getElementById('messageScreen').classList.contains('active')) {
        switch (event.key) {
          case 'ArrowRight':
          case 'Enter':
            nextMessage();
            break;
          case 'Escape':
            skipMessages();
            break;
        }
      }
    });

     const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    input.addEventListener('focus', () => {
      setTimeout(() => {
    chat.scrollTop = chat.scrollHeight; // scroll ke bawah pas input fokus (keyboard muncul)
      }, 300); // delay kecil biar keyboard muncul dulu
    });
    const sendBtn = document.getElementById('send');

    let replyCount = 0;

    function getCurrentTime() {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    }

    function addMessage(text, type = 'sent') {
      const div = document.createElement('div');
      div.classList.add('message', type);
      div.innerHTML = `${text.replace(/\n/g, '<br>')}<div class="time">${getCurrentTime()}</div>`;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function showTyping(callback) {
      const typing = document.createElement('div');
      typing.classList.add('typing');
      typing.textContent = 'Sedang mengetik...';
      chat.appendChild(typing);
      chat.scrollTop = chat.scrollHeight;

      setTimeout(() => {
        typing.remove();
        if (callback) callback();
      }, Math.random() * 1800 + 1200);
    }

    function initChat() {
      chat.innerHTML = '';
      replyCount = 0;
      setTimeout(() => {
        addMessage("aloow babe", 'received');
      }, 1200);
    }

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      addMessage(text, 'sent');
      input.value = '';

      replyCount++;

      if (replyCount === 1) {
        setTimeout(() => {
          showTyping(() => {
            addMessage("Happy birthday to the one who makes my heart feel at home❤️<br><br>Thank you for making happiness feel so easy and for showing me that loving and being loved should never be complicated. You’ve shown me that love can be gentle, safe and joyful.<br><br>I’m so grateful life led me to you, here’s to many more birthdays together!! Love you babe🤍", 'received');
          });
        }, 1800);
      }

      if (replyCount === 2) {
        setTimeout(() => {
          showTyping(() => {
            addMessage("Habis ini lanjut ke bagian selanjutnya yaa, hope you like it ^_^", 'received');

            setTimeout(() => {
              const btn = document.createElement('button');
              btn.classList.add('gallery-btn');
              btn.textContent = 'Lihat Galeri';
              btn.onclick = () => {
                showScreen('galleryScreen');
              };
              chat.appendChild(btn);
              chat.scrollTop = chat.scrollHeight;
            }, 2200);
          });
        }, 2500);
      }

      if (replyCount > 2) {
        setTimeout(() => {
          showTyping(() => {
            addMessage("Hehe seneng banget kamu bales! 🥰", 'received');
          });
        }, 2200);
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });

    // Override showScreen biar chat di-init ulang pas buka
    const originalShowScreen = showScreen;
    showScreen = function(screenId) {
      originalShowScreen(screenId);
      if (screenId === 'messageScreen') {
        initChat();
      }

    };


