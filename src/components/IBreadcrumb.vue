<template>
  <v-app-bar
    class="m-toolbar"
    elevation="1"
    dense
  >
    <ul class="breadcrumb hidden-xs-only">
      <li v-for="item in items" :key="item.text">
        <router-link :to="item.href">{{ item.text }}</router-link>
      </li>
    </ul>
    <v-breadcrumbs class="hidden-sm-and-up" :items="items" >
      <template #item="{ item }">
        <v-breadcrumbs-item
          :href="item.href"
          :disabled="item.disabled"
        >
          {{ item.text.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </v-app-bar>
</template>

<script>
export default {
  props: ['items']
}
</script>

<style lang="css" scoped>
.m-toolbar >>> .v-toolbar__content {
  padding: 0px !important;
}

.breadcrumb {
  list-style: none;
  overflow: hidden;
  font: 14px Arial, Sans-Serif;
  padding: 0;
}

.breadcrumb li {
  float: left;
}

.breadcrumb li a {
  color: white;
  text-decoration: none;
  padding: 10px 0 10px 55px;
  background: brown; /* fallback color */
  background: green;
  position: relative;
  display: block;
  float: left;
}

.breadcrumb li a:after {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border-top: 50px solid transparent; /* Go big on the size, and let overflow hide */
  border-bottom: 50px solid transparent;
  border-left: 30px solid green;
  position: absolute;
  top: 50%;
  margin-top: -50px;
  left: 100%;
  z-index: 2;
}

.breadcrumb li a:before {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border-top: 50px solid transparent; /* Go big on the size, and let overflow hide */
  border-bottom: 50px solid transparent;
  border-left: 30px solid white;
  position: absolute;
  top: 50%;
  margin-top: -50px;
  margin-left: 1px;
  left: 100%;
  z-index: 1;
}

.breadcrumb li:first-child a {
  padding-left: 10px;
}

.breadcrumb li:nth-child(2) a {
  background: hsla(34, 85%, 45%, 1);
}

.breadcrumb li:nth-child(2) a:after {
  border-left-color: hsla(34, 85%, 45%, 1);
}

.breadcrumb li:nth-child(3) a {
  background: hsla(34, 85%, 55%, 1);
}

.breadcrumb li:nth-child(3) a:after {
  border-left-color: hsla(34, 85%, 55%, 1);
}

.breadcrumb li:nth-child(4) a {
  background: hsla(34, 85%, 65%, 1);
}

.breadcrumb li:nth-child(4) a:after {
  border-left-color: hsla(34, 85%, 65%, 1);
}

.breadcrumb li:nth-child(5) a {
  background: hsla(34, 85%, 75%, 1);
}

.breadcrumb li:nth-child(5) a:after {
  border-left-color: hsla(34, 85%, 75%, 1);
}

.breadcrumb li:last-child a {
  background: transparent !important;
  color: black;
  pointer-events: none;
  cursor: default;
}

.breadcrumb li:last-child a:after {
  border: 0;
}

.breadcrumb li a:hover {
  background: green;
}

.breadcrumb li a:hover:after {
  border-left-color: green !important;
}

</style>
