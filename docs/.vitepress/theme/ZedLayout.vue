<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
</script>

<template>
  <div class="zed-site-shell">
    <div class="zed-noise" aria-hidden="true" />
    <div class="zed-gutter zed-gutter-left" aria-hidden="true">
      <span class="zed-ruler zed-ruler-a" />
    </div>
    <div class="zed-gutter zed-gutter-right" aria-hidden="true">
      <span class="zed-ruler zed-ruler-b" />
    </div>
    <Layout />
  </div>
</template>
