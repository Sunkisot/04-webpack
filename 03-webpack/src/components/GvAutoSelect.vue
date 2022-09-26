<template>
  <transition name="fade">
    <el-select
      v-bind="$attrs"
      v-on="$listeners"
      v-model="choose"
      v-el-select-loadmore:rangeNumber="loadMore(rangeNumber)"
      filterable
      :loading="loading"
      :filter-method="filterMethod"
      @focus="onfocus"
    >
      <el-option
        v-for="(item, index) in list.slice(0, rangeNumber)"
        :key="index"
        :label="codeIsLabel ? item : item[labelName]"
        :value="codeIsLabel ? item : item[codeName]"
      ></el-option>
    </el-select>
  </transition>
</template>
 
<script>
/**
 * 大数据下拉
 * @author 计欣奇
 * @time 2019/10/18
 */
import { getUrlList } from "@/api/system/gvSelect";
export default {
  props: {
    value: [String, Number],
    url: {
      // 请求的 url
      type: String,
      default: "",
    },
    codeIsLabel: {
      type: Boolean,
      default: () => false,
    },
    codeName: {
      // code绑定字段
      type: String,
      default: "",
    },
    labelName: {
      // label绑定字段
      type: String,
      default: "",
    },
    searchObject: {
      // 查询附加参数
      type: [String, Object],
      default: null,
    },
    beforeSearch: {
      // 开始查询前校验函数
      type: Function,
    },
    requestType: {
      type: String,
      default: "get",
    },
    trigger: {
      // 数据请求出发方式
      type: String,
      default: "auto",
    },
  },
  data() {
    return {
      loading: false,
      list: [],
      choose: "",
      rangeNumber: 20,
      stashList: [],
      search: "",
      oldSearchObject: null,
    };
  },

  watch: {
    choose(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.choose = val;
    },
    searchObject: {
      handler(val, old) {
        if (this.trigger == "focus") return;
        if (val && JSON.stringify(val) != JSON.stringify(old)) {
          if (typeof this.beforeSearch == "function") {
            this.beforeSearch(val) && this.debounceGetList();
          } else {
            this.debounceGetList();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    filterMethod(newVal) {
      this.choose = newVal;
      if (newVal) {
        this.list = this.stashList;
        this.list = this.list.filter((item) => {
          return this.codeIsLabel
            ? typeof item === "string"
              ? item.includes(newVal)
              : false
            : typeof item[this.labelName] === "string"
            ? item[this.labelName].includes(newVal)
            : false;
        });
      } else {
        this.list = this.stashList;
      }
    },
    onfocus() {
      if (!this.stashList.length) {
        // 数据为空请求
        this.proBeforeGetData();
      } else {
        // 查询参数改变
        if (
          !this.gvUtil.compare(this.searchObject, this.oldSearchObject)
        ) {
          this.proBeforeGetData();
        }
      }
    },
    // 请求数据前校验
    proBeforeGetData() {
      if (typeof this.beforeSearch == "function") {
        if (this.beforeSearch(this.searchObject)) {
          this.debounceGetList();
        } else {
          this.list = [];
          this.stashList = [];
        }
      } else {
        this.debounceGetList();
      }
    },
    async getList(data) {
      try {
        this.loading = true;
        this.oldSearchObject = JSON.parse(JSON.stringify(this.searchObject));
        let res = await getUrlList(
          this.url,
          data ? data : this.searchObject,
          this.requestType
        );
        this.list = res.data || [];
        this.stashList = this.list;
        this.loading = false;

      } catch (err) {
        this.list = [];
        this.stashList = [];
        this.choose = "";
        this.loading = false;
      }
    },
    loadMore(n) {
      //n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
      //if(n < 8) this.rangeNumber = 10 //elementui下拉超过7条才会出滚动条,如果初始不出滚动条无法触发loadMore方法
      return () => (this.rangeNumber += 5); //每次滚动到底部可以新增条数  可自定义
    },
  },
  created() {
    this.debounceGetList = this.gvUtil.debounce(this.getList.bind(this), 1000); // 防抖
  },
};
</script>
 
<style lang="less" scoped>
.content {
  padding: 24px 24px;
  .el-input {
    width: 400px;
    margin: 20px;
  }
}
</style>

