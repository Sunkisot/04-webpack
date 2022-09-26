<template>
  <div>
    <div>
      <el-button
        class="gv-btn-primary"
        :disabled="isReadonly"
        size="mini"
        type="primary"
        @click="onImport()"
        >{{ _btnName }}</el-button
      >
      <el-button
        class="gv-btn-primary"
        :disabled="isReadonly"
        v-show="preview && isPreview"
        size="mini"
        type="primary"
        @click="onPreview()"
        >{{ "gBtnPreview" | translate("Preview") }}</el-button
      >
      <input
        type="file"
        :id="id"
        :accept="accept"
        @change="onChangeImport()"
        style="display: none"
        ref="inputer"
      />
      <span>{{ msg }}</span>
    </div>
    <el-dialog
      append-to-body
      top="5%"
      title="Preview"
      :close-on-click-modal="false"
      custom-class="dialogForm"
      width="85%"
      v-if="show"
      :visible.sync="show"
      :before-close="beforeClose"
    >
      <el-table
        :data="table.tableData"
        class="table-scroll"
        highlight-current-row
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(v, i) in table.tableHeader"
          :key="i"
          :prop="v.replace(/\./g, '')"
          :label="v"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 导入execl
 * @author 计昕奇
 * @time 2020/02/06
 */
