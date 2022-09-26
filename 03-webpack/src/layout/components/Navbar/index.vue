<template>
  <div class="navbar">
    <Hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <HeaderSearch id="header-search" class="right-menu-item" />
        <!--
        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="sys-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="sys-doc" class="right-menu-item hover-effect" />
        </el-tooltip>
      -->
        <Screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <SizeSelect id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        @command="handleCommand"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item command="setting">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./components/Breadcrumb";
import Hamburger from "./components/Hamburger";
import Screenfull from "./components/Screenfull";
import SizeSelect from "./components/SizeSelect";
import HeaderSearch from "./components/HeaderSearch";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    HeaderSearch,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/ToggleSidebar");
    },
    handleCommand(command) {
      if (command == "setting") {
        this.setting();
      } else if (command == "logout") {
        this.logout();
      }
    },
    // 布局设置
    setting() {
      this.$store.dispatch("settings/ChangeSettings", {
        showSettings: true,
      });
    },
    // 退出登录
    logout() {
      this.$confirm(this.$t("logout.logoutHint"), this.$t("logout.hint"), {
        confirmButtonText: this.$t("gBtnConfirm"),
        cancelButtonText: this.$t("gBtnCancel"),
        type: "warning",
      }).then(async () => {
        await this.$store.dispatch("user/Logout");
        location.reload(); // 刷新页面
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          position: absolute;
          right: -25px;
          top: 17px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
