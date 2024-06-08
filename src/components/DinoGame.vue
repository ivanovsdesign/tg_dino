<template>
    <div id="game" @keydown.space.prevent="jump" @touchstart="jump" tabindex="0">
      <div id="dino" :style="{ bottom: dinoY + 'px' }"></div>
      <div id="cactus" :style="{ left: cactusX + 'px' }"></div>
      <div id="score">Score: {{ score }}</div>
    </div>
  </template>
  
  <script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  
  @Component
  export default class DinoGame extends Vue {
    dinoY: number = 0;
    cactusX: number = 400;
    score: number = 0;
    isJumping: boolean = false;
    gameInterval: number | null = null;
  
    mounted() {
      this.$el.focus();
      this.startGame();
    }
  
    startGame() {
      this.gameInterval = setInterval(this.gameLoop, 20);
    }
  
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
    }
  
    jump() {
      if (this.dinoY === 0) {
        this.isJumping = true;
      }
    }
  
    checkCollision() {
      if (this.cactusX < 50 && this.cactusX > 0 && this.dinoY < 50) {
        if (this.gameInterval) {
          clearInterval(this.gameInterval);
        }
        alert('Game Over! Your score: ' + this.score);
        this.resetGame();
      }
    }
  
    resetGame() {
      this.dinoY = 0;
      this.cactusX = 400;
      this.score = 0;
      this.isJumping = false;
      this.startGame();
    }
  }
  </script>
  
  <style scoped>
  #game {
    width: 100%;
    max-width: 600px;
    height: 200px;
    border: 1px solid #000;
    overflow: hidden;
    position: relative;
    background-color: #f7f7f7;
    margin: auto;
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
  @media (max-width: 600px) {
    #game {
      height: 150px;
    }
    #dino {
      width: 15px;
      height: 15px;
      left: 25px;
    }
    #cactus {
      width: 15px;
      height: 40px;
    }
    #score {
      top: 5px;
      right: 5px;
    }
  }
  </style>
  