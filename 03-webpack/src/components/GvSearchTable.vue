<template>
  <div>
    <gv-form :inline="true" ref="fromFilters" :model="fromFilters" :col="3">
      <div
        class="gv-query-table"
        :class="homeType == 'top' ? '' : 'gv-query-table-left'"
      >
        <h1 class="query-title">{{ "gTitleSearchData" | translate }}</h1>
        <div class="query-head">
          <div class="gv-content">
            <slot name="search" v-bind:search="fromFilters"></slot>
          </div>
        </div>
        <div class="query-more" v-show="isMore">
          <div class="gv-content">
            <slot name="searchMore" v-bind:search="fromFilters"></slot>
          </div>
        </div>
        <div class="query-bottom">
          <div class="pull-left">
            <el-button @click="dialogFormVisible = true">{{
              "gBtnSaveFi" | translate
            }}</el-button>
            <el-button @click="dialogTableVisible = true">{{
              "gBtnMaFi" | translate
            }}</el-button>
            <el-select
              @change="getFilterEx"
              :placeholder="'gSelectFi' | translate"
              class="gv-List-select"
              filterable
              v-model="filterEx"
            >
              <el-option
                v-for="item in optionsFieldsEx"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="pull-right">
            <el-button type="primary" @click="onGetList()">{{
              "gBtnSearch" | translate("Search")
            }}</el-button>
            <el-button @click="onResetForm('fromFilters')">{{
              "gBtnClear" | translate("Clear")
            }}</el-button>
            <el-button v-if="isMoreBtn" @click="onMore"
              >更多查询条件<i :class="isMore ? 'icon-up' : 'icon-down'"></i
            ></el-button>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </gv-form>
    <div class="gv-query-table" style="margin-top: 15px">
      <div class="query-control">
        <slot
          name="toolbar"
          v-bind:data="{
            search: fromFilters,
            list: list,
            res: res,
          }"
        ></slot>
        <div class="pull-right">
          <el-button
            icon="el-icon-download"
            v-if="execl.isShow"
            :disabled="disabledExcel"
            @click="onExportExcel"
            >{{ "gBtnToExecl" | translate("ToExecl") }}</el-button
          >
          <el-button
            slot="reference"
            icon="el-icon-download"
            v-if="execlAll"
            :disabled="disabledExcel"
            @click="onExportAllExcel"
            >{{ "gBtnToExecl" | translate("gBtnToAllExecl") }}</el-button
          >
          <el-button
            icon="el-icon-tickets"
            @click="keySelect = !keySelect"
          ></el-button>
          <div class="key-select-list" v-show="keySelect">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="isDefalutAll"
              @change="onHandleCheckAll"
              >{{ "gAll" | translate("ALL") }}</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedOptions"
              @change="onHandleChecked"
              class="key-list"
            >
              <el-checkbox
                v-for="option in listFields"
                :label="option.filterProp"
                :key="option.prop"
                >{{ option.label }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div style="width: 100%;overflow:hidden;">
        <div class="query-content">
          <el-table
            :data="list"
            ref="list"
            :id="ids"
            style="width: 100%"
            class="table-scroll"
            :row-key="getRowKey"
            :highlight-current-row="singleElection"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            @row-dblclick="rowDblclick"
          >
            <el-table-column
              v-if="multipleElection"
              type="selection"
              width="50"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              v-if="showSequenceNum"
              :label="'gNumber' | translate"
              width="60"
            >
              <template v-slot="scope">
                <span>{{
                  (mixinObject.searchSet.pageNo - 1) *
                    mixinObject.searchSet.pageSize +
                  scope.$index +
                  1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in listFields.filter((e) => e.show)"
              :sortable="item.sort"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :title="item.label"
              :width="item.width"
              :fixed="item.fixed"
              :formatter="formatStatus"
              :show-overflow-tooltip="item.showTip"
            >
              <template v-slot="scope">
                <template v-if="item.btns">
                  <template v-if="item.btns">
                    <el-button
                      class="mr10"
                      :type="btn.flag == 'gBtnDelete' ? 'danger' : 'primary'"
                      v-hasPermi="btn.perms"
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'btn')"
                      :key="btn.flag"
                      @click="onHandle(scope.row, btn.flag, scope.$index)"
                    >
                      {{ btn.btnKey | translate() }}
                    </el-button>
                    <el-button
                      :class="['mr10', { 'txt-red-btn': btn.flag == 'del' }]"
                      type="text"
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'a')"
                      :key="btn.flag"
                      @click="
                        onHandle(scope.row, btn.flag, scope.$index, btn.perms)
                      "
                    >
                      {{
                        scope.row[btn.prop] || scope.row[btn.prop] == 0
                          ? scope.row[btn.prop]
                          : btn.btnKey
                      }}
                    </el-button>
                    <el-button
                      class="mr10"
                      v-hasPermi="btn.perms"
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'icon')"
                      :key="btn.flag"
                      :icon="
                        item.prop == '1' ? 'el-icon-check' : 'el-icon-close'
                      "
                      @click="onHandle(scope.row, btn.flag, scope.$index)"
                    ></el-button>
                    <el-dropdown
                      class="mr10 ml10"
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'dropdown')"
                      :key="btn.flag"
                      trigger="click"
                      @command="handleCommand($event, scope.row, scope.$index)"
                    >
                      <el-button type="text">
                        {{ btn.btnKey | translate()
                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-hasPermi="ddItem.perms"
                          v-for="(ddItem, i) in btn.ddItems.filter((e) =>
                            typeof btn.dropdownRule == 'function'
                              ? btn.dropdownRule(scope.row, e.command)
                              : true
                          )"
                          :key="i"
                          :command="ddItem.command"
                          >{{ ddItem.name | translate }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                    <a
                      href="javascript:;"
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'img')"
                      :key="btn.flag"
                      @click="
                        onHandle(scope.row, btn.flag, scope.$index, btn.perms)
                      "
                    >
                      <img
                        :src="scope.row[item.prop]"
                        alt=""
                        :width="btn.imgWidth"
                      />
                    </a>
                    <div
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'vHtml')"
                      :key="btn.flag"
                      @click="
                        onHandle(scope.row, btn.flag, scope.$index, btn.perms)
                      "
                    >
                      <div
                        v-html="
                          typeof btn.vHtml == 'function'
                            ? btn.vHtml(scope.row)
                            : ''
                        "
                      ></div>
                    </div>
                    <div
                      v-for="btn in filterBtns(
                        item.btns,
                        item.btnsRule,
                        scope.row
                      ).filter((e) => e.type == 'component')"
                      :key="btn.flag"
                      @click="
                        onHandle(scope.row, btn.flag, scope.$index, btn.perms)
                      "
                    >
                      <component
                        :is="btn.component"
                        :row="scope.row"
                        :prop="item.prop"
                      ></component>
                    </div>
                  </template>
                </template>
                <template v-else-if="item.format && item.format.success">
                  <el-row type="flex" align="middle">
                    <div
                      :class="[
                        'sign',
                        {
                          success: scope.row[item.prop] == item.format.success,
                        },
                      ]"
                    ></div>
                    <span>{{
                      formatStatus(
                        scope.row,
                        scope.column,
                        scope.row[item.prop],
                        scope.$index
                      )
                    }}</span>
                  </el-row>
                </template>
                <template v-else>
                  {{
                    formatStatus(
                      scope.row,
                      scope.column,
                      scope.row[item.prop],
                      scope.$index
                    )
                  }}
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div :span="24" class="gv-pagination">
            <el-pagination
              style="float: right"
              @size-change="onHandleSizeChange"
              @current-change="onHandleCurrentChange"
              :page-sizes="pageSizes"
              :page-size="mixinObject.searchSet.pageSize"
              :layout="layout"
              :total="mixinObject.searchSet.total"
              :current-page.sync="mixinObject.searchSet.pageNo"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="'gTitlePrompt' | translate"
      custom-class="gv-dialog"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="fromFiltersEx" ref="fromFiltersEx" :inline="false">
        <el-form-item :label="'gName' | translate" label-width="120px">
          <el-input v-model="fromFiltersEx.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="'gRemarks' | translate" label-width="120px">
          <el-input
            v-model="fromFiltersEx.remarks"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          "gBtnCancel" | translate
        }}</el-button>
        <el-button type="primary" @click="onSubmit">{{
          "gSubmit" | translate
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="gv-dialog"
      :title="'gBtnMaFi' | translate"
      :visible.sync="dialogTableVisible"
    >
      <div class="gv-query-table" style="margin-top: 15px">
        <div class="">
          <el-table :data="optionsFieldsEx">
            <el-table-column
              prop="label"
              :label="'gName' | translate"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="remarks"
              :label="'gRemarks' | translate"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="time"
              :label="'gData' | translate"
              show-overflow-tooltip
            >
              <template #default="{ row }">{{
                row.time | time("yyyy-MM-dd HH:mm:ss")
              }}</template>
            </el-table-column>
            <el-table-column :label="'gTitleOperation' | translate">
              <template v-slot="scope">
                <el-button @click="onHandleDel(scope.row)" type="primary">{{
                  "gBtnDelete" | translate
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 查询表格
 * @author 计昕奇
 * @time 2020/11/08
 */
import tableMixins from "@/mixins/tableMixins";
var id = 1;
export default {
  name: "gvSearchTable",
  mixins: [tableMixins],
  props: {
    table: Object,
    beforeValidate: Function,
  },
  data: function data() {
    return {
      visible: false,
      headList: [],
      layout: "total, sizes, prev, pager, next, jumper",
      fromFilters: {},
      active: ["1"],
      list: [],
      listFields: [],
      ids: id,
      cacheFields: {},
      cacheFieldsEx: {},
      optionsFieldsEx: [],
      currentRow: null,
      multipleSelection: null,
      execl: { isShow: false, fileName: "tableExecl", exclude: null },
      execlAll: false,
      path: "",
      vo: "",
      rowKey: "id",
      autoSearch: false, // 是否开启初始化查询查询
      pageSizes: [10, 20, 50, 100],
      keySelect: false,
      disabledExcel: true,
      isIndeterminate: false,
      isDefalutAll: true,
      checkedOptions: [],
      filterEx: "",
      fromFiltersEx: {
        name: "",
        remarks: "",
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      isMore: false,
      isMoreBtn: false,
      singleElection: false,
      multipleElection: false,
      showSequenceNum: false,
      menutype: this.$store.state.homeType,
      mf: "top",
      res: {}, // 完整的响应体数据
    };
  },
  watch: {
    list: function list(n, o) {
      if (n && n.length > 0) {
        this.disabledExcel = false;
      } else {
        this.disabledExcel = true;
      }
    },
    checkedOptions: function checkedOptions(n, o) {
      this.handleFiledShow();
    },
  },
  created: function created() {
    this.handleFields(this.table.fields);
    this.handleBasic(this.table.basic);
    this.fromFilters = Object.assign({}, this.table.search);
    this.autoSearch && this.onGetList();
    id++;
    this.initFilterEx();
  },
  mounted: function mounted() {},
  computed: {
    homeType: function homeType() {
      return this.$store.state.homeType;
    },
    filterList(list) {
      return list;
    },
  },

  methods: {
    filterBtns(btns, btnsRule, row) {
      if (typeof btnsRule == "function") {
        return btnsRule(btns, row);
      } else {
        return btns;
      }
    },
    clearSelection() {
      this.$refs.list.clearSelection()
    },
    getColumnData() {
      return {
        listFields: this.listFields,
        cacheFields: this.cacheFields,
      };
    },
    getSearchVal() {
      return this.fromFilters;
    },
    setSearchVal(obj) {
      this.fromFilters = Object.assign(this.fromFilters, obj);
    },
    setTableColumn(headList, constHeads) {
      this.handleFields(this.table.fields, headList, constHeads);
    },
    clearTableData() {
      this.list = [];
      this.mixinObject.searchSet.pageNo = 1;
      this.mixinObject.searchSet.total = 0;
      this.mixinObject.searchSet.pageSize = 10;
    },
    getRowKey(row) {
      return row[this.rowKey];
    },
    rowDblclick(row, column, event) {
      this.$emit("rowDblclick", {
        row,
        column,
        event,
      });
    },
    onGetList: function onGetList() {
      var _this2 = this;
      console.log(this.fromFilters);
      if (
        !this.beforeValidate ||
        (this.beforeValidate && this.beforeValidate(this.fromFilters))
      ) {
        this.searchList(
          this.path,
          this.fromFilters,
          this.vo,
          function (data, res) {
            _this2.list = data;
            _this2.currentRow = null;
            _this2.multipleSelection = null;
            _this2.res = res;
          }
        );
      }
    },
    handleCurrentChange: function handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleSelectionChange: function handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onExportExcel: function onExportExcel() {
      if (this.execl.validate && this.list.length == 0) {
        this.gvUtil.message("List data is not allowed to be empty");
        return;
      }
      this.gvUtil.exportExcel(
        this.$refs.list,
        this.ids,
        this.execl.fileName,
        null,
        this.execl.exclude
      );
    },
    onExportAllExcel: function onExportAllExcel(type) {
      // this.gvUtil.message('open');
      this.$emit("onExportAllExcel");
    },
    onHandleCheckAll: function onHandleCheckAll() {
      if (this.isDefalutAll) {
        this.checkedOptions = this.cacheAllChecked;
      } else {
        this.checkedOptions = [];
      }
      //this.handleFiledShow();
    },
    onHandleChecked: function onHandleChecked() {
      console.log(this.checkedOptions, this.cacheAllChecked);
      if (this.checkedOptions.length != this.cacheAllChecked.length) {
        this.isDefalutAll = false;
      } else {
        this.isDefalutAll = true;
      }
      // this.handleFiledShow();
    },
    handleFiledShow: function handleFiledShow() {
      for (var key in this.cacheFields) {
        this.cacheFields[key].show = this.checkedOptions.indexOf(key) > -1;
      }
    },
    handleFields: function handleFields(list, headlist, constHeads) {
      var d = {};
      this.listFields = [];
      if (headlist) {
        for (var item of headlist) {
          let obj = constHeads.find((e) => e.dataEname == item.dataEname);
          let newObj = {
            prop: item.infoCode,
            labelKey: item.dataEname,
          };

          if (obj) {
            if (
              obj.config.type == "selectPo" ||
              obj.config.type == "ggcode" ||
              obj.config.type == "select"
            ) {
              newObj.format = obj.config;
            }
          }
          this.listFields.push(newObj);
        }
        list.forEach((e) => {
          if (
            e.prop == "operation" ||
            e.prop == "dataSources" ||
            e.prop == "versionNo" ||
            e.prop == "assetProposalStatus" ||
            e.prop == "dateList"
          ) {
            this.listFields.push(e);
          }
        });
      } else {
        Object.assign(this.listFields, list);
      }
      console.log(this.listFields, list);
      //
      for (var key in this.listFields) {
        this.listFields[key].label = this.$t(this.listFields[key].labelKey);
        this.listFields[key].show = true;
        if (this.listFields[key].prop) {
          this.listFields[key].filterProp = this.listFields[key].prop;
        } else {
          this.listFields[key].filterProp = "filterProp" + key;
        }
        this.checkedOptions.push(this.listFields[key].filterProp);
        d[this.listFields[key].filterProp] = this.listFields[key];
      }
      this.cacheAllChecked = this.checkedOptions;
      //
      this.cacheFields = d;
    },
    // 处理基础配置信息
    handleBasic: function handleBasic(obj) {
      if (obj.execl) {
        Object.assign(this.execl, obj.execl);
      }
      if (obj.execlAll) {
        this.execlAll = obj.execlAll;
      }
      this.isMoreBtn = obj.isShowMore || false;
      this.path = obj.path;
      this.vo = obj.vo;
      this.rowKey = obj.rowKey || "id";
      this.autoSearch = obj.autoSearch;
      this.pageSizes = obj.pageSizes;
      this.layout = obj.pagLayout || this.layout;
      this.singleElection = obj.singleElection || false;
      this.multipleElection = obj.multipleElection || false;
      this.showSequenceNum = obj.showSequenceNum || false;
    },

    // 状态翻译
    formatStatus: function formatStatus(row, column, cellValue, index) {
      var str = "";
      if (
        this.cacheFields[column.property] &&
        this.cacheFields[column.property].format
      ) {
        switch (this.cacheFields[column.property].format.type) {
          case "num":
            str = this.gvUtil.money(cellValue, true, 2);
            break;
          case "date":
            str = this.gvUtil.dateToStr(
              cellValue,
              this.cacheFields[column.property].format.format
            );
            break;
          case "dateRange":
            if (cellValue && cellValue[0] && cellValue[1]) {
              str =
                this.gvUtil.dateToStr(
                  cellValue[0],
                  this.cacheFields[column.property].format.format
                ) +
                " - " +
                this.gvUtil.dateToStr(
                  cellValue[1],
                  this.cacheFields[column.property].format.format
                );
            } else {
              str = "";
            }
            break;
          case "ggcode":
            str = this.gvUtil.translationData(
              this.cacheFields[column.property].format.codeType,
              cellValue
            );
            break;
          case "selectPo":
            str = this.gvUtil.translationPoData(
              this.cacheFields[column.property].format,
              cellValue
            );
            break;
          case "select":
            str = this.gvUtil.translationSelectData(
              this.cacheFields[column.property].format,
              cellValue
            );
            break;
          case "urlType":
            str = this.gvUtil.translateData(
              this.cacheFields[column.property].format.urlType,
              cellValue
            );
            break;
          case "optionType":
            str = this.gvUtil.translateOption(
              this.cacheFields[column.property].format.optionType,
              cellValue
            );
            break;
          case "custom":
            str = this.cacheFields[column.property].format.formatFn(
              cellValue,
              row
            );
            break;
          default:
            str = cellValue;
            break;
        }
      } else {
        str = cellValue;
      }
      return str
        ? str
        : this.cacheFields[column.property].format &&
          this.cacheFields[column.property].format.emptySign
        ? "--"
        : str;
    },
    handleCommand(e, row, index) {
      this.$emit("on-list-btn", row, e, index);
    },
    onHandle: function onHandle(row, flag, index, perms) {
      if(!this.gvUtil.hasPermi(perms)) {
        this.$message.error('未配置权限！')
        return
      }
      this.$emit("on-list-btn", row, flag, index);
    },
    // handleSelectionChange: function handleSelectionChange(val) {
    //     this.$emit('election-change', val);
    // },
    onMore: function onMore() {
      this.isMore = !this.isMore;
    },
    onSubmit: function onSubmit() {
      if (this.fromFiltersEx.name == "") {
        this.$message({
          type: "success",
          message: this.gvUtil.getInzTranslate("gValidateRequired"),
        });
        return;
      }
      this.dialogFormVisible = false;
      var d = {},
        d1 = {},
        time = new Date().getTime(),
        key = "filter_" + time;
      Object.assign(d1, this.fromFilters);
      d1._filterName = this.fromFiltersEx.name;
      d1._time = time;
      d1._filterRemarks = this.fromFiltersEx.remarks;
      this.cacheFieldsEx[key] = d1;
      this.updateOptionsFieldsEx(this.cacheFieldsEx, true);
      this.$message({
        type: "success",
        message: this.gvUtil.getInzTranslate("gSaveSuccess"),
      });
      this.fromFiltersEx.name = "";
      this.fromFiltersEx.remarks = "";
    },
    initFilterEx: function initFilterEx() {
      var f = sessionStorage.getItem(this.gvUtil.md5(this.path));
      if (!f) return;
      this.cacheFieldsEx = JSON.parse(f);
      this.updateOptionsFieldsEx(this.cacheFieldsEx, false);
    },
    onHandleDel: function onHandleDel(row) {
      var _this = this;
      this.$confirm(this.gvUtil.getInzTranslate("gDeleteContent")).then(() => {
        if (row && _this.cacheFieldsEx[row.value]) {
          delete _this.cacheFieldsEx[row.value];
          if (_this.filterEx == row.value) {
            _this.filterEx = "";
          }
          _this.updateOptionsFieldsEx(_this.cacheFieldsEx, true);
          _this.$message({
            type: "success",
            message: this.gvUtil.getInzTranslate("gDeleteSuccess"),
          });
        }
      });
    },
    updateOptionsFieldsEx: function updateOptionsFieldsEx(obj, type) {
      this.optionsFieldsEx = [];
      if (obj) {
        for (var key in obj) {
          var d = {
            value: key,
            label: obj[key]._filterName,
            remarks: obj[key]._filterRemarks,
            time: obj[key]._time,
            datas: JSON.stringify(obj[key]),
          };
          this.optionsFieldsEx.push(d);
        }
        this.optionsFieldsEx.sort(this.gvUtil.compare("time", false));
        type &&
          sessionStorage.setItem(
            this.gvUtil.md5(this.path),
            JSON.stringify(obj)
          );
      }
    },
    getFilterEx: function getFilterEx() {
      if (this.cacheFieldsEx && this.cacheFieldsEx[this.filterEx]) {
        Object.assign(this.fromFilters, this.cacheFieldsEx[this.filterEx]);
      }
    },
    getSingleSelectData: function getSingleSelectData() {
      return this.currentRow;
    },
    getSelectData: function getSelectData() {
      return this.multipleSelection;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
/*数据表格*/
.gv-query-table {
  background: #fff;
  border: 1px solid #e5e7ea;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-top: 24px;
}
.gv-query-table-left {
  margin-top: 4px;
}
.gv-query-table .query-title {
  font-size: 14px;
  padding: 12px 15px;
  margin: 0;
  border-bottom: 1px solid #e5e9ea;
  background: #f7f8f9;
  border-radius: 4px 4px 0 0;
}
.gv-content {
  padding-top: 15px;
}
.gv-query-table .query-more {
  border-top: 1px dotted #e5e7ea;
}
.gv-query-table .query-bottom {
  border-top: 1px dotted #e5e7ea;
  padding: 10px;
}
.pull-left {
  float: left !important;
}
.pull-right {
  position: relative;
  float: right !important;
}
.clearfix {
  clear: both;
  height: auto;
  overflow: hidden;
}
.gv-List-select {
  margin-left: 8px;
  width: 120px;
}
.gv-query-table .query-control {
  height: 48px;
  line-height: 45px;
  padding: 0px 10px;
  /*border: 1px solid #e5e7ea;*/
  border-radius: 4px 4px 0 0;
  background: #f7f8f9;
  border-bottom: none;
}
.key-select-list {
  transition: all 3s ease-in-out;
  position: absolute;
  height: 500px;
  overflow-y: auto;
  right: 5px;
  /*top: 28px;*/
  padding: 10px 15px;
  z-index: 100;
  border-radius: 5px;
  border: 1px solid #e4e4e4;
  background: #fff;
}
.key-list .el-checkbox {
  display: block;
  margin-left: 8px;
}

.key-list .el-checkbox + .el-checkbox {
  margin-left: 8px;
}
// .gv-query-table {
//   overflow: hidden;
// }
.gv-query-table .query-content {
  padding: 0;
  background: #fff;
  border-top: 1px solid #e5e7ea;
  border-radius: 0 0 4px 4px;
  display: block;
  width: 100%;

  height: 45px;
  line-height: 42px;
}
.gv-pagination {
  color: #676f7a;
  display: block;
  margin: 15px 0;
}

.gv-pagination .el-pagination {
  white-space: nowrap;
  margin-left: -5px;
  margin-right: 10px;
}
.el-dialog__wrapper /deep/.gv-dialog .el-dialog__body {
  padding: 0 10px 10px 10px;
}
.gv-dialog {
  color: #556677;
}

.gv-dialog .el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #556677;
}

.gv-dialog .el-dialog__headerbtn .el-dialog__close {
  font-size: 18px;
}

.gv-dialog .el-dialog__body {
  padding: 10px 20px 20px 20px;
}

.gv-dialog .el-input,
.gv-dialog .el-select {
  width: 300px;
}

.gv-dialog .el-input__inner {
  background-color: #eef6ff;
  border: 1px solid #d0e6f5 !important;
  color: #556677;
}

.gv-dialog h4,
.gv-dialog .el-dialog__body .dialog-msg {
  font-size: 14px;
  color: #556677;
}
.gv-dialog-smll .gv-dialog {
  width: 350px;
}
.query-content .el-table {
  margin-top: 0px;
  color: #556677;
  outline: none;
  font-weight: 500;
}

.query-content .el-table td,
.el-table th.is-leaf {
  border-bottom: 0px;
  border-bottom: 1px solid #ebeef5;
}

.query-content .el-table th {
  padding: 12px 0;
  height: 40px;
  background-color: #fff;
  height: 40px;
  color: #a7afb7;
  padding: 4px;
}

.query-content .el-table td,
.el-table th {
  height: 43px;
}

.query-content .el-table td {
  padding: 2px 0px;
}

/* .query-content .el-table th>.cell {
    text-align: left;
} */

.query-content .el-table th > .cell,
table thead td {
  font-size: 12px;
  /*font-weight:bold*/
}

.gv-query-table
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.current-row
  td,
.gv-query-table .el-table__body tr.current-row > td,
.el-table__body tr.hover-row.current-row > td,
.gv-query-table
  .el-table__body
  tr.hover-row.el-table__row--striped.current-row
  > td,
.gv-query-table .el-table__body tr.hover-row.el-table__row--striped > td,
.gv-query-table .el-table__body tr.hover-row > td {
  background: #fffdd9 !important;
}
.query-content /deep/ .el-table .el-table__header-wrapper th {
  background-color: #fff;
}
.query-content /deep/ .el-table .el-table__header th {
  font-size: 13px;
  color: #515a6e;
}
.query-content /deep/ .el-table .el-table__body-wrapper .el-table__empty-block {
  border-bottom: 1px solid #e5e7ea;
}
.sign {
  background: $red;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  margin-right: 5px;
}
.sign.success {
  background: $green;
}
</style>