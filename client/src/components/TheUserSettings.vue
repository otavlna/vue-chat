<template>
  <div class="modal-container" v-show="shown">
    <div class="modal">
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        name="username"
        v-model="username"
        @keydown.enter.exact.prevent="save"
      />
      <label for="avatar">Avatar url</label>
      <input
        id="avatar"
        type="url"
        name="avatar"
        v-model="avatar"
        @keydown.enter.exact.prevent="save"
      />
      <div class="button-container">
        <button @click="$emit('switchUserSettings')">Cancel</button>
        <button @click="save">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheUserSettings",

  props: {
    shown: Boolean,
    username: String,
    avatar: String
  },

  methods: {
    save() {
      localStorage.setItem("username", this.username);
      localStorage.setItem("avatar", this.avatar);
      this.$emit("changeUserSettings", this.username, this.avatar);
      this.$emit("switchUserSettings");
    }
  }
};
</script>

<style>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 200px;
  padding: 20px;
  background: yellow;
}

.button-container {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>