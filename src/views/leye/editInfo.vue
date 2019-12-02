<template>
  <div class="main-content editInfo">
    <div class="panel">
      <div class="phoneImg">
        <img src="../../assets/img/phone.png" alt />
        <div class="card">
          <div class="front-info">
            <img src="../../assets/img/infoCard.png" alt />
            <!-- <img class="logo-img" :src="infoData.url!=''?infoData.url:'../../assets/img/mologo.png'" alt=""> -->
            <img
              class="logo-img"
              v-if="infoData.url"
              :src="infoData.url"
              alt
            />
            <img class="logo-img" src="../../assets/img/mologo.png" v-else alt />
            <div class="short-name">{{infoData.name}}</div>
          </div>
          <p class="front-text">卡片正面</p>
          <div class="front-info reverse-info">
            <img src="../../assets/img/infoCard.png" alt />
            <div class="staff-info">
              <p class="name">员工信息</p>
              <p class="post">部门——职位</p>
              <p class="title">
                <i class="el-icon-office-building"></i>
                <span>{{infoData.company}}</span>
              </p>
              <p class="wet">
                <i class="fa fa-television"></i>
                <span>{{infoData.website}}</span>
              </p>
              <p class="address">
                <i style="font-size: 14px;" class="el-icon-location-outline adddress-icon"></i>
                <span>{{infoData.addressdetail}}</span>
              </p>
            </div>
          </div>
          <p class="front-text">卡片反面</p>
        </div>
      </div>
      <div class="writeInfo">
        <div class="detail-info">
          <div class="name"><span v-if="saveIndex==1">①</span>编辑公司信息</div>
          <div class="explain">即将开启您的乐业卡之路，点击可修改您的公司信息</div>
          <el-form class="infoForm" label-position="left" label-width="100px" :model="infoData">
            <el-form-item :required="true" label="公司简称">
              <el-input @blur="bulrShortName" v-model="infoData.name" placeholder="请输入公司简称"></el-input>
              <i class="pencil fa fa-pencil"></i>
            </el-form-item>
            <el-form-item :required="true" label="公司名称">
              <el-input @blur="bulrShortName" v-model="infoData.company" placeholder="请输入公司名称"></el-input>
              <i class="pencil fa fa-pencil"></i>
            </el-form-item>
            <el-form-item :required="true" label="公司地址">
              <el-input
                @blur="bulrShortName"
                v-model="infoData.addressdetail"
                placeholder="请输入公司地址"
              ></el-input>
              <i class="pencil fa fa-pencil"></i>
            </el-form-item>
            <el-form-item :required="true" label="公司网址">
              <el-input @blur="bulrShortName" v-model="infoData.website" placeholder="请输入公司网址"></el-input>
              <i class="pencil fa fa-pencil"></i>
            </el-form-item>
            <el-form-item label="LOGO">
              <!-- <el-input v-model="infoData.logo"></el-input> -->
              <div style="display:flex;">
                <div class="info-item" style="display:flex">
                  <div
                    style="width:120px;height:120px;border-radius:20px;overflow:hidden;border:1px solid #ddd"
                  >
                    <img
                      style="width:120px;height:120px;"
                      :src="infoData.url"
                       v-if="infoData.url"
                      alt
                    />
                    <img src="../../assets/img/mologo.png" style="width:120px;height:120px;" v-else alt />
                  </div>
                  <div style="margin-left:20px">
                    <label
                      @click="centerDialogVisible = false"
                      class="btn btn-orange btn-style-2"
                      for="uploads"
                      style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;"
                    >上传</label>
                    <input
                      type="file"
                      id="uploads"
                      :value="imgFile"
                      style="position:absolute; clip:rect(0 0 0 0);"
                      accept="image/png, image/jpeg, image/gif, image/jpg"
                      @change="uploadImg($event, 1)"
                    />
                    <p class="btn-text">建议上传公司正方形LOGO主体</p>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="saveIndex==1" label style="margin-top:90px;">
              <el-button
                class="btn-style-1"
                @click="goUpload"
                style="width:360px;height:50px;font-size:18px;background:#387DFF"
              >下一步</el-button>
            </el-form-item>
            <el-form-item v-if="saveIndex==2" label>
              <div style="display:flex;margin-top:44px">
                  <el-button  @click="saveInfo" class="btn-style-1" style="width:290px;height:50px;font-size:18px;" type="primary">保存</el-button>
                  <el-button style="width:200px;" @click="goIndex" class="downLoad btn-style-2">回首页</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog title="编辑卡片" class="editImg" :visible.sync="centerDialogVisible" width="40%" center>
      <span>
        <div style="display:flex;">
          <div class="info-item" style="flex:1;margin-left:-160px;margin-top:30px;">
            <!-- <input type="button" class="btn btn-blue" value="上传头像" @click="finish('blob')"> -->
            <div class="line" style="margin-top: 85px;">
              <div class="cropper-content" style="margin-top:-60px;">
                <div class="cropper">
                  <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                  ></vueCropper>
                </div>
                <div style="margin-left:20px;">
                  <div
                    class="show-preview"
                    :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}"
                  >
                    <div :style="previews.div" class="preview">
                      <img :src="previews.url" :style="previews.img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish('blob')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      companyId: "",
      infoData: {
        id: "",
        company: "",
        name: "",
        addressdetail: "",
        email: "",
        website: "",
        url: ""
      },
      saveIndex: "1",
      loading: true,
      // infoData.url: "",
      centerDialogVisible: false,
      // 剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: "",
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true
      },
      fileName: "", // 本机文件地址
      downImg: "#",
      imgFile: "",
      uploadImgRelaPath: "" // 上传后的图片的地址（不带服务器域名）
    };
  },
  mounted() {
    console.log(this.$route.query.save, "99999999");
    if (this.$route.query.save) {
      this.saveIndex = this.$route.query.save;
    }
    this.getListData();
  },
  methods: {
    getListData() {
      let param = {
        // companyNo: "1006005"
      };
      this.loading = true;
      this.$http
        .post("/focus.findCompany", param)
        .then(res => {
          console.log("res", res);
          var row = res.data;
          this.infoData = row;
          this.companyId = row.id;
          this.infoData = {
            id: row.id,
            company: row.company,
            name: row.name,
            addressdetail: row.addressdetail,
            website: row.website,
            email: row.email,
            url: row.url
          };
          this.loading = false;
          this.$store.commit("updateCompanyInfo", res.data);
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    bulrShortName() {
      // if (!this.infoData.name) {
      //   this.$message({
      //     type: "info",
      //     message: "请输入公司简称"
      //   });
      // }
      // if (!this.infoData.company) {
      //   this.$message({
      //     type: "info",
      //     message: "请输入公司名称"
      //   });
      // }
      // if (!this.infoData.addressdetail) {
      //   this.$message({
      //     type: "info",
      //     message: "请输入公司地址"
      //   });
      // }
      // if (!this.infoData.website) {
      //   this.$message({
      //     type: "info",
      //     message: "请输入公司网址"
      //   });
      // }
    },
    goUpload() {
      this.loading = true;
      if (!this.infoData.name) {
        this.$message({
          type: "info",
          message: "请输入公司简称"
        });
      } else if (!this.infoData.company) {
        this.$message({
          type: "info",
          message: "请输入公司名称"
        });
      } else if (!this.infoData.addressdetail) {
        this.$message({
          type: "info",
          message: "请输入公司地址"
        });
      } else if (!this.infoData.website) {
        this.$message({
          type: "info",
          message: "请输入公司网址"
        });
      } else {
        if (this.infoData.website.substr(0, 4) != "http") {
          this.$message({
            type: "info",
            message: "请输入正确的公司网址"
          });
        } else {
          // 请求接口
          let param = {
            id: this.companyId,
            company: this.infoData.company,
            name: this.infoData.name,
            addressdetail: this.infoData.addressdetail,
            website: this.infoData.website,
            email: this.infoData.email,
            url: this.infoData.url
          };
          this.$http
            .post("/focus.saveUpdateCompany", param)
            .then(res => {
              // console.log('res', res);
              // this.$message({
              //   type: "success",
              //   message: "保存成功"
              // });
              this.loading = false;
              this.getListData();
              this.PUSH({
                name: "main-leye-uploadStaff"
              });
            })
            .catch(err => {
              console.log("err", err);
              this.loading = false;
            });
        }
      }
    },
    saveInfo() {
      this.loading = true;
      if (!this.infoData.name) {
        this.$message({
          type: "info",
          message: "请输入公司简称"
        });
      } else if (!this.infoData.company) {
        this.$message({
          type: "info",
          message: "请输入公司名称"
        });
      } else if (!this.infoData.addressdetail) {
        this.$message({
          type: "info",
          message: "请输入公司地址"
        });
      } else if (!this.infoData.website) {
        this.$message({
          type: "info",
          message: "请输入公司网址"
        });
      } else {
        // 请求接口
        let param = {
          id: this.companyId,
          company: this.infoData.company,
          name: this.infoData.name,
          addressdetail: this.infoData.addressdetail,
          website: this.infoData.website,
          email: this.infoData.email,
          url: this.infoData.url
        };
        this.$http
          .post("/focus.saveUpdateCompany", param)
          .then(res => {
            // console.log('res', res);
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.loading = false;
            this.getListData();
            // this.PUSH({
            //   name: "main-leye-uploadStaff"
            // });
          })
          .catch(err => {
            console.log("err", err);
            this.loading = false;
          });
      }
    },
    goIndex() {
      this.PUSH({
        name: "main-leye-myWork"
      });
    },
    // 上传图片（点击上传按钮）
    finish(type) {
      console.log("finish");
      let _this = this;
      let formData = new FormData();
      // 输出
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          let img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
          formData.append("file", data, this.fileName);
          this.$http
            .post(
              "../bpeClean/W00B/com.w00b.action.R50.savePic.bpe_json",
              formData,
              {
                contentType: false,
                processData: false,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
              }
            )
            .then(response => {
              var res = response;
              console.log(res, "99999999");
              // if (res.success == 1) {
              // $('#btn1').val('');
              _this.imgFile = "";
              _this.infoData.url = res; // 完整路径
              _this.uploadImgRelaPath = res; // 非完整路径
              _this.$message({
                // element-ui的消息Message消息提示组件
                type: "success",
                message: "上传成功"
              });
              this.centerDialogVisible = false;
              // }
            });
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true;
          this.modelSrc = data;
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      console.log("realTime");
      this.previews = data;
      console.log(data);
    },
    // 选择本地图片
    uploadImg(e, num) {
      console.log("uploadImg");
      var _this = this;
      // 上传图片
      var file = e.target.files[0];
      _this.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          _this.option.img = data;
        } else if (num === 2) {
          _this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
      this.centerDialogVisible = true;
    },
    imgLoad(msg) {
      console.log("imgLoad");
      console.log(msg);
    }
  }
};
</script>

<style lang="scss">
.editInfo {
  img {
    max-width: none;
  }
  .editImg {
    .el-dialog__header {
      border: 1px solid #dde7ff;
      text-align: left;
    }
  }
  .btn-orange {
    width: 92px;
    height: 30px;
    background: #e5edff;
    border: 1px solid #387dff;
    border-radius: 5px;
    color: #387dff;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-text {
    color: #757a82;
    font-size: 12px;
    margin-top: 20px;
  }
  .info {
    width: 720px;
    margin: 0 auto;
    .oper-dv {
      height: 20px;
      text-align: right;
      margin-right: 100px;
      a {
        font-weight: 500;
        &:last-child {
          margin-left: 30px;
        }
      }
    }
    .info-item {
      margin-top: 15px;
      label {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
      .sel-img-dv {
        position: relative;
        .sel-file {
          position: absolute;
          width: 90px;
          height: 30px;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .sel-btn {
          position: absolute;
          cursor: pointer;
          z-index: 1;
        }
      }
    }
  }

  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .cropper {
      width: 260px;
      height: 260px;
    }
    .show-preview {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      .preview {
        overflow: hidden;
        border: 1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
      }
    }
  }
  .cropper-content .show-preview .preview {
    margin-left: 0;
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
      img {
        max-width: 100%;
        height: 100%;
      }
      .card {
        position: absolute;
        height: calc(100vh - 180px - 104px - 226px);
        width: 344px;
        left: 50%;
        top: 104px;
        transform: translateX(-50%);
        z-index: 1;
        padding: 0 20px;
        img {
          width: 317px;
          height: 173px;
        }
        .front-text {
          text-align: center;
          font-size: 12px;
          margin-top: 20px;
          margin-bottom: 38px;
        }
        .front-info {
          position: relative;
          .logo-img {
            position: absolute;
            left: 50%;
            top: 30px;
            width: 30px;
            height: 30px;
            transform: translateX(-50%);
            border: 2px solid #fff;
            border-radius: 100%;
          }
          .short-name {
            position: absolute;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
            left: 50%;
            top: 80px;
            font-size: 16px;
            font-weight: bold;
            transform: translateX(-50%);
            color: #b2a68b;
          }
        }
        .reverse-info {
          position: relative;
          .staff-info {
            position: absolute;
            width: 304px;
            // height: 173px;
            left: 0;
            top: 0;
            padding: 20px 0 0 27px;
            p {
              font-size: 12px;
              color: #fff;
              margin-bottom: 8px;
              text-align: left;
              span {
                display: inline-block;
                width: 240px;
                margin-left: 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                // white-space: normal;
                // overflow: hidden;
                // text-overflow: ellipsis;
              }
            }
            .title,
            .wet,
            .address {
              position: relative;
              padding-left: 10px;
              i {
                // vertical-align: top;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
              }
              .adddress-icon {
                top: 10px;
              }
            }
            .name {
              font-size: 15px;
              margin-bottom: 10px;
            }
            .post {
              color: #a2a2a2;
              margin-bottom: 15px;
            }
          }
        }
      }
    }
    .writeInfo {
      width: 810px;
      height: 782px;
      background-color: #fff;
      box-shadow: 0px 18px 40px rgba(5, 16, 91, 0.1);
      border-radius: 20px;
      .detail-info {
        padding: 72px 70px 40px 78px;
        .name {
          color: #091d40;
          font-size: 45px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .explain {
          color: #252f43;
          font-size: 20px;
          margin-bottom: 38px;
        }
        .infoForm {
          //   .el-form-item.is-required:not(.is-no-asterisk)
          //     > .el-form-item__label:before,
          //   .el-form-item.is-required:not(.is-no-asterisk)
          //     .el-form-item__label-wrap
          //     > .el-form-item__label:before {
          //     color: #757a82;
          //   }
          .el-form-item__content {
            position: relative;
            .pencil {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 20px;
            }
          }
          .el-form-item__label {
            font-size: 16px;
            color: #757a82;
            font-weight: bold;
          }
          .el-input__inner {
            border-radius: 20px;
            background: #ebebeb;
            font-size: 14px;
            border: none;
            &:hover {
              background: #f6f6f6;
            }
          }
        }
      }
    }
  }
}
</style>
