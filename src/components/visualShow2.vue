<template>
  <div style="padding: 10px">
<!--    <div>-->
<!--      <h1>OrgTree Demo</h1>-->
<!--    </div>-->
    <el-row>
      <el-col :span="menuSpan" style="padding-right: 15px; transition: .3s">
        <div class="expand-btn" @click="handleMenuExpand"><i :class="{'el-icon-s-fold':!menuIsExpand,'el-icon-s-unfold':menuIsExpand }" style="height: 30px"></i></div>
        <div style="height:calc(100vh - 75px); background: #fdfdfe; border-radius: 10px; box-shadow:  0 8px 24px  rgba(149,157,165,0.2);">
          <el-tree v-show="!menuIsExpand" class="treeMenu" :data="treeMenuData" @node-click="handleModelClick" @node-expand="handleModelExpand">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <img :src="iconURLs.find(type => type.craft === '工厂').img" height="16"/><span> {{ node.label }}</span>
            </span>
          </el-tree>
          <div v-show="menuIsExpand">
            .<br>.<br>.<br>.<br>.<br>.
          </div>
        </div>
      </el-col>
      <el-col :span="24 - menuSpan" style=" transition: .3s">
        <div id="r-pad" v-loading="g_loading" @click="isShowNodeMenuPanel = false" ref="myPage"
             style="height:calc(100vh - 40px);">
          <el-tooltip class="item" effect="dark" content="取消操作" placement="left">
            <el-button style="position: absolute; z-index: 99; top:20px; right: 20px;" type="primary" icon="el-icon-close" :disabled="cancelButtonDisabled" circle @click="resetGraph"/>
          </el-tooltip>
          <div style="position: absolute; z-index: 99; top:20px; margin-left: 20px; max-width: 300px;" >
            <el-input placeholder="搜索节点" v-model="searchNodeContent" class="input-with-select" size="small">
              <el-select v-model="searchNodeCraft" slot="prepend" placeholder="类型" style="min-width: 75px">
                <el-option label="产线" value="产线"></el-option>
                <el-option label="车间" value="车间"></el-option>
                <el-option label="工段" value="工段"></el-option>
                <el-option label="工序" value="工序"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="handleNodeSearch"></el-button>
            </el-input>
          </div>
          <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick">
            <div slot="node" slot-scope="{node}" class="node-shadow" :style="{borderRadius: '10px', background: 'none', border: '2px solid '+nodeBackGround(node.data.deep)}"  >
              <div style="height:64px; line-height: 64px;" :node_id="node.id" slot="reference">
                <div style="height: 64px; float: left; width: 30px; border-radius: 8px 0 0 8px;">
                  <img :src="iconURLs.find(type => type.craft === node.data.craft).img" height="16" style="margin-top: 24px"/>
                </div>
                <el-badge :is-dot="hasDevice(node.data.devicelogo)" class="dot-item">
                  <div style="height: 64px; float: right; width: 120px">
                    <div :style="{cursor: 'pointer',height:'32px', lineHeight: '32px', fontSize: '18px', color: 'white', background: nodeBackGround(node.data.deep), borderRadius: '0 8px 0 0'}" @contextmenu.prevent="showNodeMenus(node, $event)">
                      {{node.data.craft}}
                    </div>
                    <div :style="{cursor: 'pointer',height:'32px', lineHeight: '32px', fontSize: '14px', color: nodeBackGround(node.data.deep), fontWeight: 'bold', borderRadius: '0 0 8px 0', fontStyle: 'italic', overflow:'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis', border: '2px solid ' + nodeBackGround(node.data.deep), background: 'rgba(209,232,228,0.38)',borderWidth: '0 0 0 2px'}" @contextmenu.prevent="showNodeMenus(node, $event)">
                      <el-tooltip effect="dark" :content="node.data.description" placement="top-end">
                        <span>{{ node.data.description }}</span>
                      </el-tooltip>
                    </div>
                  </div>
                </el-badge>
              </div>
