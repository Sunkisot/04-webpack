<template>
  <div></div>
</template>

<script>
import BIN from "bankcardinfo";
export default {
  name: "demo4",
  data() {
    return {
      
    }
  },
  created() {
    BIN.getBankBin("6217730727382465") 
      .then(function (data) {
        console.log(data)
      })
      .catch(function (err) {});
  },
};
</script>

<style>
</style>