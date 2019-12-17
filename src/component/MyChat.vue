<template>
  <div class="my-chat">
    <div class="my-chat-dialogue">
      <a-row
        :class="'my-chat-row '+(data.isSelf==0?'':'self')"
        v-for="data in dataArray"
        :key="data.code"
      >
        <a-col :span="24">
          <p class="time">
            <span v-text="data.time"></span>
          </p>
          <p class="time system">
            <span v-html="data.content"></span>
          </p>

          <!-- <div>{{data.showPersionName}}</div>
          <div class="text">{{data.content}}</div> -->
        </a-col>
      </a-row>
    </div>
    <a-divider />
    <div class="my-chat-send">
      <div>
        <a-textarea v-model="message" placeholder="填写发送内容" :rows="4" />
      </div>
      <div>
        <a-button @click="sendMessage()">提交</a-button>
      </div>
    </div>
  </div>
</template>
<style>
.my-chat {
  height: 400px;
}

.my-chat-send {
  height: 100px;
}

.my-chat-dialogue {
  height: 200px;
  overflow-y: auto;
  /*height: 100%;*/
  padding: 10px 15px;
  /*overflow-y: scroll;*/
  background-color: #f5f5f5;
}
.my-chat-dialogue .my-chat-row {
  margin-bottom: 15px;
  left: 0;
  position: relative;
  display: block;
}
.my-chat-dialogue .time {
  margin: 10px 0;
  text-align: center;
}
.my-chat-dialogue .text {
  display: inline-block;
  position: relative;
  padding: 0 10px;
  max-width: calc(100% - 75px);
  min-height: 35px;
  line-height: 2.1;
  font-size: 15px;
  padding: 6px 10px;
  text-align: left;
  word-break: break-all;
  background-color: #fff;
  color: #000;
  border-radius: 4px;
  box-shadow: 0px 1px 7px -5px #000;
}
.my-chat-dialogue .avatar {
  float: left;
  margin: 0 10px 0 0;
  border-radius: 3px;
  background: #fff;
}
.my-chat-dialogue .time > span {
  display: inline-block;
  padding: 0 5px;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
  background-color: #dadada;
}
.my-chat-dialogue .system > span {
  padding: 4px 9px;
  text-align: left;
}
.my-chat-dialogue .text:before {
  content: " ";
  position: absolute;
  top: 9px;
  right: 100%;
  border: 6px solid transparent;
  border-right-color: #fff;
}
.my-chat-dialogue .self {
  text-align: right;
}
.my-chat-dialogue .self .avatar {
  float: right;
  margin: 0 0 0 10px;
}
.my-chat-dialogue .self .text {
  background-color: #9eea6a;
}

.my-chat-dialogue .self .text:before {
  right: inherit;
  left: 100%;
  border-right-color: transparent;
  border-left-color: #9eea6a;
}
.my-chat-dialogue .image {
  max-width: 200px;
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
      default: 450
    },
    tagMemberCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dataArray: [],
      message: ""
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
    this.dataArray = this.$store.getters.getUserDialogueData(
      this.tagMemberCode
    );
  },
  methods: {
    sendMessage() {
      alert(this.message);
    }
  }
};
</script>