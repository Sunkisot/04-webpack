<template>
  <div class="wrapper pd10">
    <gv-search-table ref="table" :table="table" @on-list-btn="onListBtn">
      <template v-slot:search="scope">
        <el-row>
          <gv-form-item keyName="机构编码" prop="code">
            <el-input
              v-model="scope.search.code"
              placeholder="输入机构编码查找"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="机构名称" prop="name">
            <el-input
              v-model="scope.search.name"
              placeholder="输入机构名称查找"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="所在地区" prop="regionCodes">
            <gv-cascader
              v-model="scope.search.regionCodes"
              @change="cascaderChange"
              :options="options"
              clearable
              :props="{ multiple: true, value: 'code', label: 'name' }"
              placeholder="请选择所在地区"
            ></gv-cascader>
          </gv-form-item>
        </el-row>
        <el-row>
          <gv-form-item keyName="机构类型" prop="type">
            <gv-select
              optionsSet="1"
              urlType="OrgType"
              v-model="scope.search.type"
            ></gv-select>
          </gv-form-item>
          <gv-form-item keyName="状态" prop="status">
            <gv-select
              optionsSet="1"
              urlType="OrgStatus"
              v-model="scope.search.status"
            ></gv-select>
          </gv-form-item>
          <gv-form-item keyName="入驻时间" prop="createTimeBegin">
            <gv-date-range
              startProp="createTimeBegin"
              endProp="createTimeEnd"
              :start.sync="scope.search.createTimeBegin"
              :end.sync="scope.search.createTimeEnd"
            ></gv-date-range>
          </gv-form-item>
        </el-row>
        <el-row>
          <gv-form-item keyName="到期时间" prop="maturityTimeBegin">
            <gv-date-range
              startProp="maturityTimeBegin"
              endProp="maturityTimeEnd"
              :start.sync="scope.search.maturityTimeBegin"
              :end.sync="scope.search.maturityTimeEnd"
            ></gv-date-range>
          </gv-form-item>
          <gv-form-item keyName="联系人信息" prop="contactInfo">
            <el-input
              v-model="scope.search.contactInfo"
              placeholder="输入联系人姓名、手机号查找"
            ></el-input>
          </gv-form-item>
        </el-row>
      </template>
      <!--工具条-->
      <template v-slot:toolbar>
        <el-button
          type="primary"
          @click="onHandleAdd()"
          v-hasPermi="['mechanism:mechanism:add']"
          >添加机构</el-button
        >
      </template>
    </gv-search-table>

    <ChargeDialog ref='ChargeDialog' v-model="rechargeVisible"></ChargeDialog>
  </div>
</template>

