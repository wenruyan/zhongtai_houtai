<template>
  <div class="main-content">
    <div class="rights-list panel points-query">
      <h4 class="public-header">积分发放查询</h4>
      <div class="rl-body">
        <el-row class="search-col" type="flex" justify="space-between" align="middle">
          <el-col :span="6">
            <span>手机号：</span>
            <el-input
              v-model="userPhone"
              class="phone-input"
              placeholder="请输入手机号"
              @change="phoneChange(userPhone)"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>状态：</span>
            <el-select v-model="sendStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span>提交时间：</span>
            <el-date-picker
              v-model="submitTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <!-- <el-col :span="6">
            <span>公司名称：</span>
            <el-input v-model="companyName" placeholder="请输入内容"></el-input>
          </el-col>-->
          <el-col :span="2" style="text-align:right">
            <el-button type="primary" plain @click="filter(userPhone,getListData)">查询</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          ref="multipleTable"
          height="calc(100vh - 290px - 76px)"
          stripe
          style="width: 100%;"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <el-table-column label="批次号" prop="batchNo"></el-table-column>
          <!-- <el-table-column label="公司名称" prop="goodName"></el-table-column> -->
          <el-table-column label="积分总量" prop="totalPoint"></el-table-column>
          <el-table-column label="记录数" prop="peopleNum"></el-table-column>
          <el-table-column label="提交时间" prop="submitDateTime"></el-table-column>
          <el-table-column label="发放时间" prop="sendDateTime"></el-table-column>
          <el-table-column label="状态" prop="sendStatus"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span @click="showModal(scope.row)" class="operate-btn">查看明细</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="bottom-col flex flex-main-right">
          <el-pagination
            class="pull-right"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </el-row>
      </div>
      <el-dialog :visible.sync="dialogVisible" width="700px" :before-close="hideModal">
        <h4 class="public-header">批次号查询</h4>
        <div class="modal-body">
          <p class="batch-no">批次号：{{selectedObj.batchNo}}</p>
          <div class="modal-child-one">
            <span>手机号：</span>
            <el-input
              v-model="userPeople"
              placeholder="请输入手机号"
              style="width:200px"
              class="mr-20"
              @change="phoneChange(userPeople)"
            ></el-input>
            <span>积分范围：</span>
            <el-input v-model="pointRange1" style="width:80px" type="number"></el-input>
            <span class="line">~</span>
            <el-input v-model="pointRange2" style="width:80px" type="number"></el-input>
            <el-button plain @click="filter(userPeople,getListDataT)" class="filter-btn">查询</el-button>
          </div>
          <el-table
            :data="tableDataT"
            ref="multipleTableT"
            stripe
            style="width: 100%;"
            height="380"
            :row-key="getRowKeysT"
            :expand-row-keys="expandsT"
            @selection-change="handleSelectionChangeT"
            v-loading="loadingT"
          >
            <el-table-column label="手机号" prop="userPhone"></el-table-column>
            <el-table-column label="积分数量" prop="point"></el-table-column>
            <el-table-column label="发放时间" prop="sendDateTime"></el-table-column>
            <el-table-column label="发放状态" prop="sendStatus"></el-table-column>
          </el-table>
          <el-row class="bottom-col flex flex-main-right">
            <el-pagination
              class="pull-right"
              background
              @size-change="handleSizeChangeT"
              @current-change="handleCurrentChangeT"
              :current-page="page.currentPageT"
              :page-sizes="[15, 30, 50, 100]"
              :page-size="pageT.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="pageT.total"
            ></el-pagination>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import PageTop from "../../components/myComponents/pageTop";
