<template>
  <div
    :class="className"
    :id="id"
    :style="{ height, width }"
  ></div>
</template>

<script>
/**
 * echarts
 * @author 计欣奇
 * @time 2020/11/08
 */
import * as echarts from "echarts";
import $ from "jquery";
// 随机数
var id = 0;

export default {
  props: {
    option: {
      type: Object,
    },
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    initCharts: Function,
  },
  data() {
    return {
      chart: null,
      id: "",
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(option, city) {
      if (city) {
        echarts.registerMap(city.name, city.map); // 注册可用的地图，必须在包括 geo 组件或者 map 图表类型的时候才能使用。
      }
      // $("echart_"+this.id).width($("echart_"+this.id).width());
      // $("echart_"+this.id).height($("echart_"+this.id).height());
      this.chart = echarts.init(document.getElementById(this.id), "light");
      if (option) {
        this.chart.setOption(option);
        this.chart.dispatchAction({
          type: "highlight", // 初始化第一个高亮
          seriesIndex: 0,
          dataIndex: 0,
        });
        this.chart.on("click", (v) => {
          if (v.seriesIndex != 0) {
            this.chart.dispatchAction({ // 取消其他高亮
              type: "downplay",
              seriesIndex: 0,
              dataIndex: 0,
            });
          }
        });
      } else {
        this.chart.setOption(this.option);
      }
    },
    editEchart(option, id) {
      let index = 0;
      this.chart = echarts.init(document.getElementById(id));
      this.chart.setOption(option);
      this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0,
      });
      this.chart.on("mousedown", function (e) {
        this.chart = echarts.init(document.getElementById(id));
        this.chart.setOption(option);
        if (e.dataIndex != index) {
          this.chart.dispatchAction({ // 鼠标左键 取消其他高粱 
            type: "downplay",
            seriesIndex: 0,
            dataIndex: 0,
          });
        }
        this.chart.dispatchAction({ // 鼠标左键 设置点击高亮
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      this.chart.on("mouseout", function (e) { // 鼠标移出 设置移出的高亮
        this.chart = echarts.init(document.getElementById(id));
        this.chart.setOption(option);
        index = e.dataIndex;
        this.chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: index,
        });
      });
    },
    destroy() {
      if (this.chart) {
        this.chart.dispose(); // 销毁实力
      }
    },
  },
  created() {
    id++;
    this.id = "echart_" + id;
  },
};
</script>

<style>
</style>