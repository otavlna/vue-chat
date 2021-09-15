<template>
  <TheSidebarLeft
    :sidebarOpen="sidebarShown"
    :channels="channels"
    :activeChannelId="activeChannelId"
    :username="this.user.username"
    :avatar="this.user.avatar"
    @switch-user-settings="userSettingsShown = !userSettingsShown"
    @switch-new-channel="newChannelShown = !newChannelShown"
    @change-channel="this.activeChannelId = $event"
  />
  <div class="main-parent">
    <TheHeader
      @switch-sidebar="sidebarShown = !sidebarShown"
      :channelName="
        this.currentActiveChannel ? this.currentActiveChannel.name : ''
      "
    />
    <main class="messages">
      <MessageItem
        v-for="message in this.currentChannelMessages"
        :key="message"
        :msg="message.what"
        :time="
          new Date(message.when).toLocaleDateString() +
            ' ' +
            new Date(message.when).toLocaleTimeString()
        "
        :nick="message.who"
        :avatarUrl="message.avatar"
      />
      <p v-if="!currentActiveChannel">No channels found!</p>
    </main>
    <TheSidebarBottom @send="sendMessage" />
  </div>
  <TheUserSettings
    :shown="userSettingsShown"
    v-model:username="user.username"
    v-model:avatar="user.avatar"
    @switch-user-settings="userSettingsShown = !userSettingsShown"
    @change-user-settings="onChangeUserSettings"
  />
  <TheNewChannel
    :shown="newChannelShown"
    @switch-new-channel="newChannelShown = !newChannelShown"
    @create-new-channel="createNewChannel"
  />
</template>

<script>
import MessageItem from "./components/MessageItem.vue";
import TheSidebarLeft from "./components/TheSidebarLeft.vue";
import TheSidebarBottom from "./components/TheSidebarBottom.vue";
import TheHeader from "./components/TheHeader.vue";
import TheUserSettings from "./components/TheUserSettings.vue";
import TheNewChannel from "./components/TheNewChannel.vue";

export default {
  name: "App",
  components: {
    MessageItem,
    TheSidebarLeft,
    TheSidebarBottom,
    TheHeader,
    TheUserSettings,
    TheNewChannel
  },

  data() {
    return {
      sidebarShown: true,
      userSettingsShown: false,
      newChannelShown: false,
      socket: null,
      channels: [],
      activeChannelId: null,
      user: {
        username: "",
        avatar: ""
      }
    };
  },

  methods: {
    onChangeUserSettings(username, avatar) {
      this.user.username = username;
      this.user.avatar = avatar;
    },

    sendMessage(message) {
      const obj = {
        type: "newmessage",
        data: {
          message: message,
          username: this.user.username,
          avatar: this.user.avatar,
          channelId: this.activeChannelId,
          when: Date.now()
        }
      };
      this.socket.send(JSON.stringify(obj));
    },

    createNewChannel(channelName) {
      const obj = {
        type: "newchannel",
        data: {
          channelName: channelName
        }
      };
      this.socket.send(JSON.stringify(obj));
    }
  },

  computed: {
    currentActiveChannel() {
      return this.channels.find(
        channel => channel._id === this.activeChannelId
      );
    },

    currentChannelMessages() {
      const channel = this.currentActiveChannel;
      if (channel) {
        return channel.messages;
      }
    }
  },

  created() {
    this.socket = new WebSocket("ws://localhost:9001/");

    this.socket.onopen = event => {
      console.log("requested getall");
      this.socket.send(JSON.stringify({ type: "getall" }));
    };

    this.socket.onmessage = event => {
      const res = JSON.parse(event.data);
      switch (res.type) {
        case "all":
          console.log(res.data);
          this.channels.splice(0, this.channels.length, ...res.data);
          break;
      }
      if (!this.activeChannelId) {
        this.activeChannelId = this.channels[0]._id;
      }
    };

    const localUsername = window.localStorage.getItem("username");
    const localAvatar = window.localStorage.getItem("avatar");
    this.user.username = localUsername ? localUsername : "Anonymous";
    this.user.avatar = localAvatar
      ? localAvatar
      : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1024px-Anonymous_emblem.svg.png";
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

html {
  font-size: 15px;
}

body {
  margin: 0;
}

#app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
}

.main-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #fff;
}

.messages {
  padding: 0 10px 20px 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
