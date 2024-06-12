<template>
    <div id="intro">
      <img src="/src/assets/splash_transparent.png" alt="Logo" id="logo" />
      <button @click="startGame">Start Game</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'IntroPage',
    setup() {
      const router = useRouter();
  
      const startGame = () => {
        router.push({ name: 'Game' });
      };
  
      return { startGame };
    },
  });
  </script>
  
  <style scoped>
  #intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  #logo {
    width: 200px;
    margin-bottom: 20px;
  }
  
  #intro button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  