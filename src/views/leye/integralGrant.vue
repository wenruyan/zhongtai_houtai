<template>
  <div class="main-content integralGrant">
    <div class="panel">
        <div class="title">积分发放</div>
        <div class="line"></div>
        <div class="content-box" v-show="showContent">
            <div class="points-box">
                <div class="box-left box">
                  <div class="text">账户余额(元)</div>
                  <span class="money">{{money}}</span>
                  <span class="small-points"> = {{pointsBalance}}积分</span>
                </div>
            </div>
            <div style="display: flex;margin-bottom:40px">
              <div class="other-title">代充文件</div>
              <div >
                <div style="display: flex;position: relative;">
                  <el-upload
                      class="upload-demo"
                      :data="{'companyNo': $store.state.userInfo.company_no}"
                      action="/bpeClean/W00B/com.w00b.action.R00.verifyRechargeExcel.bpe_json"
                      :beforeUpload="uploadBefore"
                      :on-success="uploadExcelSuccess"
                      :show-file-list="false"
                      multiple
                  >
                  <!-- :show-file-list="true" -->
                      <i class="el-icon-upload"></i>
                      <span class="el-upload__text" v-if="showUpload">选择批量代充文件</span>
                      <span class="el-upload__text" v-if="!showUpload">重新上传文件</span>
                  </el-upload>
                  <span style="line-height:40px; color:#666;font-size:14px;margin-left:20px">{{fileName}}</span>
                </div>
                  <div class="explain-text">单次不超过5000条（请按照<a class="blue" href="https://www.focus-base.com/cdn/zanpoint/batchrecharge.xls" target="_blank" rel="noopener noreferrer">批量代充模板</a>构建批量代充文件）</div>
              </div>
            </div>
            <div style="display: flex;margin-bottom:26px">
              <div class="all-title">通知方式</div>
              <el-checkbox-group v-model="way" @change="changeWay">
                  <div>
                      <el-checkbox label="微信服务通知"></el-checkbox><span style="font-size: 14px;color:#999">仅限使用过【福利盒子小程序】的用户</span>
                  </div>
                  <div>
                      <el-checkbox text-color="#999" label="短信服务"></el-checkbox><span style="font-size: 14px;color:#999">服务费：5积分/条</span>
                  </div>
              </el-checkbox-group>
            </div>
            <div class="flex-align" style="display: flex;margin-bottom:40px">
              <div class="all-title">代充事由</div>
              <el-input class="input" v-model="reasonValue"  :maxlength="10" placeholder="填写发送事由,最多10个文字"></el-input>
              <span style="color:#666;font-size:14px;">用于消息通知</span>
            </div>
            <div class="flex-align" style="display: flex;margin-bottom:40px">
              <div class="all-title">公司简称</div>
              <el-input class="input" v-model="shortValue"  :maxlength="6" placeholder="填写公司简称,最多6个文字"></el-input>
              <span style="color:#666;font-size:14px;">用于消息通知</span>
            </div>
            <div class="flex-align" style="display: flex;margin-bottom:40px">
              <div class="all-title">短信验证码</div>
              <el-input style="width:140px" class="input" v-model="code"  :maxlength="6" placeholder=""></el-input>
              <el-button v-show="time == 60" class="send-btn" @click='getCode'>发送验证码</el-button>
              <el-button v-show="time != 60" class="send-btn">{{time}}s</el-button>
            </div>
            <el-button type="primary" class="submit-btn" @click="submit">提交</el-button>
            <!-- 表格 -->
            <div class="table-box" v-if="showTable">
                <div class="table-top">
                    <div class="table-block">
                        <div class="top-content">{{totalPoint}}</div>
                        <div class="top-title">代发总积分</div>
                    </div>
                    <div class="table-block">
                        <div class="top-content">{{totalTransfer}}</div>
                        <div class="top-title">转账明细 (条)</div>
                    </div>
                    <div class="table-block">
                        <div class="top-content">{{totalPhone}}</div>
                        <div class="top-title">手机号 (个)</div>
                    </div>
                </div>
                <div class="table-content">
                    <el-table
                        :data="tableData"
                        ref="multipleTable"
                        style="width: 100%;"
                        :row-key="getRowKeys"
                        v-loading="loading"
                    >
                        <el-table-column label="序号" width="50" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.index}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="用户手机"  align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.phone}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="point" label="充值积分数" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.point}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="validMonth" label="积分有效期 (月)" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.validMonth}}</span>
                        </template>
                        </el-table-column>
                        <div slot="empty" v-if="emptyTextShow"></div>
                    </el-table>
                    <div style="margin-top:24px;">
                        <el-pagination
                            class="pull-right"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page.currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="page.pageSize"
                            layout="total, sizes, prev, pager, next"
                            :total="page.total"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="other-content" v-show="!showContent">
            <div class="su-title">您的批量代充已提交成功，系统将在1小时内处理完成。
                <img class="img" src="https://d1icd6shlvmxi6.cloudfront.net/gsc/BHB79N/97/b3/cb/97b3cba264ec43599632e58e9ba5e5cc/images/积分发放/u903.svg?token=57a9d204935d11369f059553742cbab4977ff32bb45d63ec1f2ff24493b49197" alt="">
            </div>
            <div class="su-text">工单编号: {{workNumber}}</div>
            <div class="su-text">发放积分: {{point}}</div>
            <div class="su-text">发送数量: {{sendNum}}条</div>
            <div class="btn-div">
                <div class="btn" @click="getBack">返回</div>
                <div class="btn" @click="goPointsQuery">积分发放查询</div>
            </div>
        </div>
    </div>
    <el-dialog
        title="确认积分发放"
        :visible.sync="dialogVisible"
        class="dialog">
        <span>积分发放后无法撤回，您确认要提交吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button class="sure" type="primary" @click="sureDialog">确 定</el-button>
            <el-button class="cancle" @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      wayOne: true,
      wayTwo: false,
      way: [],
      reasonValue: "",
      shortValue: "",
      informType: "",
      fileName: '',
      code: "",
      file: "",
      key: "",
      dialogVisible: false,
      time: 60,
      money: "0.00",
      pointsBalance: "0",
      showContent: true,
      totalPoint: "",
      totalTransfer: "",
      totalPhone: "",
      tableData: [],
      showTable: false,
      emptyTextShow: true,
      showUpload: true,
      workNumber: "",
      point: "",
      sendNum: "",
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };
  },
  mounted() {
    this.$http
      .post("/focus.findCompany", {})
      .then(res => {
        console.log("findCompany", res);
        this.data = res.data;
        this.$store.commit("updateCompanyInfo", res.data);
        this.money = this.formatNum(
          (
            this.$store.state.companyInfo.pointsBalance /
            this.$store.state.companyInfo.conversionRole
          ).toString(),
          0
        );
        this.pointsBalance = this.formatNum(
          this.$store.state.companyInfo.pointsBalance.toString(),
          1
        );
      })
      .catch(err => {
        console.log("err", err);
      });
  },
  computed: {},
  methods: {
    uploadBefore(file) {
      console.log(file);
    },
    uploadExcelSuccess(response, file, fileList) {
      console.log("上传成功", response);
      console.log("上传成功", file);
      this.fileName = file.name
      // this.rechargeExcel();
      if (response.code == 200) {
        this.key = response.data.VERIFY_RECHARGE_EXCEL_KEY;
        this.showUpload = false
        this.getListData();
      } else {
        this.$message({
          type: "warning",
          message: response.msg
        });
      }
    },
    rechargeExcel() {
      console.log(this.file, "file");
      let param = {
        file: this.file
      };
      this.$http
        .post("/focus.verifyRechargeExcel", param)
        .then(res => {
          if (res.code == 200) {
            this.key = res.data.VERIFY_RECHARGE_EXCEL_KEY;
            this.getListData();
          }
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    changeWay(value) {
      console.log(value);
      if (value.length == 2) {
        this.informType = 10 + "," + 20;
      } else if (value.length == 1) {
        if (value[0] == "微信服务通知") {
          this.informType = 10;
        }
        if (value[0] == "短信服务") {
          this.informType = 20;
        }
      } else {
        this.informType = "";
      }
      console.log(this.informType);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      console.log(val);
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getListData();
    },
    getRowKeys(row) {
      return row.id;
    },
    getCode() {
      let data = {
        phone: this.$store.state.companyInfo.hrPhone
        // phone: 18356504983
      };
      this.$http
        .post("/focus.getH5PhoneVcode", data)
        .then(res => {
          if (res.message == "请稍后重试") {
            this.$message({
              type: "warning",
              message: "请稍后重试"
            });
          } else if (res.message == "今天短信次数已达上限，请明天再试") {
            this.$message({
              type: "warning",
              message: "今天短信次数已达上限，请明天再试"
            });
          } else {
            this.$message({
              type: "success",
              message: "验证码已发送"
            });
            this.intervalTime();
          }
        })
        .catch(err => {
          console.log(err.status, err.message);
        });
    },
    intervalTime() {
      if (this.time > 0) {
        this.time = this.time - 1;
        setTimeout(() => {
          this.intervalTime();
        }, 1000);
      } else {
        this.time = 60;
      }
    },
    // 请求表格数据
    getListData() {
      let param = {
        page: this.page.currentPage,
        rows: this.page.pageSize,
        VERIFY_RECHARGE_EXCEL_KEY: this.key
      };
      // this.loading = true;
      this.$http
        .post("/focus.rechargeExcelData", param)
        .then(res => {
          console.log("res", res);
          let newList = res.data.rows.map((item, index) => {
            index =
              (this.page.currentPage - 1) * this.page.pageSize + index + 1;
            item.index = index;
            return item;
          });
          this.totalPoint = res.data.count.totalPoint;
          this.totalTransfer = res.data.count.totalTransfer;
          this.totalPhone = res.data.count.totalPhone;
          this.tableData = newList;
          this.page.total = res.data.total;
          this.loading = false;
          this.emptyTextShow = false;
          this.showTable = true;
        })
        .catch(err => {
          console.log("err", err);
          // this.loading = false;
        });
    },
    sureDialog() {
      let param = {
        informType: this.informType,
        reason: this.reasonValue,
        companyName: this.shortValue,
        vCode: this.code,
        VERIFY_RECHARGE_EXCEL_KEY: this.key,
        phone: this.$store.state.companyInfo.hrPhone
        // phone: 18356504983
      };
      this.$http
        .post("/focus.integralSend", param)
        .then(res => {
          console.log('integralSend', res);
          this.dialogVisible = false;
          if (res.code == '200') {
            this.showContent = false;
            this.workNumber = res.data.workNumber;
            this.point = res.data.point;
            this.sendNum = res.data.sendNum;
          } else {
            this.$message({
              type: "warning",
              message: res.msg
            });
          }
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
          this.dialogVisible = false;
        });
    },
    submit() {
      if (this.key == "") {
        this.$message({
          type: "warning",
          message: "请上传代充文件"
        });
      } else if (this.informType == "") {
        this.$message({
          type: "warning",
          message: "请选择一种通知方式"
        });
      } else if (this.reasonValue == "") {
        this.$message({
          type: "warning",
          message: "请填写代充事由"
        });
      } else if (this.shortValue == "") {
        this.$message({
          type: "warning",
          message: "请填写公司简称"
        });
      } else if (this.code == "") {
        this.$message({
          type: "warning",
          message: "请填写验证码"
        });
      } else {
        this.dialogVisible = true;
      }
    },
    getBack() {
      // this.tableData = [];
      // this.key = "";
      // this.informType = "";
      // this.reasonValue = "";
      // this.shortValue = "";
      // this.code = "";
      // this.workNumber = "";
      // this.point = "";
      // this.sendNum = "";
      // this.showContent = true;
      // this.showTable = false;
      // this.totalPoint = "";
      // this.totalTransfer = "";
      // this.totalPhone = "";
      this.REPLACE("/main/empty"); // 跳转空路由，重定向回来，刷新页面
    },
    goPointsQuery() {
      this.PUSH({
        name: "main-leye-pointsQuery"
      });
    }
  }
};
</script>

<style lang="scss">
.integralGrant {
  .flex-align {
    align-items: center;
  }
  .panel {
    width: 1200px;
    height: 940px !important;
    .title {
      font-size: 24px;
      color: #091d40;
      margin-bottom: 20px;
      font-weight: bold;
      padding-top: 24px;
      padding-left: 30px;
    }
    .line {
      border-bottom: 1px solid #dde7ff;
    }
    .content-box {
      padding: 50px;
      position: relative;
      .points-box {
        display: flex;
        .box {
          height: 80px;
          margin-right: 20px;
        }
        .box-left {
          position: relative;
          margin-bottom: 30px;
        }
        .money {
          font-size: 36px;
          color: #387dff;
        }
        .small-points {
          font-size: 24px;
          color: #666;
        }
        .text {
          font-size: 16px;
          color: #666;
          font-weight: bold;
          margin-bottom: 14px;
        }
      }
      .other-title {
        font-size: 14px;
        color: #091d40;
        margin-bottom: 10px;
        line-height: 40px;
        width: 74px;
        text-align: right;
        margin-right: 14px;
      }
      .input {
        height: 40px;
        width: 260px;
        margin-right: 22px;
        .el-input__inner {
          height: 40px;
        }
      }
      .el-upload-list {
        position: absolute;
        left: 220px;
        top: 0;
      }
      .upload-demo {
        width: 200px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #387dff;
        text-align: center;
        background: #e5edff;
        color: #387dff;
        border-radius: 5px;
      }
      .explain-text {
        font-size: 14px;
        color: #999;
        margin-top: 10px;
        .blue {
          color: #387dff;
        }
      }
      .all-title {
        font-size: 14px;
        color: #091d40;
        width: 74px;
        text-align: right;
        margin-right: 14px;
      }
      .el-checkbox {
        width: 160px;
        margin-bottom: 14px;
        .el-checkbox__label {
          color: #333;
          font-size: 14px;
        }
        // .el-checkbox__input.is-checked .el-checkbox__inner {
        //   background: #1abc9c;
        //   border-color: #1abc9c;
        // }
      }
      .send-btn {
        width: 110px;
        height: 40px;
        text-align: center;
        background-color: #e5edff;
        border: 1px solid #387dff;
        border-radius: 5px;
        color: #387dff;
        font-size: 14px;
      }
      .submit-btn {
        width: 240px;
        height: 40px;
        text-align: center;
        background: #387dff;
        border: none;
        display: block;
        margin-top: 25px;
        margin-left: 88px;
      }
    }
    .table-box {
      position: absolute;
      top: 206px;
      right: 48px;
      width: 540px;
      height: 640px;
      background: #fff;
      padding: 30px 20px;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      .table-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        .table-block {
          width: 150px;
          text-align: center;
          .top-title {
            color: #999;
            font-size: 14px;
          }
          .top-content {
            color: #387dff;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 5px;
          }
        }
      }
      .el-table::before {
        height: 0;
      }
      .el-table {
        height: 440px;
        // overflow: auto;
        .cell {
          color: #091d40;
        }
        .el-table__header {
          .is-leaf {
            background: #f9f9f9;
            height: 40px;
            padding: 0;
          }
        }
        .el-table__body-wrapper {
          height: 400px;
          overflow-y: auto;
        }
        .el-table__body {
          .is-center {
            height: 40px;
            padding: 0;
            .cell {
              font-size: 12px;
              color: #091D40;
            }
          }
        }
      }
    }
    .other-content {
      padding-top: 130px;
      padding-left: 370px;
      .su-title {
        font-size: 16px;
        margin-bottom: 40px;
        position: relative;
        .img {
          width: 30px;
          height: 30px;
          position: absolute;
          top: -5px;
          left: -40px;
        }
      }
      .su-text {
        font-size: 14px;
      }
      .btn-div {
        display: flex;
        .btn {
          width: 140px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #333;
          color: #333;
          font-size: 13px;
          margin-right: 65px;
          margin-top: 80px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .dialog {
    .el-dialog {
      border-radius: 5px;
      height: 306px;
      width: 540px;
    }
    .el-dialog__header {
      border: 1px solid #dde7ff;
      padding: 20px 35px;
    }
    .el-dialog__title {
      color: #091d40;
      font-size: 20px;
      font-weight: bold;
    }
    .el-dialog__headerbtn {
      right: 35px;
      top: 25px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #091d40;
    }
    .el-dialog__body {
      text-align: center;
      color: #091d40;
      font-size: 18px;
      padding: 58px 0;
    }
    .el-dialog__footer {
      padding: 0 110px;
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        .el-button {
          width: 150px;
          font-size: 16px;
        }
        .sure {
          background: #387dff;
        }
        .cancle {
          background: #e5edff;
          border: 1px solid #387dff;
          color: #387dff;
        }
      }
    }
  }
}
</style>
