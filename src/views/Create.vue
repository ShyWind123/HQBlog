<template>
  <div class="createContainer">
    <div class="settingContainner">
      <div class="infoContainer">
        <div class="titleSumContainer">
          <div class="titleContainer">
            <v-text-field label="标题" placeholder="请输入标题" variant="outlined" density="comfortable"></v-text-field>
          </div>
          <div class="summaryContainer">
            <v-textarea label="概要" placeholder="请输入概要" variant="outlined" no-resize></v-textarea>
          </div>
        </div>
        <div class="tagsContainer">
          <div class="tagsTitleContainer">
            <div class="tagsTitle">标签</div>
            <v-btn>一键生成</v-btn>
            <v-btn>添加标签</v-btn>
          </div>
          <v-chip-group column>
            <v-chip text="Elevator" variant="outlined" filter></v-chip>
            <v-chip text="Washer / Dryer" variant="outlined" filter></v-chip>
            <v-chip text="Fireplace" variant="outlined" filter></v-chip>
            <v-chip text="Wheelchair access" variant="outlined" filter></v-chip>
          </v-chip-group>
        </div>
      </div>
      <div class="optionContainer">

      </div>
    </div>
    <div id="vditor"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import Vditor from 'vditor';

const vditor = ref<Vditor | null>(null);

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    "mode": "ir",
    "icon": "material",
    "minHeight": 600,
    "counter": {
      "enable": true
    },
    "outline": {
      "enable": true,
      "position": "left"
    },
    // "width": screen.width * 0.96,
    after: () => {
      vditor.value.setTheme('dark', 'dark')
    }
  });
});
</script>

<style scoped>
.createContainer {
  /* background-color: var(--primary-color); */
  height: auto;
  overflow: auto;
  margin: 30px 0;
}

.settingContainner {
  width: auto;
  height: auto;
  /* background-color: #ada; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.infoContainer {
  width: 60vw;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.titleSumContainer {
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}

.titleContainer {
  width: 100%;
}

.summaryContainer {
  width: 100%;
  height: auto;
}

.tagsContainer {
  width: 20%;
  height: auto;
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}

.optionContainer {
  width: 15vw;
  height: auto;
  margin: 10px;
}
</style>