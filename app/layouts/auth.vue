<template>
  <div class="auth-page-wrapper">
    <slot />
  </div>
</template>

<style>
@import '~/assets/css/auth.css';
@import '~/assets/css/auth-modern.css';
</style>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>