<!--              <el-popover-->
<!--                  v-show="hasDevice(node.data.craft, node.data.haschild)"-->
<!--                  placement="bottom"-->
<!--                  title="设备"-->
<!--                  width="400"-->
<!--                  trigger="click">-->
<!--                <div>-->
<!--                  {{this.deviceList}}-->
<!--                </div>-->
<!--                <el-button @click="deviceShow(node.id)" icon="el-icon-search" slot="reference" circle/>-->
<!--              </el-popover>-->
            </div>
          </SeeksRelationGraph>
        </div>
      </el-col>
    </el-row>

    <div v-show="isShowNodeMenuPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: fixed; border-radius: 6px; min-width: 120px">
      <div class="c-node-menu-item" @click.stop="doAction('新增')">添加</div>
      <div class="c-node-menu-item" @click.stop="doAction('详情')">详情</div>
      <div class="c-node-menu-item" @click.stop="doAction('删除')">删除</div>
      <div class="c-node-menu-item" @click.stop="doAction('编辑')">编辑</div>
      <div class="c-node-menu-item" @click.stop="doAction('变更节点')">变更节点</div>
      <div class="c-node-menu-item" @click.stop="doAction('挂载设备')">挂载设备</div>
    </div>
    <el-dialog :title="deviceTitle" :visible.sync="isShowDevice" width="600">
      <div style="margin-bottom: 10px; text-align: left">
        <span>
          <el-checkbox v-model="isAllDevicesChecked" size="small" border style=" margin-left: 5px;">全选</el-checkbox>
        </span>
        <span>
          <el-input placeholder="搜索设备" v-model="searchDeviceContent" size="small" style="max-width: 250px; margin-left: 5px;">
            <el-button slot="append" icon="el-icon-search" @click="handleDeviceSearch"></el-button>
          </el-input>
        </span>
        <span v-show="isMountDevice" style="float: right">
          <el-button style=" margin-right: 5px" size="small" type="primary" :disabled="!this.checkedDevices.length > 0" @click="handleMountDevice">挂载</el-button>
        </span>
        <span v-show="!isMountDevice" style="float: right">
          <el-button style=" margin-right: 5px" size="small" type="danger">删除</el-button>
        </span>
        <span v-show="!isMountDevice" style="float: right">
          <el-button style=" margin-right: 5px" size="small" type="primary" @click="isMovingDevice = true; isShowDevice = false;" :disabled="!this.checkedDevices.length > 0">变更</el-button>
        </span>

      </div>
      <el-scrollbar style="height: 450px; text-align: left;">
        <el-row :gutter="10" style="overflow-x:hidden;margin-left: 0;margin-right: 0">
          <el-col :span="8">
            <el-card v-for="device in deviceCol1" :key="device.locationid" style="margin-bottom: 18px; border: none" shadow="hover" :body-style="{ padding: '0px', borderRadius: '5px' ,border: checkedDevices.indexOf(device.locationid) !== -1?'1px solid rgba(51, 88, 227, 0.8)':'1px solid #EBEEF5'}" @click.native="clickDevice(device.locationid, $event)">
              <div class="device-card-header" :class="{'device-card-header-checked':checkedDevices.indexOf(device.locationid) !== -1}">
                <img src="../assets/device.png" style="height: 16px">
                <el-tooltip effect="dark" :content="device.devicename" placement="top-start">
                  <span> {{device.devicename}}</span>
                </el-tooltip>
              </div>
              <div class="device-card-content">
                <div class="device-card-item">
                  <i class="el-icon-s-tools"></i> 设备编码：<span style="color: #444444; font-style: italic">{{device.devicecode}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-money"></i> 设备类型：<span style="color: #444444; font-style: italic">{{device.dtypename}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-coin"></i> 设备型号：<span style="color: #444444; font-style: italic">{{device.dmodelname}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-guide"></i> 位置编码：<span style="color: #444444; font-style: italic">{{device.locationid}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-bangzhu"></i> 设备主题：<span style="color: #444444; font-style: italic">{{device.topicid}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card v-for="device in deviceCol2" :key="device.locationid" style="margin-bottom: 18px; border: none" shadow="hover" :body-style="{ padding: '0px', borderRadius: '5px' ,border: checkedDevices.indexOf(device.locationid) !== -1?'1px solid rgba(51, 88, 227, 0.8)':'1px solid #EBEEF5'}" @click.native="clickDevice(device.locationid, $event)">
              <div class="device-card-header" :class="{'device-card-header-checked':checkedDevices.indexOf(device.locationid) !== -1}">
                <img src="../assets/device.png" style="height: 16px">
                <el-tooltip effect="dark" :content="device.devicename" placement="top-start">
                  <span> {{device.devicename}}</span>
                </el-tooltip>
              </div>
              <div class="device-card-content">
                <div class="device-card-item">
                  <i class="el-icon-s-tools"></i> 设备编码：<span style="color: #444444; font-style: italic">{{device.devicecode}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-money"></i> 设备类型：<span style="color: #444444; font-style: italic">{{device.dtypename}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-coin"></i> 设备型号：<span style="color: #444444; font-style: italic">{{device.dmodelname}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-guide"></i> 位置编码：<span style="color: #444444; font-style: italic">{{device.locationid}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-bangzhu"></i> 设备主题：<span style="color: #444444; font-style: italic">{{device.topicid}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card v-for="device in deviceCol3" :key="device.locationid" style="margin-bottom: 18px; border: none" shadow="hover" :body-style="{ padding: '0px', borderRadius: '5px' ,border: checkedDevices.indexOf(device.locationid) !== -1?'1px solid rgba(51, 88, 227, 0.8)':'1px solid #EBEEF5'}" @click.native="clickDevice(device.locationid, $event)">
              <div class="device-card-header" :class="{'device-card-header-checked':checkedDevices.indexOf(device.locationid) !== -1}">
                <img src="../assets/device.png" style="height: 16px">
                <el-tooltip effect="dark" :content="device.devicename" placement="top-start">
                  <span> {{device.devicename}}</span>
                </el-tooltip>
              </div>
              <div class="device-card-content">
                <div class="device-card-item">
                  <i class="el-icon-s-tools"></i> 设备编码：<span style="color: #444444; font-style: italic">{{device.devicecode}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-money"></i> 设备类型：<span style="color: #444444; font-style: italic">{{device.dtypename}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-coin"></i> 设备型号：<span style="color: #444444; font-style: italic">{{device.dmodelname}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-guide"></i> 位置编码：<span style="color: #444444; font-style: italic">{{device.locationid}}</span>
                </div>
                <div class="device-card-item">
                  <i class="el-icon-bangzhu"></i> 设备主题：<span style="color: #444444; font-style: italic">{{device.topicid}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-scrollbar>
      <el-pagination
          style="margin-top: 10px;text-align: center"
          background
          layout="total, prev, pager, next, sizes"
          :current-page.sync="deviceCurrentPage"
          :pager-count="5"
          :page-sizes="[12, 24, 48, 96]"
          :page-size.sync="devicePageSize"
          :page-count="deviceTotalPages"
          :total="deviceTotalCount">
      </el-pagination>
<!--      <el-button icon="el-icon-circle-plus" type="primary">变更节点</el-button>-->
    </el-dialog>
    <el-dialog :title=this.dialogTitle :visible.sync="dialogFormVisible">
      <el-form :model="new_node">
        <el-form-item label="节点名称" :label-width="formLabelWidth" v-show="formShow('节点名称')" >
          <el-input v-model="new_node.data.description" autocomplete="off" placeholder="节点名称" size="small" required></el-input>
        </el-form-item>
        <el-form-item label="节点编码" :label-width="formLabelWidth" v-show="formShow('节点编码')">
          <el-input v-model="new_node.data.devicecode" autocomplete="off" placeholder="节点编码" size="small"></el-input>
        </el-form-item>
        <el-form-item label="节点类型" :label-width="formLabelWidth" v-show="formShow('节点类型')">
          <el-select v-model="new_node.data.craft" placeholder="节点类型" size="small" required :disabled="dialogTitle === '编辑'">
            <el-option
                v-for="item in nodeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实时监控" :label-width="formLabelWidth" v-show="formShow('实时监控')">
          <el-radio-group v-model="new_node.data.monflag">
            <el-radio label="是" size="small" border></el-radio>
            <el-radio label="否" size="small" border></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="监控地址" :label-width="formLabelWidth" v-show="formShow('监控地址')">
          <el-input v-model="new_node.data.url" autocomplete="off" placeholder="监控地址" size="small"></el-input>
        </el-form-item>
        <el-form-item label="节点协议" :label-width="formLabelWidth" v-show="formShow('节点协议')">
          <el-radio-group v-model="new_node.data.agrflag">
            <el-radio label="是" size="small" border></el-radio>
            <el-radio label="否" size="small" border></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择协议" :label-width="formLabelWidth" v-show="formShow('选择协议')">
          <el-input v-model="new_node.data.agreementname" autocomplete="off" placeholder="请选择协议" size="small" :readonly=true>
            <el-popover
              placement="left-start"
              width="400"
              trigger="click"
              slot="append"
              v-model="agrVisible">
              <el-table :data="agreementData" stripe size="small">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="agreementname" width="180" property="date" label="名称"></el-table-column>
                <el-table-column prop="agreementtype" width="100" property="name" label="类型"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="agrSelect(scope.$index, scope.row)"
                        round>选择</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                  style="margin-top: 10px;text-align: center"
                  background
                  layout="total, prev, pager, next"
                  :current-page.sync="agrCurrentPage"
                  :pager-count="5"
                  :page-count="agrTotalPages"
                  :total="agrTotalCount"
                  small>
              </el-pagination>
              <el-button slot="reference" size="small" style="background: #409EFF; border-radius: 0 3px 3px 0" round>选择</el-button>
            </el-popover>
          </el-input>
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth" v-show="formShow('设备类型')">
          <el-select v-model="new_node.data.dtypename" placeholder="设备类型" size="small" @input="reloadDeviceModelOptions">
            <el-option
                v-for="item in deviceTypeOptions"
                :key="item.dtypeid"
                :label="item.dtypename"
                :value="item.dtypename">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" :label-width="formLabelWidth" v-show="formShow('设备型号')">
          <el-select v-model="new_node.data.dmodelname" placeholder="设备型号" size="small">
            <el-option
                v-for="item in deviceModelOptions"
                :key="item.dmodelid"
                :label="item.dmodelname"
                :value="item.dmodelname">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
        title="详情"
        :visible.sync="detailsDrawer"
        :with-header="false"
        style="">
      <div style="font-size: 30px; font-family: 幼圆, sans-serif; font-weight: bold; border-bottom: 1px solid lightgrey; padding-bottom: 20px">
        {{currentNode.data.description}}
      </div>

      <div class="drawer-item">
        <i class="el-icon-money"></i> 节点类型：<span style="color: #444444; font-style: italic">{{currentNode.data.craft}}</span>
      </div>
      <div class="drawer-item">
        <i class="el-icon-guide"></i> 位置编码：<span style="color: #444444; font-style: italic">{{currentNode.id}}</span>
      </div>
      <div class="drawer-item">
        <i class="el-icon-s-tools"></i> 设备编码：<span style="color: #444444; font-style: italic">{{currentNode.data.devicecode}}</span>
      </div>
      <div class="drawer-item">
        <i class="el-icon-bangzhu"></i> 主题描述：<span style="color: #444444; font-style: italic">{{currentNode.data.topicdesc}}</span>
      </div>
      <div class="drawer-item">
        <i class="el-icon-bangzhu"></i> 节点主题：<span style="color: #444444; font-style: italic">{{currentNode.data.topicid}}</span>
      </div>
      <div class="drawer-item">
        <i class="el-icon-camera"></i> 节点监控：<span style="color: #444444; font-style: italic">{{currentNode.data.monflag}}</span>
      </div>
    </el-drawer>
<!--    <el-button @click="test"/>-->
<!--    {{dialogTitle === '编辑'}}-->
  </div>
</template>

<script>
import SeeksRelationGraph from 'relation-graph'
const baseURL = [
  'http://192.168.1.143:8890','http://192.168.1.143:38890','http://192.168.1.143:38892'
]
export default {
  name: 'visual-show2',
  components: {SeeksRelationGraph},
  data() {
    return {
      menuSpan: 4,
      menuIsExpand: false,
      searchNodeContent: '',
      searchNodeCraft: '产线',
      searchDeviceContent: '',
      detailsDrawer:false,
      iconURLs: [],
      testData: {},
      treeData: {},
      selectModel: {},
      isMountDevice: false, // 区分展示设备还是挂载设备
      deviceList:[],
      deviceCol1: [],
      deviceCol2: [],
      deviceCol3: [],
      isAllDevicesChecked: false,
      cancelButtonDisabled: true,
      nodeTypeOptions: [
      {
        label: "产线",
        value: "产线"
      },{
        label: "车间",
        value: "车间"
      },{
        label: "工段",
        value: "工段"
      },{
        label: "工序",
        value: "工序"
      },{
        label: "设备",
        value: "设备"
      },{
        label: "部件",
        value: "部件"
      }
      ],
      agrVisible: false,
      agreementData: [],
      agrCurrentPage: 1,
      agrTotalPages: 1,
      agrTotalCount: 0,
      deviceCurrentPage: 1,
      deviceTotalPages: 1,
      deviceTotalCount: 0,
      devicePageSize: 24,
      checkedDevices: [],
      g_loading: true,
      isMoving: false,
      isMovingDevice: false,
      isShowDevice: false,
      isShowCodePanel: false,
      demoname: '---',
      isShowNodeMenuPanel: false,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      nodeMenuPanelPosition: { x: 0, y: 0 },
      dragConf: {
        isDown: false,
        isMove: false,
        offsetTop: 0,
        offsetLeft: 0,
        clientX: 0,
        clientY: 0,
        id: '',
        ele: null,
        info: null,
      },
      dialogTitle: '',
      deviceTitle: '',
      new_node: {
        children: [],
        data: {
          craft: '',
          description: '',
          deep: 1,
          devicecode: '',
          monflag: "否",
          agrflag: "否",
          url: '',
          agreementid: '',
          agreementname: '',
          dtypeid: '',
          dtypename: '',
          dmodelid: '',
          dmodelname: '',
          special_id: ''
        },
        id: ''
      },
      deviceModelOptions: [],
      deviceTypeOptions: [],
      currentNode: {
        id: "未加载",
        data: {
          "agrflag": "否",
          "craft": "未加载",
          "current": 0,
          "description": "未加载",
          "devicecode": "未加载",
          "devicelogo": "0",
          "haschild": "",
          "id": 0,
          "locationid": "未加载",
          "matchedflag": "否",
          "modelLogo": "未加载",
          "monflag": "未加载",
          "orderby": false,
          "parent": "",
          "parentCode": null,
          "parentlocationid": "",
          "parenttopicdesc": "",
          "selectVal": "",
          "size": 0,
          "systemid": "",
          "topicdesc": "未加载",
          "topicid": "未加载",
          "treeId": "未加载",
          "url": ""
        }

      },
      graphOptions: {
        debug: true,
        disableDragNode: false,
        // 'backgrounImage': 'http://ai-mark.cn/images/ai-mark-desc.png',
        'backgrounImageNoRepeat': true,
        'layouts': [{
          'label': '横向',
          'layoutName': 'tree',
          'layoutClassName': 'seeks-layout-center',
          'defaultJunctionPoint': 'lr',
          useLayoutStyleOptions: true,
          'from': 'left',
          // 通过这4个属性来调整 tree-层级距离&节点距离
          'min_per_width': '200',
          'max_per_width': '500',
          'min_per_height': '100',
          'max_per_height': '120',
          'levelDistance': '', // 如果此选项有值，则优先级高于上面那4个选项

          'defaultNodeShape': 1,
          'defaultNodeWidth': '154',
          'defaultLineShape': 4,
          "defaultLineWidth": 3,
          'defaultNodeBorderWidth': 0,
          "defaultExpandHolderPosition": "right",
          'defaultLineColor': 'rgba(51, 88, 227, 0.4)',
          'defaultNodeColor': 'rgba(0, 186, 189, 0)',
          "defaultNodeFontColor": "#393e46",
          "defaultNodeBorderColor": "rgba(51, 88, 227, 1)",
          "defaultLineMarker": {
            "markerWidth": "0",
            "markerHeight": "0",
            "refX": 0,
            "refY": 0,
            "data": "M2,2 L10,6 L2,10 L6,6 L2,2"
          },
        },
          {
            'label': '中心',
            'layoutName': 'center',
            'layoutClassName': 'seeks-layout-center',
            'defaultJunctionPoint': 'border',
            useLayoutStyleOptions: true,
            'defaultNodeShape': 1,
            'defaultNodeWidth': '154',
            'defaultLineShape': 2,
            "defaultLineWidth": 3,
            'defaultNodeBorderWidth': 0,
            'defaultLineColor': 'rgba(51, 88, 227, 0.4)',
            'defaultNodeColor': 'rgba(0, 186, 189, 0)',
            "defaultNodeFontColor": "#393e46",
            "defaultNodeBorderColor": "rgba(51, 88, 227, 1)",
            "defaultExpandHolderPosition": "left",
            "defaultLineMarker": {
              "markerWidth": "0",
              "markerHeight": "0",
              "refX": 0,
              "refY": 0,
              "data": "M2,2 L10,6 L2,10 L6,6 L2,2"
            },
          },
          {
            'label': '竖向',
            'layoutName': 'tree',
            'layoutClassName': 'seeks-layout-center',
            'defaultJunctionPoint': 'tb',
            useLayoutStyleOptions: true,
            'from': 'top',
            // 通过这4个属性来调整 tree-层级距离&节点距离
            'min_per_width': '180',
            // 'max_per_width': '150',
            'min_per_height': '150',
            // 'max_per_height': '200',
            'levelDistance': '', // 如果此选项有值，则优先级高于上面那4个选项

            'defaultNodeShape': 1,
            'defaultNodeWidth': '154',
            'defaultLineShape': 4,
            "defaultLineWidth": 3,
            'defaultNodeBorderWidth': 0,
            "defaultExpandHolderPosition": "bottom",
            'defaultLineColor': 'rgba(51, 88, 227, 0.4)',
            'defaultNodeColor': 'rgba(0, 186, 189, 0)',
            "defaultNodeFontColor": "#393e46",
            "defaultNodeBorderColor": "rgba(51, 88, 227, 1)",
            "defaultLineMarker": {
              "markerWidth": "0",
              "markerHeight": "0",
              "refX": 0,
              "refY": 0,
              "data": "M2,2 L10,6 L2,10 L6,6 L2,2"
            },
          },
        ],
        // "defaultExpandHolderPosition": "right",
        'defaultNodeShape': 1,
        'defaultNodeWidth': '154',
        'defaultLineShape': 4,
        "defaultLineWidth": 3,
        'defaultNodeBorderWidth': 0,
        'defaultLineColor': 'rgba(51, 88, 227, 0.4)',
        'defaultNodeColor': 'rgba(0, 186, 189, 0)',
        "defaultNodeFontColor": "#393e46",
        "defaultNodeBorderColor": "rgba(51, 88, 227, 1)",
        allowShowMiniToolBar: true,
        allowSwitchLineShape: true,
        allowShowMiniNameFilter: true,
        allowShowMiniView: false
      },
      treeMenuData: [{
        label: '正安西南水泥有限公司',
        modelLogo: 'XN',
      },],
    }
  },
  created() {

  },
  mounted() {
    this.demoname = this.$route.params.demoname
    this.checkedDevices.length = 0
    //获取当前节点可添加的节点类型
      this.$axios
        .post(baseURL[1]+'/equ/cldeviceframe/v1/queryCldeviceframe',{
          frname:""
        })
        .then(successResponse => {
          // console.log('/equ/cldeviceframe/v1/queryCldeviceframe');
          // console.log(successResponse.data);
          let data = successResponse.data.data
          for(let i=0; i<data.length; i++) {
            this.iconURLs.push({
              craft: data[i].frname,
              img: data[i].img
            })
          }
          // console.log("iconURLs")
          // console.log(this.iconURLs)
        })
        .catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
    // 获取工厂模型列表
    this.$axios
      .post(baseURL[1]+'/equ/basisModel/v1/queryList',{
        size:9999,current:1
      })
      .then(successResponse => {
        console.log('/equ/basisModel/v1/queryList');
        console.log(successResponse.data.data.records);
        this.treeMenuData.length = 0
        for(let i=0; i<successResponse.data.data.records.length; i++) {
          this.treeMenuData.push({
            label: successResponse.data.data.records[i].modelName,
            modelLogo: successResponse.data.data.records[i].modelLogo
          })
        }

        //加载首个模型
        this.handleModelClick(this.treeMenuData[0])


      })
      .catch(failResponse => {
        this.showMessage('网络错误！',failResponse,'error');
      })

    // this.setGraphData()
    // 拖拽代码
    // document.addEventListener("mousemove", this.docMousemove);
    // document.addEventListener("mouseup", this.docMouseup);
    // this.$once("hook:beforeDestroy", () => {
    //   document.removeEventListener("mousemove", this.docMousemove);
    //   document.removeEventListener("mouseup", this.docMouseup);
    // });
    // 前面div再加
    // @mousedown="(evt) => nodeItemMouseDown(evt, node)"

  },
  methods: {
    // test() {
    //   console.log(this.$refs.seeksRelationGraph)
    //   let rect = document.getElementById("r-pad").getBoundingClientRect();
    //   //中心位置
    //   let center = {
    //     x: rect.left + (rect.right - rect.left) / 2,
    //     y: rect.top + (rect.bottom - rect.top) / 2
    //   }
    //   this.$refs.seeksRelationGraph.zoom(-5 * 10 * 1, center)
    // },
    handleMenuExpand() {
      this.menuIsExpand = !this.menuIsExpand
      this.menuSpan = this.menuIsExpand?1:4

    },
    resetGraph() {
      this.isShowNodeMenuPanel = false;
      const nodes = this.$refs.seeksRelationGraph.getNodes()
      for(let i=0; i<nodes.length; i++) {
        nodes[i].el.style.opacity = 1
      }
      this.isMoving = false
      this.isMovingDevice = false
      if(this.cancelButtonDisabled === false) {
        this.cancelButtonDisabled = true
        this.$message('已取消操作');
      }
    },
    clickDevice(id, event) {
      // console.log("event.currentTarget")
      // console.log(event.currentTarget)
      let hasCheckedIndex = this.checkedDevices.indexOf(id)
      if(hasCheckedIndex !== -1) { // 已选中
        console.log("已选中")
        this.checkedDevices.splice(hasCheckedIndex, 1)
        // event.currentTarget.children[0].children[0].style.background = '#FFF'
        // event.currentTarget.children[0].children[0].style.color = '#303133'
        // event.currentTarget.style.border = '1px solid #EBEEF5'
        // event.currentTarget.style.transition = '.2s'
      } else { // 未选中
        console.log("未选中")
        this.checkedDevices.push(id)
        // event.currentTarget.children[0].children[0].style.background = '#3fb9b9'
        // event.currentTarget.children[0].children[0].style.color = 'white'
        // event.currentTarget.style.border = '1px solid #3fb9b9'
        // event.currentTarget.style.transition = '.2s'
      }
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleModelExpand(data) {
      console.log(data);
      // console.log(data.modelLogo)
    },
    handleModelClick(data) {
      this.selectModel = data
      this.$axios.get(baseURL[1]+'/equ/cllocations/v1/queryClocationsNodevice',{params:{modelLogo:this.selectModel.modelLogo}}).then((response) => {
        console.log(this.selectModel.modelLogo+" response.data!!!")
        console.log(response.data)
        this.testData = response.data.data[0]
        this.setGraphData()

      });
      console.log("this.testData")
      console.log(this.testData)
    },
    setGraphData() {
      // console.log("2this.testData!!!!"+JSON.stringify(this.testData))
      // 使用要点：通过节点属性expandHolderPosition: 'right' 和 expanded: false 可以让节点在没有子节点的情况下展示一个"展开"按钮
      //         通过onNodeExpand事件监听节点，在被展开的时候有选择的去从后台获取数据，如果已经从后台加载过数据，则让当前图谱根据当前的节点重新布局
      let treeData = this.testData
      this.wrapTreeData(treeData, 1)
      this.treeData = treeData
      // console.log(nodes)
      // console.log("123123!!!"+JSON.stringify(treeData))
      let __graph_json_data = {
        'rootId': this.testData.locationid, // 还没改
        'nodes': [
          treeData
        ],
        'links': [
          // 你仍然可以通过常规方式添加关系
        ]
      }

      // console.log(JSON.stringify(__graph_json_data))
      this.g_loading = false
      this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
        // this.currentNode = this.$refs.seeksRelationGraph.getNodeById(treeData.id)
        console.log("this.$refs.seeksRelationGraph.getNodeById(treeData.id)")
        console.log(this.$refs.seeksRelationGraph.getNodeById(treeData.id))

      })

      this.setExpandByDeep()

      this.$refs.seeksRelationGraph.refresh()

      let rect = document.getElementById("r-pad").getBoundingClientRect();
      //中心位置
      let center = {
        x: rect.left + (rect.right - rect.left) / 2,
        y: rect.top + (rect.bottom - rect.top) / 2
      }

      let timeoutID = setInterval(function () {
        zoomTest()
      },"100");

      setTimeout(function () {
        clearInterval(timeoutID)
      },"400");


      // this.$refs.seeksRelationGraph.focusRootNode()

      let that = this

      function zoomTest() {

        // console.log("this")
        // console.log(this)

        that.$refs.seeksRelationGraph.zoom(-5 * 2 * 1, center)
      }
      // zoomTest.bind(this)
    },


    // 折叠多余层
    setExpandByDeep() {
      const nodes = this.$refs.seeksRelationGraph.getNodes()
      for(let i=0; i<nodes.length; i++) {
        if(nodes[i].data.deep === 3) {
          this.$refs.seeksRelationGraph.getNodes()[i].expanded = false
          this.$refs.seeksRelationGraph.getNodes()[i].lot.childs.forEach(thisNode => {
            thisNode.isShow = false;
          });
        }
      }
    },
    showNodeMenus(nodeObject, $event) {
      this.currentNode = nodeObject
      console.log("currentNode")
      console.log(this.currentNode)
      let _base_position = this.$refs.myPage.getBoundingClientRect()
      console.log('showNodeMenus:', $event, _base_position)
      this.isShowNodeMenuPanel = true
      this.nodeMenuPanelPosition.x = $event.clientX
      this.nodeMenuPanelPosition.y = $event.clientY
    },
    clearCheckDevices () {
      this.checkedDevices.length = 0
    },
    hasDevice(devicelogo) {
      // console.log("craft " + craft+"\nhaschild " + haschild)
      return devicelogo === "1";
    },
    deviceHasChecked(id) {
      return this.checkedDevices.indexOf(id) !== -1
    },
    doAction(actionName) {
      // console.log("!!!!!!!!!!!!!")
      // console.log(this.currentNode)
      this.isShowNodeMenuPanel = false
      switch (actionName) {
        case "新增": {
          // console.log("this.currentNode")
          // console.log(this.currentNode)
          this.dialogTitle = this.currentNode.data.description+'/新增子节点'
          this.new_node = {
            children: [],
            data: {
              craft: '',
              description: '',
              deep: 1,
              devicecode: '',
              monflag: "否",
              agrflag: "否",
              url: '',
              agreementid: '',
              agreementname: '',
              dtypeid: '',
              dtypename: '',
              dmodelid: '',
              dmodelname: '',
              special_id: '',
              topicid: ''
            },
            id: ''
          }
          this.nodeTypeOptions = [
            {
              label: "产线",
              value: "产线"
            },{
              label: "车间",
              value: "车间"
            },{
              label: "工段",
              value: "工段"
            },{
              label: "工序",
              value: "工序"
            },{
              label: "设备",
              value: "设备"
            },{
              label: "部件",
              value: "部件"
            }
          ]
          for(let i=0; i<this.nodeTypeOptions.length; i++) {
            if(this.currentNode.data.craft === this.nodeTypeOptions[i].label) {
              this.nodeTypeOptions.splice(0,i+1)
            }
          }
          this.$axios
              .post(baseURL[2]+'/agr/clagreement/v1/queryClagreement',{
                current: "1",
                orderby: true,
                size: 10
              })
              .then(successResponse => {
                this.agrTotalPages = successResponse.data.data.pages
                this.agreementData = successResponse.data.data.records
                this.agrCurrentPage = successResponse.data.data.current
                this.agrTotalCount = successResponse.data.data.total
              })
              .catch(failResponse => {
                this.showMessage('网络错误！',failResponse,'error');
              })
          this.$axios
              .post(baseURL[1]+'/equ/cldevicetype/v1/queryCldevicetype',{
                size: 1000,
                parameter: ""
              })
              .then(successResponse => {
                let data = successResponse.data.data.records
                for(let i=0; i<data.length; i++) {
                  this.deviceTypeOptions.push({
                    dtypename: data[i].dname,
                    dtypeid: data[i].id
                  })
                }
                // console.log("data")
                // console.log(data)
                console.log("this.deviceTypeOptions")
                console.log(this.deviceTypeOptions)
                this.$axios
                    .post(baseURL[1]+'/equ/cldevicemodel/v1/queryCldevicemodel',{
                      size: 1000,
                      parameter: this.deviceTypeOptions[0].dtypeid
                    })
                    .then(successResponse => {
                      let data = successResponse.data.data.records
                      for(let i=0; i<data.length; i++) {
                        this.deviceModelOptions.push({
                          dmodelname: data[i].dname,
                          dmodelid: data[i].id
                        })
                      }
                    })
                    .catch(failResponse => {
                      this.showMessage('网络错误！',failResponse,'error');
                    })
              })
              .catch(failResponse => {
                this.showMessage('网络错误！',failResponse,'error');
              })

          this.dialogFormVisible = true
          break
        }
        case "编辑": {
          this.dialogTitle = '编辑'
          this.new_node = {
            children: this.currentNode.children,
            data: {
              craft: this.currentNode.data.craft,
              description: this.currentNode.data.description,
              deep: this.currentNode.data.deep,
              devicecode: this.currentNode.data.devicecode,
              monflag: this.currentNode.data.monflag,
              agrflag: this.currentNode.data.agrflag,
              url: this.currentNode.data.url,
              agreementid: this.currentNode.data.agreementid,
              agreementname: this.currentNode.data.agreementname,
              dtypeid: this.currentNode.data.dtypeid,
              dtypename: this.currentNode.data.dtypename,
              dmodelid: this.currentNode.data.dmodelid,
              dmodelname: this.currentNode.data.dmodelname,
              special_id: this.currentNode.data.special_id,
              topicid: this.currentNode.data.topicid
            },
            id: this.currentNode.id
          }

          this.dialogFormVisible = true
          break
        }
        case "删除": {
          // this.$refs.seeksRelationGraph.removeNodeById(this.currentNode.id)
          // console.log(this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).lot.childs)
          this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios
                .post(baseURL[1]+'/equ/cllocations/v1/delCllocations',{
                  ids:[this.currentNode.data.special_id],
                  locationid: this.currentNode.id,
                  craft: this.currentNode.data.craft
                })
                .then(successResponse => {
                  if(successResponse.data.code === "200"){
                    this.recurDelete(this.currentNode.id)
                    this.$message({
                      type: 'success',
                      message: successResponse.data.msg
                    })
                  }
                  else if(successResponse.data.code === "500") {
                    this.$message({
                      type: 'warning',
                      message: successResponse.data.msg
                    });
                  }
                })
                .catch(failResponse => {
                  this.showMessage('网络错误！',failResponse,'error');
                })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

          break
        }
        case "变更节点": {
          this.isMoving = true
          this.$message('点击右上角按钮可取消操作')
          this.showAddjudge()
          break
        }
        case "挂载设备": {
          this.isMountDevice = true
          this.$axios
              .post(baseURL[1]+'/equ/cllocations/v1/mountedDevices',{
                current: 1,
                modelLogo: this.selectModel.modelLogo,
                selectVal: "",
                size: this.devicePageSize
              })
              .then(successResponse => {
                this.deviceList = successResponse.data.data.records;
                this.splitDeviceList()

                // console.log('收到设备的页数1/');
                // console.log(successResponse.data.data.pages)
                // console.log("this.deviceTotalPages")
                // console.log(this.deviceTotalPages)
                this.deviceTotalPages = successResponse.data.data.pages
                // console.log("this.deviceTotalPages")
                // console.log(this.deviceTotalPages)
                // console.log('收到设备的页数2/');
                // console.log(successResponse.data.data.pages)

                this.deviceCurrentPage = successResponse.data.data.current
                this.deviceTotalCount = successResponse.data.data.total
                this.deviceTitle = this.selectModel.label + '/可挂载设备'
                this.isShowDevice = true
              }).catch(failResponse => {
            this.showMessage('网络错误！',failResponse,'error');
          })
          break
        }
        case "详情": {
          this.detailsDrawer = true
          break
        }

      }
    },
    submitDialog() {
      if(this.dialogTitle === '编辑') {
        // console.log("父节点！")
        // console.log(this.currentNode.lot.parent)
        this.$axios
            .post(baseURL[1]+'/equ/cllocations/v1/updateCllocations',{
              matchedflag: "否",
              id: this.new_node.data.special_id,
              description: this.new_node.data.description,
              devicename: this.new_node.data.description,
              devicecode: this.new_node.data.devicecode,
              craft: this.new_node.data.craft,
              monflag: this.new_node.data.monflag,
              url: this.new_node.data.url,
              agrflag: this.new_node.data.agrflag,
              agreementname: this.new_node.data.agreementname,
              locationid: this.new_node.id,
              parent: this.$refs.seeksRelationGraph.getNodeById(this.new_node.id).lot.parent.id,
              parentCode: this.$refs.seeksRelationGraph.getNodeById(this.new_node.id).lot.parent.id,
              updateby: "zl"
            })
            .then(successResponse => {
              if(successResponse.data.code === "200"){
                this.$message({
                  type: 'success',
                  message: successResponse.data.msg
                })
              }
              else if(successResponse.data.code === "500") {
                this.$message({
                  type: 'error',
                  message: successResponse.data.msg
                });
              }
            })
            .catch(failResponse => {
              this.showMessage('网络错误！',failResponse,'error');
            })
      } else {
        console.log("this.new_node.data.devicecode左")
        console.log(this.new_node.data.devicecode)
        console.log("this.new_node.data.devicecode右")
        this.$axios
            .post(baseURL[1]+'/equ/cllocations/v1/addCllocations',{
              description: this.new_node.data.description,
              parent: this.currentNode.id,
              craft: this.new_node.data.craft,
              devicecode: this.new_node.data.devicecode,
              dtypename: this.new_node.data.dtypename,
              dmodelname: this.new_node.data.dmodelname,
              modelLogo: this.selectModel.modelLogo,
              dmodelid: this.new_node.data.dmodelid,
              agrflag: this.new_node.data.agrflag,
              monflag: this.new_node.data.monflag,
              url: this.new_node.data.url,
              dtypeid: this.new_node.data.dtypeid,
              agreementid: this.new_node.data.agreementid
            })
            .then(successResponse => {
              let node = successResponse.data.data
              if(successResponse.data.code === "200") {
                console.log("返回200")
                if(!(this.new_node.data.craft === "设备" || this.new_node.data.craft === "部件")){
                  node.data = {
                    craft: node.craft,
                    description: node.description,
                    deep: this.currentNode.data.deep+1,
                    haschild: node.haschild,
                    topicdesc: node.topicdesc,
                    monflag: node.monflag,
                    agrflag: node.agrflag,
                    url: node.url,
                    agreementid: node.agreementid,
                    agreementname: node.agreementname,
                    dtypeid: node.dtypeid,
                    dtypename: node.dtypename,
                    dmodelid: node.dmodelid,
                    dmodelname: node.dmodelname,
                    devicelogo: node.devicelogo,
                    special_id: node.id.toString(),
                    devicecode: node.devicecode,
                    topicid: node.topicid
                  }

                  let id = node.locationid
                  delete node.locationid
                  delete node.id
                  node.id = id

                  if(node.childs) {
                    let children = node.childs
                    delete node.childs
                    node.children = children
                  }

                  let new_graph_json_data = {
                    rootId: 'root',
                    nodes: [
                      node
                    ],
                    links: [
                      { from: this.currentNode.id, to: node.id}
                    ]
                  }
                  this.$refs.seeksRelationGraph.appendJsonData(new_graph_json_data, (seeksRGGraph) => {
                    // 这些写上当图谱初始化完成后需要执行的代码
                    console.log("// 这些写上当图谱初始化完成后需要执行的代码")
                  })
                }

                this.showMessage('提示', successResponse.data.msg, 'success')
              } else if(successResponse.data.code === "500") {
                console.log("返回500")
                this.showMessage('提示', successResponse.data.msg, 'error')
              }
              this.new_node = {
                children: [],
                data: {
                  craft: '',
                  description: '',
                  deep: 1,
                  devicecode: '',
                  monflag: "否",
                  agrflag: "否",
                  url: '',
                  agreementid: '',
                  agreementname: '',
                  dtypeid: '',
                  dtypename: '',
                  dmodelid: '',
                  dmodelname: '',
                  special_id: '',
                  topicid: ''
                },
                id: ''
              }
            })
            .catch(failResponse => {
              this.showMessage('网络错误！',failResponse,'error');
            })
      }
      this.dialogFormVisible = false


    },
    recurDelete(id){
      console.log("删除id="+id)
      let children = this.$refs.seeksRelationGraph.getNodeById(id).lot.childs
      for(let i=0; i<children.length; i++) {
        this.recurDelete(children[i].id)
      }
      this.$refs.seeksRelationGraph.removeNodeById(id)
    },
    showMessage(title, message, type){
      this.$notify({
        title: title,
        message: message,
        type: type
      })
    },
    // 数组存储所有节点的{宽，高，中心坐标}，变量存储temp_node的信息，mouseup时循环判定是否和某一个node有重叠（多个重叠怎么处理），暂定首次判定为真时node落地
    // 如果判定为真，继续判断两节点是否是亲子代。是的话不能执行。
    // 自己和自己也不能执行
    nodeItemMouseDown(evt, info) {
      const { clientX, clientY, currentTarget } = evt;

      const { top, left } = evt.currentTarget.getBoundingClientRect();

      const conf = this.dragConf;
      // currentTarget.style.background = "green";
      const ele = currentTarget.cloneNode(true); //复制一份按下的DOM用来实时预览
      // offsetLeft: 点击坐标和被点击DOM左边的距离
      // offsetTop: 点击坐标和被点击DOM上边的距离
      // 自定属性不能通过.直接访问，需要getAttribute
      console.log("按下node_id="+ele.getAttribute('node_id'))
      Object.assign(this.dragConf, {
        offsetLeft: clientX - left,
        offsetTop: clientY - top,
        clientX: clientX,
        clientY: clientY,
        info,
        ele,
        id: ele.getAttribute('node_id'),
        isDown: true,
      });
      // console.log('clientY:'+clientY+' conf.offsetTop '+conf.offsetTop+'\nclientX:'+clientX+' conf.offsetLeft '+conf.offsetLeft);
      ele.style.position = "fixed";
      ele.style.margin = "0";
      ele.style.top = clientY - conf.offsetTop + "px";
      ele.style.left = clientX - conf.offsetLeft + "px";

      this.$el.appendChild(this.dragConf.ele);
    },

    docMousemove({ clientX, clientY }) {
      const conf = this.dragConf;

      if (conf.isMove) {
        conf.ele.style.top = clientY - conf.offsetTop + "px";
        conf.ele.style.left = clientX - conf.offsetLeft + "px";

        const nodes = this.$refs.seeksRelationGraph.getNodes()
        for(let i=0; i<nodes.length; i++) {
          // const left = nodes[i].el.style.left
          // const right = nodes[i].el.style.right
          // const top = nodes[i].el.style.top
          // const bottom = nodes[i].el.style.bottom

          const {
            top,
            right,
            bottom,
            left,
          } = nodes[i].el.getBoundingClientRect();

          console.log('进来了'+left)
          if (
              clientX > left &&
              clientX < right &&
              clientY > top &&
              clientY < bottom
          ) {
            console.log('进来了2')
              nodes[i].el.style.background = "red"
          }
        }

      } else if (conf.isDown) {
        // 鼠标移动量大于 5 时 移动状态生效
        conf.isMove =
            Math.abs(clientX - conf.clientX) > 5 ||
            Math.abs(clientY - conf.clientY) > 5;
      }
    },

    docMouseup({ clientX, clientY }) {

      const conf = this.dragConf;
      conf.isDown = false;

      let nodes = this.$refs.seeksRelationGraph.getNodes()
      if (!conf.isMove) return
      for(let i=0; i<nodes.length; i++) {

        // let left = nodes[i].el.style.offsetLeft
        // let right = nodes[i].el.style.offsetLeft+nodes[i].el.style.width
        // let top = nodes[i].el.style.offsetTop
        // let bottom = nodes[i].el.style.bottom+nodes[i].el.style.height

        const {
          top,
          right,
          bottom,
          left,
        } = nodes[i].el.getBoundingClientRect();

        // console.log("left: "+left)

        if (
            clientX > left &&
            clientX < right &&
            clientY > top &&
            clientY < bottom
        ) {
          console.log("移动元素成功！")
          this.recurDelete(this.dragConf.id)
          console.log("原来")
          console.log(this.$refs.seeksRelationGraph.getNodeById(this.dragConf.id))
          // 将原来的元素添加到新位置
          // console.log("this.treeData")
          // console.log(this.treeData)
          // console.log("this.dragConf.id")
          // console.log(this.dragConf.id)
          let subTree = this.findSubTree(this.treeData, this.dragConf.id)
          console.log("subtree:")
          console.log(subTree)
          this.recurAdd(subTree, nodes[i].id, this.$refs.seeksRelationGraph.getNodeById(nodes[i].id).data.deep+1)
          console.log("之后")
          console.log(this.$refs.seeksRelationGraph.getNodeById(this.dragConf.id))

        }
        conf.isMove = false;
      }

      // 不管怎么样都去除这个DOM
      if (conf.ele) {
        conf.ele.remove();
        conf.ele = null;
      }
    },

    handleNodeSearch() {
      this.$refs.seeksRelationGraph.focusNodeById(this.$refs.seeksRelationGraph.getNodes().find(node => node.data.description.includes(this.searchNodeContent) && node.data.craft === this.searchNodeCraft).id)
    },
    handleMountDevice() {
      this.$axios
          .post(baseURL[1]+'/equ/cllocations/v2/editLoctionnode',{
            locationid: this.checkedDevices,
            parentlocationid: this.currentNode.id,
            parenttopicdesc: this.currentNode.data.topicdesc
          })
          .then(successResponse => {
            if(successResponse.data.code === "200"){
              this.showMessage(successResponse.data.msg, this.checkedDevices[0]+" 等设备添加到 "+this.currentNode.data.description,'success')
            } else {
              this.showMessage('提示', successResponse.data.msg,'error')
            }
          }).catch(failResponse => {
        this.showMessage('网络错误！',failResponse,'error');
      })
    },
    handleDeviceSearch() {
      if(this.isMountDevice) {
        this.$axios
            .post(baseURL[1]+'/equ/cllocations/v1/mountedDevices',{
              current: 1,
              modelLogo: this.selectModel.modelLogo,
              selectVal: this.searchDeviceContent,
              size: this.devicePageSize
            })
            .then(successResponse => {
              this.deviceList = successResponse.data.data.records;
              this.splitDeviceList()
              this.deviceTotalPages = successResponse.data.data.pages
              this.deviceCurrentPage = successResponse.data.data.current
              this.deviceTotalCount = successResponse.data.data.total
            }).catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
      } else {
        this.$axios
            .post(baseURL[1]+'/equ/cldevice/v1/queryCldeviceByparent',{
              current: 1,
              parentLocationId: this.currentNode.id,
              size: this.devicePageSize,
              orderby: true,
              selectVal: this.searchDeviceContent
            })
            .then(successResponse => {
              this.deviceList = successResponse.data.data.records;
              this.splitDeviceList()
              this.deviceTotalPages = successResponse.data.data.pages
              this.deviceCurrentPage = successResponse.data.data.current
              this.deviceTotalCount = successResponse.data.data.total
            }).catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
      }

    },
    checkAllDevices() {
      this.checkedDevices.length = 0
      for( let i=0; i<this.deviceList.length; i++) {
        this.checkedDevices.push(this.deviceList[i].locationid)
      }
    },
    onNodeClick(nodeObject, $event) {
      // console.log('onNodeClick:', nodeObject)
      if(this.isMovingDevice) {
        for( let i = 0; i < this.checkedDevices.length; i++) {
          //axios请求
          this.$axios
              .post(baseURL[1]+'/equ/cllocations/v1/editLoctionnode',{
                locationid: this.checkedDevices[i],
                parentlocationid: nodeObject.id,
                parenttopicdesc: nodeObject.data.topicdesc
              })
              .then(successResponse => {
                //无需刷新树
                if(successResponse.data.code === "200"){
                  this.showMessage(successResponse.data.msg, this.checkedDevices[i]+" 设备添加到 "+nodeObject.data.description,'success')
                  this.resetGraph()
                  // this.$axios.get(baseURL[1]+'/equ/cllocations/v1/queryClocationsNodevice',{params:{modelLogo:this.selectModel.modelLogo}}).then((response) => {
                  //   this.testData = response.data.data[0]
                  //   this.setGraphData()
                  //   this.$refs.seeksRelationGraph.focusNodeById(this.currentNode.id)
                  // });
                } else {
                  this.showMessage('提示', successResponse.data.msg,'error')
                }

              })
              .catch(failResponse => {
                this.showMessage('网络错误！',failResponse,'error');
              })
        }
        this.checkedDevices.length = 0
      } else
      if(this.isMoving) {
        if(this.judgeAddByCraft(this.currentNode.data.craft, nodeObject.data.craft)) {
          //axios请求
          this.$axios
              .post(baseURL[1]+'/equ/cllocations/v1/editLoctionnode',{
                locationid: this.currentNode.id,
                parentlocationid: nodeObject.id,
                parenttopicdesc: nodeObject.data.topicdesc
              })
              .then(successResponse => {
                //刷新树
                if(successResponse.data.code === "200"){
                  this.showMessage(successResponse.data.msg, this.currentNode.data.description+" 节点添加到 "+nodeObject.data.description,'success')
                  this.resetGraph()
                  this.$axios.get(baseURL[1]+'/equ/cllocations/v1/queryClocationsNodevice',{params:{modelLogo:this.selectModel.modelLogo}}).then((response) => {
                    this.testData = response.data.data[0]
                    this.setGraphData()
                    this.$refs.seeksRelationGraph.focusNodeById(this.currentNode.id)
                  });
                } else {
                  this.showMessage('提示', successResponse.data.msg,'error')
                }

              })
              .catch(failResponse => {
                this.showMessage('网络错误！',failResponse,'error');
              })
        } else {
          this.showMessage('无法变更！', '请重新选择','warning')
          return
        }
      } else {
        // 设备列表
        this.isMountDevice = false
        this.currentNode = nodeObject
        if(!this.isShowDevice) {
          if(this.hasDevice(this.currentNode.data.devicelogo)) {
            this.$axios
                .post(baseURL[1]+'/equ/cldevice/v1/queryCldeviceByparent',{
                  current: 1,
                  parentLocationId: this.currentNode.id,
                  size: this.devicePageSize,
                  orderby: true,
                  selectVal: ''
                })
                .then(successResponse => {
                  this.deviceList = successResponse.data.data.records;
                  this.splitDeviceList()

                  console.log('收到设备的页数1/');
                  console.log(successResponse.data.data.pages)
                  console.log("this.deviceTotalPages")
                  console.log(this.deviceTotalPages)
                  this.deviceTotalPages = successResponse.data.data.pages
                  console.log("this.deviceTotalPages")
                  console.log(this.deviceTotalPages)
                  console.log('收到设备的页数2/');
                  console.log(successResponse.data.data.pages)

                  this.deviceCurrentPage = successResponse.data.data.current
                  this.deviceTotalCount = successResponse.data.data.total
                  this.deviceTitle = this.currentNode.data.topicdesc + '/设备'
                  this.isShowDevice = true
                }).catch(failResponse => {
              this.showMessage('网络错误！',failResponse,'error');
            })
          }
        } else {
          this.deviceTitle = '未选择'
          this.isShowDevice = false
        }
      }
    },
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    findSubTree(tree, id) {
      // console.log("findTree!!!!!\n")
      // console.log(tree)
        for(let i=0; i<tree.children.length; i++) {
          if(tree.children[i].id === id) return tree.children[i]
          else if(this.findSubTree(tree.children[i], id)) return this.findSubTree(tree.children[i], id)
        }
    },
    recurAdd(tree, id, deep) {
      console.log("处理中tree")
      console.log(tree)
      let children = tree.children
      tree.children.length = 0
      tree.data.deep = deep
      let new_graph_json_data = {
        rootId: 'root',
        nodes: [
          tree
        ],
        links: [
          { from: id,
            to: tree.id}
        ]
      }
      this.$refs.seeksRelationGraph.appendJsonData(new_graph_json_data, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
      })
      for(let i=0; i<children.length; i++) {
        this.recurAdd(children[i], tree.id, deep+1)
      }
    },

    // wrapTreeData(tree, deep) {
    //
    //   let children = tree.childs
    //   delete tree.childs
    //   tree.children = children
    //
    //   tree.data = {craft: tree.craft, description: tree.description, deep: deep, devicecode: tree.devicecode}
    //
    //   let id = tree.treeId
    //   let temp_id = tree.id.toString() // 很重要
    //   delete tree.treeId
    //   delete tree.id
    //   tree.id = id
    //   tree.data.temp_id = temp_id
    //
    //   for (let i = 0; i < tree.children.length; i++) {
    //     this.wrapTreeData(children[i], deep+1)
    //   }
    // },
    wrapTreeData(tree, deep) {

      console.log(deep)
      // console.log(tree.cllocationWorkSectionDTOList)
      tree.data = {
        craft: tree.craft,
        description: tree.description,
        deep: deep,
        haschild: tree.haschild,
        topicdesc: tree.topicdesc,
        monflag: tree.monflag,
        agrflag: tree.agrflag,
        url: tree.url,
        agreementid: tree.agreementid,
        agreementname: tree.agreementname,
        dtypeid: tree.dtypeid,
        dtypename: tree.dtypename,
        dmodelid: tree.dmodelid,
        dmodelname: tree.dmodelname,
        devicecode: tree.devicecode,
        devicelogo: tree.devicelogo,
        special_id: tree.id.toString(),
        topicid: tree.topicid
      }

      let id = tree.locationid
      delete tree.locationid
      delete tree.id
      tree.id = id

      if(!tree.childs) {
        tree.children = []
        return
      }

      let children = tree.childs
      delete tree.childs
      tree.children = children

      // tree.expanded = deep <= 3

      for (let i = 0; i < tree.children.length; i++) {
        this.wrapTreeData(children[i], deep+1)
      }
    },
    splitDeviceList() {
      // console.log("this.deviceList")
      // console.log(this.deviceList)
      this.deviceCol1.length = 0
      this.deviceCol2.length = 0
      this.deviceCol3.length = 0
      // // 不被3整除的设备
      // let leftDeviceList = this.deviceList.splice(this.deviceList.length - this.deviceList.length%3, this.deviceList.length%3)
      // this.deviceList.length -= this.deviceList.length%3
      console.log("this.deviceList.length")
      console.log(this.deviceList.length)
      for(let i=0; i<this.deviceList.length; i+=3) {
        this.deviceCol1.push(this.deviceList[i])
        if(i+1<this.deviceList.length)
        this.deviceCol2.push(this.deviceList[i+1])
        if(i+2<this.deviceList.length)
        this.deviceCol3.push(this.deviceList[i+2])
      }

      console.log("deviceCol1")
      console.log(this.deviceCol1)
      console.log("deviceCol2")
      console.log(this.deviceCol2)
      console.log("deviceCol3")
      console.log(this.deviceCol3)

    },
    formShow(label) {
      switch (label) {
        case "节点名称":
        case "节点编码":
        case "节点类型":
        case "实时监控": {
          return true
        }
        case "节点协议": {
          return this.new_node.data.craft === "设备" || this.new_node.data.craft === "部件";
        }
        case "设备类型":
        case "设备型号": {
          return this.new_node.data.craft === "设备" || this.new_node.data.craft === "部件";
        }
        case "监控地址": {
          return this.new_node.data.monflag === "是";
        }
        case "选择协议": {
          return this.new_node.data.agrflag === "是" && this.new_node.data.craft !== "产线" && this.new_node.data.craft !== "车间";
        }


      }
    },
    judgeAddByCraft(child, parent) {
      let list = ['工厂', "产线", "车间", "工段", "工序", "设备", "部件"]
      if (list.indexOf(child) > list.indexOf(parent)) {
        return true
      } else return false
    },
    showAddjudge() {
      const nodes = this.$refs.seeksRelationGraph.getNodes()
      for(let i=0; i<nodes.length; i++) {
        let permitAdd = this.judgeAddByCraft(this.currentNode.data.craft, nodes[i].data.craft)
        if(!permitAdd && this.currentNode.id !== nodes[i].id) nodes[i].el.style.opacity = 0.3
      }
    },
    showAddDevicejudge() {
      // const nodes = this.$refs.seeksRelationGraph.getNodes()
      // for(let i=0; i<nodes.length; i++) {
      //   let permitAdd = this.judgeAddByCraft(this.currentNode.data.craft, nodes[i].data.craft)
      //   if(!permitAdd && this.currentNode.id !== nodes[i].id) nodes[i].el.style.opacity = 0.3
      // }
    },
    agrSelect(index, row) {
      this.agrVisible = false
      this.new_node.data.agreementid = row.agreementid
      this.new_node.data.agreementname = row.agreementname
    },
    reloadDeviceModelOptions(dtypename) {
      console.log("触发重载")
      this.deviceModelOptions.length = 0
      this.new_node.data.dmodelname = ''
      this.$axios
          .post(baseURL[1]+'/equ/cldevicemodel/v1/queryCldevicemodel',{
            size: 1000,
            parameter: this.deviceTypeOptions.find(type => type.dtypename === dtypename).dtypeid
          })
          .then(successResponse => {
            let data = successResponse.data.data.records
            for(let i=0; i<data.length; i++) {
              this.deviceModelOptions.push({
                dmodelname: data[i].dname,
                dmodelid: data[i].id
              })
            }
          })
          .catch(failResponse => {
            this.showMessage('网络错误！',failResponse,'error');
          })
    },
  },
  watch: {
    isMoving(newVal, oldVal) {
      if(newVal === true) {
        this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.style.border = "3px solid rgba(51, 88, 227, 0.8)"
        this.cancelButtonDisabled = false
        // this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.children[1].children[0].style.boxShadow = 'rgba(46, 240, 217, 0.4) -5px 5px, rgba(46, 240, 217, 0.3) -10px 10px, rgba(46, 240, 217, 0.2) -15px 15px, rgba(46, 240, 217, 0.1) -20px 20px, rgba(46, 240, 217, 0.05) -25px 25px'
      } else {
        this.cancelButtonDisabled = true
        this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.style.border = "none"
        // this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.children[1].children[0].style.boxShadow = ''

      }
    },
    isAllDevicesChecked(newVal, oldVal) {
      if(newVal === true) {
        this.checkAllDevices()
      } else {
        this.checkedDevices.length = 0
      }
    },
    isMovingDevice(newVal, oldVal) {
      if(newVal === true) {
        this.$message('点击右上角按钮可取消操作')
        // this.$message({
        //   showClose: true,
        //   message: '请选择节点',
        //   duration: 0
        // });
        // this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.style.border = "3px solid rgb(50, 253, 236)"
        this.cancelButtonDisabled = false
        // this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.children[1].children[0].style.boxShadow = 'rgba(46, 240, 217, 0.4) -5px 5px, rgba(46, 240, 217, 0.3) -10px 10px, rgba(46, 240, 217, 0.2) -15px 15px, rgba(46, 240, 217, 0.1) -20px 20px, rgba(46, 240, 217, 0.05) -25px 25px'
      } else {
        this.cancelButtonDisabled = true
        // this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.style.border = "none"
        // this.$refs.seeksRelationGraph.getNodeById(this.currentNode.id).el.children[1].children[0].style.boxShadow = ''

      }
    },
    isShowDevice(newVal, oldVal) {
      if(newVal === false) {
        if(!this.isMovingDevice) this.checkedDevices.length = 0
        this.searchDeviceContent = ''
        this.isAllDevicesChecked = false
        this.devicePageSize = 24
        this.deviceCurrentPage = 1
      }
    },
    agrCurrentPage(newVal, oldVal) {
      console.log("current")
      console.log(newVal)
      this.$axios
          .post(baseURL[2]+'/agr/clagreement/v1/queryClagreement',{
            current: newVal+"",
            orderby: true,
            size: 10
          })
          .then(successResponse => {
            this.agrTotalPages = successResponse.data.data.pages
            this.agreementData = successResponse.data.data.records
            this.agrCurrentPage = successResponse.data.data.current
            this.agrTotalCount = successResponse.data.data.total
          })
          .catch(failResponse => {
            this.showMessage('网络错误！',failResponse,'error');
          })
    },
    devicePageSize(newVal, oldVal) {
      if(this.isMountDevice) {
        this.$axios
            .post(baseURL[1]+'/equ/cllocations/v1/mountedDevices',{
              current: this.deviceCurrentPage,
              modelLogo: this.selectModel.modelLogo,
              selectVal: this.searchDeviceContent,
              size: newVal
            })
            .then(successResponse => {
              this.deviceList = successResponse.data.data.records;
              this.splitDeviceList()

              // console.log('收到设备的页数1/');
              // console.log(successResponse.data.data.pages)
              // console.log("this.deviceTotalPages")
              // console.log(this.deviceTotalPages)
              this.deviceTotalPages = successResponse.data.data.pages
              // console.log("this.deviceTotalPages")
              // console.log(this.deviceTotalPages)
              // console.log('收到设备的页数2/');
              // console.log(successResponse.data.data.pages)

              this.deviceCurrentPage = successResponse.data.data.current
              this.deviceTotalCount = successResponse.data.data.total
            }).catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
      } else {
        this.$axios
            .post(baseURL[1]+'/equ/cldevice/v1/queryCldeviceByparent',{
              current: this.deviceCurrentPage,
              parentLocationId: this.currentNode.id,
              orderby: true,
              size: newVal,
              selectVal: this.searchDeviceContent
            })
            .then(successResponse => {
              // console.log('收到设备');
              // console.log(successResponse.data.data.records)
              this.deviceList = successResponse.data.data.records;
              this.splitDeviceList()
              this.deviceTotalPages = successResponse.data.data.pages
              this.deviceCurrentPage = successResponse.data.data.current
              this.deviceTotalCount = successResponse.data.data.total

            }).catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
      }
    },
    deviceCurrentPage(newVal, oldVal) {
      if(this.isMountDevice) {
        this.$axios
            .post(baseURL[1]+'/equ/cllocations/v1/mountedDevices',{
              current: newVal+"",
              modelLogo: this.selectModel.modelLogo,
              selectVal: this.searchDeviceContent,
              size:this.devicePageSize
            })
            .then(successResponse => {
              this.deviceList = successResponse.data.data.records;
              this.splitDeviceList()

              // console.log('收到设备的页数1/');
              // console.log(successResponse.data.data.pages)
              // console.log("this.deviceTotalPages")
              // console.log(this.deviceTotalPages)
              this.deviceTotalPages = successResponse.data.data.pages
              // console.log("this.deviceTotalPages")
              // console.log(this.deviceTotalPages)
              // console.log('收到设备的页数2/');
              // console.log(successResponse.data.data.pages)

              this.deviceCurrentPage = successResponse.data.data.current
              this.deviceTotalCount = successResponse.data.data.total
            }).catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
      } else {
        this.$axios
            .post(baseURL[1]+'/equ/cldevice/v1/queryCldeviceByparent',{
              current: newVal+"",
              parentLocationId: this.currentNode.id,
              orderby: true,
              size:this.devicePageSize,
              selectVal: this.searchDeviceContent
            })
            .then(successResponse => {
              // console.log('收到设备');
              // console.log(successResponse.data.data.records)
              this.deviceList = successResponse.data.data.records;
              this.splitDeviceList()
              this.deviceTotalPages = successResponse.data.data.pages
              this.deviceCurrentPage = successResponse.data.data.current
              this.deviceTotalCount = successResponse.data.data.total

            }).catch(failResponse => {
          this.showMessage('网络错误！',failResponse,'error');
        })
      }

    },
  },
  computed: {
    nodeBackGround(){
      return function (deep) {
        // switch (deep) {
        //   case 1:
        //     return "rgba(51, 88, 227, 1)"
        //   case 2:
        //     return "rgba(51, 88, 227, 0.8)"
        //   case 3:
        //     return "rgba(51, 88, 227, 0.6)"
        //   case 4:
        //     return "rgba(51, 88, 227, 0.4)"
        //   case 5:
        //     return "rgba(51, 88, 227, 0.3)"
        //   case 6:
        //     return "rgba(51, 88, 227, 0.2)"
        //   default:
        //     return "rgba(51, 88, 227, 0.1)"
        //
        // }
        switch (deep) {
          case 1:
            return "rgba(51, 88, 227, 1)"
          case 2:
            return "rgba(51, 88, 227, 1)"
          case 3:
            return "rgba(51, 88, 227, 1)"
          case 4:
            return "rgba(51, 88, 227, 1)"
          case 5:
            return "rgba(51, 88, 227, 1)"
          case 6:
            return "rgba(51, 88, 227, 1)"
          default:
            return "rgba(51, 88, 227, 1)"

        }
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* 节点动画效果 */
/*.rel-node-peel {*/
/*  transition: .2s;*/
/*}*/
.rel-node-shape-1 {
  padding: 0 0 !important;
}
.c-collapsed {
  background-color: rgba(51, 88, 227, 0.4) !important;
}
.c-expanded {
  background-color: rgba(51, 88, 227, 0.4) !important;
}
.node-shadow {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.c-node-menu-item{
  line-height: 30px;padding-left: 10px;cursor: pointer;color: #605f5f;font-size: 14px;font-family: 幼圆,serif;font-weight: bolder;
}
.c-node-menu-item:hover{
  border-radius: 3px;
  background-color: rgba(51, 88, 227, 0.4);
  color: #ffffff;
  transition: .1s;
}
.treeMenu{
  height:calc(100vh - 95px);
  padding: 10px;
  border-radius: 10px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}
.rel-map[data-v-2964abc9] {
  /*background-color: transparent !important;*/
  border-radius: 10px;
  box-shadow:  0 8px 24px  rgba(149,157,165,0.2);
}
.el-form-item {
  text-align: left;
}
.device-card-item {
  font-size: 12px;
  color: grey;
  margin-bottom: 10px;
}
.device-checked {
  background: rgba(51, 88, 227, 0.4);
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.device-card-header {
  padding: 8px;
  line-height: 30px;
  height: 30px;
  border-bottom: 1px solid lightgrey;
  font-weight: bolder;
  font-family: 幼圆,serif;
  font-size: 16px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}
.device-card-content {
  padding: 8px;
}
.dot-item {
  /*margin-top: 10px;*/
  /*margin-right: 40px;*/
}
.device-card-header-checked {
  background : rgba(51, 88, 227, 0.8);
  color : white;
  transition: .2s;
}
.el-drawer__body {
  padding: 30px 20px;
  text-align: left;
}
.el-drawer {
  width: calc(20% + 50px) !important;
}
.drawer-item {
  margin-top: 20px;
  color: grey;
}
.expand-btn {
  height: 30px;
  line-height: 30px;
  border-radius: 10px;
  margin-bottom: 5px;
  background: #fdfdfe;
  box-shadow:  0 8px 24px  rgba(149,157,165,0.2);

}
.expand-btn:hover {
  cursor: pointer;
  background: #eae9e9;
  transition: .3s;
}
.el-dialog__body {
 padding: 20px 20px !important;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
  overflow-y: scroll !important;
}
</style>
