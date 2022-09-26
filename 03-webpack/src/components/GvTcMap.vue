<template>
  <div>
    <div id="map" class="map"></div>
    <el-button @click="setMark">标记</el-button>
  </div>
</template>

<script>
import markImg from "@/assets/images/mark.png";
export default {
  name: "GvTcMap",
  data() {
    return {
      map: null,
    };
  },
  methods: {
    // 设置标记
    setMark() {
      var marker = new TMap.MultiMarker({
        id: "marker-layer", //图层id
        map: this.map,
        styles: {
          //点标注的相关样式
          marker: new TMap.MarkerStyle({
            width: 35,
            height: 35,
            anchor: { x: 16, y: 32 },
            src: markImg,
          }),
        },
        geometries: [
          {
            //点标注数据数组
            id: "demo",
            styleId: "marker",
            position: new TMap.LatLng(39.984104, 116.307503),
            properties: {
              title: "marker",
            },
          },
        ],
      });
    },
    // 地图初始化函数，本例取名为init，开发者可根据实际情况定义
    initMap() {
      // 定义地图中心点坐标
      var center = new window.TMap.LatLng(39.98412, 116.307484);
      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      this.map = new window.TMap.Map(document.getElementById("map"), {
        center: center, // 设置地图中心点坐标
        zoom: 17.2, // 设置地图缩放级别
        // pitch: 43.5, // 设置俯仰角
        // rotation: 45, // 设置地图旋转角度
      });
    },
    loadScript() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://map.qq.com/api/gljs?v=1.exp&key=MMEBZ-W56KU-DLFV7-2MFOB-5REHV-PVF6T";
      document.body.appendChild(script);
      script.onload = () => {
        this.initMap();
      };
    },
  },
  mounted() {
    this.loadScript();
  },
};
</script>

<style lang='less' scoped>
.map {
  width: 500px;
  height: 250px;
}
</style>