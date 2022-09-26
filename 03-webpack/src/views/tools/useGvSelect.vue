<template>
  <div style="margin-top: 20px">
    <gv-select
      optionsSet="0"
      codeType="Currency"
      v-model="currency"
    ></gv-select>
    <gv-select
      options-set="0"
      po-name="ehrOrg"
      code-name="code"
      label-name="label"
      labelNameEx="code"
      v-model="selectPo"
    >
    </gv-select>
    <gv-select
      url="/test/select"
      :searchObject="{ select: '1' }"
      codeName="code"
      labelName="name"
      v-model="selectUrl"
    ></gv-select>
    <el-button type="primary" @click="handleCache">获取缓存</el-button>
  </div>
</template>

<script>
export default {
  name: "useGvSelect",
  data() {
    return {
      currency: '',
      selectPo: '',
      selectUrl: ''

    }
  },
  methods: {
    handleCache() {
      var c = this.gvUtil.getCache();
      console.log(c.get(this.gvUtil.md5("Currency")));
      console.log(c.get(this.gvUtil.md5(JSON.stringify({ poName: "ehrOrg" }))));
      console.log(
        c.get(this.gvUtil.md5("/test/select" + JSON.stringify({ select: "1" })))
      );
    },
  }
};
</script>

<style>
</style>