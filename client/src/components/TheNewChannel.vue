<template>
  <div class="modal-container" v-show="shown">
    <div class="modal">
      <label for="channelName">Channel name</label>
      <input
        type="text"
        name="channelName"
        v-model="channelName"
        @keydown.enter.exact.prevent="save"
      />
      <div class="button-container">
        <button @click="$emit('switchNewChannel')">
          Cancel
        </button>
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

  data() {
    return {
      channelName: null
    };
  },

  props: {
    shown: Boolean
  },

  methods: {
    save() {
      this.$emit("createNewChannel", this.channelName);
      this.$emit("switchNewChannel");
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