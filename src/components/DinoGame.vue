<template>
  <div id="game" @keydown.space.prevent="jump" @touchstart="jump" tabindex="0">
    <div id="clouds">
      <div v-for="cloud in clouds" :key="cloud.id" class="cloud" :style="{ left: cloud.x + 'px', top: cloud.y + 'px' }"></div>
    </div>
    <div id="dino" :style="{ bottom: dinoY + 'px', backgroundImage: `url(${dinoSprite})` }"></div>
    <div id="cactus" :style="{ left: cactusX + 'px' }"></div>
    <div id="score">Score: {{ score }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import dinoRun1 from 'src/assets/drex_run_1.png';
import dinoRun2 from 'src/assets/drex_run_2.png';

interface Cloud {
  id: number;
  x: number;
  y: number;
}

export default defineComponent({
  name: 'GamePage',
  setup() {
    const dinoY = ref(0);
    const velocityY = ref(0);
    const gravity = 1;
    const jumpPower = 20;
    const cactusX = ref(window.innerWidth - 40);
    const score = ref(0);
    const isJumping = ref(false);
    const gameInterval = ref<number | null>(null);
    const clouds = ref<Cloud[]>([]);
    const cloudCount = 5;
    const dinoSprites = [dinoRun1, dinoRun2];
    const currentSprite = ref(0);
    const dinoSprite = ref(dinoSprites[currentSprite.value]);
    const animationCounter = ref(0);
    const animationSpeed = 10;

    const startGame = () => {
      gameInterval.value = setInterval(gameLoop, 20);
    };

    const gameLoop = () => {
      cactusX.value -= 5;
      moveClouds();
      if (cactusX.value < -40) {
        cactusX.value = window.innerWidth - 40;
        score.value++;
      }

      if (isJumping.value) {
        velocityY.value -= gravity;
        dinoY.value += velocityY.value;
        if (dinoY.value <= 0) {
          dinoY.value = 0;
          isJumping.value = false;
          velocityY.value = 0;
        }
      } else {
        // Handle animation speed
        animationCounter.value++;
        if (animationCounter.value >= animationSpeed) {
          currentSprite.value = (currentSprite.value + 1) % dinoSprites.length;
          dinoSprite.value = dinoSprites[currentSprite.value];
          animationCounter.value = 0;
        }
      }

      checkCollision();
    };

    const jump = () => {
      if (!isJumping.value) {
        isJumping.value = true;
        velocityY.value = jumpPower;
      }
    };

    const checkCollision = () => {
      const dinoLeft = 70;
      const dinoRight = dinoLeft + 128;
      const cactusLeft = cactusX.value;
      const cactusRight = cactusLeft + 40;

      if (dinoRight > cactusLeft && dinoLeft < cactusRight && dinoY.value < 50) {
        if (gameInterval.value !== null) {
          clearInterval(gameInterval.value);
        }
        alert(`Game Over! Your score: ${score.value}`);
        resetGame();
      }
    };

    const resetGame = () => {
      dinoY.value = 0;
      cactusX.value = window.innerWidth - 40;
      score.value = 0;
      isJumping.value = false;
      velocityY.value = 0;
      startGame();
    };

    const updateGameSize = () => {
      cactusX.value = window.innerWidth - 40;
    };

    const createClouds = () => {
      for (let i = 0; i < cloudCount; i++) {
        clouds.value.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * 100,
        });
      }
    };

    const moveClouds = () => {
      clouds.value.forEach((cloud) => {
        cloud.x -= 2;
        if (cloud.x < -100) {
          cloud.x = window.innerWidth + 100;
          cloud.y = Math.random() * 100;
        }
      });
    };

    onMounted(() => {
      document.addEventListener('keydown', jump);
      window.addEventListener('resize', updateGameSize);
      createClouds();
      startGame();
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', jump);
      window.removeEventListener('resize', updateGameSize);
      if (gameInterval.value !== null) {
        clearInterval(gameInterval.value);
      }
    });

    return {
      dinoY,
      cactusX,
      score,
      clouds,
      jump,
      dinoSprite,
    };
  },
});
</script>

<style scoped>
#game {
  width: 70vw;
  height: 90vh;
  overflow: hidden;
  position: relative;
  background-color: #6fbeff;
}

#clouds {
  position: absolute;
  width: 100%;
  height: 100%;
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
  width: 100px;
  height: 80px;
  background-size: contain;
  position: absolute;
  bottom: 0;
  left: 70px;
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
