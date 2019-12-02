<template>
  <div class="main-content">
    <div class="recharge panel">
      <h4 class="public-header">对账明细</h4>
      <div class="r-body">
        <div class="search-col">
          <div class="search-one">
            <span>支付状态：</span>
            <el-select v-model="payStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-one">
            <span>提交时间：</span>
            <el-date-picker
              v-model="submitTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="search-one">
            <el-button type="primary" plain @click="getListData">查询</el-button>
          </div>
        </div>
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
          <el-table-column label="流水号" prop="swiftNumber" width="300"></el-table-column>
          <!-- <el-table-column label="公司名称" prop="companyName"></el-table-column> -->
          <el-table-column label="充值金额" prop="rechargeMoney" width="100"></el-table-column>
          <el-table-column label="提交时间" prop="submitDateTime" width="200"></el-table-column>
          <el-table-column label="提交人" prop="submitPeople" width="100"></el-table-column>
          <el-table-column label="支付状态" prop="payStatusText" width="100"></el-table-column>
          <el-table-column label="支付方式" prop="payMethod" width="100"></el-table-column>
          <el-table-column label="支付时间" prop="payDateTime" width="200"></el-table-column>
          <el-table-column label="凭证号" prop="proofNumber" width="200"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.payStatus == '10'" @click="goPay(scope.row)" class="go-pay operate-btn">去支付</span>
              <span v-if="scope.row.payStatus == '10'" @click="showModal(scope.row)" class="operate-btn">取消</span>
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
      <!-- 取消提示框 -->
      <el-dialog :visible.sync="cancelModalShow" width="30%" class="cancel-modal">
        <span>您确定要取消吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cancelOrder">确 定</el-button>
          <el-button @click="cancelModalShow = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cancelModalShow: false,
      options: [
        {
          value: "",
          label: "所有"
        },
        {
          value: "10",
          label: "未支付"
        },
        {
          value: "20",
          label: "已支付"
        },
        {
          value: "30",
          label: "支付超时"
        },
        {
          value: "40",
          label: "取消"
        }
      ],
      payType: [
        {
          value: "10",
          label: "企业网银"
        },
        {
          value: "20",
          label: "银行转账"
        },
        {
          value: "30",
          label: "支付宝"
        },
        {
          value: "40",
          label: "微信"
        }
      ],
      selectedPayType: "",
      selectedObj: {},
      voucher: "",
      payStatus: "",
      payStatusObj: {
        "10": "未支付",
        "20": "已支付",
        "30": "支付超时",
        "40": "取消"
      },
      payMethodObj: {
        "10": "企业网银",
        "20": "银行转账",
        "30": "支付宝",
        "40": "微信"
      },
      submitTime: "",
      companyName: "",
      loading: true,
      searchVal: "",
      tableData: [
        // {
        //   'url': ''
        // }
      ],
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      multipleSelection: [],
      expands: [],
      typeStatusTextObj: {
        "10": "下架",
        "20": "上架",
        "30": "敬请期待"
      }
    };
  },
  computed: {},
  created() {
    this.$store.commit("updatepageTopData", [
      { router: "", text: "积分" },
      { router: "", text: "充值记录" }
    ]);
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getListData();
    },
    // 显示取消提示框
    showModal(item) {
      this.cancelModalShow = true;
      this.selectedObj = item;
    },
    // 取消订单
    cancelOrder() {
      this.$http
        .post("/focus.updatePointsRechargeStatus", {
          rechargeId: this.selectedObj.id,
          payStatus: "40", // 取消
          swiftNumber: this.selectedObj.swiftNumber
        })
        .then(res => {
          console.log("integralRechargeList", res);
          this.cancelModalShow = false;
          this.getListData();
        })
        .catch(err => {
          console.log(err, "integralRechargeList");
          this.$message.error(err.msg);
        });
    },
    // 去支付
    goPay(item) {
      this.PUSH({
        name: "main-leye-rechargePay",
        params: {
          rechargeId: item.id
        }
      });
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getListData();
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val;
    },
    getListData() {
      let param = {
        searchName: this.searchVal || "",
        page: this.page.currentPage,
        rows: this.page.pageSize,
        payStatus: this.payStatus,
        // companyName: this.companyName,
        startTime: (this.submitTime && this.submitTime[0]) || "",
        endTime: (this.submitTime && this.submitTime[1] + " 23:59:59") || "",
        type: "20" // 某公司
      };
      console.log(param);
      this.loading = true;
      this.$http
        .post("/focus.integralRechargeList", param)
        .then(res => {
          console.log("integralRechargeList", res);
          let newList = res.data.rows.map(item => {
            item.submitDateTime = this.handleTime(item.submitDateTime);
            item.payDateTime = this.handleTime(item.payDateTime);
            item.payStatusText = this.payStatusObj[item.payStatus];
            item.payMethod = this.payMethodObj[item.payMethod];
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
    }
  }
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.recharge {
  .r-body {
    padding: 0 20px;
  }
  button {
    padding: 0 20px;
    height: 34px;
  }
  .span-mr {
    margin-right: 10px;
  }
  position: relative;
  .cancel-modal {
    .el-dialog__body {
      text-align: center;
    }
  }
  .el-dialog__body {
    .modal-child-one {
      & > span {
        display: inline-block;
        width: 90px;
      }
      textarea,
      input {
        width: 220px;
      }
    }
    .voucher-box {
      margin-top: 20px;
      span {
        vertical-align: top;
      }
    }
    textarea {
      border-color: #dcdfe6;
    }
  }
  .el-dialog__footer {
    text-align: center;
    button.el-button {
      height: 34px;
    }
  }
  .el-input--mini .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .panel {
    margin-bottom: 0;
  }
  .search-col {
    padding: 20px 0;
    &:before, &:after {
      /*清除浮动*/
      content: "";
      height: 0;
      line-height: 0;
      display: block;
      visibility: hidden;
      clear: both;
    }
    .search-one {
      float: left;
      margin-right: 80px;
    }
    .filter {
      display: inline-block;
      cursor: pointer;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #d3d8de;
      text-align: center;
      border-radius: 3px;
      .active {
        color: #308ad9;
        font-weight: bold;
      }
    }
    .el-range-separator {
      width: 50px;
    }
    .el-input {
      input,
      i {
        height: 36px;
        line-height: 36px;
      }
    }
    .el-select {
      width: 120px;
    }
    .el-date-editor {
      padding: 0 10px;
      height: 36px;
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
  .el-table {
    font-size: 12px;
    // padding: 0 20px;
    table {
      // width: 100% !important;
    }
    th {
      font-size: 15px;
    }
    tr {
      height: 54px;
      .go-pay {
        margin-right: 20px;
        color: #387DFF;
      }
      .operate-btn {
        cursor: pointer;
      }
    }
    .el-table__header,
    .el-table__body,
    .el-table__footer {
      table-layout: auto;
    }
    .cell {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
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
  }
}
.el-dropdown-menu {
  padding: 0;
  overflow: hidden;
  li.el-dropdown-menu__item {
    padding: 0 16px;
    &:hover {
      background: rgba(241, 241, 241, 1);
      color: #262f3e;
    }
  }
}
</style>
