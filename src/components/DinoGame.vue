<template>
    <div id="game" @keydown.space.prevent="jump" tabindex="0">
      <div id="dino" :style="{ bottom: dinoY + 'px' }"></div>
      <div id="cactus" :style="{ left: cactusX + 'px' }"></div>
      <div id="score">Score: {{ score }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dinoY: 0,
        cactusX: 400,
        score: 0,
        isJumping: false,
        gameInterval: null,
      };
    },
    mounted() {
      this.$el.focus();
      this.startGame();
    },
    methods: {
      startGame() {
        this.gameInterval = setInterval(this.gameLoop, 20);
      },
      gameLoop() {
        this.cactusX -= 5;
        if (this.cactusX < -20) {
          this.cactusX = 400;
          this.score++;
        }
  
        if (this.isJumping) {
          this.dinoY += 10;
          if (this.dinoY >= 150) {
            this.isJumping = false;
          }
        } else if (this.dinoY > 0) {
          this.dinoY -= 10;
        }
  
        this.checkCollision();
      },
      jump() {
        if (this.dinoY === 0) {
          this.isJumping = true;
        }
      },
      checkCollision() {
        if (this.cactusX < 50 && this.cactusX > 0 && this.dinoY < 50) {
          clearInterval(this.gameInterval);
          alert('Game Over! Your score: ' + this.score);
          this.resetGame();
        }
      },
      resetGame() {
        this.dinoY = 0;
        this.cactusX = 400;
        this.score = 0;
        this.isJumping = false;
        this.startGame();
      },
    },
  };
  </script>
  
  <style scoped>
  #game {
    width: 600px;
    height: 200px;
    border: 1px solid #000;
    overflow: hidden;
    position: relative;
    background-color: #f7f7f7;
  }
  #dino {
    width: 20px;
    height: 20px;
    background-color: #000;
    position: absolute;
    bottom: 0;
    left: 50px;
  }
  #cactus {
    width: 20px;
    height: 50px;
    background-color: #0a0;
    position: absolute;
    bottom: 0;
    left: 400px;
  }
  #score {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  </style>
  