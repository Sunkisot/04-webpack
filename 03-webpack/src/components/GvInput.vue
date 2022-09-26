<template>
  <transition name="fade">
    <el-input
      class="gv-input"
      v-bind="$attrs"
      :name="name"
      is-number="y"
      :data-correct-type="dataCorrectType"
      :maxlength="maxlength"
      :readonly="readonly"
      :placeholder="placeholder"
      @focus="onKeyup($event, '1')"
      @keyup.native="onKeyup"
      v-model="code"
      @blur="onBlur"
    >
      <i slot="suffix" class="c-black" v-if="suffix">{{ suffix }}</i>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>
  </transition>
</template>

<script>
/**
 * 输入框
 * @author 计昕奇
 * @time 2019/05/05
 */
export default {
  name: "gvInput",
  /**
   * @property {Number|String} v-model 双向绑定属性
   * @property {Boolean} [readonly=false] 只读
   * @property {String} [id=''] id
   * @property {String} suffix 后缀
   * @property {String} numLen 数值长度
   * @property {Number} [maxlength=50] 可输入长度
   * @property {String} patternKey 正则，校验提示语（键值）
   * @property {Boolean} custom 自定义校验
   * @property {Number} max 最大值
   * @property {Number} min 最小值
   * @property {Boolean} isSelect 获取焦点后是否全选
   */
  props: {
    value: [String, Number],
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: function () {
        return this.$t("gInput");
      },
    },
    dataCorrectType: "",
    /* disabled: {
                type   : Boolean,
                default: false
            }, */
    suffix: {
      type: String,
      default: null,
    },
    thou: {
      type: [Boolean],
      default: null,
    },
    numLen: {
      type: [Number, String],
      default: null,
    },
    maxlength: {
      type: [Number, String],
      default: 50,
    },
    patternKey: {
      type: String,
      default: null,
    },
    custom: {
      type: Boolean,
      default: true,
    },
    max: {
      type: Number,
      default: 9007199254740992,
    },
    min: {
      type: Number,
      default: null,
    },
    name: "",
    isSelect: {
      type: Boolean,
      default: true,
    },
  },
  data: function data() {
    return {
      code: "",
      isKey: false,
      repeat: false, // 防重复
      codeCache: "",
    };
  },
  watch: {
    value: function value(val, old) {
      if (val !== "") {
        // 暂时屏蔽，它阻碍了数据的双向绑定
        /* eslint no-constant-condition: "off" */
        // if(!this.isKey) {
        if (true) {
          // if (val + '' !== old) {
          var codeVal = +this.gvUtil.delcommafy(this.code + "");
          if (codeVal !== val || (old === "" && val === 0)) {
            this.initData(val);
          }
          this.codeCache =
            this.code == null || this.code == undefined || this.code == ""
              ? this.code
              : this.gvUtil.delcommafy(this.code);
        } else {
          this.isKey = false;
        }
      } else {
        if (this.code !== "") {
          this.code = "";
        }
      }
    },
    code: function code(val, old) {
      if (val === "" && old !== "") {
        this.updateValue();
      }
    },
  },
  created: function created() {
    this.initData(this.value);
  },
  methods: {
    clear() {
      this.$nextTick(function () {
        // 写清空逻辑;
      });
    },
    updateValue: function updateValue() {
      var val = "";
      if (this.code === "") {
        this.$emit("blur", val);
      } else {
        if (this.code || this.code == 0) {
          val = this.gvUtil.delcommafy(this.code) || +this.code;
          if (this.codeCache === val) return;
        }
      }

      this.$emit("input", val);
      this.codeCache = this.gvUtil.delcommafy(this.code);
      /**
       * 数值发生变化.
       * @event component:TpInput#change
       * @property {Number} val 数值.
       */
      this.$emit("change", val);
    },
    onBlur: function onBlur() {
      var val = "";
      if (this.code == "") {
        this.$emit("blur", val);
        return;
      }
      if (this.code || this.code == 0) {
        val = this.gvUtil.delcommafy(this.code) || +this.code;
      }
      //var val = this.code ? this.gvUtil.delcommafy(this.code) || +this.code : ''
      // if (this.code && parseFloat(this.gvUtil.delcommafy(this.code + '')) !== parseFloat(this.codeCache)) {
      if (
        !(!this.code && this.code != 0) &&
        +parseFloat(this.gvUtil.delcommafy(this.code + "")) !== this.value
      ) {
        this.initData(this.code);
      }
      /**
       * 焦点离开.
       * @event component:TpInput#blur
       * @property {Number} val 数值.
       */
      this.$emit("blur", val);
      // this.$emit('input', val);
    },
    onKeyup: function onKeyup(event, flag) {
      if (!this.isKey) {
        this.isKey = true;
      }
      if (flag && flag == "1") {
        if (this.isSelect) {
          this.$emit("focus", event.currentTarget);
          event.currentTarget.select();
        }
      }
    },
    initData: function initData(value) {
      if (value !== "" && value !== null && value !== undefined) {
        if (this.thou || this.numLen) {
          this.showNumber(this.thou, this.numLen, value, "num");
        } else {
          //this.code = value;
          //this.updateValue();
          this.showNumber(false, 0, value, "txt");
        }
      } else {
        this.code = value;
      }
    },
    showNumber: function showNumber(thou, len, value, type) {
      if (type == "txt") {
        if (this.patternKey && !this.gvUtil[this.patternKey].test(value)) {
          this.$message.error(this.$t("gValidate" + this.patternKey));
          this.code = "";
        } else {
          this.code = value;
        }
        var leng = this.code.length || 0; // 过滤后字符长度
        if (leng > this.maxlength) {
          // 超过最长字符截取
          this.code = this.code.substring(leng - this.maxlength, leng);
        }
        this.repeat = false;
        this.updateValue();
        return;
      }
      if (!len && len != 0) {
        // 如果有没有设置小数 则设置为0
        len = 2;
      } else {
        // 设置了小数 转换为number
        len = parseInt(len) !== undefined ? parseInt(len) : 2;
      }

      if (!value || parseFloat(value) === "0") {
        // 如果没有值或者设置为0
        this.code = Number("0").toFixed(len);
        this.updateValue();
        return;
      }

      if (value && parseFloat(value) !== "0") {
        // 有值 并且不等于0
        if (!isNaN(parseFloat(this.gvUtil.delcommafy(value)))) {
          // 去除千分符后是数字
          var itemValue = parseFloat(this.gvUtil.delcommafy(value));
          if (
            this.patternKey &&
            !this.gvUtil[this.patternKey].test(itemValue)
          ) {
            this.$message.error(this.$t("gValidate" + this.patternKey));
            this.code = "";
          } else {
            var _b = true;
            //自定义校验大小
            if (this.custom) {
              if (this.max != undefined && itemValue >= this.max) {
                _b = false;
                this.$message.error("超过了最大值！");
                this.code = "";
              }
              if (_b && this.min != undefined && itemValue <= this.min) {
                _b = false;
                this.$message.error("Must be greater than " + this.min);
                this.code = "";
              }
            }

            if (_b) {
              if (thou) {
                this.code = this.gvUtil.comdify(Number(itemValue).toFixed(len));
              } else {
                this.code = Number(value).toFixed(len);
              }
            }
          }
        } else {
          //  去除千分符后不是数字
          this.$message.error(this.gvUtil.getInzTranslate("gValidateNumber"));
          this.code = "";
        }
        var leng = this.code.length || 0; // 过滤后字符长度
        if (leng > this.maxlength) {
          // 超过最长字符截取
          this.code = this.code.substring(leng - this.maxlength, leng);
        }
        this.repeat = false;
        this.updateValue();
      }
    },
  },
};
</script>

<style lang='less' scoped>
.c-black {
  font-style: normal;
}
.gv-input /deep/.el-input__suffix {
  display: flex;
  align-items: center;
}
</style>