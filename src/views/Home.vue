<template>
  <div id="app" style="height: 800px">

    <el-button type="primary" @click="horizontal=!horizontal">切换tree方向</el-button>
    <org-tree
        class="ccc"
        :data="data"
        :horizontal="horizontal"
        collapsable
        :render-content="renderContent"
        @on-expand="onExpand"
        @on-node-mouseover="onMouseover"
        @on-node-mouseout="onMouseout"
        @on-expand-mouseover="Mouseover"
        @on-expand-mouseout="Mouseout"
    >
    </org-tree>
    <div
        class="floating"
        v-show="isShowF&&bd"
        @mouseover="() => {isShowF = true;}"
        @mouseout="() => {isShowF = false;}"
        @mousewheel.prevent="mouseWheelDia"
    >
      <span @click="addOrEdit(0)">增加</span>
      <span @click="addOrEdit(1)">编辑</span>
      <span @click="del">删除</span>
    </div>
    <!-- 增加/编辑弹层 -->
    <el-dialog
        title="提示"
        v-if="dialogVisible"
        :visible="dialogVisible"
        @close="clearDialog"
        show-close
        :close-on-click-modal="false"
        custom-class="addOrEditDia"
        width="35%"
    >
      <div class="tips">
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
            @submit.native.prevent
        >
          <el-form-item prop="partnerName">
            <el-input
                v-focus
                placeholder="请输入节点名称"
                :maxlength="32"
                clearable
                v-model="ruleForm.partnerName"
                @keyup.enter.native="confirm"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="tip-left">
          <el-button size="small" type="info" @click="dialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="confirm">确定</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
        title="提示"
        v-if="dialogVisible2"
        :visible="dialogVisible2"
        @close="clearDialog"
        custom-class="delDia"
        width="35%">
      <div class="tips">
        <p style="text-align: left">确定要删除该节点吗?</p>
      </div>
      <span slot="footer" class="dialog-footer">
      <div class="tip-left">
        <el-button size="mini" type="info" @click="dialogVisible2=false">取消</el-button>
        <el-button size="mini" type="primary" @click="confimdelete">确定</el-button>
      </div>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import OrgTree from "../components/org-tree";

