<template>
  <div id="app">
    <component :is="layout">
      <router-view :layout.sync="layout"/>
    </component>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      layout: 'div',
      siteNameTemplate: '%s - CHẤM ĐIỂM VĂN HÓA XÃ PHƯỜNG - TP. SA ĐÉC'
    };
  },
  provide() {
    return {
      siteNameTemplate: this.siteNameTemplate
    };
  },
};
</script>
