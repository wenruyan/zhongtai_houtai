<template>
  <div class="main-content uploadStaff">
    <div class="panel">
        <div class="writeInfo" v-if="!showList">
            <div class="detail-info">
                <div class="name">②上传员工信息</div>
                <div style="display:flex;align-items: center;margin-bottom: 28px;">
                  <div class="explain">在这里上传您的员工清单，若不上传员工无访问权限哦</div>
                  <el-button class="downLoad-text btn-style-2"><a href="https://www.focus-base.com/cdn/template/staff_info.xls" target="_blank" rel="noopener noreferrer" style="color:#387DFF">下载员工信息模板</a></el-button>
                </div>
                <div class="upload">
                  <div v-if="uploadStatus ==1">
                    <el-upload
                      class="upload-demo"
                      drag
                      :data="{'companyNo': $store.state.userInfo.company_no}"
                      action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                      :before-upload="uploadBefore"
                      :on-progress="uploadExcelProgress"
                      :on-success="uploadExcelSuccess"
                      :show-file-list="false"
                      multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件直接拖到此处或点击 <em>上传员工列表</em></div>
                    </el-upload>
                    <div style="display:flex;justify-content: center;margin-top:135px">
                      <el-button class="nextBtn btn-style-1" @click="goEditInfo" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">上一步</el-button>
                      <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                    </div>
                  </div>
                  <div class="uploading m-t-40" v-if="uploadStatus == 2">
                    <div class="m-b-20 t-c fs-14 b m-t-40" style="font-size:12px;padding: 0 50px">{{importingText}}</div>
                    <div class="progress rounded-corner progress-striped active">
                      <el-progress :percentage="importPercent1"></el-progress>
                    </div>
                  </div>
                  <div class="uploading m-t-10" v-if="uploadStatus == 3">
                    <div class="upload-box">
                      <div class=" t-c fs-14 b" style="font-size:12px;padding: 0 50px;margin-bottom:8px;text-align: center;margin-top:90px">文件上传失败，共有<span style="color:#FF4343">{{num}}</span>条信息出错</div>
                      <div class="m-b-20" style="padding: 0 50px;text-align: center;">
                        <div @click="goDownError"> <span style="color:#FF4343;font-size:12px;cursor:pointer;">点击下载带有错误信息高亮的文件</span></div>
                      </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 135px; ">
                    <el-upload
                          class="upload-demo1"
                          drag
                          :data="{'companyNo': $store.state.userInfo.company_no}"
                          action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                          :before-upload="uploadBefore"
                          :on-progress="uploadExcelProgress"
                          :show-file-list="false"
                          :on-success="uploadExcelSuccess">
                        <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                      </el-upload>
                      <div style="display:flex;justify-content: center;">
                        <!-- <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">重新上传</el-button> -->
                        <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="uploading m-t-10"   v-if="uploadStatus == 4">
                    <div class="upload-box">
                    <div style="padding: 0 50px;text-align: center;margin-top: 60px;    color: #091D40;">
                      <div>文件上传失败,文件格式错误</div>
                    </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 135px; ">
                    <el-upload
                          class="upload-demo1"
                          drag
                          :data="{'companyNo': $store.state.userInfo.company_no}"
                          action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                          :before-upload="uploadBefore"
                          :on-progress="uploadExcelProgress"
                          :show-file-list="false"
                          :on-success="uploadExcelSuccess">
                        <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                      </el-upload>
                      <div style="display:flex;justify-content: center;">
                        <!-- <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">重新上传</el-button> -->
                        <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="uploading m-t-10" v-if="uploadStatus == 5">
                    <div class="upload-box">
                    <div style="padding: 0 50px;text-align: center;margin-top: 110px;color: #091D40;">
                      <div>上传的文件无法识别,请使用官方模板进行编辑</div>
                    </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 135px; ">
                    <el-upload
                          class="upload-demo1"
                          drag
                          :data="{'companyNo': $store.state.userInfo.company_no}"
                          action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                          :before-upload="uploadBefore"
                          :on-progress="uploadExcelProgress"
                          :show-file-list="false"
                          :on-success="uploadExcelSuccess">
                        <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                      </el-upload>
                      <div style="display:flex;justify-content: center;">
                        <!-- <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">重新上传</el-button> -->
                        <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div style="display:flex;justify-content: center;margin-top:135px">
                  <el-button class="nextBtn btn-style-1" @click="goEditInfo" style="width:290px;height:50px;font-size:18px;" type="primary">上一步</el-button>
                  <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                </div> -->
            </div>
        </div>
        <div v-if="showList" class="writeInfo">
            <div class="detail-info">
                <div class="name">②上传员工信息</div>
                  <div class="explain">上传成功请核对表格是否正确，如有误请重新上传，或者您可以到员工管理中对个别员工进行修改</div>
                  <div class="table" v-if="uploadStatus1 == 1">
                      <el-table
                        :data="tableData"
                        ref="multipleTable"
                        height="420"
                        stripe
                        style="width: 100%;"
                        :row-key="getRowKeys"
                        v-loading="loading"
                        >
                        <el-table-column prop="name" label="姓名">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="电话"></el-table-column>
                        <el-table-column prop="departmentName" label="部门">
                        <template slot-scope="scope">
                            <span>{{scope.row.departmentName}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="positionName" label="职位">
                        <template slot-scope="scope">
                            <span>{{scope.row.positionName}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱">
                        <template slot-scope="scope">
                            <span>{{scope.row.email}}</span>
                        </template>
                        </el-table-column>
                        <div slot="empty" v-if="emptyTextShow"></div>
                    </el-table>
                    <el-row class="bottom-col" type="flex" justify="space-between" align="middle">
                        <el-col :span="8" class="flex flex-cross-center">
                        </el-col>
                        <el-col :span="16">
                        <el-pagination
                            class="pull-right"
                            :pager-count="5"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page.currentPage"
                            :page-sizes="[15, 30, 50, 100]"
                            :page-size="page.pageSize"
                            layout="total, sizes, prev, pager, next"
                            :total="page.total"
                        ></el-pagination>
                        </el-col>
                    </el-row>
                    <div style="display:flex;justify-content: center;margin-top:22px">
                        <el-upload
                            class="upload-demo1"
                            drag
                            :data="{'companyNo': $store.state.userInfo.company_no}"
                            action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                            :before-upload="uploadBefore1"
                            :on-success="uploadExcelSuccess1"
                            :on-progress="uploadExcelProgress1"
                            :show-file-list="false"
                            :limit="1">
                            <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                        </el-upload>
                      <!-- <el-button class="nextBtn" @click="goEditInfo" style="width:290px;height:50px;font-size:18px;background:#387DFF" type="primary">上一步</el-button> -->
                      <el-button @click="nextStep" class="downLoad btn-style-2">下一步</el-button>
                    </div>
                  </div>
                  <div class="upload">
                  <div class="uploading m-t-40" v-if="uploadStatus1 == 2">
                    <div class="m-b-20 t-c fs-14 b m-t-40" style="font-size:12px;padding: 0 50px">{{importingText}}</div>
                    <div class="progress rounded-corner progress-striped active">
                      <el-progress :percentage="importPercent1"></el-progress>
                    </div>
                  </div>
                  <div class="uploading m-t-10" v-if="uploadStatus1 == 3">
                    <div class="upload-box">
                    <div class=" t-c fs-14 b" style="font-size:12px;padding: 0 50px;margin-bottom:8px;text-align: center;margin-top:90px">文件上传失败，共有<span style="color:#FF4343">{{num}}</span>条信息出错</div>
                    <div class="m-b-20" style="padding: 0 50px;text-align: center;">
                      <div @click="goDownError1"> <span style="color:#FF4343;font-size:12px;cursor:pointer;">点击下载带有错误信息高亮的文件</span></div>
                    </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 135px; ">
                      <el-upload
                            class="upload-demo1"
                            drag
                            :data="{'companyNo': $store.state.userInfo.company_no}"
                            action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                            :before-upload="uploadBefore1"
                            :on-progress="uploadExcelProgress1"
                            :show-file-list="false"
                            :on-success="uploadExcelSuccess1">
                          <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                        </el-upload>
                        <div style="display:flex;justify-content: center;">
                          <!-- <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">重新上传</el-button> -->
                          <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                        </div>
                    </div>
                  </div>
                  <div class="uploading m-t-10"   v-if="uploadStatus1 == 4">
                    <div class="upload-box">
                    <div style="padding: 0 50px;text-align: center;margin-top: 60px;    color: #091D40;">
                      <div>文件上传失败,文件格式错误</div>
                    </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 135px; ">
                    <el-upload
                          class="upload-demo1"
                          drag
                          :data="{'companyNo': $store.state.userInfo.company_no}"
                          action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                          :before-upload="uploadBefore1"
                          :on-progress="uploadExcelProgress1"
                          :show-file-list="false"
                          :on-success="uploadExcelSuccess1">
                        <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                      </el-upload>
                      <div style="display:flex;justify-content: center">
                        <!-- <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">重新上传</el-button> -->
                        <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="uploading m-t-10" v-if="uploadStatus1 == 5">
                    <div class="upload-box">
                    <div style="padding: 0 50px;text-align: center;margin-top: 110px;color: #091D40;">
                      <div>上传的文件无法识别,请使用官方模板进行编辑</div>
                    </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 135px; ">
                    <el-upload
                          class="upload-demo1"
                          drag
                          :data="{'companyNo': $store.state.userInfo.company_no}"
                          action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
                          :before-upload="uploadBefore1"
                          :on-progress="uploadExcelProgress1"
                          :show-file-list="false"
                          :on-success="uploadExcelSuccess1">
                        <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;;background:#387DFF" type="primary">重新上传</el-button>
                      </el-upload>
                      <div style="display:flex;justify-content: center;">
                        <!-- <el-button class="nextBtn btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">重新上传</el-button> -->
                        <el-button @click="skipStep" class="downLoad btn-style-2">跳过此步</el-button>
                      </div>
                    </div>
                  </div>
                  </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emptyTextShow: true,
      loading: true,
      tableData: [],
      importingText: "",
      importFileName: "",
      importPercent: "",
      importPercent1: 0,
      background: "red",
      showList: false,
      uploadStatus: 1,
      uploadStatus1: 1,
      time: "",
      num: "",
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    };
  },
  mounted() {
    // this.getListData();
  },
  methods: {
    uploadBefore(file) {
      console.log(file);
      if (!file.name.endsWith("xlsx") && !file.name.endsWith("xls")) {
        this.uploadStatus = "4";
        return false;
      }
      this.importFileName = file.name;
      this.importingText = "文件上传中，请不要关闭或刷新页面，请稍后...";
    },
    uploadExcelProgress(event) {
      this.importPercent1 = parseInt(event.percent);
      this.uploadStatus = 2;
    },
    uploadExcelSuccess(response) {
      console.log("上传成功", response);
      this.time = response.time;
      if (response.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功"
        });
        this.showList = true;
        this.getListData();
      }
      if (response.code == 201 || response.code == 206) {
        this.uploadStatus = 5;
      }
      // if (response.code == 206) {
      //   // 空的文件
      //   this.uploadStatus = 4;
      // }
      if (response.code == 207) {
        this.uploadStatus = 3;
        // this.showTable = false
        this.num = response.errorNum;
      }
    },
    goDownError() {
      window.open(
        "../../bpeClean/W00B/com.w00b.action.R64.downStaffInfoExcel.bpe_json?" +
          "&companyNo=" +
          this.$store.state.userInfo.company_no +
          "&time=" +
          this.time
      );
    },
    goDownError1() {
      this.showList = true;
      window.open(
        "../../bpeClean/W00B/com.w00b.action.R64.downStaffInfoExcel.bpe_json?" +
          "&companyNo=" +
          this.$store.state.userInfo.company_no +
          "&time=" +
          this.time
      );
    },
    uploadBefore1(file) {
      console.log(file, "file");
      if (!file.name.endsWith("xlsx") && !file.name.endsWith("xls")) {
        this.uploadStatus1 = "4";
        return false;
      }
      this.importFileName = file.name;
      this.importingText = "文件上传中，请不要关闭或刷新页面，请稍后...";
    },
    uploadExcelProgress1(event) {
      this.importPercent1 = parseInt(event.percent);
      this.uploadStatus1 = 2;
    },
    uploadExcelSuccess1(response) {
      console.log("上传成功111111111111", response);
      this.time = response.time;
      if (response.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功"
        });
        this.uploadStatus1 = 1;
        this.showList = true;
        this.getListData();
      }
      if (response.code == 201 || response.code == 206) {
        this.uploadStatus1 = 5;
      }
      // if (response.code == 206) {
      //   // 空的文件
      //   this.uploadStatus1 = 4;
      // }
      if (response.code == 207) {
        this.uploadStatus1 = 3;
        this.showTable = false;
        this.num = response.errorNum;
      }
    },
    beforeUpload(file) {},
    successUpload(response, file, fileList) {
      this.getListData();
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
    getListData() {
      let param = {
        page: this.page.currentPage,
        rows: this.page.pageSize,
        time: this.time
      };
      // console.log(param)
      this.loading = true;
      this.$http
        .post("/focus.selectStaffInfo", param)
        .then(res => {
          console.log("res", res);
          let newList = res.data.rows.map(item => {
            return item;
          });
          this.tableData = newList;
          // this.tableData = res.data.rows
          this.page.total = res.total;
          this.loading = false;
          this.emptyTextShow = false;
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    nextStep() {
      let param = {
        time: this.time
      };
      this.$http.post("/focus.saveStaffInfo", param).then(res => {
        if (res.code == 200) {
          this.PUSH({
            name: "main-leye-craeteSuccess"
          });
        }
      });
    },
    skipStep() {
      this.PUSH({
        name: "main-leye-craeteSuccess"
      });
    },
    goEditInfo() {
      this.PUSH({
        name: "main-leye-editInfo"
      });
    }
  }
};
</script>

<style lang="scss">
.uploadStaff {
  .bottom-col {
    margin-top: 20px;
  }
  .uploading {
    // padding: 50px 30px;
    .upload-box {
      // width: 500px;
    height: 260px;
    border: 1px dashed #c7c7c7;
    }
    .bg-purple {
      background-color: red;
    }
  }
  .panel {
    width: 1200px;
    background-color: #f4f4f4;
    border-radius: none;
    box-shadow: none;
    display: flex;
    .phoneImg {
      width: 385px;
      height: 782px;
      margin-right: 16px;
      position: relative;
      .front-phone {
        position: absolute;
        left: 19px;
        top: 22px;
        width: 343px;
        height: 745px;
      }
      .tou {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 11px;
        width: 207px;
        height: 34px;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .writeInfo {
      width: 100%;
      height: 782px;
      background-color: #fff;
      box-shadow: 0px 18px 40px rgba(5, 16, 91, 0.1);
      border-radius: 20px;
      .detail-info {
        padding: 72px 70px 80px 78px;
        height: 100%;
        .upload {
          padding-top: 50px;
          .el-upload-dragger {
            background-color: rgba(255, 255, 255, 0);
          }
        }
        .upload-demo1 {
          height: 50px;
          .el-upload-dragger {
            background-color: rgba(255, 255, 255, 0);
            border: none;
            height: 50px;
          }
        }
        .other-switch {
          span {
            &:nth-of-type(1) {
              color: #242a30;
            }
            &:nth-of-type(3) {
              span {
                color: #a8acb1;
              }
            }
          }
        }
        .name {
          color: #091d40;
          font-size: 45px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .downLoad-text {
          width: 200px;
          height: 40px;
          line-height: 30px;
          padding: 0;
          font-size: 13px;
          background: #e5edff;
          color: #387dff;
          border: 1px solid #387dff;
          margin-left: 35px;
          a {
            display: inline-block;
            width: 100%;
            height: 30px;
            line-height: 30px;
          }
        }
        .explain {
          color: #252f43;
          font-size: 20px;
        }
        .upload {
          display: flex;
          justify-content: center;
          .upload-demo1 {
            .el-upload-dragger {
              border: none;
              background: rbga(255, 255, 255, 0);
              // margin-top: 135px;
              width: 290px;
            }
          }
          .upload-demo {
            .el-upload-dragger {
              width: 500px;
              height: 260px;
              padding: 0 85px;
              .el-icon-upload {
                font-size: 85px;
                margin: 70px 0 16px;
              }
              .uploadBtn {
                width: 144px;
                height: 30px;
                line-height: 30px;
                padding: 0;
                font-size: 13px;
                background: #387dff;
                margin: 15px 0 12px 0;
              }
            }
          }
        }
        .set {
          margin: 33px 0 33px 0;
        }
        .nextBtn {
          // margin:
        }
        .downLoad {
          width: 200px;
          height: 50px;
          line-height: 50px;
          padding: 0;
          font-size: 18px;
          background: #e5edff;
          color: #387dff;
          border: 1px solid #387dff;
          margin: 0;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