export default {
  components: {
    // PageTop
  },
  data() {
    return {
      // 积分发放列表筛选条件
      HrPhone: "",
      userPhone: "",
      sendStatus: "",
      submitTime: "",
      companyName: "",
      // 状态选择
      options: [
        {
          value: "",
          label: "所有"
        },
        {
          value: "20",
          label: "待处理"
        },
        {
          value: "10",
          label: "已处理"
        }
      ],
      statusObj: {
        "20": "待处理",
        "10": "已处理"
      },
      // 明细
      userPeople: "",
      pointRange1: "",
      pointRange2: "",
      dialogVisible: false,
      selectedObj: {},
      emptyTextShow: true,
      loading: true,
      emptyTextShowT: true,
      loadingT: true,
      showOperation: false,
      showOperationT: false,
      tableData: [],
      tableDataT: [],
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      pageT: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      multipleSelection: [],
      multipleSelectionT: [],
      expands: [],
      expandsT: []
    };
  },
  created() {
    this.$store.commit("updatepageTopData", [
      { router: "", text: "积分" },
      { router: "", text: "发放记录" }
    ]);
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getListData();
    },
    filter(phone, cb) {
      if (this.phoneChange(phone)) {
        cb && cb();
      }
    },
    phoneChange(phone) {
      if (!this.judgePhone(phone)) {
        this.$message({
          message: "手机号输入错误",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    showModal(item) {
      this.dialogVisible = true;
      this.selectedObj = item;
      this.getListDataT();
    },
    hideModal() {
      this.pointRange1 = "";
      this.pointRange2 = "";
      this.userPeople = "";
      this.dialogVisible = false;
    },
    getRowKeys(row) {
      return row.id;
    },
    getRowKeysT(row) {
      return row.id;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.getListData();
    },
    handleSizeChangeT(val) {
      // console.log(`每页 ${val} 条`);
      this.pageT.pageSize = val;
      this.getListDataT();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getListData();
    },
    handleCurrentChangeT(val) {
      console.log(`当前页: ${val}`);
      this.pageT.currentPage = val;
      this.getListDataT();
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val;
    },
    handleSelectionChangeT(val) {
      // console.log(val)
      this.multipleSelectionT = val;
    },
    searchListData() {
      this.page.currentPage = 1;
      this.getListData();
    },
    getListData() {
      let param = {
        page: this.page.currentPage,
        rows: this.page.pageSize,
        HrPhone: this.HrPhone,
        userPhone: this.userPhone,
        sendStatus: this.sendStatus,
        startTime: (this.submitTime && this.submitTime[0]) || "",
        endTime: (this.submitTime && this.submitTime[1] + " 23:59:59") || "",
        // companyName: this.companyName,
        type: "20" // 10:全部 20:某公司
      };
      console.log(param);
      this.loading = true;
      this.$http
        .post("/focus.integralSendList", param)
        .then(res => {
          console.log("integralSendList", res);
          let newList = res.data.rows.map(item => {
            item.submitDateTime = this.handleTime(item.submitDateTime);
            item.sendDateTime = this.handleTime(item.sendDateTime);
            item.sendStatus = this.statusObj[item.sendStatus];
            item.showOperation = false;
            return item;
          });
          console.log(newList, "newList");
          this.tableData = newList;
          this.page.total = res.data.total;
          this.loading = false;
          this.emptyTextShow = false;
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    getListDataT() {
      let param = {
        page: this.pageT.currentPage,
        rows: this.pageT.pageSize,
        id: this.selectedObj.id || "",
        userPhone: this.userPeople,
        pointRange1: this.pointRange1,
        pointRange2: this.pointRange2
      };
      console.log(param);
      this.loadingT = true;
      this.$http
        .post("/focus.integralSendDetailList", param)
        .then(res => {
          console.log("res", res);
          let newList = res.data.rows.map(item => {
            item.sendDateTime = this.handleTime(item.sendDateTime);
            item.sendStatus = this.statusObj[item.sendStatus];
            item.showOperation = false;
            return item;
          });
          console.log(newList, "newList");
          this.tableDataT = newList;
          this.pageT.total = res.data.total;
          this.loadingT = false;
          this.emptyTextShowT = false;
        })
        .catch(err => {
          console.log("err", err);
          this.loadingT = false;
        });
    }
  }
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.points-query {
  position: relative;
  width: 1200px;
  height: 800px;
  .rl-body {
    padding: 0 20px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .mr-20 {
    margin-right: 20px;
  }
  .search-col {
    padding: 20px 0;
    .phone-input {
      width: 160px;
    }
    .el-select {
      width: 120px;
      i {
        line-height: 34px;
      }
      input {
        padding-left: 40px;
      }
    }
    .el-date-editor {
      padding: 0 10px;
      height: 36px;
      &.el-input__inner {
        width: 260px;
        .el-range-separator {
          width: 50px;
        }
        input {
          width: 80px;
        }
      }
      span {
        padding: 0;
      }
      input,
      i,
      span {
        height: 34px;
        line-height: 34px;
      }
    }
    button {
      height: 34px;
      padding: 0 20px;
    }
  }
  .el-dialog {
    border-radius: 10px;
    .el-dialog__header {
      display: none;
    }
    button {
      padding: 0 20px;
    }
    .modal-body {
      padding: 0 30px;
    }
    .el-dialog__body {
      // max-height: 500px;
      height: 654px;
      padding: 0;
      input,
      span,
      button {
        height: 34px;
      }
      .el-table {
        tr {
          height: 40px;
        }
      }
    }
    .filter-btn {
      float: right;
    }
    .line {
      margin: 0 10px;
    }
    .modal-child-one {
      margin-bottom: 20px;
    }
    .batch-no {
      text-align: center;
      height: 68px;
      line-height: 68px;
      color: #387dff;
      font-size: 18px;
      font-weight: bold;
    }
    .el-dialog__footer {
      text-align: center;
      button.el-button {
        height: 34px;
      }
    }
  }
  .panel {
    margin-bottom: 0;
  }
  .search-col {
    // height: 34px;
    .el-input {
      input {
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .el-table {
    font-size: 12px;
    th {
      font-size: 15px;
    }
    tr {
      height: 54px;
      .operate-btn {
        color: #387dff;
        cursor: pointer;
        font-size: 14px;
      }
      td {
        padding: 0;
        button {
          padding: 8px 12px;
          font-size: 12px;
        }
      }
    }
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: center;
    }
    .el-table__header-wrapper {
      table {
        thead {
          color: #242a30;
        }
      }
    }
    .el-table__header {
      .el-table-column--selection {
        .cell {
          visibility: hidden;
        }
      }
    }
    .operate-col {
      .el-button {
        padding: 5px 8px;
      }
      .show-operation {
        padding-right: 35px;
        position: relative;
        .el-icon-caret-bottom {
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);
        }
      }
      .caozuo-drop {
        margin-left: 10px;
      }
    }
    .el-table__expanded-cell {
      padding-left: 18px;
      padding-right: 18px;
      padding-bottom: 0;
      background-color: #fafafa;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f2f3f4;
    // label {
    //   overflow: hidden;
    // }
  }
  .bottom-col {
    height: 28px;
    margin-top: 15px;
    .el-button:hover,
    .el-button:focus {
      background: none;
      border-color: #dcdfe6;
      color: #606266;
    }
    .filter {
      margin: 0 20px 0 0;
    }
    label.el-checkbox {
      margin: 0 20px 0 0;
    }
    .el-dropdown {
      .el-button {
        padding: 6px 16px;
      }
    }
  }
}
.el-select-dropdown__item {
  padding-left: 40px;
}
</style>
