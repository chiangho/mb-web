<template>
  <div class="my-chat">
    <a-row v-for="data in dataArray" :key="data.code">
      <a-col :span="12">{{data.showPersionName}}</a-col>
      <a-col :span="12">{{data.content}}</a-col>
    </a-row>
  </div>
</template>
<style>
.my-chat {
  height: 350px;
  overflow-y: auto;
}
</style>


<script>
import http from "./../Https.js";
// import { mapGetters } from 'vuex'

export default {
  name: "MyChat",

  props: {
    contactNickname: {
      type: String,
      default: "自己"
    },

    width: {
      type: Number,
      default: 450
    },

    maxHeight: {
      type: Number,
      default: 700
    },

    contactAvatarUrl: {
      type: String
    },

    ownerAvatarUrl: {
      type: String
    },

    getUpperData: {
      type: Function,
      required: true
    },

    getUnderData: {
      type: Function,
      required: true
    },
    tagMemberCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isUpperLaoding: false,
      isUnderLaoding: false,

      isRefreshedAll: false,
      isLoadedAll: false,

      minHeight: 700,

      dataArray:[]
    };
  },
  created() {
    if (this.$store.getters.isNullDialogueForMember(this.tagMemberCode)) {
      http
        .ajax(
          "get",
          "dialogue/load-member",
          { targeMemberCode: this.tagMemberCode },
          null
        )
        .then(resp => {
          resp.data.forEach(item => {
            this.$store.commit("addDialogue", item);
          });
        })
        .catch(() => {});
    }
    this.dataArray = this.$store.getters.getUserDialogueData(this.tagMemberCode);
    this.setMessage();
  },
  methods: {
    setMessage() {
      setTimeout(()=>{
        this.$store.commit("addDialogue", {
          code: 121212,
          memberCode: this.tagMemberCode,
          tagMemberCode: this.tagMemberCode,
          showPersionCode: "12345",
          showPersionName: "1234567",
          time: 1576581617000,
          content: "1234567890",
          isSelf: 0
        });
      }, 10000);
    },
    //向上拉刷新
    refresh(done) {
      var me = this;
      if (me.isUpperLaoding) {
        return;
      }

      if (me.isRefreshedAll) {
        done(true);
        me.isUpperLaoding = false;
        return;
      }

      try {
        this.getUpperData().then(function(data) {
          if (data.length == 0) {
            me.isRefreshedAll = true;
            done(true);
          } else {
            me.dataArray = data.reverse().concat(me.dataArray); //倒序合并
            done();
          }
        });
      } catch (error) {
        window.console.error(
          'wxChat: props "getUpperData" must return a promise object!'
        );
      }
      me.isUpperLaoding = false;
    },

    //向下拉加载
    infinite(done) {
      var me = this;
      if (me.isUnderLaoding) {
        return;
      }
      if (me.isLoadedAll) {
        done(true);
        me.isUnderLaoding = false;
        return;
      }

      try {
        this.getUnderData().then(function(data) {
          if (data == 0) {
            me.isLoadedAll = true;
            done(true);
          } else {
            done();
            me.dataArray = me.dataArray.concat(data); //直接合并
          }
        });
      } catch (error) {
        window.console.error(
          'wxChat: props "getUnderData" must return a promise object!'
        );
      }
      me.isUnderLaoding = false;
    }
  }
};
</script>