<script>
import { getRegionTree } from "@/api/sys";
import { delOrg, editStatusOrg } from "@/api/orgManage";
import ChargeDialog from "./conponents/charge-dialog.vue";
export default {
  name: "list-index",
  components: {
    ChargeDialog,
  },
  data(vm) {
    return {
      table: {
        basic: {
          path: "/mechanism/list", //分页列表请求api
          vo: "list", //分页列表返回的vo
          singleElection: false, //是否支持单选  获取选中数据 this.$refs.table.getSingleSelectData()
          multipleElection: false, //是否支持多选  获取选中数据 this.$refs.table.getSelectData()
          autoSearch: false, // 是否开启默认查询
          pageSizes: [10, 20, 50, 100], // 默认尺码
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
          code: "",
          name: "",
          regionCodes: [],
          type: "",
          status: "",
          createTimeBegin: null,
          createTimeEnd: null,
          maturityTimeBegin: null,
          maturityTimeEnd: null,
          contactInfo: "",
        },
        fields: [
          //结果列表配置，一个对象一列
          {
            prop: "code", //属性
            labelKey: "机构编码", //国际化key
          },
          {
            prop: "name",
            labelKey: "机构名称",
            width: "130px",
          },
          {
            prop: "logo",
            labelKey: "机构Logo",
            btns: [
              {
                imgWidth: "50px",
                flag: "logo",
                type: "img",
              },
            ],
          },

          {
            prop: "region",
            labelKey: "所在地区",
            width: "160px",
          },
          {
            labelKey: "子机构",
            width: "160px",
            btns: [
              {
                prop: "subCount",
                flag: "subCount",
                type: "a",
                perms: ["mechanism:mechanism:detail"],
              },
            ],
          },
          {
            prop: "status",
            labelKey: "状态",
            width: "140px",
            format: {
              type: "urlType",
              urlType: "OrgStatus",
              success: "NORMAL",
            },
          },
          {
            prop: "type",
            labelKey: "机构类型",
            format: {
              type: "urlType",
              urlType: "OrgType",
            },
          },
          {
            prop: "createTime",
            labelKey: "入驻时间",
            width: "140px",
            format: {
              type: "date",
              format: "yyyy-MM-dd",
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "maturityTime",
            labelKey: "到期时间",
            width: "140px",
            format: {
              type: "date",
              format: "yyyy-MM-dd",
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "contactPerson",
            labelKey: "联系人",
            width: "160px",
            format: {
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "contactPhone",
            labelKey: "联系人电话",
            width: "160px",
            format: {
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "userAgreementUrl",
            labelKey: "用户协议链接地址",
            width: "120px",
            format: {
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "appDownloadUrl",
            labelKey: "机构APP下载链接地址",
            width: "120px",
            format: {
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "qrCodeUrl",
            labelKey: "二维码链接地址",
            width: "120px",
            format: {
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "isShowQrCode",
            labelKey: "是否显示下载二维码",
            width: "120px",
            format: {
              type: "custom",
              formatFn: vm.whetherList,
            },
          },
          {
            prop: "customerServicePhone",
            labelKey: "客服电话",
            width: "160px",
            format: {
              emptySign: true, // 数据为空时是否展示 '--'
            },
          },
          {
            prop: "isOpenRegistry",
            labelKey: "是否开放注册",
            width: "120px",
            format: {
              type: "custom",
              formatFn: vm.whetherList,
            },
          },
          {
            //配置最后列按钮
            prop: "Operation",
            labelKey: "操作",
            fixed: "right",
            width: "200px",
            btns: [
              {
                btnKey: "详情",
                flag: "detail",
                type: "a",
                perms: ["mechanism:mechanism:detail"],
              },
              {
                btnKey: "充值",
                flag: "recharge",
                type: "a",
              },
              {
                btnKey: "更多", //任务列表
                flag: "dropdown",
                type: "dropdown",
                dropdownRule: vm.dropdownValid,
                ddItems: [
                  {
                    command: "edit",
                    name: "编辑",
                    perms: ["mechanism:mechanism:edit"],
                  },
                  {
                    command: "del",
                    name: "删除",
                    perms: ["mechanism:mechanism:delete"],
                  },
                  {
                    command: "start",
                    name: "启用",
                    perms: ["mechanism:mechanism:edit:status"],
                  },
                  {
                    command: "stop",
                    name: "禁用",
                    perms: ["mechanism:mechanism:edit:status"],
                  },
                  {
                    command: "charge",
                    name: "计费政策配置",
                  },
                ],
              },
            ],
          },
        ],
      },
      options: [],
      rechargeVisible: false, // 充值弹窗
    };
  },
  methods: {
    whetherList(val) {
      let obj = this.gvUtil.options.whether.find((e) => e.code == val);
      return obj ? obj.name : "";
    },
    cascaderChange(e) {
      console.log(e);
    },
    dropdownValid(row, command) {
      if (["NORMAL"].includes(row.status) && command == "start") {
        // 正常
        return false;
      } else if (
        ["DISABLE", "MATURITY"].includes(row.status) &&
        command == "stop"
      ) {
        return false;
      } else {
        return true;
      }
    },
    onHandleAdd() {
      this.$router.push({
        path: "/org-manage/org-add/add",
      });
    },
    formatSupplierList(val) {
      return val;
    },
    // 跳转详情
    toDetail(row) {
      this.$router.push({
        path: "/org-manage/org-detail",
        query: {
          id: row.id,
        },
      });
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定要删除这个机构吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      }).then(async () => {
        let res = await delOrg(row.id);
        if (res && res.code == "00000") {
          this.gvUtil.success();
          this.$refs.table.onGetList();
        } else {
          this.$alert(res.message, "无法删除", {
            confirmButtonText: "知道了",
            type: "info",
          });
        }
      });
    },
    // 启用/禁用
    handleStatus(row, status) {
      if (status == "DISABLE") {
        this.$confirm("确定要禁用这个机构吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "danger",
        }).then(async () => {
          this.putEditStatus(row, status);
        });
      } else {
        this.putEditStatus(row, status);
      }
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/org-manage/org-add/edit",
        query: {
          id: row.id,
        },
      });
    },
    // 启用/禁用接口
    async putEditStatus(row, status) {
      let res = await editStatusOrg(row.id, status);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$refs.table.onGetList();
      }
    },
    // 前往子机构
    handleToSubCount(row) {
      this.$router.push({
        path: "/org-manage/org-detail",
        query: {
          id: row.id,
          type: "subCount",
        },
      });
    },
    // 前往计费政策
    toCharge(row) {
      this.$router.push({
        path: "/org-manage/charge-policy",
        query: {
          id: row.id,
        },
      });
    },
    // 充值弹窗
    openRecharge(row) {
      this.rechargeVisible = true;
      this.$refs.ChargeDialog.initComponent(row.id)
    },
    onListBtn(row, type) {
      switch (type) {
        case "detail":
          this.toDetail(row);
          break;
        case "edit":
          this.handleEdit(row);
          break;
        case "del":
          this.handleDel(row);
          break;
        case "subCount":
          this.handleToSubCount(row);
          break;
        case "stop":
          this.handleStatus(row, "DISABLE");
          break;
        case "start":
          this.handleStatus(row, "NORMAL");
          break;
        case "charge":
          this.toCharge(row);
          break;
        case "recharge":
          this.openRecharge(row);
          break;
      }
    },
    // 获取省市区
    async getRegionTree() {
      let res = await getRegionTree();
      if (res && res.code == "00000") {
        this.options = res.data || [];
      }
    },
  },
  mounted() {
    this.getRegionTree();
    this.gvUtil.initTranslate(["OrgType", "OrgStatus"], () => {
      this.$refs.table.onGetList();
    });
  },
};
</script>

<style>
</style>