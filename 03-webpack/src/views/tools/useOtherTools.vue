<template>
  <div class="wrapper container">
    <p>时间格式化：{{ new Date() | time("yyyy-MM-dd HH:mm:ss") }} &emsp; gvUtil.dateToStr</p>
    <p>金额格式化：{{ "111111.2" | money(true, 2) }}&emsp; gvUtil.money</p>
    <p>国际化：{{ "login.title" | translate }}&emsp; $t &emsp; gvUtil.getInzTranslate</p>
    <p>格式化小数：gvUtil.toFixed()</p>
    <p>去除千分位中的','：gvUtil.delcommafy()</p>
    <p>数字加千分符：gvUtil.comdify()</p>
    <p>数字格式化：gvUtil.showNumber()</p>
    <p>获取前端缓存：gvUtil.getCache()</p>
    <p>数据比较：gvUtil.compare("id")</p>
    <p>获取md5：gvUtil.md5()</p>
    <p>全局的Mixins对象：gvUtil.getMixins()</p>
    <p>比较对象是否相等：gvUtil.compare()</p>
    <p>深拷贝对象：gvUtil.cloneObj()</p>
    <p>时间比较：gvUtil.comPareDate()</p>
    <p>时间加减：gvUtil.getHandleDate()</p>
    <p>取两个日期相差月数：gvUtil.getMonthsApart()</p>
    <p>文件流下载：gvUtil.resolveBlob()</p>
    <p>将文件转化为url：gvUtil.getObjectURL()</p>
    <p>excel导出：gvUtil.exportExcel()</p>
    <p>获取表格数据：gvUtil.getExeclData()</p>
    <p>信息提示：gvUtil.message()</p>
    <p>初始化ggcode：gvUtil.initTranslation()</p>
    <p>初始化poname：gvUtil.initTranslationPo()</p>
    <p>初始化UrlSelect：gvUtil.initTranslationSelect()</p>
    <p>翻译ggcode：gvUtil.translationData()</p>
    <p>翻译poname：gvUtil.translationPoData()</p>
    <p>翻译UrlSelect：gvUtil.translationSelectData()</p>
  </div>
</template>

<script>
export default {
  name: 'useOtherTools',
  data() {
    return {
      data: [
        {id: 1},
        {id: 2},
      ]
    }
  },
  created() {
    var _cache = this.gvUtil.getCache();
    // _cache.set
    _cache.set("ggcode", ["1", "2"]);
    console.log(_cache.get("ggcode"));

    console.log(this.data.sort(this.gvUtil.compare("id")));

    console.log(this.gvUtil.md5(JSON.stringify({ name: "123" })));

    console.log(this.handleMixinMethod());

    console.log(this.gvUtil.getMixins());

    console.log(this.gvUtil.compare({ name: "1" }, { name: "2" }));

    var obj = { name: "1" };
    var cloneobj = this.gvUtil.cloneObj(obj, false);
    cloneobj.name = 2;
    console.log(obj, cloneobj);

    console.log(process.env.VUE_APP_BASE_API);
    console.log(process.env);

    console.log(this.gvUtil.comPareDate("2020-11-12", "2021-12-12"));

    console.log(this.gvUtil.getMonthsApart("2020-11-12", "2021-12-12"), 111);

    console.log(this.gvUtil.dateToStr(new Date(), "yyyy-MM-dd"));

    console.log(this.gvUtil.money("11111", true, 2));

    console.log(this.gvUtil.toFixed("2222.22", 4));

    // this.$store.dispatch('test/app/ag')
    console.log(this.$store.state.app.language);

    console.log(this.gvUtil.getInzTranslate("login.title"));
    // request.get('/pdf').then(res => {
    //   // debugger
    // })
    // request.get('/test').then(res => {
    //   // debugger
    // })
    console.log((this.mixin = 456));
  }
};
</script>

<style scoped>
.container {
  padding: 0 15px;
}
</style>