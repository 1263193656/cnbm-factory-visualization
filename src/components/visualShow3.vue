<template>
  <div>
    <vo-edit style="background: #ec9393"
             :data="chartData1"
             :exportButton=true
             :toggleCollapse=true
             :pan=true
             :zoom=true
             :draggable=true
             direction="l2r"
             nodeTitle="craft"
             nodeContent="description"
             exportButtonName="导出"
             exportFilename="test"
    >
    </vo-edit>
    <div id="edit-panel" class="view-state edit-container">
      <div class="item item-half">
        <div class="input-node-container">
          <label class="selected-node-group">Selected Node</label>
          <input type="text" id="selected-node" class="selected-node-group new-node">
        </div>
        <div>
          <label>New Node</label>
          <ul id="new-nodelist">
            <li><input type="text" class="new-node"></li>
          </ul>
        </div>
      </div>
      <div id="node-type-panel" class="radio-panel item">
        <input type="radio" name="node-type" id="rd-parent" value="parent" class=""><label for="rd-parent">Root</label>
        <input type="radio" name="node-type" id="rd-child" value="children"><label for="rd-child">Child</label>
        <input type="radio" name="node-type" id="rd-sibling" value="siblings"><label for="rd-sibling">Sibling</label>
      </div>
      <div class="item">
        <button @click="addNodes">Add</button>
        <button @click="deleteNodes">Delete</button>
        <button @click="exportJSON">Export JSON</button>
      </div>
    </div>
    <pre class="json-container">
          <code class="json">
            {{chartData1}}
          </code>
  </pre>
    <div>
      <el-button @click="test"></el-button>
    </div>
    <div>
      {{showNodeMenu}}
    </div>
    <el-menu
        id="node-menu"
        class="el-menu-vertical-demo"
        v-show="showNodeMenu">
      <el-menu-item index="1">
        <i class="el-icon-edit"></i>
        <span slot="title">编辑</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-circle-plus-outline"></i>
        <span slot="title">添加</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-delete"></i>
        <span slot="title">删除</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
