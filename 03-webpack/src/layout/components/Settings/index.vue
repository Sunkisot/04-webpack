<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">系统布局配置</h3>

      <div class="drawer-item">
        <span>主题颜色</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="colorChange($event, '_primary')"
        />
      </div>
      <div class="drawer-item">
        <span>成功颜色</span>
        <el-color-picker
          class="theme-picker"
          popper-class="theme-picker-dropdown"
          :predefine="[
            '#13ce66',
            '#1890ff',
            '#304156',
            '#212121',
            '#11a983',
            '#13c2c2',
            '#6959CD',
            '#f5222d',
          ]"
          v-model="success"
          @change="colorChange($event, 'success')"
        ></el-color-picker>
      </div>
      <div class="drawer-item">
        <span>警告颜色</span>
        <el-color-picker
          class="theme-picker"
          popper-class="theme-picker-dropdown"
          :predefine="[
            '#FFBA00',
            '#1890ff',
            '#304156',
            '#212121',
            '#11a983',
            '#13c2c2',
            '#6959CD',
            '#f5222d',
          ]"
          v-model="warning"
          @change="colorChange($event, 'warning')"
        ></el-color-picker>
      </div>
      <div class="drawer-item">
        <span>错误颜色</span>
        <el-color-picker
          class="theme-picker"
          popper-class="theme-picker-dropdown"
          :predefine="[
            '#ff4949',
            '#1890ff',
            '#304156',
            '#212121',
            '#11a983',
            '#13c2c2',
            '#6959CD',
            '#f5222d',
          ]"
          v-model="danger"
          @change="colorChange($event, 'danger')"
        ></el-color-picker>
      </div>

      <div class="drawer-item">
        <span>开启 Tags-Views</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定 Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from "./components/ThemePicker.vue";

export default {
  components: { ThemePicker },
  data() {
    return {
      warning: "#FFBA00",
      success: "#13ce66",
      danger: "#ff4949",
    };
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.getters.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/ChangeSettings", {
          fixedHeader: val,
        });
      },
    },
    tagsView: {
      get() {
        return this.$store.getters.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/ChangeSettings", {
          tagsView: val,
        });
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.getters.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/ChangeSettings", {
          sidebarLogo: val,
        });
      },
    },
    defaultWarning() {
      return this.$store.getters.warning.startsWith('#') ? this.$store.getters.warning : '#FFBA00'
    },
    defaultSuccess() {
      return this.$store.getters.success.startsWith('#') ? this.$store.getters.success : '#13ce66'
    },
    defaultDanger() {
      return this.$store.getters.danger.startsWith('#') ? this.$store.getters.danger : '#ff4949'
    }
  },
  methods: {
    colorChange(val, type) {
      console.log({
        [type]: val,
      })
      this.$store.dispatch("settings/ChangeSettings", {
        [type]: val,
      });
      document
        .getElementsByTagName("body")[0]
        .style.setProperty("--" + type, val);
    },
  },
  watch: {
    defaultWarning: {
      handler(val) {
        this.warning = val
      },
      immediate: true
    },
    defaultSuccess: {
      handler(val) {
        this.success = val
      },
      immediate: true
    },
    defaultDanger: {
      handler(val) {
        this.danger = val
      },
      immediate: true
    },
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}
.theme-picker {
  float: right;
  height: 26px;
  margin: -3px 8px 0 0;
}
.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
