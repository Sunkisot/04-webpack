<template>
  <!-- 日期区间 -->
  <el-table-column
    v-if="prop.config.type == 'dateRange'"
    :key="prop.dataEname[0] + prop.request"
    :min-width="prop.width ? prop.width : ''"
  >
    <template v-slot:header>
      <div style="display: flex; justify-content: space-around">
        <span
          ><span v-if="prop.request == '1'" style="color: #ff4949">*</span>
          {{ Vue.gvUtil.getInzTranslate(prop.dataEname[0]) }}</span
        >
        <span
          ><span v-if="prop.request == '1'" style="color: #ff4949">*</span>
          {{ Vue.gvUtil.getInzTranslate(prop.dataEname[1]) }}</span
        >
      </div>
    </template>
    <template slot-scope="scope">
      <!-- 日期区间 有联动校验 -->
      <gv-date-range
        :propPath="'tableData.' + initPath(scope) + '.' + prop.infoCode[0]"
        :required="prop.request == '1'"
        :startDate.sync="scope.row[prop.infoCode[0]]"
        :endDate.sync="scope.row[prop.infoCode[1]]"
      ></gv-date-range>
    </template>
  </el-table-column>
  <!-- 普通输入 -->
  <el-table-column
    v-else
    :label="prop.dataEname | translate"
    :prop="rules[prop.dataEname] ? prop.infoCode : ''"
    :width="prop.width ? prop.width : ''"
    :render-header="rules[prop.dataEname] ? requiredField : undefined"
    :key="prop.dataEname + prop.request"
  >
    <template slot-scope="scope">
      <el-form-item
        :prop="'tableData.' + initPath(scope) + '.' + prop.infoCode"
        :rules="rules[prop.dataEname] ? rules[prop.dataEname] : undefined"
      >
        <!-- 普通文本 -->
        <span v-if="prop.config.type == 'txt'" key="txt">{{
          scope.row[prop.infoCode]
        }}</span>
        <!-- 序号 -->
        <span v-if="prop.config.type == 'sequenceNum'" key="sequenceNum">{{
          scope.$index + 1
        }}</span>
        <!-- 时间选择框 -->
        <template v-else-if="prop.config.type == 'time'">
          <gv-time-picker
            v-if="controlReadonly(scope.row)"
            v-model="scope.row[prop.infoCode]"
            :rangeType="prop.config.rangeType"
            :timeLimit="scope.row[prop.config.timeLimit]"
          >
          </gv-time-picker>
          <span v-else>{{ scope.row[prop.infoCode] | _time("HH:mm") }}</span>
        </template>
        <!-- switch -->
        <template v-else-if="prop.config.type == 'switch'">
          <gv-switch
            :disabled="controlReadonly(scope.row)"
            v-model="scope.row[prop.infoCode]"
          ></gv-switch>
        </template>


        <!-- 废弃 -->
        <!-- poName  Select下拉 key='selectPo'-->
        <template v-else-if="prop.config.type == 'selectPo'">
          <gv-select
            v-if="controlReadonly(scope.row)"
            size="mini"
            options-set="0"
            :po-name="prop.config.poName"
            :code-name="prop.config.code"
            :label-name="prop.config.name"
            v-model="scope.row[prop.infoCode]"
            :placeholder="'gSelect' | translate('Please Select')"
          >
          </gv-select>
          <span v-else>{{
            Vue.gvUtil.translationPoData(prop.config, scope.row[prop.infoCode])
          }}</span>
        </template>

        <!-- 普通输入框 key='input'-->
        <template v-else-if="prop.config.type == 'input'">
          <el-input
            v-if="controlReadonly(scope.row)"
            :maxlength="prop.config.maxlength ? prop.config.maxlength : '60'"
            :readonly="isReadonly"
            :placeholder="'gInput' | translate"
            v-model="scope.row[prop.infoCode]"
            @blur="inputBlur(prop.dataEname, scope.row, $event)"
          >
          </el-input>
          <span v-else>{{ scope.row[prop.infoCode] }}</span>
        </template>

        <!-- ggcode Select下拉 key='ggcode'-->
        <template v-else-if="prop.config.type == 'ggcode'">
          <gv-select
            v-if="controlReadonly(scope.row)"
            size="mini"
            options-set="0"
            :default-value="prop.config.defaultValue"
            :code-type="prop.config.codeType"
            v-model="scope.row[prop.infoCode]"
          ></gv-select>
          <span v-else>{{
            Vue.gvUtil.translationData(
              prop.config.codeType,
              scope.row[prop.infoCode]
            )
          }}</span>
        </template>

        <!-- num输入 key='numInput'-->
        <template v-else-if="prop.config.type == 'numInput'">
          <gv-input
            v-if="controlReadonly(scope.row)"
            size="mini"
            :readonly="isReadonly"
            :maxlength="prop.config.maxlength ? prop.config.maxlength : '60'"
            :pattern-key="prop.config.patternKey"
            :thou="prop.config.thou"
            :num-len="prop.config.numLen"
            @blur="numInputBlur(prop.dataEname, scope.row, $event)"
            :placeholder="'gInput' | translate"
            v-model="scope.row[prop.infoCode]"
          >
          </gv-input>
          <span v-else>{{
            scope.row[prop.infoCode]
              | money(prop.config.thou, prop.config.numLen)
          }}</span>
        </template>

        <!-- 日期 :picker-options="pickerOptions[initPath(scope)]" @change="changeDate('0',initPath(scope), $event)" key='date'-->
        <template v-else-if="prop.config.type == 'date'">
          <el-date-picker
            v-if="controlReadonly(scope.row)"
            class="datetimer"
            v-model="scope.row[prop.infoCode]"
            :format="prop.config.format ? prop.config.format : 'yyyy-MM-dd'"
            unlink-panels
            :value-format="
              prop.config.valFormat ? prop.config.valFormat : 'yyyy-MM-dd'
            "
            :type="prop.config.datePickType ? prop.config.datePickType : 'date'"
            :placeholder="
              prop.config.placeholder ? prop.config.placeholder : '年/月/日'
            "
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <span v-else>{{ scope.row[prop.infoCode] }}</span>
        </template>
        <!-- url select下拉 key='select'-->
        <template v-else-if="prop.config.type == 'select'">
          <gv-select
            v-if="controlReadonly(scope.row)"
            :url="prop.config.url"
            context-name="product"
            :searchObject="prop.config.data"
            :codeName="prop.config.code"
            :labelName="prop.config.name"
            v-model="scope.row[prop.infoCode]"
          ></gv-select>
          <span v-else>{{
            Vue.gvUtil.translationSelectData(
              prop.config,
              scope.row[prop.infoCode]
            )
          }}</span>
        </template>
      </el-form-item>
    </template>
  </el-table-column>
