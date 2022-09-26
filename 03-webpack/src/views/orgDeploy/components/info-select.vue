<template>
  <div>
    <el-button type="text" @click="handleClick" :disabled='disabled'>管理</el-button>
    <div class="tags">
      <el-tag class="tagItem" v-for="tag in codes" :key="tag.id">
        {{ tag.label }}{{ tag.isRequir == "1" ? "(必填)" : "" }}
      </el-tag>
    </div>
    <gv-dialog title="提示" :visible.sync="visible" width="700px">
      <gv-column-table
        class="deployTable"
        ref="table"
        isSelection
        :rowKey="['id']"
        :table="formData"
        :rules="rules"
      ></gv-column-table>
      <span slot="footer" class="dialog-footer flex-center">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </gv-dialog>
  </div>
</template>

<script>
import { getInsField } from "@/api/sys";
export default {
  name: "info-select",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    prop: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      codes: [],
      formData: {
        tableData: [],
        head: [
          {
            dataEname: "字段名称", // 工作日
            infoCode: "label",
            config: {
              type: "txt",
            },
          },
          {
            dataEname: "是否必填", // 工作日
            infoCode: "isRequir",
            config: {
              type: "switch",
            },
          },
        ],
      },
      rules: {},
      multiples: [],
    };
  },
  methods: {
    updataValue() {
      this.$emit("input", this.codes);
      this.$emit("change", this.codes);
    },
    // 保存
    handleSave() {
      let list = this.$refs.table.getSelection() || [];
      let l = list.reduce((t, e) => {
        // 由于getSelection取回旧数据
        let obj = this.formData.tableData.find((v) => v.id == e.id);
        t.push(obj);
        return t;
      }, []);
      this.codes = l.map((e) => {
        let { id: fieldId, label, isRequir } = e;
        return {
          fieldId,
          label,
          isRequir: isRequir ? 1 : 0,
          bizType: this.type,
          infoType: this.prop,
        };
      });
      this.updataValue();
      this.visible = false;
    },
    // 点击展开
    async handleClick() {
      this.visible = true;
      await this.$nextTick();
      let selectData = []; // 选中的数据
      this.codes.forEach((e) => {
        let { fieldId: id, label, isRequir } = e;
        let i = this.formData.tableData.findIndex((v) => v.id == e.fieldId);
        if (i != -1) {
          this.$set(this.formData.tableData, i, {
            id,
            label,
            isRequir,
          });
          selectData.push(this.formData.tableData[i]);
        }
      });
      await this.$nextTick();
      this.$refs.table.toggleRowSelect(selectData);
    },
    // 初始化数据
    async initData() {
      let res = await getInsField({
        privyType: this.prop,
        displayPosition: this.type,
      });
      if (res && res.code == "00000") {
        this.formData.tableData = res.data || [
          {
            id: 1,
            label: "姓名",
          },
          {
            id: 2,
            label: "手机号",
          },
        ];
      }
    },
  },
  watch: {
    value: {
      handler(val) {
        this.codes = JSON.parse(JSON.stringify(val));
      },
      deep: true,
    },
  },
  computed: {},
  created() {
    this.codes = this.value;
    this.initData();
  },
};
</script>

<style lang='less' scoped>
.deployTable /deep/.el-table__body-wrapper .cell {
  padding: 5px;
}
.tags {
  max-height: 180px;
  overflow-y: scroll;
  .tagItem {
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
    cursor: pointer;
  }
}
</style>