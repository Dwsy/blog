<template>
  <v-container grid-list-xs>
    <v-card max-width="mx-auto" class="mx-auto">
      <v-row justify="space-around">
        <v-col>
          <v-sheet elevation="0" class="pa-10 ma-2" >
            <h2 class="title mb-2">
              文章筛选:{{tagName}}
            </h2>

              <v-chip
                v-for="tag in tags"
                :key="tag._id"
                :color="tag.colours"
                label
                class="ma-1"
                :to="`/tag/${tag._id}`"
              >
                {{ tag.name }} <b>{{ tag.contentsNum }}</b>
                <v-avatar v-show="tag.icon">
                  <v-icon>{{ tag.icon }}</v-icon>
                </v-avatar>
              </v-chip>

          </v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <ArticleList :fields="fields" />
  </v-container>
</template>

<script>
import ArticleList from "../../components/article/ArticleList";
export default {
  components: { ArticleList },
  // props: {
  //   tags:[]
  // }
  async asyncData({ $axios, params }) {
    let id = params.id;
    if (id === undefined) {
      id = "603befa8b139000093003433";
    }

    // console.log(id);
    const data = await $axios.$get("tag", {
      params: {
        query: {
          limit: 777,
          sort: "-contentsNum",
        }
      }
    });
    const fields = await $axios.$get(`tag/article/${id}`);
      let tagName= String;
       (data.data).forEach(p=>{
          if (p._id===id){
              tagName = p.name
             return
          }
      })
      // console.log(tagName)

    // console.log(fields);
    return { tags: data.data, fields: fields,tagName:tagName };
  },
  // data() {
  //   return {
  //     // selects: []
  //   };
  // },
  // watch: {
  //   selects: {
  //     handler(val) {
  //       // console.log(this.selects);
  //       // console.log(this.tags);
  //       // console.log(this.tags[this.selects]._id);
  //       this.$router.push(`/tag/${this.tags[this.selects]._id}`);
  //     },
  //     deep: true
  //   }
  // }
};
</script>
