<template>
  <transition name="fade">
    <treeselect
      class="gvTreeSelect"
      v-bind="$attrs"
      v-model="code"
      :options="options"
      :normalizer="normalizer"
      @input="onInput"
      @select="onSelect"
      searchable
      noResultsText="无匹配数据"
      noOptionsText="无数据"
      append-to-body
    ></treeselect>
  </transition>
</template>

<script>
/**
 * 树型下拉
 * @author 计昕奇
 * @time 2019/11/08
 */
import { getUrlList } from "@/api/system/gvSelect";
import select from "@/api/select";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "GvTreeSelect",
  components: {
    Treeselect,
  },
  props: {
    value: null,
    url: {
      // 请求的 url
      type: String,
      default: "",
    },
    urlType: {
      type: String,
      default: "",
    },
    searchObject: {
      // 查询附加参数
      type: [String, Object],
      default: null,
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
    isCache: {
      // 是否缓存下拉数据
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      code: "",
      options: [],
    };
  },
  methods: {
    onInput(e) {
      this.$emit("input", e);
      this.$emit("change", e);
    },
    onSelect(e) {
      if (this.code != e[this.codeName || "id"]) {
        this.$emit("select", e);
      }
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node[this.codeName || "id"],
        label: node[this.labelName || "name"],
        children: node.children,
      };
    },
    initData() {
      var list = null;
      var c = this.gvUtil.getCache();
      var url = this.url ? this.url : select[this.urlType];
      var cacheKey = this.gvUtil.md5(
        url + JSON.stringify(this.searchObject) || ""
      );
      if (this.isCache) {
        list = c.get(cacheKey);
      }
      if (!list) {
        getUrlList(url, this.searchObject).then((res) => {
          if (res && res.code == "00000") {
            let data = res.data || [];
            this.handleReturnData(data, c, cacheKey);
          }
        });
      } else {
        this.handleReturnData(list);
      }
    },
    handleReturnData: function handleReturnData(data, c, cacheKey) {
      var cacheList = data;

      this.options = data;

      // 存到缓存中
      if (c && this.isCache && cacheList) {
        c.set(cacheKey, cacheList);
      }
    },
  },
  watch: {
    value: {
      handler(val) {
        this.code = val;
      },
      immediate: true,
      deep: true,
    },
    searchObject: function searchObject(val, old) {
      if (val && val !== old) {
        this.initData();
      }
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang='less' >
.vue-treeselect__menu .vue-treeselect__label {
  color: #606266;
  font-size: 14px;
  font-weight: normal;
}
.vue-treeselect__menu .vue-treeselect__option {
  height: 34px;
  line-height: 34px;
}
.vue-treeselect__menu .vue-treeselect__option--highlight {
  background: #f5f7fa;
}
.vue-treeselect__menu .vue-treeselect__icon-container {
  display: none;
}
.vue-treeselect__menu .vue-treeselect__no-results-tip {
  text-align: center;
}
.vue-treeselect__menu .vue-treeselect__no-results-tip-text {
  font-size: 14px;
}
</style>