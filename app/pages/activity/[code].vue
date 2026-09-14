<script setup lang="ts">
const route = useRoute();
const code = String(route.params.code || '');

await navigateTo(`/luxury/activity/${encodeURIComponent(code)}`, {
  redirectCode: 301,
  replace: true,
});
</script>

<template>
  <div></div>
</template>
