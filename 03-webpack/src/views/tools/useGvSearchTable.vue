<template>
  <div class="wrapper pd10">
    <gv-search-table ref="table" :table="table" @on-list-btn="onListBtn">
      <template v-slot:search="scope">
        <el-row>
          <gv-form-item keyName="currency" prop="currency1">
            <gv-select
              optionsSet="0"
              codeType="Currency"
              v-model="scope.search.currency1"
            ></gv-select>
          </gv-form-item>
          <gv-form-item keyName="currency" prop="currency2">
            <gv-select
              optionsSet="0"
              codeType="Currency"
              v-model="scope.search.currency2"
            ></gv-select>
          </gv-form-item>
          <gv-form-item keyName="currency" prop="currency1">
            <gv-select
              optionsSet="0"
              codeType="Currency"
              v-model="scope.search.currency1"
            ></gv-select>
          </gv-form-item>
        </el-row>
        <el-row>
          <gv-form-item keyName="currency" prop="currency2">
            <gv-select
              optionsSet="0"
              codeType="Currency"
              v-model="scope.search.currency2"
            ></gv-select>
          </gv-form-item>
        </el-row>
        <el-row>
          <gv-form-item keyName="currency" prop="textarea" :holdCol="3">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="scope.search.textarea"
            >
            </el-input>
          </gv-form-item>
        </el-row>
      </template>
      <!--工具条-->
      <template v-slot:toolbar>
        <el-button type="primary" @click="onHandleAdd()">{{
          "gBtnCreate" | translate
        }}</el-button>
      </template>
    </gv-search-table>
  </div>
</template>

<script>
export default {
  name: "useGvSearchTable",
  data(vm) {
    return {
      table: {
        basic: {
          path: "/test/search", //分页列表请求api
          vo: "list", //分页列表返回的vo
          singleElection: false, //是否支持单选  获取选中数据 this.$refs.table.getSingleSelectData()
          multipleElection: true, //是否支持多选  获取选中数据 this.$refs.table.getSelectData()
          autoSearch: false, // 是否开启默认查询
          pageSizes: [10, 30, 50, 100], // 默认尺码
          pagLayout: "total, prev, pager, next, jumper", // 分页的Layout
          showSequenceNum: true, // 是否展示序号
          execl: {
            isShow: true,
            fileName: "testExecl",
            exclude: ["Operation"],
          }, //导出按钮控制，不需要可以删除此属性
          // execlAll: {
          //   isShow: true,
          //   fileName: "testExecl",
          //   exclude: ["operation"],
          // },
        },
        search: {
          //查询域元数据

          currency1: "001",
          currency2: "",
          textarea: "123",
        },
        fields: [
          //结果列表配置，一个对象一列
          {
            labelKey: "projectNo", //国际化key
            btns: [
              {
                flag: "projectNo",
                type: "vHtml",
                vHtml: vm.vHtml
              },
            ],
          },
          {
            prop: "headImgUrl",
            labelKey: "微信头像",
            btns: [
              {
                imgWidth: "50px",
                flag: "QRcode",
                type: "img",
              },
            ],
          },
          {
            prop: "id",
            labelKey: "序号",
            width: "160px",
            btns: [
              {
                flag: "projectNo",
                type: "component",
                component: setSerial,
              },
            ],
          },
          {
            prop: "projectName",
            labelKey: "projectName",
            showTip: true,
          },
          {
            prop: "expectPurchaseMoney",
            labelKey: "预计金额",
            format: {
              type: "num",
            },
          },
          {
            labelKey: "projectBatchCode",
            btns: [
              {
                flag: "batchCode",
                prop: "batchCode",
                type: "a",
              },
            ],
          },
          {
            prop: "expectStartdate",
            labelKey: "proposalCommonStartDate", //保险起期
            format: {
              type: "date",
              format: "yyyy-MM-dd",
            },
          },
          {
            prop: "status",
            labelKey: "currency",
            format: {
              type: "urlType",
              urlType: "OrgStatus",
            },
          },
          {
            prop: "status",
            labelKey: "currency",
            format: {
              type: "optionType",
              optionType: "whether",
            },
          },
          {
            prop: "projectDescript",
            labelKey: "项目主要内容",
            width: "200px",
            showTip: true,
          },
          {
            prop: "supplierList",
            labelKey: "supplierName",
            width: "200px",
            format: {
              type: "custom",
              formatFn: vm.formatSupplierList,
            },
          },
          {
            //配置最后列按钮
            prop: "Operation",
            labelKey: "trajectory",
            width: "300px",
            btnsRule: vm.btnsRuleFn,
            btns: [
              {
                btnKey: "taskList",
                flag: "workbench1",
                type: "btn",
              },
              {
                btnKey: "taskList", //任务列表
                flag: "workbench",
                type: "dropdown",
                dropdownRule: vm.dropdownRuleFn,
                ddItems: [
                  {
                    command: "auditTrail",
                    name: "auditTrail",
                  },
                  {
                    command: "confirmTrack",
                    name: "confirmTrack",
                  },
                  {
                    command: "purchaseTrack",
                    name: "purchaseTrack",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    // 自定义Html
    vHtml(row) {
      return `<span style='color: red;'>${row.projectNo}</span>`
    },
    // dropdown 按钮展示规则
    dropdownRuleFn(row, command) {
      return true;
    },
    // 按钮展示规则
    btnsRuleFn(btns, row) {
      return btns;
    },
    onHandleAdd() {},
    formatSupplierList(val) {
      return val;
    },
    onListBtn(row, type, index) {
      console.log(row, type, index);
    },
  },
};
</script>

<style>
</style>