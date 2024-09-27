<template>
  <v-app class="allContainer">
    <!-- <v-app-bar extended>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-dots-vertical">
      </v-btn>
    </v-app-bar> -->
    <div class="allTitleContainer">
      <span class="allTitle">所有草稿</span>
    </div>

    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="draft in drafts" :key="draft.id" cols="4">
            <v-card class="draftCardContainer" height="300">
              <div class="draftTitleContainer" @click="onClickDraftTitle(draft.id)">{{ draft.title }}</div>
              <div class="draftSummaryContainer">{{ draft.summary }}</div>
              <div class="draftTagsContainer">
                <v-chip-group>
                  <v-chip v-for="tag in draft.tags" label>
                    <router-link :to="{ name: 'tags', query: { tag: tag } }">{{ tag }}</router-link>
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '../store/UserStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();

const drafts = ref([]);

const onClickDraftTitle = (id: number) => {
  router.push({ 'name': 'create', params: { id: id } })
}

onMounted(() => {
  axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/blog/my-blogs?uid=' + userStore.getUid() + '&state=' + "草稿",
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      drafts.value = response.data.data.reverse();
    })
    .catch((error) => {
      console.log(error);
    });
})
</script>

<style scoped>
.allContainer {
  /* background-color: var(--primary-color); */
  height: 800px;
  overflow: auto;
  margin: 30px;
}

.allTitleContainer {
  font-size: 30px;
  font-weight: bold;
  width: auto;
  margin: 20px 50px;
}

.allTitle {
  border-bottom: 3px solid var(--primary-color);
}

.draftCardContainer {
  padding: 20px;
  color: var(--light-background);
  background-color: var(--dark-background);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
}

.draftTitleContainer {
  font-size: 24px;
  font-weight: bold;
}

.draftTitleContainer:hover {
  color: var(--primary-color);
  cursor: pointer;
}

.draftSummaryContainer {
  margin: 5px;
}

.draftTagsContainer {
  display: flex;
}
</style>