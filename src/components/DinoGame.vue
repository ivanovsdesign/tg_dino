<template>
  <div id="game" @keydown.space.prevent="jump" @touchstart="jump" tabindex="0">
    <div id="clouds">
      <div v-for="cloud in clouds" :key="cloud.id" class="cloud" :style="{ left: cloud.x + 'px', top: cloud.y + 'px' }"></div>
    </div>
    <div id="dino" :style="{ bottom: dino.y + 'px', backgroundImage: `url(${dino.sprite})` }"></div>
    <div id="cactus" :style="{ left: cactus.x + 'px' }"></div>
    <div id="score">Score: {{ score }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import dinoRun1 from '../assets/drex_run_1.png';
import dinoRun2 from '../assets/drex_run_2.png';

class Dino {
  public y: number;
  private velocityY: number;
  private gravity: number;
  private jumpPower: number;
  private isJumping: boolean;
  private sprites: string[];
  private currentSpriteIndex: number;
  private animationCounter: number;
  private animationSpeed: number;
  public sprite: string;

  constructor(sprites: string[], jumpPower: number, gravity: number, animationSpeed: number) {
    this.y = 0;
    this.velocityY = 0;
    this.gravity = gravity;
    this.jumpPower = jumpPower;
    this.isJumping = false;
    this.sprites = sprites;
    this.currentSpriteIndex = 0;
    this.animationCounter = 0;
    this.animationSpeed = animationSpeed;
    this.sprite = sprites[this.currentSpriteIndex];
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY = this.jumpPower;
    }
  }

  update() {
    if (this.isJumping) {
      this.velocityY -= this.gravity;
      this.y += this.velocityY;
      if (this.y <= 0) {
        this.y = 0;
        this.isJumping = false;
        this.velocityY = 0;
      }
    } else {
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.sprites.length;
        this.sprite = this.sprites[this.currentSpriteIndex];
        this.animationCounter = 0;
      }
    }
  }
}

class Cactus {
  public x: number;
  private speed: number;

  constructor(speed: number, initialX: number) {
    this.x = initialX;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
    if (this.x < -40) {
      this.x = window.innerWidth - 40;
    }
  }
}

class Cloud {
  public id: number;
  public x: number;
  public y: number;
  private speed: number;

  constructor(id: number, x: number, y: number, speed: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
    if (this.x < -100) {
      this.x = window.innerWidth + 100;
      this.y = Math.random() * 100;
    }
  }
}

export default defineComponent({
  name: 'GamePage',
  setup() {
    const dinoSprites = [dinoRun1, dinoRun2];
    const dino = new Dino(dinoSprites, 20, 1, 10);
    const cactus = new Cactus(5, window.innerWidth - 40);
    const clouds = ref<Cloud[]>([]);
    const cloudCount = 5;
    const score = ref(0);
    const gameInterval = ref<number | null>(null);

    const startGame = () => {
      gameInterval.value = setInterval(gameLoop, 20);
    };

    const gameLoop = () => {
      cactus.update();
      moveClouds();
      dino.update();

      if (cactus.x < -40) {
        cactus.x = window.innerWidth - 40;
        score.value++;
      }

      checkCollision();
    };

    const jump = () => {
      dino.jump();
    };

    const checkCollision = () => {
      const dinoLeft = 110;
      const dinoRight = dinoLeft + 130;
      const cactusLeft = cactus.x;
      const cactusRight = cactusLeft + 40;

      if (dinoRight > cactusLeft && dinoLeft < cactusRight && dino.y < 30) {
        if (gameInterval.value !== null) {
          clearInterval(gameInterval.value);
        }
        alert(`Game Over! Your score: ${score.value}`);
        resetGame();
      }
    };

    const resetGame = () => {
      dino.y = 0;
      cactus.x = window.innerWidth - 40;
      score.value = 0;
      startGame();
    };

    const updateGameSize = () => {
      cactus.x = window.innerWidth - 40;
    };

    const createClouds = () => {
      for (let i = 0; i < cloudCount; i++) {
        clouds.value.push(new Cloud(i, Math.random() * window.innerWidth, Math.random() * 100, 2));
      }
    };

    const moveClouds = () => {
      clouds.value.forEach(cloud => cloud.update());
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
      dino,
      cactus,
      clouds,
      score,
      jump,
    };
  },
});
</script>

<style scoped>
#game {
  width: 90vw;
  height: 70vh;
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
  width: 120px;
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 0;
  left: 120px;
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
    width: 110px;
    height: 70px;
    left: 110px;
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
