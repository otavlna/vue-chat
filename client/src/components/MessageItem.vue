<template>
  <article class="message">
    <img class="message-avatar" :src="avatarUrl" alt="" />
    <section class="message-section">
      <h6 class="message-nickname">{{ nick }}</h6>
      <span class="message-time">{{ time }}</span>
      <p class="message-content">{{ msg }}</p>
    </section>
  </article>
</template>

<script>
export default {
  name: "MessageItem",
  props: {
    avatarUrl: String,
    nick: String,
    time: String,
    msg: String
  }
};
</script>

<style>
.message {
  display: flex;
  margin: 10px 0 0 10px;
}

.message-avatar {
  border-radius: 100%;
  width: 48px;
  height: 48px;
}

.message-section {
  margin-left: 15px;
}

.message-nickname {
  font-size: 1em;
  margin: 3px 0 0 0;
  display: inline-block;
}

.message-time {
  margin-left: 10px;
  font-size: 0.8em;
  opacity: 80%;
}

.message-content {
  max-width: 100%;
  margin: 5px 0 0 0;
  overflow-wrap: anywhere;
}
</style>