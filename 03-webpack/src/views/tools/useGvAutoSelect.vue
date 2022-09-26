<template>
  <div>
    <gv-auto-select v-model='code' @change='change' url='/test/autoSelect' codeName='value' labelName='label'></gv-auto-select>
  </div>
</template>

<script>
export default {
  name: 'useGvAutoSelect',
  data() {
    return {
      code: '1'
    }
  },
  methods: {
    change() {
      console.log(this.code)
    }
  }
}
</script>

<style>

</style>