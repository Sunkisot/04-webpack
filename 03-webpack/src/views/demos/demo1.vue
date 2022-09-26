<template>
  <div style="margin-top: 20px">
    <input type="checkbox" :checked="checked" @change="handleCheckAll" />
    <ul>
      <li
        v-for="(item, i) of listcheck"
        :key="item.id"
        @click="handleClick(item.id)"
      >
        {{ item.name + "" + i }}
      </li>
    </ul>
    <ul>
      <li
        v-for="item in filterList"
        :key="item.id"
        @click="handleClickNO(item.id)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      cacheList: [
        {
          id: 1,
          name: "name1",
          isChecked: false,
        },
        {
          id: 2,
          name: "name2",
          isChecked: false,
        },
        {
          id: 3,
          name: "name3",
          isChecked: false,
        },
        {
          id: 4,
          name: "name4",
          isChecked: false,
        },
        {
          id: 5,
          name: "name5",
          isChecked: false,
        },
        {
          id: 6,
          name: "name6",
          isChecked: false,
        },
      ],
      list: [
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ],
      list1: [
        [1, 21, 3],
        [21, 32, 42],
        [33, 41, 5],
      ],
    };
  },
  methods: {
    handleClick(id) {
      let obj = this.cacheList.find((e) => e.id == id);
      obj.isChecked = true;
    },
    handleClickNO(id) {
      let obj = this.cacheList.find((e) => e.id == id);
      obj.isChecked = false;
    },
    handleCheckAll(e) {
      e.target.checked;
      debugger;
    },
    fangdou(fn, delay) {
      let timeid;
      return function () {
        clearTimeout(timeid);
        timeid = setTimeout(fn, delay);
      };
    },
    quchong() {
      let arr = this.list.flat(Infinity);
      let arr1 = this.list1.flat(Infinity);
      console.log(this.list.toString().split(","));
      console.log(arr, arr1);
      let all = [...arr, ...arr1];
      // concat
      let a = all.reduce((t, e) => {
        t.includes(e) || t.push(e);
        return t;
      }, []);
      console.log(a);
    },
  },
  watch: {
    cacheList: {
      handler(val) {
        let flag = val.some((e) => !e.isChecked);
        this.checked = !flag;
      },
      deep: true,
    },
  },
  computed: {
    filterList() {
      return this.cacheList.filter((e) => e.isChecked);
    },
    listcheck() {
      return this.cacheList.filter((e) => !e.isChecked);
    },
  },
  created() {
    this.quchong();
  },
};
</script>

<style>
</style>