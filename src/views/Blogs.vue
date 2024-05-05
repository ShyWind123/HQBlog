<template>
  <v-divider vertical></v-divider>
  <div id="blogContainer">

    <v-text-field variant="outlined" label="密码" placeholder="请输入密码" spellcheck="false" clearable>

    </v-text-field>

  </div>
  <v-divider vertical></v-divider>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>

<style scoped>
#blogContainer {
  /* background-color: var(--primary-color); */
  height: 800px;
  width: 65vw;
}
</style>