export default {
  name: "App",
  components: {
    OrgTree,
  },
  data() {
    return {
      bd: true, // 标的，修改鼠标移入展开关闭icon，增加编辑删除弹层出现的bug
      ruleForm: {
        partnerName: "",
      },
      rules: {
        partnerName: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
        ],
      },
      dialogVisible: false,
      dialogVisible2: false,
      isShowF: false,
      // data: {
      //   id: 'abc0',
      //   label: "XXX科技有限公司",
      //   leave: 1,  // tree层级
      //   children: [
      //     {
      //       id: 'abc2',
      //       label: "产品研发部",
      //       leave: 2,
      //       children: [
      //         {
      //           id: 'abc5',
      //           label: "研发-前端",
      //           children: [
      //             {
      //               id: 'abc11',
      //               label: "测试1",
      //               children: [
      //                 {
      //                   id: 'abc20',
      //                   label: 'ceshi18',
      //                   children: [
      //                     {
      //                       id: 'abc19',
      //                       label: "ceshi19"
      //                     }
      //                   ]
      //                 }
      //               ]
      //             }
      //           ]
      //         },
      //         {
      //           id: 'abc6',
      //           label: "研发-后端",
      //         },
      //         {
      //           id: 'abc9',
      //           label: "UI设计",
      //         },
      //         {
      //           id: 'abc1',
      //           label: "产品经理",
      //         },
      //       ],
      //     },
      //     {
      //       id: 'abc3',
      //       leave: 2,
      //       label: "销售部",
      //       children: [
      //         {
      //           id: 'abc7',
      //           label: "销售一部",
      //         },
      //         {
      //           id: 'abc8',
      //           label: "销售二部",
      //         },
      //       ],
      //     },
      //     {
      //       id: 'abc4',
      //       leave: 2,
      //       label: "财务部",
      //     },
      //     {
      //       id: 'abcc9',
      //       leave: 2,
      //       label: "HR人事",
      //     },
      //     {
      //       id: 'abc12',
      //       label: "ceshi2"
      //     },
      //     {
      //       id: 'abc13',
      //       leave: 2,
      //       label: "ceshi3"
      //     },
      //     {
      //       id: 'abc14',
      //       leave: 2,
      //       label: "ceshi4"
      //     },
      //     {
      //       id: 'abc15',
      //       label: "ceshi5"
      //     },
      //     {
      //       id: 'abc16',
      //       leave: 2,
      //       label: "ceshi6"
      //     },
      //     {
      //       id: 'abc17',
      //       leave: 2,
      //       label: "ceshi7"
      //     },
      //     {
      //       id: 'abc18',
      //       leave: 2,
      //       label: "ceshi7"
      //     },
      //   ],
      // },
      data: { "children": [ { "children": [ { "children": [ { "children": [], "craft": "工序", "description": "原料储备工序", "devicecode": "GX_000001", "id": 10, "locationid": "GX_000001", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000001" }, { "children": [], "craft": "工序", "description": "1#生料制备工序", "devicecode": "GX_000002", "id": 11, "locationid": "GX_000002", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000002" }, { "children": [], "craft": "工序", "description": "1#生料磨窑尾废气处理系统", "devicecode": "GX_000003", "id": 12, "locationid": "GX_000003", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000003" }, { "children": [], "craft": "工序", "description": "2#生料制备工序", "devicecode": "GX_000004", "id": 13, "locationid": "GX_000004", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000004" }, { "children": [], "craft": "工序", "description": "2#生料磨窑尾废气处理系统", "devicecode": "GX_000005", "id": 14, "locationid": "GX_000005", "parent": "GD_000001", "parentCode": "GD_000001", "treeId": "GX_000005" } ], "craft": "工段", "description": "生料制备工段", "devicecode": "GD_000001", "id": 5, "locationid": "GD_000001", "parent": "CJ_000001", "parentCode": "CJ_000001", "treeId": "GD_000001" }, { "children": [ { "children": [], "craft": "工序", "description": "煤粉制备工序", "devicecode": "GX_000006", "id": 15, "locationid": "GX_000006", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000006" }, { "children": [], "craft": "工序", "description": "烧成工序", "devicecode": "GX_000007", "id": 16, "locationid": "GX_000007", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000007" }, { "children": [], "craft": "工序", "description": "循环水供水工序", "devicecode": "GX_000008", "id": 17, "locationid": "GX_000008", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000008" }, { "children": [], "craft": "工序", "description": "空压机供气工序", "devicecode": "GX_000009", "id": 18, "locationid": "GX_000009", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000009" }, { "children": [], "craft": "工序", "description": "氨水脱销工序", "devicecode": "GX_000010", "id": 19, "locationid": "GX_000010", "parent": "GD_000002", "parentCode": "GD_000002", "treeId": "GX_000010" } ], "craft": "工段", "description": "烧成工段", "devicecode": "GD_000002", "id": 7, "locationid": "GD_000002", "parent": "CJ_000001", "parentCode": "CJ_000001", "treeId": "GD_000002" } ], "craft": "车间", "description": "烧成车间", "devicecode": "CJ_000001", "id": 2, "locationid": "CJ_000001", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000001" }, { "children": [ { "children": [ { "children": [], "craft": "工序", "description": "混合材储备工序", "devicecode": "GX_000011", "id": 20, "locationid": "GX_000011", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000011" }, { "children": [], "craft": "工序", "description": "熟料输送工序", "devicecode": "GX_000012", "id": 21, "locationid": "GX_000012", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000012" }, { "children": [], "craft": "工序", "description": "水泥管磨制备工序", "devicecode": "GX_000013", "id": 72, "locationid": "GX_000013", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000013" }, { "children": [], "craft": "工序", "description": "水泥立磨制备工序", "devicecode": "GX_000014", "id": 73, "locationid": "GX_000014", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000014" }, { "children": [], "craft": "工序", "description": "清水池供水工序", "devicecode": "GX_000015", "id": 74, "locationid": "GX_000015", "parent": "GD_000003", "parentCode": "GD_000003", "treeId": "GX_000015" } ], "craft": "工段", "description": "水泥制备工段", "devicecode": "GD_000003", "id": 8, "locationid": "GD_000003", "parent": "CJ_000002", "parentCode": "CJ_000002", "treeId": "GD_000003" }, { "children": [ { "children": [], "craft": "工序", "description": "水泥成品发放工序", "devicecode": "GX_000016", "id": 75, "locationid": "GX_000016", "parent": "GD_000004", "parentCode": "GD_000004", "treeId": "GX_000016" }, { "children": [], "craft": "工序", "description": "熟料散装发放工序", "devicecode": "GX_000017", "id": 76, "locationid": "GX_000017", "parent": "GD_000004", "parentCode": "GD_000004", "treeId": "GX_000017" }, { "children": [], "craft": "工序", "description": "污水处理工序", "devicecode": "GX_000018", "id": 77, "locationid": "GX_000018", "parent": "GD_000004", "parentCode": "GD_000004", "treeId": "GX_000018" } ], "craft": "工段", "description": "成品发放工段", "devicecode": "GD_000004", "id": 9, "locationid": "GD_000004", "parent": "CJ_000002", "parentCode": "CJ_000002", "treeId": "GD_000004" } ], "craft": "车间", "description": "水泥车间", "devicecode": "CJ_000002", "id": 3, "locationid": "CJ_000002", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000002" }, { "children": [], "craft": "车间", "description": "余热发电车间", "devicecode": "CJ_000003", "id": 4, "locationid": "CJ_000003", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000003" }, { "children": [ { "children": [], "craft": "设备", "description": "电动抓斗桥式起重机", "devicecode": "291CA04", "id": 1647, "locationid": "SD_000001", "parent": "CJ_000004", "parentCode": "CJ_000004", "treeId": "SD_000001" } ], "craft": "车间", "description": "测试车间", "devicecode": "CJ_000004", "id": 1763, "locationid": "CJ_000004", "parent": "CX_000001", "parentCode": "CX_000001", "treeId": "CJ_000004" } ], "craft": "产线", "description": "铜川尧柏万吨线", "devicecode": "CX_000001", "id": 1, "locationid": "CX_000001", "parent": "", "parentCode": "null", "treeId": "CX_000001" }
      ,
      horizontal: true,
      collapsable: true,
      isEdit: 0,
      currentTreeData: {},
      lastId: 11,
      labelClassName: "bg-white",
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },
  created() {
    this.toggleExpand(this.data, true); // 调用全部展开
  },
  watch: {
    dialogVisible: {
      handler(newV,oldV){
        if(newV == false) {
          this.ruleForm.partnerName = ''
        }
      }
    }
  },
  methods: {
    mouseWheelDia(){  // bugfix 鼠标移入弹层，滚动鼠标不能缩放bug
      this.isShowF = false;
    },
    Mouseover(){
      this.bd = false
    },
    Mouseout(){
      this.bd = true
    },
    clearDialog() { // 关闭添加/编辑/删除弹层
      this.dialogVisible = false;
      this.dialogVisible2 = false
      this.ruleForm.partnerName = "";
    },
    addOrEdit(val) {  // 点击添加/编辑
      // 新增val：0，编辑val：1
      this.dialogVisible = true;
      this.isEdit = val
      if(val == 1){  // 编辑回显
        this.ruleForm.partnerName = this.currentTreeData.description;
      }
    },
    confirm() {// 添加/编辑的确定
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            description: this.ruleForm.partnerName,
          };
          if (this.isEdit === 1) {
            // 编辑
            this.ruleForm.partnerName =
                // data.id = this.treeData.id;
                this.currentTreeData.description = data.description;
            // 前端编辑数据
            this.$message({
              type: "success",
              message: "节点修改成功！",
            });
            this.clearDialog();
            // loading.close();
          } else {
            // 添加
            // 前端添加数据,需要自己生成子级id,可以传数据的时候把最后一级id传过来,进行累加
            data.id = this.lastId++;
            // data.level = this.currentTreeData.level + 1;
            data.description = this.ruleForm.partnerName;
            data.expand = true;
            const render = (formData) => {
              formData.some((item) => {
                if (item.id === this.currentTreeData.id) {
                  if (item.children) {
                    item.children.push(data);
                  } else {
                    this.$set(item, "children", [data]);
                  }
                  return;
                } else if (item.children) {
                  render(item.children);
                }
              });
            };
            let arr = [this.data];
            render(arr);
            this.data = arr[0];

            this.$message({
              type: "success",
              message: "新增节点成功！",
            });
            this.clearDialog();
            // loading.close();
          }
        } else {
          // loading.close();
        }
      });
    },
    del() {
      this.dialogVisible2 = true;
    },
    confimdelete(){  // 是否确定删除当前节点
      // 前端删除 遍历原数据,删除匹配id数据
      const deleteData = (data) => {
        data.some((item, i) => {
          if (item.id === this.currentTreeData.id) {
            data.splice(i, 1)
            return
          } else if (item.children) {
            deleteData(item.children)
          }
        })
      }
      let arr = [this.data]
      deleteData(arr)
      this.data = arr[0] ? arr[0] : {}
      this.dialogVisible2 = false
      this.$message({
        type: "success",
        message: "节点删除成功！"
      });
    },
    onMouseover(e, data) { // 鼠标移入树节点
      this.currentTreeData = data;  // 鼠标移入，该节点的所有数据
      this.isShowF = true;
      var floating = document.getElementsByClassName("floating")[0];
      floating.style.left = e.clientX + "px";
      floating.style.top = e.clientY + "px";
    },
    onMouseout(e, data) { // 鼠标移出树节点
      this.isShowF = false;
    },
    renderContent(h, data) {
      return data.description;
    },
    onExpand(e, data) {  // 节点展开收缩
      if(data.leave === 1 && data.expand === true){  // bugfix
        var dom = document.getElementById('ddd')
        dom.style.top = '50%'
        dom.style.left = '8%'
      }
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },
    collapse(list) {
      list.forEach((child) => {
        if (child.expand) {
          child.expand = false;
        }

        child.children && this.collapse(child.children);
      });
    },
    toggleExpand(data, val) {  // 节点默认全部展开
      var _this = this;
      console.log(data);
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, "expand", val);
          if (item.children) {
            _this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, "expand", val);
        if (data.children) {
          _this.toggleExpand(data.children, val);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
#app {
  // position: relative;
}
.floating {
  background: rgba(0, 0, 0, 0.7);
  width: 130px;
  height: 45px;
  line-height: 45px;
  display: flex;
  justify-content: space-around;
  position: fixed;
  color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  left:0;
  top: 0;
  transition: all 0.3s;
  z-index: 999;
  font-size: 12px;
  span {
    cursor: pointer;
  }
}
</style>
<style lang="less">
.addOrEditDia,
.delDia {
  padding: 14px 18px 10px 18px;
  border-radius: 4px !important;
  .el-dialog__header {
    display: flex;
    justify-content: space-between;
  }
  .el-dialog__body {
    margin-top: 37px;
  }
  .el-dialog__footer {
    padding: 27px 0 9px 0 !important;
  }
  .el-dialog__headerbtn {
    position: static !important;
  }
}
.bg-white {
  background-color: white;
}
.bg-orange {
  background-color: orange;
}
.bg-gold {
  background-color: gold;
}
.bg-gray {
  background-color: gray;
}
.bg-lightpink {
  background-color: lightpink;
}
.bg-chocolate {
  background-color: chocolate;
}
.bg-tomato {
  background-color: tomato;
}
</style>
