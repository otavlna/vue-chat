<template>
  <header class="header">
    <button class="collapse-sidebar-button" @click="$emit('switchSidebar')">
      ☰
    </button>
    <h2 class="channel-heading">{{ channelName }}</h2>
  </header>
</template>

<script>
export default {
  name: "TheHeader",
  props: {
    channelName: ""
  }
};
</script>

<style scoped>
.header {
  margin-bottom: auto;
  padding: 20px 10px;
  border-bottom: 1px #f1f1f1 solid;
  /* background: #d1d1d1; */
  display: flex;
  flex-direction: row;
  align-items: center;
}

.channel-heading {
  margin: 0 0 0 20px;
  font-size: 1em;
}
</style>