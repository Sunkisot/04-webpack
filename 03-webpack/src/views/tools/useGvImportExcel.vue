<template>
  <section>
    <gv-import-excel
      :preview="true"
      @select="excelData"
      :is-page="true"
      :formatObj='formatObj'
      style="width: 80%; display: inline-block"
      :btn-name="'gBtnUpload' | translate('Upload')"
    >
    </gv-import-excel>
  </section>
</template>

<script>
export default {
  name: "useGvImportExcel",
  data() {
    return {
      formatObj: {
        '日期': {
          type: 'date',
          format: 'dd-MM-yyyy'
        }
      }
    }
  },
  methods: {
    // excel 导入
    excelData(val) {
      console.log(val);
    },
  },
};
</script>

<style>
</style>