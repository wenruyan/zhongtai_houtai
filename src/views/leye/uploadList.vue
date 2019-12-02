<template>
  <div class="main-content uploadList">
    <div class="panel">
        <div class="writeInfo">
            <div class="detail-info">
                <div class="name">②上传员工信息</div>
                  <div class="explain">上传成功请核对表格是否正确，如有误请重新上传，或者您可以到员工管理中对个别员工进行修改</div>
                  <div class="table">
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
                        <el-table-column prop="departmentname" label="部门">
                        <template slot-scope="scope">
                            <span>{{scope.row.departmentname}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="positionname" label="职位">
                        <template slot-scope="scope">
                            <span>{{scope.row.positionname}}</span>
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
                  </div>
                <div style="display:flex;justify-content: center;margin-top:22px">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :before-upload="beforeUpload"
                        :on-success="successUpload"
                        :limit="1">
                        <el-button class="nextBtn btn-style-1" @click="goEditInfo" style="width:290px;height:50px;font-size:18px;" type="primary">点击上传</el-button>
                    </el-upload>
                  <!-- <el-button class="nextBtn" @click="goEditInfo" style="width:290px;height:50px;font-size:18px;background:#387DFF" type="primary">上一步</el-button> -->
                  <el-button @click="skipStep" class="downLoad btn-style-2">下一步</el-button>
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
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    goEditInfo() {
      //   this.PUSH({
      //     name: "main-leye-editInfo"
      //   });
    },
    skipStep() {
      this.PUSH({
        name: "main-leye-craeteSuccess"
      });
    },
    beforeUpload(file) {},
    successUpload(response, file, fileList) {},
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
        rows: this.page.pageSize
      };
      // console.log(param)
      this.loading = true;
      this.$http
        .post("/focus.staffList", param)
        .then(res => {
          console.log("res", res);
          let newList = res.data.rows.map(item => {
            return item;
          });
          this.tableData = newList;
          // this.tableData = res.data.rows
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
.uploadList {
  .panel {
    width: 1200px;
    height: 790px;
    background-color: #f4f4f4;
    border-radius: none;
    box-shadow: none;
    display: flex;
    .bottom-col {
      margin-top: 20px;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        border-radius: 100%;
        background-color: #387DFF
      }
      .el-pagination.is-background .el-pager li {
        border-radius: 100%;
        background-color: #fff;
        min-width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        padding: 0;
      }
      .el-pagination.is-background .btn-prev,
      .el-pagination.is-background .btn-next {
        border-radius: 100%;
        background-color: #fff;
        border: 1px solid #091d40;
        min-width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
      .el-pagination.is-background .btn-prev:disabled {
        color: #c0c4cc;
        border: 1px solid #c0c4cc;
      }
    }
    .el-table th > .cell {
      color: #091d40;
      font-size: 15px;
      font-weight: bold;
    }
    .phoneImg {
      width: 385px;
      height: 790px;
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
      height: 790px;
      background-color: #fff;
      box-shadow: 0px 18px 40px rgba(5, 16, 91, 0.1);
      border-radius: 20px;
      .detail-info {
        padding: 72px 70px 80px 78px;
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
        }
        .explain {
          color: #252f43;
          font-size: 20px;
          margin-bottom: 38px;
        }
        .downLoad {
          width: 200px;
          height: 50px;
          line-height: 50px;
          padding: 0;
          font-size: 13px;
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
