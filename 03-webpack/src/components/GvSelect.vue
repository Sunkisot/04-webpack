<template>
  <transition name="fade">
    <el-select
      ref="tpSelect"
      v-bind="$attrs"
      :name="name"
      :filterable="true"
      @change="onChange"
      v-model="code"
      :placeholder="placeholder"
      @input="updateValue()"
      @visible-change="visibleChange"
      @focus="focusSelect"
      :disabled="disableds"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
      </el-option>
    </el-select>
  </transition>
</template>

<script>
import { getSelectList } from "@/api/system/gvSelect";
import select from "@/api/select";
/**
 * 下拉
 * @author 计欣奇
 * @time 2020/10/18
 */
export default {
  name: "gvSelect",
  props: {
    url: {
      type: String,
      default: "",
    },
    urlType: {
      type: String,
      default: "",
    },
    optionType: {
      type: String,
      default: "",
    },
    value: [String, Number, Array],
    codeType: String, // code类型
    optionsSet: {
      // 下拉类型
      type: String,
      default: "0",
    },
    placeholder: {
      type: String,
      default: function () {
        return this.$t("gSelect");
      },
    },
    dataCorrectType: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    disabled: {
      // 组件disabled
      type: Boolean,
      default: false,
    },
    disabledOption: null, // 隐藏的选项
    poName: {
      // 业务表名
      type: String,
      default: "",
    },
    searchObject: {
      // 查询附加参数
      type: [String, Object],
      default: null,
    },
    requireds: {
      // 查询附加参数 的必填参数配置
      type: Array,
      default: () => [],
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
    labelNameEx: {
      // label展示附加字段
      type: String,
      default: "",
    },
    isCache: {
      // 是否缓存下拉数据
      type: Boolean,
      default: true,
    },
    defaultParams: {
      type: String,
      default: "",
    },
    defaultEmit: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: String,
      default: "",
    },
    defaultType: {
      type: Boolean,
      default: false,
    },
    orderByField: {
      // 要排序的字段
      type: String,
      default: "",
    },
    direction: {
      // 顺序还是倒序 desc，asc
      type: String,
      default: "",
    },
    isFuzzy: {
      // 后台isFuzzy 0：模糊，1：不模糊 前端is-fuzzy false：模糊 true:不模糊
      type: Boolean,
      default: false,
    },
    vo: {
      // 数据对象的名字
      type: String,
      default: "businessList",
    },
    index: String,
  },
  data: function data() {
    return {
      code: "",
      options: [],
      path: "",
      c: "",
      l: "",
      le: "",
      cacheKey: "",
      disableds: false,
      // Todo 废弃
      // searchCacheList: {}
    };
  },
  watch: {
    value: function value(val, old) {
      //
      if (val !== old || (val == "" && old == "")) {
        // this.onChange(val, true);
        this.code = val;
      }
    },
    searchObject: function searchObject(val, old) {
      if (val && JSON.stringify(val) != JSON.stringify(old)) {
        if (this.proRequired()) {
          this.initData();
        }
      }
    },
    disabledOption: function disabledOption(val, old) {
      if (val && val !== old) {
        this.handleDisabledOption();
      }
    },
    codeType: function codeType(val) {
      if (val) {
        if (this.proRequired()) {
          this.initData();
        }
      }
    },
    poName: function poName(val) {
      if (val) {
        if (this.proRequired()) {
          this.initData();
        }
      }
    },
    disabled: function disabled(val) {
      this.disableds = val;
    },
    dataCorrectType: function dataCorrectType(val) {
      this.setParams("data-correct-type", val);
    },
    code: function code(val, old) {},
  },
  created: function created() {
    this.code = this.value;
    if (this.proRequired()) {
      this.initData();
    }
    this.disableds = this.disabled;
  },
  mounted: function mounted() {
    if (this.dataCorrectType) {
      this.setParams("data-correct-type", this.dataCorrectType);
    }
    this.setParams("is-select", "y");
  },
  methods: {
    updateValue: function updateValue() {
      //
      this.$emit("input", this.code);
      this.$emit("change", this.code);
    },
    focusSelect: function focusSelect() {
      this.$emit("focus");
    },
    visibleChange: function visibleChange(val) {
      this.$emit("visibleChange", val);
    },
    onChange: function onChange(obj, flag) {
      //
      var self = this;
      var row;

      if (flag) {
        if (obj !== this.code && this.options.filter) {
          row = this.options.filter(function (item) {
            return item.value === obj;
          })[0];
          this.$emit("select", row, this.index);
        }
      } else if (this.options.filter) {
        row = this.options.filter(function (item) {
          return item.value === self.code;
        })[0];
        this.$emit("select", row, this.index);
      }
    },
    // 判断必填项是否有值
    proRequired() {
      let searchObject = this.searchObject;
      if (typeof this.searchObject == "string") {
        searchObject = JSON.parse(this.searchObject);
      }
      return !this.requireds.find(
        (e) => !searchObject[e] && searchObject[e] != 0
      );
    },
    initData: function initData() {
      var c = this.gvUtil.getCache();
      var type = "code";
      var _this = this;
      var url = "";
      var param = {};
      var cacheKey = "";
      var cacheKeyParam = null;
      var list = null;
      if (this.optionType) {
        this.c = this.codeName || "code";
        this.l = this.labelName || "name";
        list = this.gvUtil.options[this.optionType] || [];
        this.handleReturnData(list);
        return;
      }
      if (this.codeType) {
        // codeType
        type = "codeType";
        this.path = this.codeType;
        this.c = this.codeName || "codeCode";
        this.l = this.labelName || "codeName";
        this.le = this.labelNameEx;
        param = { codeType: this.codeType, validind: "1" };
        cacheKey = this.gvUtil.md5(this.path);
        if (this.searchObject && _typeof(this.searchObject) === "object") {
          Object.assign(param, this.searchObject);
          cacheKeyParam = Vue.gvUtil.md5(
            this.path + JSON.stringify(param) || ""
          );
        }
        if (this.searchObject && typeof this.searchObject === "string") {
          Object.assign(param, JSON.parse(this.searchObject));
          cacheKeyParam = Vue.gvUtil.md5(
            this.path + JSON.stringify(param) || ""
          );
        }
      } else if (this.url !== "") {
        // url
        type = "url";
        url = this.url;
        this.path = this.codeType;
        param = {};
        this.c = this.codeName || "codeCode";
        this.l = this.labelName || "codeName";
        this.le = this.labelNameEx;
        if (this.searchObject && _typeof(this.searchObject) === "object") {
          Object.assign(param, this.searchObject);
        }
        if (this.searchObject && typeof this.searchObject === "string") {
          Object.assign(param, JSON.parse(this.searchObject));
        }
        cacheKey = this.gvUtil.md5(this.url + JSON.stringify(param) || "");
      } else if (this.urlType !== "") {
        // url
        type = "url";
        url = select[this.urlType];
        this.path = this.codeType;
        param = {};
        this.c = this.codeName || "code";
        this.l = this.labelName || "name";
        this.le = this.labelNameEx;
        if (this.searchObject && _typeof(this.searchObject) === "object") {
          Object.assign(param, this.searchObject);
        }
        if (this.searchObject && typeof this.searchObject === "string") {
          Object.assign(param, JSON.parse(this.searchObject));
        }
        cacheKey = this.gvUtil.md5(url);
      } else {
        // poName
        type = "poName";
        this.path = this.poName;
        param = { poName: this.poName };
        this.c = this.codeName;
        this.l = this.labelName;
        this.le = this.labelNameEx;
        if (this.searchObject && _typeof(this.searchObject) === "object") {
          Object.assign(param, this.searchObject);
        }
        if (this.searchObject && typeof this.searchObject === "string") {
          Object.assign(param, JSON.parse(this.searchObject));
        }
        cacheKey = this.gvUtil.md5(JSON.stringify(param) || "");
      }

      if (this.isCache) {
        if (cacheKeyParam) {
          list = c.get(cacheKeyParam);
        } else {
          list = c.get(cacheKey);
        }
      }
      // 要排序的字段           排列的顺序
      if (this.orderByField && this.direction) {
        param.orderByField = this.orderByField;
        param.direction = this.direction;
      }
      param.isFuzzy = this.isFuzzy ? "1" : "0";
      if (!list) {
        getSelectList(type, param, url).then((res) => {
          let data = res.data;
          if (type === "codeType") {
            data = data[this.codeType];
          }
          this.handleReturnData(data, c, cacheKey, cacheKeyParam);
        });
      } else {
        this.handleReturnData(list);
      }
    },
    setParams: function setParams(name, value) {
      this.$refs.tpSelect.$el.querySelector("input").setAttribute(name, value);
    },
    handleReturnData: function handleReturnData(
      data,
      c,
      cacheKey,
      cacheKeyParam
    ) {
      var self = this;
      var result = [];
      var item = null;
      var optionsSet = this.optionsSet;
      var cacheList = data;

      // 第一项
      if (optionsSet === "1") {
        item = {};
        item.value = "";
        item.label = this.$t("gAll");
      } else if (optionsSet === "2") {
        item = {};
        item.value = "";
        item.label = this.$t("gSelect");
      }
      item && result.push(item);
      if (data && data.length > 0) {
        // 选项
        data.forEach(function (tmp) {
          var value = tmp[self.c] + "";
          var label = tmp[self.l];
          var disabled;
          if (value === "false") {
            value = false;
          } else if (value === "true") {
            value = true;
          }
          if (self.le) {
            label = tmp[self.le] + " - " + label;
          }
          disabled =
            self.disabledOption && self.disabledOption.indexOf(value) > -1;
          tmp.value = value;
          tmp.label = label;
          tmp.disabled = disabled;
          result.push(tmp);
        });
      }
      // 最后一项添加其他
      if (optionsSet === "3") {
        item = {};
        item.value = "";
        item.label = this.$t("other");
        result.push(item);
      }

      this.options = result;

      // if (this.defaultParams) {
      //   if (!this.defaultType && (this.value === '' || this.value === null)) {
      //     this.handleDefaultParams(cacheList)
      //   }
      //   if (this.defaultType) {
      //     this.handleDefaultParams(cacheList)
      //   }
      // }
      // 存到缓存中
      if (c && this.isCache && cacheList) {
        if (cacheKeyParam) {
          c.set(cacheKeyParam, cacheList);
        } else {
          c.set(cacheKey, cacheList);
        }
      }
    },
    handleDisabledOption: function handleDisabledOption() {
      var obj = $.extend({}, this.options);
      for (var o in obj) {
        obj[o].disabled =
          this.disabledOption && this.disabledOption.indexOf(obj[o].value) > -1;
      }
      this.options = obj;
    },
    handleDefaultParams: function handleDefaultParams(obj) {
      for (var o in obj) {
        if (obj[o][this.defaultParams] === "false") {
          obj[o][this.defaultParams] = false;
        } else if (obj[o][this.defaultParams] === "true") {
          obj[o][this.defaultParams] = true;
        }
        if (this.defaultValue === "false") {
          this.defaultValue = false;
        } else if (this.defaultValue === "true") {
          this.defaultValue = true;
        }
        if (obj[o][this.defaultParams] === this.defaultValue) {
          this.code = obj[o][this.c] + "";
          this.updateValue();
          if (this.defaultEmit) {
            this.onChange(obj[o][this.defaultParams]);
          }
        }
      }
    },
  },
};
</script>

<style>
</style>
