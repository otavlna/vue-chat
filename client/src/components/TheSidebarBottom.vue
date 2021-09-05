<template>
  <aside class="bottom-sidebar">
    <textarea
      v-focus
      @input="onInput"
      @keydown.enter.exact.prevent="send"
      v-model="text"
      class="message-input"
      placeholder="Message"
    ></textarea>
    <button class="message-submit" @click="send">
      Send
    </button>
  </aside>
</template>

<script>
export default {
  name: "TheSidebarBottom",
  data() {
    return {
      text: ""
    };
  },
  methods: {
    onInput(event) {
      // automaticky zvětší textarea až do arbitrárně zvoleného limitu (ukradeno od někud jinud)
      const textarea = event.srcElement;
      textarea.style.height = "auto";
      if (textarea.scrollHeight < 305) {
        textarea.style.height = textarea.scrollHeight + "px";
      } else {
        textarea.style.height = 305 + "px";
      }
    },

    send() {
      if (this.text.length === 0) {
        return;
      }
      this.$emit("send", this.text);
      this.text = "";
    }
  },
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      }
    }
  }
};
</script>

<style scoped>
.bottom-sidebar {
  display: flex;
  align-items: flex-start;
  border-radius: 15px;
  margin: 0 10px 10px 10px;
  padding: 0 30px 0 5px;
  background-color: #f1f1f1;
}

.message-input {
  margin-left: 10px;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  border: none;
  padding: 10px;
  outline: none;
  resize: none;
}

.message-submit {
  margin: 10px 0 0 10px;
}
</style>