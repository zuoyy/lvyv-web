<template>
  <div class="blank-page-container">
    <div class="content-box">
      <h1>About Us</h1>
    </div>
  </div>
</template>

<style scoped>
.blank-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 100px 20px 80px 20px;
  background-color: #fcfdfa;
}
.content-box {
  background: #ffffff;
  border: 1px solid #e1e3db;
  border-radius: 16px;
  padding: 60px 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(21, 75, 63, 0.05);
}
h1 {
  font-family: 'Playfair Display', serif;
  color: #154B3F;
  font-size: 36px;
  margin-bottom: 12px;
}
.subtitle {
  color: #606d5c;
  font-size: 16px;
  margin-bottom: 30px;
}
.placeholder-content {
  border: 1px dashed #ccd1c7;
  border-radius: 8px;
  padding: 40px 20px;
  margin-bottom: 30px;
  color: #8fa08a;
  background: #fdfefc;
}
.back-home a {
  color: #154B3F;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}
.back-home a:hover {
  opacity: 0.8;
}
</style>
