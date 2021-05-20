<template>
  <div id="message" v-scroll-bottom="sessions">
    <ul
      style="padding-left:0px"
      v-show="currentSession == item"
      v-for="item in sessions"
      :key="item"
    >
      <li v-for="entry in item.messages" :key="entry">
        <p class="time">
          <span>{{ entry.date | time }}</span>
        </p>
        <div class="main" :class="{ self: entry.self }">
          <img class="avatar" :src="entry.self ? img : item.user.img" alt="" />
          <p class="text">{{ entry.content }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'message',
  data() {
    return {
      img: 'http://localhost:8081/src/assets/images/1.jpg'
    }
  },
  computed: mapState(['sessions', 'currentSession']),
  filters: {
    time(date) {
      if (date) {
        date = new Date(date)
      }
      return `${date.getHours()}:${date.getMinutes()}`
    }
  },
  directives: {
    'scroll-bottom'(el) {
      setTimeout(function() {
        el.scrollTop += 9999
      }, 1)
    }
  }
}
</script>

<style lang="less" scoped>
#message {
  padding: 15px;
  max-height: 68%;
  overflow-y: scroll;
  ul {
    list-style-type: none;
    li {
      margin-bottom: 15px;
    }
  }
  .time {
    text-align: center;
    margin: 7px 0;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      background-color: #dcdcdc;
      border-radius: 2px;
    }
  }
  .main {
    .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 80%;
      background-color: #fafafa;
      border-radius: 4px;
      line-height: 30px;
    }
  }
  .self {
    text-align: right;
    .avatar {
      float: right;
      margin: 0 0 0 10px;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 80%;
      background-color: #b2e281;
      border-radius: 4px;
      line-height: 30px;
    }
  }
}
</style>
