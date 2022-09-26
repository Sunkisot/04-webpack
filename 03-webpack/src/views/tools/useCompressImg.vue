<template>
  <section>
    图片压缩： <input type="file" @change="changeImg" />
    <div>
      <el-row>
        <el-col :span="12">
          <p>旧图片：</p>
          <img :src="oldImg" alt="" width="100%"/>
          <p>大小：{{ oldSize }}</p>
        </el-col>
        <el-col :span="12">
          <p>新图片：</p>
          <img :src="newImg" alt="" />
          <p>大小：{{ newSize }}</p>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
export default {
  name: "useCompressImg",
  data() {
    return {
      oldImg: null,
      oldSize: 0,
      newImg: null,
      newSize: 0,
    };
  },
  methods: {
    //图片压缩
    async changeImg(e) {
      var files = e.target.files[0];
      this.oldImg = this.gvUtil.getObjectURL(files);
      this.oldSize = files.size;
      this.newImg = await this.gvUtil.compressImg(
        this.gvUtil.getObjectURL(files),
        {
          quality: 0.7, // 压缩系数
          width: 200, // 后图片的宽度
        }
      );
      this.newSize = this.gvUtil.dataURLtoFile(this.newImg, "newImg").size;
    },
  },
};
</script>

<style>
</style>