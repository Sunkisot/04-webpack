<template>
  <div>
    <div v-for="item in arr" :key="item.id" >
      <gv-echarts
        :ref="item.id"
        v-show="item.show"
        style="width: 100%; height: 300px"
      ></gv-echarts>
    </div>
  </div>
</template>

<script>
export default {
  name: "useGvEcharts",
  data() {
    return {
      arr: [{
        id: '1',
        show: true,
        data: []
      }],
    };
  },
  created() {
    this.arr.forEach((item) => {
      let option = {
        title: {
          text: item.title,
          x: "10",
          y: "10",
          textStyle: {
            fontSize: "17",
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
          postion: [10, "50%"],
        },
        legend: {
          selectedMode: false,
          borderRadius: 10,
          orient: "horizontal",
          icon: "circle",
          left: "10",
          bottom: "13",
          textStyle: {
            fontSize: 10,
            fontWeight: "bold",
          },
          data: item.data,
          itemWidth: 10, // 图标宽
          itemHeight: 10, // 图标高
          itemGap: 10, // 间距
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      };

      setTimeout(() => {
        this.$refs[item.id][0].initChart(option);
      }, 10);
    });
  },
};
</script>

<style>
</style>