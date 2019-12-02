<template>
  <div class="main-content createSuccess">
    <div class="panel">
      <div class="phoneImg">
        <img src="../../assets/img/phone.png" alt />
        <div class="front-phone">
          <div class="phone">
            <img src="../../assets/img/front-phone-1.png" alt />
            <div class="phone-box">
              <div class="flex" style="justify-content: center;">
                <img :src="infoData.logo" v-if="infoData.logo" alt />
                <img src="../../assets/img/mologo.png" v-else alt />
              </div>
              <p>{{infoData.name}}</p>
            </div>
          </div>
        </div>
        <div class="tou">
          <img src="../../assets/img/tou.png" alt />
        </div>
      </div>
      <div class="writeInfo">
        <div class="detail-info">
          <div style="display:flex;justify-content: space-between;align-items: center;">
            <div class="name">创建成功</div>
            <use-desc></use-desc>
          </div>
          <div class="form">
            <el-form class="infoForm" label-position="right" label-width="100px" :model="infoData">
              <el-form-item label="邀请码">
                <div class="text">{{infoData.invitationcode}}</div>
                <p class="explain-text">将此邀请码发给员工以登录乐业卡</p>
              </el-form-item>
              <el-form-item label="乐业卡链接">
                <div class="text" id="link">{{linkUrl}}</div>
                <p class="explain-text">可用此链接访问乐业卡</p>
              </el-form-item>
              <el-form-item label="二维码">
                <img class="erweima" :src="image" alt />
                <p class="explain-text" style="height:30px;line-height:30px">或扫描此二维码关注“乐业权益公众号”使用乐业卡</p>
              </el-form-item>
              <el-form-item label="公司人数">
                <!-- {{infoData.staffrate}} -->
                <div class="text num">{{infoData.staffrate}}</div>
              </el-form-item>
              <el-form-item label="权益数">
                <!-- {{infoData.qynum}} -->
                <div class="text num">{{infoData.qynum}}</div>
              </el-form-item>
            </el-form>
          </div>
          <div style="display:flex;justify-content: center;margin-top:44px">
            <el-button
              @click="copyUrl()"
              class="btn-style-1"
              style="width:290px;height:50px;font-size:18px;;background:#387DFF"
              type="primary"
            >一键复制乐业卡链接</el-button>
            <el-button @click="goIndex" class="downLoad btn-style-2">回首页</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useDesc from "../../components/useDesc";
export default {
  components: { useDesc },
  data() {
    return {
      staffSwitch: false,
      image: "",
      linkUrl: "",
      infoData: {
        shortName: "",
        name: "",
        address: "",
        wet: "",
        logo: ""
      }
    };
  },
  mounted() {
    this.getListData();
    this.getUrl();
  },
  methods: {
    getUrl() {
      let param = {
        // companyNo: "1006005"
      };
      this.$http.post("/focus.middleGroundParam", param).then(res => {
        this.linkUrl = res.data.leyeH5lUrl;
        this.image = res.data.leyeCodeUrl;
      });
    },
    getListData() {
      let param = {
        // companyNo: "1006005"
      };
      this.$http
        .post("/focus.findCompany", param)
        .then(res => {
          console.log("res", res);
          var row = res.data;
          this.infoData = row;
          this.infoData.logo = row.url;
          this.infoData.name = row.name;
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    goIndex() {
      this.PUSH({
        name: "main-leye-myWork"
      });
    },
    copyUrl() {
      var Url2 = document.getElementById("link").innerText;
      var oInput = document.createElement("input");
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        message: "复制成功",
        type: "success",
        center: true
      });
    }
  }
};
</script>

<style lang="scss">
.createSuccess {
  .panel {
    width: 1200px;
    height: 782px;
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
        top: 14px;
        width: 340px;
        height: 744px;
        overflow-y: auto;
        border-radius: 30px;
        .phone {
          position: relative;
          .phone-box {
            width: 300px;
            height: 60px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 168px;
            img {
              width: 30px;
              height: 30px;
              border-radius: 100%;
              border: 2px solid #fff;
            }
            p {
              color: #d4b17b;
              text-align: center;
              margin-top: 10px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        img {
          width: 100%;
          // height: 100%;
        }
      }
      .front-phone::-webkit-scrollbar {
        /*滚动条整体样式*/

        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/

        height: 1px;
      }

      .front-phone::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        border-radius: 10px;

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

        background: #999;
      }

      .front-phone::-webkit-scrollbar-track {
        /*滚动条里面轨道*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

        border-radius: 10px;

        background: #ededed;
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
      // img {
      //   width: 100%;
      //   height: 100%;
      // }
    }
    .writeInfo {
      width: 810px;
      height: 782px;
      background-color: #fff;
      box-shadow: 0px 18px 40px rgba(5, 16, 91, 0.1);
      border-radius: 20px;
      .detail-info {
        padding: 72px 66px 80px 0;
        .name {
          color: #091d40;
          font-size: 45px;
          font-weight: bold;
          margin-bottom: 20px;
          margin-left: 70px;
        }
        .form {
          padding: 0 30px 0 45px;
          .el-form-item {
            margin-bottom: 10px;
          }
          .el-form-item__label {
            font-size: 16px;
            color: #757a82;
            font-weight: bold;
          }
          .erweima {
            width: 125px;
            height: 125px;
          }
          .text {
            width: 100%;
            height: 40px;
            line-height: 40px;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
            border-radius: 20px;
            color: #000;
            padding-left: 32px;
          }
          .explain-text {
            font-size: 12px;
            color: #999;
          }
          .num {
            width: 170px;
          }
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
