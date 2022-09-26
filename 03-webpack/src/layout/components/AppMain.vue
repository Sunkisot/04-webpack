<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.getters.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // height: calc(100vh - 50px);
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fixed-header + .app-main {
  padding-top: 54px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    // height: calc(100vh - 84px);
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .fixed-header + .app-main {
    padding-top: 90px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.wrapper {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.hasTagsView .app-main .wrapper {
  flex: 1;
  overflow: auto;
  // height: calc(100vh - 100px);
}
</style>