window.oncontextmenu=function(e){
//取消默认的浏览器自带右键 很重要！！
  e.preventDefault();
}
import { VoEdit } from 'vue-orgchart'
export default {
  components: { VoEdit },
  data () {
    return {
      chartData1: {},
      showNodeMenu: false,
    }
  },
  created () {
    this.chartData1 = { "children": [ { "children": [ { "children": [ { "children": [], "craft": "工序", "description": "原料储备工序", "devicecode": "GX_000001", "id": 10, "locationid": "GX_000001", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000001" }, { "children": [], "craft": "工序", "description": "1#生料制备工序", "devicecode": "GX_000002", "id": 11, "locationid": "GX_000002", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000002" }, { "children": [], "craft": "工序", "description": "1#生料磨窑尾废气处理系统", "devicecode": "GX_000003", "id": 12, "locationid": "GX_000003", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000003" }, { "children": [], "craft": "工序", "description": "2#生料制备工序", "devicecode": "GX_000004", "id": 13, "locationid": "GX_000004", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000004" }, { "children": [], "craft": "工序", "description": "2#生料磨窑尾废气处理系统", "devicecode": "GX_000005", "id": 14, "locationid": "GX_000005", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000005" } ], "craft": "工段", "description": "生料制备工段", "devicecode": "GD_000001", "id": 5, "locationid": "GD_000001", "parent": "CJ_000001", "parentCode": "CJ_000001", "treeId": "GD_000001" }, { "children": [ { "children": [], "craft": "工序", "description": "煤粉制备工序", "devicecode": "GX_000006", "id": 15, "locationid": "GX_000006", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000006" }, { "children": [], "craft": "工序", "description": "烧成工序", "devicecode": "GX_000007", "id": 16, "locationid": "GX_000007", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000007" }, { "children": [], "craft": "工序", "description": "循环水供水工序", "devicecode": "GX_000008", "id": 17, "locationid": "GX_000008", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000008" }, { "children": [], "craft": "工序", "description": "空压机供气工序", "devicecode": "GX_000009", "id": 18, "locationid": "GX_000009", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000009" }, { "children": [], "craft": "工序", "description": "氨水脱销工序", "devicecode": "GX_000010", "id": 19, "locationid": "GX_000010", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000010" } ], "craft": "工段", "description": "烧成工段", "devicecode": "GD_000002", "id": 7, "locationid": "GD_000002", "parent": "CJ_000001", "parentCode": "CJ_000001", "treeId": "GD_000002" } ], "craft": "车间", "description": "烧成车间", "devicecode": "CJ_000001", "id": 2, "locationid": "CJ_000001", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000001" }, { "children": [ { "children": [ { "children": [], "craft": "工序", "description": "混合材储备工序", "devicecode": "GX_000011", "id": 20, "locationid": "GX_000011", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000011" }, { "children": [], "craft": "工序", "description": "熟料输送工序", "devicecode": "GX_000012", "id": 21, "locationid": "GX_000012", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000012" }, { "children": [], "craft": "工序", "description": "水泥管磨制备工序", "devicecode": "GX_000013", "id": 72, "locationid": "GX_000013", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000013" }, { "children": [], "craft": "工序", "description": "水泥立磨制备工序", "devicecode": "GX_000014", "id": 73, "locationid": "GX_000014", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000014" }, { "children": [], "craft": "工序", "description": "清水池供水工序", "devicecode": "GX_000015", "id": 74, "locationid": "GX_000015", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000015" } ], "craft": "工段", "description": "水泥制备工段", "devicecode": "GD_000003", "id": 8, "locationid": "GD_000003", "parent": "CJ_000002", "parentCode": "CJ_000002", "treeId": "GD_000003" }, { "children": [ { "children": [], "craft": "工序", "description": "水泥成品发放工序", "devicecode": "GX_000016", "id": 75, "locationid": "GX_000016", "parent": "GD_000004", "parentCode": "GD_000004", "treeId": "GX_000016" }, { "children": [], "craft": "工序", "description": "熟料散装发放工序", "devicecode": "GX_000017", "id": 76, "locationid": "GX_000017", "parent": "GD_000004", "parentCode": "GD_000004", "treeId": "GX_000017" }, { "children": [], "craft": "工序", "description": "污水处理工序", "devicecode": "GX_000018", "id": 77, "locationid": "GX_000018", "parent": "GD_000004", "parentCode": "GD_000004", "treeId": "GX_000018" } ], "craft": "工段", "description": "成品发放工段", "devicecode": "GD_000004", "id": 9, "locationid": "GD_000004", "parent": "CJ_000002", "parentCode": "CJ_000002", "treeId": "GD_000004" } ], "craft": "车间", "description": "水泥车间", "devicecode": "CJ_000002", "id": 3, "locationid": "CJ_000002", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000002" }, { "children": [], "craft": "车间", "description": "余热发电车间", "devicecode": "CJ_000003", "id": 4, "locationid": "CJ_000003", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000003" }, { "children": [ { "children": [], "craft": "设备", "description": "电动抓斗桥式起重机", "devicecode": "291CA04", "id": 1647, "locationid": "SD_000001", "parent": "CJ_000004", "parentCode": "CJ_000004", "treeId": "SD_000001" } ], "craft": "车间", "description": "测试车间", "devicecode": "CJ_000004", "id": 1763, "locationid": "CJ_000004", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000004" } ], "craft": "产线", "description": "铜川尧柏万吨线", "devicecode": "CX_000001", "id": 1, "locationid": "CX_000001", "parent": "", "parentCode": "null", "treeId": "CX_000001" }
  },
  mounted() {
    this.$nextTick(
        this.mountOrgchart()
    )

  },
  methods: {
    switchNodeMenu()
    {
      console.log("HELLO")
      this.showNodeMenu = !this.showNodeMenu
    },
    test(){
      console.log("obj.showNodeMenu+"+this.showNodeMenu)
      this.showNodeMenu = !this.showNodeMenu
      // 动态绑定点击事件
      // document.querySelectorAll('.node')
      //   .forEach(item => {
      //     item.addEventListener('click',function(e){
      //       console.log(e.currentTarget.id)
      //     },false)
      //   })
      let switchNodeMenu = function (obj)
      {
        console.log("HELLO")
        obj.showNodeMenu = !obj.showNodeMenu
        console.log(obj.showNodeMenu)
      }
      let nodes = document.querySelectorAll('.node');
      for(let i = 0; i < nodes.length; i++) {
        nodes[i].onmouseup = function(e){
          console.log('右键点击了');
          if(e.button === 2){
            switchNodeMenu(this)
            // this.showNodeMenu = true
            // console.log(this.showNodeMenu)
            // console.log(e.currentTarget.id)

          }
        }
      }
      // document.querySelectorAll('.node')
      //     .forEach(item => {
      //       // item.addEventListener('oncontextmenu',function(e){
      //       //   console.log(e.currentTarget.id)
      //       // },false)
      //       // 右键点击节点事件
      //       item.onmouseup = function(e){
      //         console.log('右键点击了');
      //         if(e.button === 2){
      //           this.parent.switchNodeMenu()
      //           // this.showNodeMenu = true
      //           // console.log(this.showNodeMenu)
      //           // console.log(e.currentTarget.id)
      //
      //         }
      //       }
      //     })
    },
    mountOrgchart() {
      this.$children.forEach((item) => {
        item.orgchart !== undefined ? this.orgchart = item.orgchart : null
      })
      // // 动态绑定点击事件
      // document.querySelectorAll('.node')
      //   .forEach(item => {
      //     console.log('+1')
      //       item.addEventListener('click',function(e){
      //         console.log(222)
      //       },false)
      //   })
    },
    addNodes() {
      let chartContainer = document.getElementById('chart-container')
      let nodeVals = []
      //把有关这个new-node的所有输入信息都放入nodeVals[]
      Array.from(document.getElementById('new-nodelist').querySelectorAll('.new-node'))
          .forEach(item => {
            let validVal = item.value.trim()
            if (validVal) {
              nodeVals.push(validVal)
            }
          })
      //获得已选中的node对象
      let selectedNode = document.getElementById(document.getElementById('selected-node').dataset.node)
      //判断有没有输入new-node值
      if (!nodeVals.length) {
        alert('Please input value for new node')
        return
      }
      //获得radioBox值
      let nodeType = document.querySelector('input[name="node-type"]:checked')
      if (!nodeType) {
        alert('Please select a node type')
        return
      }
      // alert(JSON.stringify(chartContainer.querySelector('.node')))
      // 分别对三种radioBox值作处理
      // 1.所有node都删干净了
      if (nodeType.value !== 'parent' && !document.querySelector('.orgchart')) {
        alert('Please creat the root node firstly when you want to build up the orgchart from the scratch')
        return
      }
      // 2.没有选radioBox值
      if (nodeType.value !== 'parent' && !selectedNode) {
        alert('Please select one node in orgchart')
        return
      }
      /* eslint-disable */
      // 3.选中root的处理
      if (nodeType.value === 'parent') {
        if (!chartContainer.children.length) {// 所有node都删干净了，创建新的node
          this.orgchart = new OrgChart({
            'chartContainer': '#chart-container',
            'data': { 'craft': nodeVals[0] },
            'parentNodeSymbol': 'fa-th-large',
            'createNode': function (node, data) {
              node.id = this.getId()
            }
          })
          this.orgchart.chart.classList.add('view-state')
        } else {// 正常创建根节点
          // alert(JSON.stringify(chartContainer.querySelector('.node')))
          this.orgchart.addParent(chartContainer.querySelector('.node'), { 'craft': nodeVals[0], 'Id': this.getId() })
        }
        // 4.选中siblings的处理
      } else if (nodeType.value === 'siblings') {
        this.orgchart.addSiblings(selectedNode, {
          'siblings': nodeVals.map(item => {
            return { 'craft': item, 'relationship': '110', 'Id': this.getId() }
          })
        })
        // 5.选中child的处理
      } else {
        let hasChild = selectedNode.parentNode.colSpan > 1
        if (!hasChild) {
          let rel = nodeVals.length > 1 ? '110' : '100'
          this.orgchart.addChildren(selectedNode, {
            'children': nodeVals.map(item => {
              return { 'description': item, 'relationship': rel, 'Id': this.getId() }
            })
          })
        } else {
          this.orgchart.addSiblings(closest(selectedNode, el => el.nodeName === 'TABLE').querySelector('.nodes').querySelector('.node'),
              { 'siblings': nodeVals.map(function (item) { return { 'craft': item, 'relationship': '110', 'Id': this.getId() } })
              })
        }
      }
      this.chartData1 = this.orgchart.getChartJSON();
      console.log('change');
    },
    deleteNodes() {
      let sNodeInput = document.getElementById('selected-node')
      let sNode = document.getElementById(sNodeInput.dataset.node)
      if (!sNode) {
        alert('Please select one node in orgchart')
        return
      } else if (sNode === document.querySelector('.orgchart').querySelector('.node')) {
        if (!window.confirm('Are you sure you want to delete the whole chart?')) {
          return
        }
      }
      this.orgchart.removeNodes(sNode)
      sNodeInput.value = ''
      sNodeInput.dataset.node = ''
      // this.chartData = this.orgchart;
      this.chartData1  = this.orgchart.getChartJSON()
      console.log('change');

    },
    exportJSON() {
      let datasourceJSON = {}
      let ChartJSON = this.orgchart.getChartJSON()
      datasourceJSON = JSON.stringify(ChartJSON, null, 2)
      if(document.getElementsByTagName('code')[0]) {
        let code = document.getElementsByTagName('code')[0]
        code.innerHTML = datasourceJSON
      }
      return datasourceJSON
    },
    getId() {
      return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001)
    }
  },
}
</script>
<style>
html {
  background: #f0f2f5;
}
#node-menu {
  width: 100px;
  font-size: 10px;
  max-height: 165px;
  /*height: 300px;*/
}
@media (min-width: 768px) {
  .input-node-container {
    margin-top:-20px;
    margin-bottom:15px;
  }
}
.edit-container {
  border-radius: 5px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit-container .item {
  flex: 1;
}
.edit-container .item-half {
  height: 24px;
  flex: 0 0 45%;
  text-align: center;
}
@media (max-width: 768px) {
  .edit-container {
    height: 140px;
    flex-direction: column;
    flex: 1;
  }
  .edit-container .item {
    flex: auto;
  }
}
.json-container {
  margin-right: 15px;
  float: right;
  border-radius: 5px;
}
.json {
  margin-top: -12.5px;
  margin-left: 10px;
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #383a42;
  background: #fff;
}
.c-expand-positon-bottom {
  height: fit-content !important;
  margin-top: 75px !important;
}
</style>
