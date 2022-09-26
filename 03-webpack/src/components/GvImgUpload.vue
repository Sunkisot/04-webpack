<template>
  <div>
    <el-upload
      v-bind="$attrs"
      class="avatar-uploader"
      :action="action"
      :http-request="httpRequest"
      :before-upload="beforeAvatarUpload"
      :show-file-list="false"
    >
      <i
        v-if="imgUrl && clearable"
        class="el-icon-error clear-icon"
        @click.stop="handleDel"
      ></i>
      <img
        v-if="imgUrl"
        :src="imgUrl"
        :style="{ width: imgWidth, height: imgHeight }"
        class="avatar"
      />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <span class="tip" v-if="tip">{{ tip }}</span>
  </div>
</template>

<script>
/**
 * 图片上传组件
 * @author 计欣奇
 * @time 2020/11/08
 */
import { uploadFile } from "@/api/sys";
export default {
  name: "GvImgUpload",
  props: {
    value: {
      type: String,
      default: "",
    },
    action: {
      // 支持上传图片的类型 accept='image/jpeg,image/png'
      type: String,
      default: "",
    },
    "http-request": {
      type: Function,
      default: () => {},
    },
    imgWidth: {
      type: String,
      default: "120px",
    },
    imgHeight: {
      type: String,
      default: "120px",
    },
    tip: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    max: {
      // 上传最大尺寸
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      imgUrl: "",
    };
  },
  methods: {
    updateValue() {
      this.$emit('input', this.imgUrl)
      this.$emit('change', this.imgUrl)
    },
    // 图片上传校验
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < this.max;
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${this.max}MB!`);
        return;
      }
      this.uploadFile(file);
      return isLt2M;
    },
    async uploadFile(file) {
      let formData = new FormData();
      formData.append("file", file);
      let res = await uploadFile(formData);
      if (res && res.code == "00000") {
        this.imgUrl = res.data
        this.updateValue()
      }
    },
    // 删除
    handleDel() {
      this.imgUrl = ''
      this.updateValue()
    },
  },
  watch: {
    value: {
      handler(val) {
        this.imgUrl = val;
      },
      deep: true,
    },
  },
  created() {
    this.imgUrl = this.value;
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables";
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .clear-icon {
    position: absolute;
    top: 0;
    right: 0px;
    font-size: 26px;
    color: $red;
  }
}
.avatar-uploader /deep/.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.tip {
  font-size: 12px;
  color: #7f7f7f;
  position: relative;
  top: -10px;
}
</style>