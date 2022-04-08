<template>
  <div>
    <vo-edit style="min-height: 1280px; min-width: 720px" :data="this.chartData" :pan="pan" :zoom="zoom" :draggable="draggable"></vo-edit>
    <div>
      <el-button @click="test"></el-button>
      {{'结构'+JSON.stringify(chartData)}}
    </div>
  </div>
</template>

<script>
import { VoEdit } from 'vue-orgchart'
export default {
  name: "visualShow",
  components: { VoEdit },
  data(){
    return {
      chartData: {
        name: 'JavaScript',
        children: [
          { name: 'Angular' },
          {
            name: 'React',
            children: [{ name: 'Preact' }]
          },
          {
            name: 'Vue',
            children: [{ name: 'Moon' }]
          }
        ]
      },
      pan: true,
      zoom: true,
      draggable: true,
    }
  },
  created () {

  },
  methods: {
    test(){
      this.chartData = {}
      this.chartData = {
        name: 'JavaScript',
        children: [
          {
            name: 'React',
            children: [{ name: 'Preact' }]
          },
          {
            name: 'Vue',
            children: [{ name: 'Moon' }]
          }
        ]
      }
    },
  },
}
</script>
