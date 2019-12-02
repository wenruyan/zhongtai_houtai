<template>
  <div class="main-content staff-manage">
    <div class="panel" ref="panel">
      <header class="flex">
        <h2>员工管理</h2>
        <el-menu
          :default-active="$store.state.activeIndex+''"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">员工信息</el-menu-item>
          <el-menu-item index="2">员工审核</el-menu-item>
        </el-menu>
      </header>
      <!-- 员工信息 -->
      <div class="content-one content-staff-info" v-show="$store.state.activeIndex == '1'">
        <div class="operation flex flex-main-justify">
          <div>
            <span class="btn btn-style-2" @click="showEditModal('')">添加员工</span>
            <span class="btn btn-style-1" @click="importModalShow = true;uploadStatus = '1'">批量导入</span>
          </div>
          <div class="flex">
            <el-input
              v-model="searchVal"
              placeholder="请输入内容"
              class="flex-1"
              @keyup.enter.native="searchListData"
            ></el-input>
            <span class="btn btn-style-2 search" @click="searchListData">搜索</span>
          </div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          height="calc(100vh - 450px)"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="left" prop="name" label="姓名" width="120">
            <template slot-scope="scope" class="flex flex-cross-center">
              <span class="name" :class="{'hidden':scope.row.isfreeze == 20}">{{scope.row.name}}</span>
              <img src="../../assets/img/frozen.png" class="frozen" v-if="scope.row.isfreeze == 20" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="phone" label="电话" width="160"></el-table-column>
          <el-table-column align="center" prop="departmentname" label="部门" width="140"></el-table-column>
          <el-table-column align="center" prop="positionname" label="职位" width="140"></el-table-column>
          <el-table-column align="center" prop="staffstaus" label="状态" width="140">
            <template slot-scope="scope">{{scope.row.staffstaus == 10 ? '在职' : '离职'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
          <!-- <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="showEditModal(scope.row)">编辑</el-button>
              <el-button
                v-if="scope.row.staffstaus == 10"
                size="mini"
                type="primary"
                plain
                @click="operateJudge('freeze', scope.$index,scope.row, tableData)"
              >冻结</el-button>
              <el-button
                v-if="scope.row.staffstaus == 20"
                size="mini"
                type="primary"
                plain
                @click="operateJudge('unfreeze', scope.$index,scope.row, tableData)"
              >解冻</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="operateJudge('del', scope.$index,scope.row, tableData)"
              >删除</el-button>
            </template>
          </el-table-column>-->
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showEditModal(scope.row)"
                class="edit"
              >编辑</el-button>
              <el-dropdown trigger="click">
                <el-button type="default" size="mini">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.isfreeze == 10"
                    @click.native="operateJudge('freeze', scope.$index,scope.row, tableData)"
                  >冻结</el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.isfreeze == 20"
                    @click.native="operateJudge('unfreeze', scope.$index,scope.row, tableData)"
                  >解冻</el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.staffstaus == 20"
                    @click.native="operateJudge('reinstate', scope.$index,scope.row, tableData)"
                  >复职</el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.staffstaus == 10"
                    @click.native="operateJudge('quit', scope.$index,scope.row, tableData)"
                  >离职</el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.staffstaus == 20"
                    @click.native="operateJudge('del', scope.$index,scope.row, tableData)"
                  >剔除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="bottom-col" type="flex" justify="space-between" align="middle">
          <el-col :span="8" class="flex flex-cross-center">
            <el-checkbox class="p-l-14" v-model="checkedAll"></el-checkbox>
            <div class="filter">本页全选</div>
            <el-dropdown trigger="click" @command="handleBatchCommand">
              <el-button type="default">
                批量操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="key"
                  v-for="(item, key) in batchOptions"
                  :key="key"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="16">
            <el-pagination
              class="pull-right flex flex-cross-center"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="pageSizes"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="page.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </div>
      <!-- 员工审核 -->
      <div class="content-one content-staff-examine" v-show="$store.state.activeIndex == '2'">
        <div class="operation flex flex-main-justify flex-cross-center">
          <div>
            <el-switch v-model="openExamine" inactive-text="员工登录审核" @change="changeAutoCheck"></el-switch>
            <span class="switch-tip">该功能关闭后，所有员工申请就被自动通过，不再进行审核，请谨慎关闭此功能</span>
          </div>
          <div class="flex">
            <el-input
              v-model="searchValT"
              placeholder="请输入内容"
              class="flex-1"
              @keyup.enter.native="searchListDataT"
            ></el-input>
            <span class="btn btn-style-2 search" @click="searchListDataT">搜索</span>
          </div>
        </div>
        <el-table
          :data="tableDataT"
          style="width: 100%"
          highlight-current-row
          height="calc(100vh - 450px)"
          ref="multipleTableT"
          @selection-change="handleSelectionChangeT"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column align="center" prop="phone" label="电话" width="160"></el-table-column>
          <el-table-column align="center" prop="department" label="部门" width="140"></el-table-column>
          <el-table-column align="center" prop="position" label="职位" width="140"></el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="checkJudge('pass', scope.$index,scope.row, tableDataT)"
              >通过</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="checkJudge('nopass', scope.$index,scope.row, tableDataT)"
              >拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="bottom-col" type="flex" justify="space-between" align="middle">
          <el-col :span="8" class="flex flex-cross-center">
            <el-checkbox class="p-l-14" v-model="checkedAllT"></el-checkbox>
            <div class="filter">本页全选</div>
            <el-dropdown trigger="click" @command="handleBatchCommandT">
              <el-button type="default">
                批量操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="key"
                  v-for="(item, key) in batchOptionsT"
                  :key="key"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="16">
            <el-pagination
              class="pull-right flex flex-cross-center"
              background
              @size-change="handleSizeChangeT"
              @current-change="handleCurrentChangeT"
              :current-page="pageT.currentPage"
              :page-sizes="pageSizesT"
              :page-size="pageT.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="pageT.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 确认操作模态框 -->
    <div class="modal confirm-modal" v-show="confirmModalShow">
      <div class="modal-content">
        <div class="m-c-header flex flex-main-justify flex-cross-center">
          <h4>员工管理</h4>
          <span class="el-icon-close" @click="confirmModalShow = false"></span>
        </div>
        <div class="m-c-body">
          <p>确定{{confirmModalTxtObj[confirmModalType]}}</p>
          <div class="operation flex flex-main-justify">
            <span class="btn btn-style-2" @click="confirmModalShow = false">取消</span>
            <span class="btn btn-style-1" @click="handleConfirm">确定</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑模态框 -->
    <div class="modal edit-modal" v-show="editModalShow">
      <div class="modal-content">
        <div class="m-c-header flex flex-main-justify flex-cross-center">
          <h4>{{editType ? '编辑' : '添加员工'}}</h4>
          <span class="el-icon-close" @click="editModalShow = false"></span>
        </div>
        <div class="m-c-body">
          <div class="input-ones flex must">
            <div class="input-one flex flex-cross-center">
              <span>
                <span>姓名</span>
              </span>
              <el-input placeholder="请输入姓名" v-model="inputObj.name" class="flex-1"></el-input>
            </div>
            <div class="input-one flex flex-cross-center">
              <span>
                <span>电话</span>
              </span>
              <el-input placeholder="请输入电话" v-model="inputObj.phone" class="flex-1" :maxlength="11"></el-input>
            </div>
            <div class="input-one flex flex-cross-center">
              <span>
                <span>部门</span>
              </span>
              <el-input placeholder="请输入部门" v-model="inputObj.departmentname" class="flex-1"></el-input>
            </div>
          </div>
          <div class="input-ones flex">
            <div class="input-one flex flex-cross-center">
              <span>职位</span>
              <el-input placeholder="请输入职位" v-model="inputObj.positionname" class="flex-1"></el-input>
            </div>
            <div class="input-one flex flex-cross-center">
              <span>邮箱</span>
              <el-input placeholder="请输入邮箱" v-model="inputObj.email" class="flex-1"></el-input>
            </div>
          </div>
          <div class="operation flex flex-main-center">
            <span class="btn btn-style-2" @click="hideEditModal">取消</span>
            <span class="btn btn-style-1" style="margin-left:20px" @click="save">保存</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 导入模态框 -->
    <div class="modal import-modal" v-show="importModalShow">
      <div class="modal-content">
        <div class="m-c-header flex flex-main-justify flex-cross-center">
          <h4>批量导入</h4>
          <span class="el-icon-close" @click="importModalShow = false"></span>
        </div>
        <!-- 上传前 -->
        <div
          class="m-c-body flex flex-dir-top flex-main-center flex-cross-center"
          v-show="uploadStatus == '1'"
        >
          <span class="btn btn-style-2 download">
            <a
              href="https://www.focus-base.com/cdn/template/staff_info.xls"
              target="_blank"
              rel="noopener noreferrer"
              style="color:#387DFF"
            >下载员工信息模板</a>
          </span>
          <el-upload
            class="upload-demo upload-before"
            drag
            :data="{'companyNo': $store.state.userInfo.company_no}"
            action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
            multiple
            :on-progress="progress"
            :on-change="fileTypeChange"
            v-show="uploadStatus == '1'"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件直接拖到此处或点击
              <em>上传员工列表</em>
            </div>
          </el-upload>
          <div class="operation flex flex-main-center">
            <span class="btn btn-style-1" @click="importModalShow = false">关闭</span>
          </div>
        </div>
        <!-- 上传中 -->
        <div
          class="m-c-body flex flex-dir-top flex-main-center flex-cross-center"
          v-show="uploadStatus == '2'"
        >
          <div class="upload-box flex flex-cross-center flex-main-center">
            <div class="progress-box">
              <p>文件上传中，请不要关闭或刷新页面，请稍后</p>
              <el-progress :percentage="progressNum"></el-progress>
            </div>
          </div>
        </div>
        <!-- 上传失败 -->
        <div
          class="m-c-body flex flex-dir-top flex-main-center flex-cross-center"
          v-show="uploadStatus == '3'"
        >
          <div class="upload-box flex flex-dir-top flex-cross-center flex-main-center upload-fail">
            <!-- 200 成功 205 companyNo为空 201 表头不一致 206 空的excel 207 有错误数据 202 文件格式错误 -->
            <div v-show="failCode == '207'">
              <p>文件上传失败，共有{{failNum}}条信息出错</p>
              <p class="btn down-fail-file" @click="goDownError">点击下载带有错误信息高亮的文件</p>
            </div>
            <div v-show="failCode == '201' || failCode == '206'">
              <p>上传的文件无法识别，请使用官方模板进行编辑</p>
            </div>
            <div v-show="failCode == '202'">
              <p>文件上传失败，文件格式错误</p>
            </div>
            <div></div>
          </div>
          <div class="operation flex flex-main-center">
            <span class="btn btn-style-2" @click="importModalShow = false">取消</span>
            <el-upload
              class="upload-demo"
              :data="{'companyNo': $store.state.userInfo.company_no}"
              action="/bpeClean/W00B/com.w00b.action.R64.importStaffExcel.bpe_json"
              multiple
              :on-change="fileTypeChange"
              :on-progress="progress"
              :show-file-list="false"
            >
              <el-button size="small" type="primary" class="btn btn-style-1 afresh-btn">重新上传</el-button>
            </el-upload>
          </div>
        </div>
        <!-- 上传成功 -->
        <div
          class="m-c-body flex flex-dir-top flex-main-center flex-cross-center"
          v-show="uploadStatus == '4'"
        >
          <div
            class="upload-box flex flex-dir-top flex-cross-center flex-main-center upload-success"
          >
            <i class="el-icon-success"></i>
            <p>已成功上传{{successNum}}条数据</p>
          </div>
          <div class="operation flex flex-main-center">
            <span class="btn btn-style-1" @click="complete">完成</span>
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
      // T代表审核列表数据
      beforeEditObj: {},
      // 当前选中列表
      activeIndex: "1",
      // 搜索框的值
      searchVal: "",
      searchValT: "",
      // 员工列表
      tableData: [],
      tableDataT: [],
      // 分页规格
      pageSizes: [15, 30, 50],
      pageSizesT: [15, 30, 50],
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 100
      },
      pageT: {
        currentPage: 1,
        pageSize: 15,
        total: 100
      },
      // 全选
      checkedAll: false,
      checkedAllT: false,
      noCheckedAll: true,
      noCheckedAllT: true,
      multipleSelection: [],
      multipleSelectionT: [],
      // 模态框
      confirmModalShow: false,
      editModalShow: false,
      importModalShow: false,
      // 1: 上传前 2: 上传中 3: 上传失败 4: 上传成功
      uploadStatus: "1",
      // 205 companyNo为空  201 表头不一致  206 空的excel  207 有错误数据
      failCode: "206",
      // 成功条数
      successNum: "",
      // 失败条数
      failNum: "",
      progressNum: 0,
      inputObj: {
        name: "",
        phone: "",
        departmentname: "",
        positionname: "",
        email: ""
      },
      editType: false,
      confirmModalType: "冻结此员工",
      typeObj: {
        freeze: "10", // 冻结
        unfreeze: "0", // 解冻
        del: "20", // 剔除
        reinstate: "30", // 复职
        quit: "40", // 离职,
        pass: "30", // 通过审核
        nopass: "20" // 拒绝审核
      },
      operateObj: {
        freeze: "冻结",
        unfreeze: "解冻",
        del: "剔除",
        reinstate: "复职",
        quit: "离职",
        pass: "通过",
        nopass: "拒绝"
      },
      confirmModalTxtObj: {
        freeze: "冻结此员工",
        unfreeze: "解冻此员工",
        del: "删除此员工",
        "4": "通过审核",
        "5": "拒绝审核"
      },
      confirmModalTipObj: {
        freeze: "冻结",
        unfreeze: "解冻",
        del: "删除",
        "4": "通过",
        "5": "拒绝"
      },
      // 是否开启审核
      openExamine: true,
      checkedScope: {},
      emptyTextShow: true,
      loading: true,
      importDialogVisible: false,
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        departmentname: [
          { required: true, message: "请输入部门", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        positionname: [
          { required: true, message: "请输入职位", trigger: "blur" }
        ]
      },
      batchOptions: {
        freeze: {
          label: "冻结",
          title: "批量员工冻结",
          // tip: "请选择员工冻结"
          tip: ""
        },
        unfreeze: {
          label: "解冻",
          title: "批量设置员工解冻",
          // tip: "请选择员工解冻"
          tip: ""
        },
        reinstate: {
          label: "复职",
          title: "批量设置员工复职",
          // tip: "请选择员工解冻"
          tip: ""
        },
        quit: {
          label: "离职",
          title: "批量设置员工离职",
          // tip: "请选择员工解冻"
          tip: ""
        },
        del: {
          label: "剔除",
          title: "批量删除员工",
          tip: ""
        }
      },
      batchOptionsT: {
        pass: {
          label: "通过",
          title: "批量员工通过",
          // tip: "请选择员工冻结"
          tip: ""
        },
        nopass: {
          label: "拒绝",
          title: "批量设置员工拒绝",
          // tip: "请选择员工解冻"
          tip: ""
        }
      },
      batchHandleType: "label",
      batchHandleTypeT: "label",
      moreNomDialogVisible: false,
      // sortDialogVisible: false,
      sortBtnText: "",
      quickEditForm: {
        id: "",
        name: "",
        departmentname: "",
        email: "",
        phone: "",
        positionname: "",
        sort: [],
        label: [],
        type: "",
        staffstaus: ""
      },
      moreNomTableData: [],
      expands: [],
      specificationOptions: [],
      sortOptions: [],
      labelOptions: [],
      specificationOptionsObj: [],
      sortOptionsObj: [],
      labelOptionsObj: [],
      normKey: [],
      skuList: [],
      selectedIndex: "",
      selectedRow: "",
      uploadTime: ""
    };
  },
  computed: {},
  watch: {
    checkedAll(val) {
      console.log(val, "val");
      console.log(this.noCheckedAll, "noCheckedAll");
      if (this.noCheckedAll) {
        if (val) {
          this.$refs.multipleTable.clearSelection();
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    checkedAllT(val) {
      console.log(val, "val");
      console.log(this.noCheckedAllT, "noCheckedAll");
      if (this.noCheckedAllT) {
        if (val) {
          this.$refs.multipleTableT.clearSelection();
          this.tableDataT.forEach(row => {
            this.$refs.multipleTableT.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTableT.clearSelection();
        }
      }
    },
    multipleSelection() {
      console.log("haha");
      if (this.multipleSelection.length != this.tableData.length) {
        this.noCheckedAll = false;
        this.checkedAll = false;
        this.$nextTick(() => {
          this.noCheckedAll = true;
        });
      } else {
        this.checkedAll = true;
      }
    },
    multipleSelectionT() {
      console.log("haha");
      if (this.multipleSelectionT.length != this.tableDataT.length) {
        this.noCheckedAllT = false;
        this.checkedAllT = false;
        this.$nextTick(() => {
          this.noCheckedAllT = true;
        });
      } else {
        this.checkedAllT = true;
      }
    },
    $route() {
      if (this.$route.query.num) {
        this.activeIndex = this.$route.query.num + "";
      }
    }
  },
  methods: {
    hideEditModal() {
      console.log(this.beforeEditObj, "beforeEditObj");
      this.inputObj = JSON.parse(JSON.stringify(this.beforeEditObj));
      this.editModalShow = false;
    },
    complete() {
      this.importModalShow = false;
      this.getListDataT();
      this.getListData();
    },
    // 隐藏导入模态框
    hideImportModal() {
      this.importModalShow = false;
      this.uploadStatus = "1";
    },
    // 下载带有错误信息的文件
    goDownError() {
      window.open(
        "../../bpeClean/W00B/com.w00b.action.R64.downStaffInfoExcel.bpe_json?" +
          "&companyNo=" +
          this.$store.state.userInfo.company_no +
          "&time=" +
          this.uploadTime
      );
    },
    // 自动审核
    changeAutoCheck(val) {
      console.log(val, "val");
      let type = val == true ? "开启" : "关闭";
      this.$http
        .post("/focus.saveUpdateCompany", {
          auditFreeStatus: val == true ? "20" : "10",
          id: this.$store.state.companyInfo.id
        })
        .then(res => {
          console.log("saveUpdateCompany", res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "已" + type + "审核"
            });
          } else {
            this.$message({
              type: "error",
              message: type + "审核失败"
            });
            this.openExamine = !val;
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 上传文件状态改变
    fileTypeChange(file) {
      console.log("haha", file);
      console.log("uploadStatus", this.uploadStatus);
      if (!file.name.endsWith("xlsx") && !file.name.endsWith("xls")) {
        this.uploadStatus = "3";
        this.failCode = "202";
        return false;
      }
      if (this.uploadStatus == "1") {
        this.uploadStatus = "2";
      }
      if (file.status == "success" || file.status == "fail") {
        // 200 成功  205 companyNo为空  201 表头不一致  206 空的excel  207 有错误数据
        switch (file.response.code) {
          case "200":
            this.$http
              .post("/focus.saveStaffInfo", {
                time: file.response.time
              })
              .then(res => {
                if (res.code == 200) {
                  this.uploadStatus = "4";
                  this.successNum = file.response.successNum;
                }
              });
            break;
          case "201":
            this.uploadStatus = "3";
            this.failCode = "201";
            break;
          case "206":
            this.uploadStatus = "3";
            this.failCode = "206";
            break;
          case "207":
            this.uploadStatus = "3";
            this.failCode = "207";
            this.failNum = file.response.errorNum;
            this.uploadTime = file.response.time;
            break;
        }
      }
    },
    progress(event, file) {
      console.log(event, "event");
      this.progressNum = parseInt(event.percent);
      if (file.status == "fail") {
        this.uploadStatus = "3";
      }
      if (file.status == "success") {
        this.uploadStatus = "1";
      }
    },
    // 提示
    showMessage(text) {
      this.$message({
        message: text,
        type: "success"
      });
    },
    // 确定
    handleConfirm() {
      this.changeStatus(
        this.selectedRow,
        this.selectedRow.id,
        this.typeObj[this.confirmModalType],
        this.operateObj[this.confirmModalType]
      );
      this.confirmModalShow = false;
    },
    // 删除员工
    deleteStaff(row, idArry) {
      let arr;
      if (row.length > 1) {
        arr = row.join(",");
      } else {
        arr = idArry;
      }
      // id是数组
      let param = {
        type: "20",
        staffIds: arr
      };
      this.$http.post("/focus.batchStaff", param).then(res => {
        console.log("res", res);
        this.confirmSuccess();
      });
    },
    confirmSuccess() {
      this.confirmModalShow = false;
      this.showMessage(
        "已成功" + this.confirmModalTipObj[this.confirmModalType]
      );
      this.getListData();
    },
    warnMsg(txt) {
      this.$message({
        type: "warning",
        message: txt
      });
    },
    // 保存
    save() {
      console.log(this.inputObj, "inputobj");
      let type = this.editType ? "编辑" : "添加";
      let param = {
        id: this.inputObj.id,
        name: this.inputObj.name,
        departmentname: this.inputObj.departmentname,
        positionname: this.inputObj.positionname,
        email: this.inputObj.email,
        phone: this.inputObj.phone,
        staffstaus: this.inputObj.staffstaus
      };
      console.log(param.name);
      console.log(param.phone);
      console.log(param.departmentname);
      if (!param.name) {
        this.warnMsg("姓名不能为空");
      } else if (!param.phone) {
        this.warnMsg("电话不能为空");
      } else if (!/^[1][3456789]\d{9}$/.test(param.phone)) {
        this.warnMsg("请输入正确的手机号码格式");
      } else if (!param.departmentname) {
        this.warnMsg("部门不能为空");
      } else if (
        param.email &&
        !/^[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-])+)*@[a-zA-Z0-9_-]+[.][a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*$/.test(
          param.email
        )
      ) {
        this.warnMsg("请输入正确的邮箱");
      } else {
        this.$http
          .post("/focus.saveUpdateStaff", param)
          .then(res => {
            // console.log('res', res);
            this.$message({
              type: "success",
              message: type + "成功"
            });
            this.editModalShow = false;
            this.getListData();
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    },
    handleSelect(index) {
      this.activeIndex = index;
      this.$store.commit("updateActiveIndex", index);
    },
    operate(param) {
      console.log(1);
      console.log(param, "param");
    },
    // 单一操作
    handleOperate(operate, desc, cb, row, type) {
      this.$confirm("您确定需要" + operate + desc, "员工管理", {
        confirmButtonText: operate,
        cancelButtonText: "取消"
      })
        .then(() => {
          cb(row, row.id, type, operate);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + operate
          });
        });
    },
    // 单一操作判断
    operateJudge(type, index, row) {
      console.log(type, "type");
      this.handleOperate(
        this.operateObj[type],
        "此员工么？",
        this.changeStatus,
        row,
        this.typeObj[type]
      );
    },
    // 批量操作
    handleBatch(operate, desc, cb, type) {
      let str = desc == "check" ? "审核" : "已选员工么？";
      let arr =
        desc == "check" ? this.multipleSelectionT : this.multipleSelection;
      this.$confirm("您确定需要" + operate + str, "员工管理", {
        confirmButtonText: operate,
        cancelButtonText: "取消"
      })
        .then(() => {
          let idStr = "";
          idStr = arr[0].id;
          let idArr = arr.map(item => {
            return item.id;
          });
          cb(idArr, idStr, type, operate);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + operate
          });
        });
    },
    // 批量操作判断
    handleBatchCommand(command) {
      console.log(this.multipleSelection, "嘎嘎嘎嘎嘎");
      console.log(command, "command");
      this.batchHandleType = command;
      let idArry = [];
      idArry = this.multipleSelection.map(item => {
        return item.id;
      });
      if (idArry.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择1个员工"
        });
      } else {
        this.handleBatch(
          this.operateObj[command],
          "",
          this.changeStatus,
          this.typeObj[command]
        );
      }
    },
    // 批量审核操作判断
    handleBatchCommandT(command) {
      console.log(this.multipleSelectionT);
      this.batchHandleTypeT = command;
      let idArry = [];
      idArry = this.multipleSelectionT.map(item => {
        return item.id;
      });
      if (idArry.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择1个员工"
        });
      } else {
        this.handleBatch(
          this.operateObj[command],
          "check",
          this.changePass,
          this.typeObj[command]
        );
      }
    },
    // 审核判断
    checkJudge(type, index, row) {
      this.handleOperate(
        this.operateObj[type],
        "审核",
        this.changePass,
        row,
        this.typeObj[type]
      );
    },
    // 审核
    changePass(row, idArry, type, operate) {
      let arr;
      if (row.length > 1) {
        arr = row.join(",");
      } else {
        arr = idArry;
      }
      this.$http
        .post("/focus.verifyStaff", {
          type,
          staffIds: arr
        })
        .then(res => {
          console.log("res", res);
          this.$message({
            showClose: true,
            message: "成功" + operate,
            type: "success"
          });
          this.getListDataT();
          this.getListData();
        });
    },
    // 切换每页展示条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getListData();
    },
    handleSizeChangeT(val) {
      this.pageT.pageSize = val;
      this.getListDataT();
    },
    // 切换页
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getListData();
    },
    handleCurrentChangeT(val) {
      this.pageT.currentPage = val;
      this.getListDataT();
    },
    // 获取审核员工列表
    getListDataT() {
      let param = {
        key: this.searchValT || "",
        page: this.pageT.currentPage,
        rows: this.pageT.pageSize
      };
      this.$http.post("/focus.verifyStaffList", param).then(res => {
        console.log("verifyStaffList", res);
        this.tableDataT = res.data.rows;
        this.pageT.total = res.data.total;
      });
    },
    handleEdit() {},
    handleThaw() {
      this.confirmModalShow = true;
    },
    showEditModal(scope) {
      this.editModalShow = true;
      // 编辑员工信息
      if (scope) {
        this.editType = true;
        this.inputObj = JSON.parse(JSON.stringify(scope));
        this.beforeEditObj = JSON.parse(JSON.stringify(scope));
      } else {
        console.log(1111);
        this.editType = false;
        this.inputObj = {};
      }
      console.log(scope, "scope");
    },
    async init() {
      this.resetImport(async () => {
        await Promise.all([
          // this.getSpecificationData()
          // this.getLabelData()
          // this.getSortData()
        ]);
      });
      this.getListData();
    },
    getRowKeys(row) {
      return row.id;
    },
    quickEditSave(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            id: this.quickEditForm.id,
            name: this.quickEditForm.name,
            departmentname: this.quickEditForm.departmentname,
            positionname: this.quickEditForm.positionname,
            email: this.quickEditForm.email,
            phone: this.quickEditForm.phone,
            staffstaus: this.quickEditForm.staffstaus
          };
          console.log(param);
          this.$http
            .post("/focus.saveUpdateStaff", param)
            .then(res => {
              // console.log('res', res);
              if (res.code == 100) {
                this.$message({
                  type: "info",
                  message: "此手机号已存在"
                });
              } else {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.expands = [];
                this.getListData();
              }
            })
            .catch(err => {
              console.log("err", err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeDialogVisible(type, value) {
      this[type] = value;
    },
    showMoreNomDialog(data) {
      this.normKey = this.typeStringToArry(data.productSpecificationSet);
      this.skuList = data.skuList;
      this.changeDialogVisible("moreNomDialogVisible", true);
    },
    searchListData() {
      this.page.currentPage = 1;
      this.getListData();
    },
    searchListDataT() {
      this.pageT.currentPage = 1;
      this.getListDataT();
    },
    handleSelectionChange(val) {
      console.log(val, "val00000000000");
      this.multipleSelection = val;
    },
    handleSelectionChangeT(val) {
      console.log(val, "val00000000000");
      this.multipleSelectionT = val;
    },
    // 获取员工信息列表
    getListData() {
      let param = {
        key: this.searchVal || "",
        page: this.page.currentPage,
        rows: this.page.pageSize
      };
      // console.log(param)
      this.loading = true;
      this.$http
        .post("/focus.staffList", param)
        .then(res => {
          console.log("staffList", res);
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
    },
    getCascaderObj(val, opt) {
      if (!val || val.length == 0 || opt.length == 0) return [];
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.id == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    // 改变员工状态
    changeStatus(row, idArry, type, operate) {
      let arr;
      console.log(row, "row");
      if (row.length > 1) {
        arr = row.join(",");
      } else {
        arr = idArry;
      }
      console.log(type, "type");
      console.log(arr, "arr");
      this.$http
        .post("/focus.batchStaff", {
          type,
          staffIds: arr,
          hideError: true
        })
        .then(res => {
          console.log("res", res);
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: operate + "成功",
              type: "success"
            });
            this.getListData();
          } else {
            this.$message({
              showClose: true,
              message: "批量操作失败，请查看已选员工的状态",
              type: "error"
            });
          }
        });
    },
    changeImportDialog(opt) {
      this.importDialogVisible = true;
    },
    closeImportDialog(val) {
      console.log(val);
      this.importDialogVisible = false;
      if (val) this.init();
    },
    resetImport(cb) {
      // 清除之前导入的数据
      let param = {};
      this.$http
        .get("../bpeClean/W00B/com.w00b.action.R52.removeStaff.bpe_json", param)
        .then(res => {
          if (res.code == 200) {
            cb && cb();
          } else {
            this.$confirm("请求出错, 请重试", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  },
  created() {
    if (sessionStorage.getItem("activeIndex")) {
      this.$store.commit(
        "updateActiveIndex",
        sessionStorage.getItem("activeIndex")
      );
    }
    this.openExamine = this.$store.state.companyInfo.auditFreeStatus == "20";
    this.getListData();
    this.getListDataT();
  }
};
</script>

<style lang="scss">
$text-color: #091d40;
.staff-manage {
  .btn {
    cursor: pointer;
  }
  h4 {
    font-weight: bold;
  }
  .panel {
    width: 1200px;
    height: auto;
    header {
      height: 86px;
      border-bottom: 1px solid #dde7ff;
      padding-top: 35px;
      h2 {
        color: $text-color;
        font-size: 24px;
        margin-left: 26px;
        margin-right: 48px;
      }
      .el-menu.el-menu--horizontal {
        border-bottom: none;
      }
      .el-menu-item {
        height: 48px;
        line-height: 34px;
        padding: 0;
        margin-right: 46px;
        font-size: 15px;
        color: $text-color;
        font-weight: 500;
        &.is-active {
          border-color: #387dff;
          color: #387dff;
        }
      }
    }
    .content-one {
      padding: 0 26px 0 26px;
      .el-table {
        min-height: 300px;
        .name {
          vertical-align: middle;
          &.hidden {
            display: inline-block;
            width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .frozen {
          margin-left: 6px;
          vertical-align: middle;
        }
      }
      .btn {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding: 0 21px;
        border-radius: 5px;
        font-size: 13px;
        &:first-child {
          margin-right: 13px;
        }
      }
      .el-input {
        height: 36px;
        input {
          height: 100%;
        }
      }
      .search {
        margin-left: 11px;
      }
      .el-table {
        th:first-child {
          .cell {
            display: none;
          }
        }
        .edit {
          margin-right: 10px;
        }
      }
      .operation {
        height: 36px;
        margin-top: 15px;
        margin-bottom: 15px;
      }
      .cell {
        white-space: nowrap;
      }
      .bottom-col {
        margin-top: 26px;
        padding-bottom: 26px;
        .filter {
          margin-right: 30px;
        }
        .pull-right {
          padding: 0;
          height: 36px;
        }
      }
      &.content-staff-examine {
        .operation {
          .is-active {
            color: #0e1b31;
          }
          .switch-tip {
            font-size: 10px;
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.6);
    .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 10px;
      .m-c-header {
        height: 66px;
        border-bottom: 1px solid #dde7ff;
        padding: 0 34px;
        .el-icon-close {
          font-weight: bold;
          cursor: pointer;
        }
      }
      .operation {
        height: 44px;
        line-height: 44px;
        width: 100%;
        & > span {
          height: 100%;
          width: 150px;
          text-align: center;
          display: inline-block;
          font-size: 16px;
          border-radius: 5px;
        }
        button {
          width: 150px;
          height: 44px;
          text-align: center;
          padding: 0;
          border-radius: 5px;
          font-size: 16px;
        }
      }
    }
  }
  .confirm-modal {
    .modal-content {
      width: 560px;
      .m-c-body {
        padding: 47px 120px 72px 120px;
        text-align: center;
        p {
          margin-bottom: 44px;
        }
      }
    }
  }
  .edit-modal {
    .modal-content {
      .m-c-body {
        padding: 43px 34px 66px 0;
        .input-ones {
          margin-bottom: 10px;
          padding-left: 10px;
          &.must span span {
            position: relative;
            &:before {
              content: "*";
              position: absolute;
              right: 110%;
              color: #ff4343;
            }
          }
        }
        .input-one {
          & > span {
            width: 72px;
            text-align: center;
            color: $text-color;
            font-size: 14px;
            position: relative;
          }
          .el-input {
            input {
              width: 200px;
            }
          }
        }
        .operation {
          margin-top: 44px;
          // span:first-child {
          //   margin-right: 20px;
          // }
        }
      }
    }
  }
  .import-modal {
    .modal-content {
      width: 858px;
      .m-c-body {
        padding: 72px 213px 122px 213px;
        position: relative;
        .download {
          width: 200px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          text-align: center;
          position: absolute;
          top: 13px;
        }
        .upload-demo {
          &.upload-before {
            width: 432px;
            height: 260px;
          }
          .el-icon-upload {
            color: #dfdfdf;
          }
          .el-upload__text {
            color: #999;
            em {
              color: #387dff;
            }
          }
          .el-upload-dragger {
            width: 432px;
            height: 260px;
            padding-top: 40px;
          }
        }
        .upload-box {
          width: 432px;
          height: 260px;
          border: 1px dashed #d9d9d9;
          p {
            color: $text-color;
            font-size: 10px;
          }
          &.upload-fail {
            .down-fail-file {
              color: #ff4343;
              margin-top: 5px;
            }
            button {
              width: 144px;
              height: 30px;
              text-align: center;
              border-radius: 5px;
              font-size: 13px;
            }
          }
          .progress-box {
            width: 352px;
            text-align: center;
            p {
              margin-bottom: 18px;
            }
          }
          &.upload-success {
            .el-icon-success {
              color: #387dff;
              font-size: 60px;
            }
            p {
              color: #999;
              font-size: 12px;
              margin-top: 24px;
            }
          }
        }
        .operation {
          margin: 0;
          position: absolute;
          bottom: 56px;
          .afresh-btn {
            margin-right: 20px;
          }
          // span:first-child {
          //   margin-right: 20px;
          // }
        }
      }
    }
  }
}
.el-message-box {
  width: 560px;
  border-radius: 8px;
  .el-message-box__header {
    height: 68px;
    padding-left: 34px;
    border-bottom: 1px solid #dde7ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-message-box__title {
      color: $text-color;
      font-size: 20px;
      font-weight: bold;
    }
    .el-message-box__close {
      color: $text-color;
      font-size: 20px;
      font-weight: bold;
    }
    button {
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .el-message-box__content {
    padding: 47px 0 44px 0;
  }
  .el-message-box__message {
    text-align: center;
    color: $text-color;
    font-size: 18px;
    font-weight: 500;
  }
  .el-message-box__btns {
    display: flex;
    justify-content: center;
    margin-bottom: 72px;
    button {
      width: 150px;
      height: 44px;
      font-size: 16px;
      border-radius: 5px;
      border: 1px solid #1c60ff;
      background-color: #e5edff;
      color: #387dff;
      &.el-button--primary {
        background-color: #387dff;
        color: #ffffff;
      }
    }
  }
}
</style>
