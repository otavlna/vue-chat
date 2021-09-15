<template>
  <aside
    class="left-sidebar"
    :class="sidebarOpen ? 'left-sidebar-open' : 'left-sidebar-close'"
  >
    <h1>Vue-chat</h1>
    <button @click="$emit('switchNewChannel')">
      New channel
    </button>
    <ul>
      <li
        v-for="channel in channels"
        :class="channel._id === activeChannelId ? 'selected' : ''"
        :key="channel.id"
        @click="changeChannel(channel._id)"
      >
        {{ channel.name }}
      </li>
    </ul>
    <div class="user-info">
      <img :src="avatar" alt="" class="avatar" />
      <span class="username"> {{ username }} </span>
      <button class="user-edit" @click="$emit('switchUserSettings')">
        Edit
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: "TheSidebarLeft",
  methods: {
    changeChannel(id) {
      if (id !== this.activeChannelId) {
        this.$emit("changeChannel", id);
      }
    }
  },
  props: {
    sidebarOpen: Boolean,
    channels: Array,
    activeChannelId: String,
    username: String,
    avatar: String
  }
};
</script>

<style scoped>
.left-sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px #f1f1f1 solid;
  height: 100vh;

  overflow-x: hidden;

  text-align: center;
  transition: width 0.25s, padding 0.25s;
  white-space: nowrap;
}

.left-sidebar-open {
  width: 200px;
  padding: 20px 10px;
}

.left-sidebar-close {
  width: 0;
  padding: 20px 0;
}

.left-sidebar h1 {
  margin: 0 0 20px 0;
  text-align: center;
}

.left-sidebar button {
  white-space: nowrap;
}

.left-sidebar ul {
  list-style-type: none;
  text-align: left;
  padding: 0;
}

.left-sidebar li {
  padding-left: 5px;
  border-left: 3px solid #f1f1f1;
  margin-bottom: 5px;
}

.left-sidebar li:hover {
  border-left: 3px solid black;
  cursor: pointer;
}

.left-sidebar .selected {
  border-left: 3px solid blue !important;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
}

.avatar {
  border-radius: 100%;
  width: 32px;
  height: 32px;
}

.username {
  font-size: 1em;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 0.5rem;
}

.user-edit {
  margin-left: auto;
}
</style>