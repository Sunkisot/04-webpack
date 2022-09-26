<template>
  <div>
    <p>
      pdf 预览：<input id="input" type="file" @change="changeFile" />
      <button @click="checkLocal">窗口打开pdf</button>
      <button @click="handleOpenPdf">iframe打开pdf</button>
    </p>
    <iframe
      class="iframe"
      :src="iframeSrc"
      frameborder="0"
      width="100%"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'usePdfView',
  data() {
    return {
      iframeSrc: "",
    }
  },
  methods: {
    handleOpenPdf() {
      this.iframeSrc = this.gvUtil.openPdf(
        {
          file: "/GISV前端用户手册.pdf",
        },
        true
      );
    },
    checkLocal() {
      this.gvUtil.openPdf(
        {
          file: encodeURIComponent("/GISV前端用户手册.pdf"),
        },
        false
      );
    },
    changeFile(e) {
      var files = e.target.files[0];
      if (files.type !== "application/pdf") {
        alert("只能上传一份pdf文件哦～");
        return;
      }
      this.fileUrl = this.gvUtil.getObjectURL(files);
      this.iframeSrc = this.gvUtil.openPdf(
        {
          file: this.fileUrl,
        },
        true
      );
    },
  }
};
</script>

<style>
.iframe {
  height: calc(99vh - 140px);
}
</style>