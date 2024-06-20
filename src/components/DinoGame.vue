<template>
  <div id="game" @keydown.space.prevent="jump" @click="jump" tabindex="0">
    <div id="background">
      <div class="bg" :style="{ left: background.x1 + 'px' }"></div>
      <div class="bg" :style="{ left: background.x2 + 'px' }"></div>
    </div>
    <div id="clouds">
      <div v-for="cloud in clouds" :key="cloud.id" class="cloud" :style="{ left: cloud.x + 'px', top: cloud.y + 'px', background: `url(${cloud.sprite})`, 'background-size' : 'contain' }"></div>
    </div>
    <div id="dino" :style="{ bottom: dino.y + 'px', backgroundImage: `url(${dino.sprite})` }"></div>
    <div id="ground">
      <div class="ground" :style="{ left: ground.x1 + 'px' }"></div>
      <div class="ground" :style="{ left: ground.x2 + 'px' }"></div>
    </div>
    <div id="cactus" :style="{ left: cactus.x + 'px' }"></div>
    <div id="score">Score: {{ score }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import dinoRun1 from '../assets/sprites/player/dino1.png';
import dinoRun2 from '../assets/sprites/player/dino2.png';
import dinoRun3 from '../assets/sprites/player/dino3.png';
import dinoRun4 from '../assets/sprites/player/dino4.png';
import cloudSprite from '../assets/sprites/environment/cloud.png'

class Background {
  public x1: number;
  public x2: number;
  private speed: number;
  private width: number;

  constructor(speed: number, width: number) {
    this.x1 = 0;
    this.x2 = width;
    this.speed = speed;
    this.width = width;
  }

  update() {
    this.x1 -= this.speed;
    this.x2 -= this.speed;
    if (this.x1 <= -this.width) {
      this.x1 = this.width;
    }
    if (this.x2 <= -this.width) {
      this.x2 = this.width;
    }
  }
}

class Ground {
  public x1: number;
  public x2: number;
  private speed: number;
  private width: number;

  constructor(speed: number, width: number) {
    this.x1 = 0;
    this.x2 = width;
    this.speed = speed;
    this.width = width;
  }

  update() {
    this.x1 -= this.speed;
    this.x2 -= this.speed;
    if (this.x1 <= -this.width) {
      this.x1 = this.width;
    }
    if (this.x2 <= -this.width) {
      this.x2 = this.width;
    }
  }
}

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
  public sprite: string;
  private speed: number;

  constructor(id: number, x: number, y: number, speed: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = cloudSprite;
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
    const dinoSprites = [dinoRun1, dinoRun2, dinoRun3, dinoRun4];
    const dino = new Dino(dinoSprites, 20, 1, 10);
    const cactus = new Cactus(5, window.innerWidth - 40);
    const clouds = ref<Cloud[]>([]);
    const cloudCount = 5;
    const score = ref(0);
    const gameInterval = ref<number | null>(null);

    const backgroundWidth = window.innerWidth;
    const groundWidth = window.innerWidth;
    const background = new Background(2, backgroundWidth);
    const ground = new Ground(4, groundWidth);

    const startGame = () => {
      gameInterval.value = setInterval(gameLoop, 20);
    };

    const gameLoop = () => {
      cactus.update();
      moveClouds();
      dino.update();
      background.update();
      ground.update();

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
        // alert(`Game Over! Your score: ${score.value}`);
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
      document.addEventListener('click', jump)
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
      background,
      ground,
    };
  }
});
</script>

<style scoped>

#game {
  width: 100vw;
  height: 70vh;
  overflow: hidden;
  position: relative;
  background-color: #6fbeff;
  z-index:-2;
}

#background {
  position: absolute;
  width: 200%;
  height: 45%;
  bottom: 0;
  left: 0;
  z-index: -1;
  display: flex;
  opacity: 70%;
}

.bg {
  width: 100%;
  height: 100%;
  background: url('../assets/sprites/environment/background.png');
  background-size: contain;
  background-repeat: repeat-x;
  position: absolute;
}

#clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 70%;
  display: flex;
}

.cloud {
  width: 100px;
  height: 50px;
  position: absolute;
}

#dino {
  width: 120px;
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 0;
  left: 120px;
  z-index: 2;
}

#cactus {
  width: 40px;
  height: 82px;
  background: url('../assets/sprites/environment/cactus.png');
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 0;
  left: calc(100vw - 40px);
  z-index: 2;
}

#score {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
}

#ground {
  position: absolute;
  width: 200%;
  height: 30px;
  bottom: -3px;
  left: 0;
  z-index: -1;
}

.ground {
  width: 100%;
  height: 100%;
  background-repeat: repeat-x;
  background: url('../assets/sprites/environment/ground.png');
  background-size: contain;
  background-repeat: repeat-x;
  position: absolute;
}
</style>
