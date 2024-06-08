<template>
    <div id="game" @keydown.space.prevent="jump" @touchstart="jump" tabindex="0">
      <div id="clouds">
        <div v-for="cloud in clouds" :key="cloud.id" class="cloud" :style="{ left: cloud.x + 'px', top: cloud.y + 'px' }"></div>
      </div>
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
        cactusX: window.innerWidth - 40,
        score: 0,
        isJumping: false,
        gameInterval: null,
        clouds: [],
        cloudCount: 5,
      };
    },
    mounted() {
      this.$el.focus();
      this.startGame();
      window.addEventListener('resize', this.updateGameSize);
      this.createClouds();
    },
    methods: {
      startGame() {
        this.gameInterval = setInterval(this.gameLoop, 20);
      },
      gameLoop() {
        this.cactusX -= 5;
        this.moveClouds();
        if (this.cactusX < -40) {
          this.cactusX = window.innerWidth - 40;
          this.score++;
        }
  
        if (this.isJumping) {
          this.dinoY += 10;
          if (this.dinoY >= 200) {
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
        const dinoLeft = 50;
        const dinoRight = dinoLeft + 40;
        const cactusLeft = this.cactusX;
        const cactusRight = cactusLeft + 40;
  
        if (dinoRight > cactusLeft && dinoLeft < cactusRight && this.dinoY < 50) {
          clearInterval(this.gameInterval);
          alert('Game Over! Your score: ' + this.score);
          this.resetGame();
        }
      },
      resetGame() {
        this.dinoY = 0;
        this.cactusX = window.innerWidth - 40;
        this.score = 0;
        this.isJumping = false;
        this.startGame();
      },
      updateGameSize() {
        this.cactusX = window.innerWidth - 40;
      },
      createClouds() {
        for (let i = 0; i < this.cloudCount; i++) {
          this.clouds.push({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * 100,
          });
        }
      },
      moveClouds() {
        this.clouds.forEach(cloud => {
          cloud.x -= 2;
          if (cloud.x < -100) {
            cloud.x = window.innerWidth + 100;
            cloud.y = Math.random() * 100;
          }
        });
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateGameSize);
    }
  };
  </script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 90%;
  height: 90%;
}

#game {
  width: 80vw;
  height: 70vh;
  overflow: hidden;
  position: relative;
  background-color: #3badfa;
}

#clouds {
  position: absolute;
  width: 60%;
  height: 70%;
  z-index: 0;
}

.cloud {
  width: 100px;
  height: 50px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#dino {
  width: 40px;
  height: 40px;
  background-color: #000;
  position: absolute;
  bottom: 0;
  left: 50px;
}

#cactus {
  width: 40px;
  height: 100px;
  background-color: #0a0;
  position: absolute;
  bottom: 0;
  left: calc(100vw - 40px);
}

#score {
  position: absolute;
  top: 10px;
  right: 10px;
}

@media (max-width: 600px) {
  #dino {
    width: 30px;
    height: 30px;
    left: 25px;
  }
  #cactus {
    width: 30px;
    height: 80px;
  }
  #score {
    top: 5px;
    right: 5px;
  }
}
</style>
