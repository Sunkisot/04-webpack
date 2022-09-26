<template>
  <!-- 图片预览 -->
  <el-image-viewer
    v-if="previewImg"
    :on-close="handleCloseImg"
    :url-list="previewImgList"
  ></el-image-viewer>
</template>

<script>
/**
 * GvImageViewer 图片预览组件
 * @author 计欣奇
 * @time 2020/11/08
 */
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  name: "GvImageViewer",
  components: {
    ElImageViewer,
  },
  data() {
    return {
    };
  },
  methods: {
    handleCloseImg() {
      this.$store.dispatch('app/SetPreviewImg', {
        visable: false
      })
    }
  },
  computed: {
    previewImg() {
      return this.$store.getters.previewImg;
    },
    previewImgList() {
      return this.$store.getters.previewImgList;
    }
  },
};
</script>

<style>
</style>