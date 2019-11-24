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
          if(err.message){
            this.$message.error(err.message);  
          }else{
            this.$message.error(err);
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
