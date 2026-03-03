<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()

</script>
<template>
  <div class="panel-heading">
    <div class="panel-lead">
      <div class="title">{{ route.meta.name }}</div>
      <p class="description">{{ route.meta.describe }}</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.panel-heading {
    padding:5px 8px ;
    z-index: 2;
    background: #e8edf0;
    border-color: #e8edf0;
    border-radius: 10px;
    height: 50%;
    position: relative;
    .panel-lead {
      font-size: 14px;
      .title {
        font-weight: bold;
        font-style: normal;
      }
      .description {
        text-indent: 2em;
        margin-top: 5px;
      }
    }
  }
</style>
