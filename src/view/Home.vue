<template>
  <div>内容</div>
</template>
<script>
import Http from "./../Https";
export default {
  data() {
    return {
      publishBookList: []
    };
  },
  created() {
    this.loadPublishBookList();
  },
  methods: {
    //加载发布的图书
    loadPublishBookList() {
      Http.ajax("get","book/publish-book/query",null,null)
        .then(res => {
          this.publishBookList = res.data;
        })
        .catch(err => {
          this.$message.error(JSON.stringify(err));
        });
    }
  }
};
</script>
<style scoped>
</style>