import X2JS from "x2js";
import XLSX from 'xlsx'
export default {
  props: {
    size: {
      // 上传文件大小限制 默认小于2MB
      type: String,
      default: "2",
    },
    btnName: {
      // 展示的按钮名字
      type: String,
      default: null,
    },
    preview: {
      // 上传后是否预览
      type: Boolean,
      default: false,
    },
    isReadonly: {
      // 按钮是否只读
      type: Boolean,
      default: false,
    },
    formatObj: null,
  },
  data: function data() {
    return {
      wb: null, // 读取完成的数据
      rABS: false, // //是否将文件读取为二进制字符串
      id: "_" + new Date().getUTCMilliseconds(),
      table: {
        tableData: [],
        tableHeader: [],
      },
      _btnName: "",
      msg: "",
      isPreview: false,
      show: false,
      accept: ".xlsx,.xls,.csv,.xml",
    };
  },
  created: function created() {
    if (this.btnName) {
      this._btnName = this.btnName;
    } else {
      this._btnName = this.gvUtil.getInzTranslate("gBtnImportExecl");
    }
  },
  methods: {
    onImport: function onImport() {
      this.clearAllData();
      document.getElementById(this.id).click();
    },
    onPreview: function onPreview() {
      if (this.preview) {
        this.show = true;
      }
    },
    onChangeImport: function onChangeImport() {
      var inputDOM = this.$refs.inputer,
        _this = this;
      if (!inputDOM) {
        return;
      }

      var f = inputDOM.files[0];
      if (!this.beforeAvatarUpload(f)) {
        return;
      }
      var reader = new FileReader();
      if (_this.rABS) {
        reader.readAsArrayBuffer(f); // 读取文件转换成ArrayBuffer对象
      } else {
        reader.readAsBinaryString(f);// 读取文件转换成文件的二进制串
      }
      reader.onload = function () {
        if (reader.result) {
          reader.content = reader.result;
        }
        var data = reader.content;
        console.log(f)
        debugger
        if (f.type == "text/xml") {
          var x2 = new X2JS();
          _this.msg = f.name;
          _this.$emit("select", x2.xml_str2json(data), f.type);
          return;
        }
        if (_this.rABS) {
          _this.wb = XLSX.read(btoa(fixdata(data)), {
            // 手动转化
            type: "base64",
          });
        } else {
          _this.wb = XLSX.read(data, {
            type: "binary",
          });
        }
        var j = _this.sheet_to_json(_this.wb.Sheets[_this.wb.SheetNames[0]]);
        console.log(j, 1)
        if (j) {
          if (_this.preview) {
            _this.show = true;
          }
          _this.msg = f.name;
          _this.table = _this.xlsxArrToTableArr(j);
          _this.isPreview = true;
          _this.$emit("select", _this.table, f.type, _this.msg);
        }
        // var str = JSON.stringify()
        // wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        // wb.Sheets[Sheet名]获取第一个Sheet的数据
      };
    },
    xlsxArrToTableArr: function xlsxArrToTableArr(xlsxArr) {
      var tableArr = [],
        length = 0,
        maxLength = 0,
        maxLengthIndex = 0,
        _this = this;
      xlsxArr.forEach(function (item, index) { // 获取属性名最多的一个数据对象
        length = Object.keys(item).length;
        if (maxLength < length) {
          maxLength = length;
          maxLengthIndex = index;
        }
      });
      var tableHeader = Object.keys(xlsxArr[maxLengthIndex]),
        rowItem = {};
      xlsxArr.forEach(function (item) {
        rowItem = {};
        for (var i = 0; i < maxLength; i++) {
          if (_this.formatObj && _this.formatObj[tableHeader[i]]) { // 对每行属性进行格式化
            if (_this.formatObj[tableHeader[i]].type == "date") {
              rowItem[tableHeader[i]] = _this.gvUtil.dateToStr(
                item[tableHeader[i]],
                _this.formatObj[tableHeader[i]].format
              );
            }
          } else {
            rowItem[tableHeader[i]] = item[tableHeader[i]] || "";
          }
        }
        tableArr.push(rowItem);
      });
      // 去除点.
      tableArr.forEach(function (item) {
        for (var key in item) {
          var rename = key.replace(/\./g, "");
          item[rename] = item[key];
        }
      });
      return {
        tableHeader: tableHeader,
        tableData: tableArr,
      };
    },
    clearAllData: function clearAllData() {
      document.getElementById(this.id).value = null;
      this.table = {
        tableData: [],
        tableHeader: [],
      };
      this.isPreview = false;
      this.msg = "";
      this.wb = null;
    },
    fixdata: function fixdata(data) {
      // 文件流转BinaryString
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    beforeClose: function beforeClose() {
      this.show = false;
      // this.clearAllData();
    },
    beforeAvatarUpload: function beforeAvatarUpload(file) {
      var isLt = file.size / 1024 / 1024 < parseInt(this.size);
      if (!isLt) {
        this.$message.error(
          "Uploading files cannot exceed " + this.size + "MB!"
        );
      }
      return isLt;
    },
    sheet_to_json: function sheet_to_json(sheet, opts) {
      var val,
        row,
        range,
        header = 0,
        offset = 1,
        r,
        hdr = [],
        isempty,
        R,
        C,
        v;
      var o = opts != null ? opts : {};
      var raw = o.raw;
      if (sheet == null || sheet["!ref"] == null) return [];
      range = o.range !== undefined ? o.range : sheet["!ref"];
      if (o.header === 1) header = 1;
      else if (o.header === "A") header = 2;
      else if (Array.isArray(o.header)) header = 3;
      switch (typeof range === "undefined" ? "undefined" : _typeof(range)) {
        case "string":
          r = this.safe_decode_range(range);
          break;
        case "number":
          r = this.safe_decode_range(sheet["!ref"]);
          r.s.r = range;
          break;
        default:
          r = range;
      }
      if (header > 0) offset = 0;
      var rr = this.encode_row(r.s.r);
      var cols = new Array(r.e.c - r.s.c + 1);
      var out = new Array(r.e.r - r.s.r - offset + 1);
      var outi = 0;
      for (C = r.s.c; C <= r.e.c; ++C) {
        cols[C] = this.encode_col(C);
        val = sheet[cols[C] + rr];
        switch (header) {
          case 1:
            hdr[C] = C;
            break;
          case 2:
            hdr[C] = cols[C];
            break;
          case 3:
            hdr[C] = o.header[C - r.s.c];
            break;
          default:
            if (val === undefined) continue;
            hdr[C] = this.format_cell(val);
        }
      }
      for (R = r.s.r + offset; R <= r.e.r; ++R) {
        rr = this.encode_row(R);
        isempty = true;
        if (header === 1) row = [];
        else {
          row = {};
          if (Object.defineProperty)
            Object.defineProperty(row, "__rowNum__", {
              value: R,
              enumerable: false,
            });
          else row.__rowNum__ = R;
        }
        for (C = r.s.c; C <= r.e.c; ++C) {
          val = sheet[cols[C] + rr];
          if (val === undefined || val.t === undefined) {
            val = { t: "s", v: null, w: "" };
          }
          v = val.v;
          switch (val.t) {
            case "e":
              continue;
            case "s":
              break;
            case "b":
            case "n":
              break;
            default:
              throw "unrecognized type " + val.t;
          }
          if (v !== undefined) {
            row[hdr[C]] = raw ? v : this.format_cell(val, v);
            isempty = false;
          }
        }
        if (isempty === false || header === 1) out[outi++] = row;
      }
      out.length = outi;
      return out;
    },
    safe_decode_range: function safe_decode_range(
      range /*:string*/
    ) /*:Range*/ {
      var o = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
      var idx = 0,
        i = 0,
        cc = 0;
      var len = range.length;
      for (idx = 0; i < len; ++i) {
        if ((cc = range.charCodeAt(i) - 64) < 1 || cc > 26) break;
        idx = 26 * idx + cc;
      }
      o.s.c = --idx;

      for (idx = 0; i < len; ++i) {
        if ((cc = range.charCodeAt(i) - 48) < 0 || cc > 9) break;
        idx = 10 * idx + cc;
      }
      o.s.r = --idx;

      if (i === len || range.charCodeAt(++i) === 58) {
        o.e.c = o.s.c;
        o.e.r = o.s.r;
        return o;
      }

      for (idx = 0; i != len; ++i) {
        if ((cc = range.charCodeAt(i) - 64) < 1 || cc > 26) break;
        idx = 26 * idx + cc;
      }
      o.e.c = --idx;

      for (idx = 0; i != len; ++i) {
        if ((cc = range.charCodeAt(i) - 48) < 0 || cc > 9) break;
        idx = 10 * idx + cc;
      }
      o.e.r = --idx;
      return o;
    },
    decode_row: function decode_row(rowstr /*:string*/) /*:number*/ {
      return parseInt(unfix_row(rowstr), 10) - 1;
    },
    encode_row: function encode_row(row /*:number*/) /*:string*/ {
      return "" + (row + 1);
    },
    decode_col: function decode_col(colstr /*:string*/) /*:number*/ {
      var c = unfix_col(colstr),
        d = 0,
        i = 0;
      for (; i !== c.length; ++i) {
        d = 26 * d + c.charCodeAt(i) - 64;
      }
      return d - 1;
    },
    encode_col: function encode_col(col /*:number*/) /*:string*/ {
      var s = "";
      for (++col; col; col = Math.floor((col - 1) / 26)) {
        s = String.fromCharCode(((col - 1) % 26) + 65) + s;
      }
      return s;
    },
    format_cell: function format_cell(cell /*:Cell*/, v /*:any*/, o /*:any*/) {
      if (cell == null || cell.t == null || cell.t == "z") return "";
      if (cell.w !== undefined) return cell.w;
      if (cell.t == "d" && !cell.z && o && o.dateNF) cell.z = o.dateNF;
      if (v == undefined) return safe_format_cell(cell, cell.v);
      return safe_format_cell(cell, v);
    },
  },
};
</script>

<style>
</style>