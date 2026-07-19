<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Log In to Lvyv</h2>
      <p class="subtitle">Start your authentic Chinese journey</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username / Email</label>
          <input type="text" id="username" v-model="username" required placeholder="Enter username">
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required placeholder="Enter password">
        </div>

        <button type="submit" class="btn btn-lime btn-login">
          Log In <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" aria-hidden="true" />
        </button>
      </form>
      
      <div class="back-home">
        <NuxtLink to="/">← Back to Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const token = useCookie('token')

const handleLogin = () => {
  // 简易模拟登录，写入 Token 并跳转首页
  token.value = 'dummy-token-for-dev'
  alert('Logged in successfully!')
  navigateTo('/')
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
}
.login-box {
  background: #ffffff;
  border: 1px solid #e1e3db;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 4px 20px rgba(21, 75, 63, 0.05);
}
.login-box h2 {
  font-family: 'Playfair Display', serif;
  color: #154B3F;
  font-size: 28px;
  margin-bottom: 8px;
  text-align: center;
}
.subtitle {
  color: #606d5c;
  font-size: 14px;
  margin-bottom: 30px;
  text-align: center;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #154B3F;
  margin-bottom: 6px;
}
.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ccd1c7;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}
.form-group input:focus {
  border-color: #154B3F;
  box-shadow: 0 0 0 3px rgba(21, 75, 63, 0.1);
}
.btn-login {
  width: 100%;
  padding: 14px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  background-color: #cbef43;
  color: #154B3F;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.btn-login:hover {
  background-color: #b3d735;
  transform: translateY(-1px);
}
.back-home {
  text-align: center;
  margin-top: 24px;
}
.back-home a {
  color: #606d5c;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s ease;
}
.back-home a:hover {
  color: #154B3F;
}
</style>
