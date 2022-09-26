<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./components/Logo";
import SidebarItem from "./components/SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: {
    SidebarItem,
    Logo,
  },
  computed: {
    ...mapGetters(["routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.getters.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() { // 菜单是否折叠
      return !this.sidebar.opened;
    },
  },
};
</script>

<style scoped>
/* .el-menu {
  background-color: rgba(0, 0, 0, 0)!important;
} */
.sidebar-container /deep/ .el-menu--inline .el-menu-item {
  color: #acc1eb !important;
}
.sidebar-container /deep/ .el-menu--inline .is-active {
  color: #fff !important;
  background: url("../../../assets/images/slices.png") 28px 4px no-repeat !important;
  background-size: 140px !important;
}
/* .sidebar-container /deep/ .el-submenu__title {
  background-color: rgba(0, 0, 0, 0)!important;
} */
</style>