</template>

<script>
/**
 * 可配置生成el-table-column（可控制编辑只读等）
 * @author 计欣奇
 * @time 2020/11/08
 */
import GvDateRange from "./GvDateRange.vue";
export default {
  name: "GvDataColumn",
  components: {
    GvDateRange,
  },
  props: {
    prop: {
      // 表头配置对象
      type: Object,
      required: true,
    },
    isReadonly: {
      // 整个表格只读
      type: Boolean,
      default: () => false,
    },
    rules: {
      // 校验规则 必传
      type: Object,
      required: true,
    },
    paging: {
      // 是否分页  true 分页 false  不分页
      type: Boolean,
      default: true,
    },
    isCheckLine: {
      type: Boolean,
      default: false,
    },
    validReadonly: Function,
  },
  data: function (vm) {
    // 双向绑定页面显示数据
    let endDateValid = (rule, value, callback) => {
      if (!vm.table.endDate) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      pickerOptions: [],
      options: [],
      dateRule: {
        dateRange: [
          {
            required: true,
            message: "必填字段",
            trigger: "change",
          },
          { validator: endDateValid, trigger: "change" },
        ],
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
    };
  },
  methods: {
    // 控制只读 true 非只读 false 只读
    controlReadonly(row) {
      if (this.validReadonly && typeof this.validReadonly == "function") {
        return this.prop.readonly == "1" && !this.validReadonly(row); // true 只读  false  不只读
      } else {
        return !this.isReadonly && this.prop.readonly == "1";
      }
    },
    // 普通输入框 blur 事件抛出
    inputBlur(name, row, e) {
      this.$emit("inputBlur", {
        name,
        val: e.target.value,
        row,
      });
    },
    // num输入框 blur事件抛出
    numInputBlur(name, row, e) {
      this.$emit("numInputBlur", {
        name,
        val: e,
        row,
      });
    },
    // 日期change
    changeDate(code, thenTime, val) {
      console.log(code, val);
      if (code == "0") {
        // 开始
        if (thenTime) {
          this.pickerOptionsStart = {
            disabledDate: (time) => {
              if (thenTime) {
                return time.getTime() > new Date(thenTime);
              }
            },
          };
        } else {
          thenTime = null;

          this.pickerOptionsEnd = {
            disabledDate: (time) => {
              if (val) {
                return time.getTime() < new Date(val);
              }
            },
          };
        }
      } else {
        if (thenTime) {
          this.pickerOptionsEnd = {
            disabledDate: (time) => {
              if (thenTime) {
                return time.getTime() < new Date(thenTime);
              }
            },
          };
        } else {
          thenTime = null;
          this.pickerOptionsStart = {
            disabledDate: (time) => {
              if (val) {
                return time.getTime() > new Date(val);
              }
            },
          };
        }
      }
    },
    test() {
      console.log(this.rules);
    },
    // 转码
    transCode(val) {
      var obj = this.options.find((e) => e[this.prop.config.code] == val);
      return obj ? obj[this.prop.config.name] : val;
    },
    // 初始化下拉
    // initSelectOptions() {
    //   Vue.gvUtil.http.post('product' + this.prop.config.url, this.prop.config.data).then(res => {
    //     this.options = res.data.businessList ? res.data.businessList : []
    //   })
    // },
    initPath(scope) {
      return this.paging ? scope.row.key : scope.$index;
    },
    // 定制表头
    requiredField(h, { column, $index }) {
      // 这里在最外层插入一个div标签
      return h("div", { class: "requireHead" }, [
        h(
          "el-tooltip",
          {
            // 表示属性
            attrs: {
              effect: "dark",
              content: "必填项",
              placement: "top",
            },
          },
          [
            h("span", {
              domProps: {
                innerHTML: "* ",
              },
              class: "require",
            }),
          ]
        ),
        h("span", {
          // 表示内容
          domProps: {
            innerHTML: column.label,
          },
          on: {
            click: () => {
              console.log(`${$index}  ${column.label}`);
            },
          },
        }),
      ]);
    },
  },
  filters: {
    transCode(val) {
      return val;
    },
  },
  computed: {},
  mounted() {},
  created() {
    // if (this.prop.config.type == "select") {
    //   this.initSelectOptions()
    // }
    // type: 'selectPo',
    //   poName: 'ehrOrg',
    // if (this.prop.config.type == "selectPo") {
    //   Vue.gvUtil.translationPoData(this.prop.config, )
    //   // var cacheKey = Vue.gvUtil.md5(JSON.stringify({ poName: this.prop.config.poName }) || ''),
    //   //     c = Vue.gvUtil.getCache();
    //   // //debugger
    //   // c.get(cacheKey)
    // }
  },
};
</script>

<style>
.require {
  color: red;
}
</style>