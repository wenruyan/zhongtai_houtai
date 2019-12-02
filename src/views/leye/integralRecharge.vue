<template>
  <div class="main-content integralRecharge">
    <div class="panel">
        <div class="title">积分充值</div>
        <div class="line"></div>
        <div class="content-box">
            <div class="points-box">
                <div class="box-left box">
                  <div class="text">账户余额(元)</div>
                  <span class="money">{{money}}</span>
                  <span class="small-points"> = {{pointsBalance}}积分</span>
                </div>
            </div>
            <div class="next-box">
              <div class="other-title">充值金额</div>
              <el-input :min="1" class="input" oninput = "value=value.replace(/[^\d.]/g,'')" v-model="value" @change='changeValue' placeholder="请输入充值金额"></el-input>
              <span>元</span>
            </div>
            <span class="min-money">最小充值金额: <span style="color:#387DFF">1元</span> </span>
            <el-button type="primary" class="submit-btn" @click="submit">提交</el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      money: "0.00",
      pointsBalance: "0"
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
  watch: {},
  methods: {
    changeValue(val) {
      var x = String(val).indexOf(".") + 1; // 小数点的位置
      var y = String(val).length - x; // 小数的位数
      if (y > 2) {
        let arr = [];
        arr = val.split(".");
        let a = arr[0];
        let b = arr[1];
        if (b.length >= 3) {
          b = b.substring(0, 2);
          this.value = [a, b].join(".");
        }
      } else {
        this.value = val;
      }
    },
    submit() {
      // if (!/^[0-9]+.?[0-9]*/.test(this.value)) {
      //   this.$message({
      //     type: "warning",
      //     message: "请输入正确的金额"
      //   });
      // } else if (this.value < 1) {
      //   this.$message({
      //     type: "warning",
      //     message: "充值金额最低1元"
      //   });
      // } else {
      let data = {
        rechargeMoney: (this.value * 100).toFixed(0),
        userId: this.$store.state.companyInfo.userId
      };
      this.$http.post("/focus.submitRechargePay", data).then(res => {
        if (res.code == 200) {
          this.PUSH({
            name: "main-leye-rechargePay",
            params: { rechargeId: res.data.rechargeId }
          });
        }
      });
      // }
    }
  }
};
</script>

<style lang="scss">
.integralRecharge {
  .panel {
    width: 1200px;
    .title {
      font-size: 24px;
      color: #091D40;
      margin-bottom: 20px;
      font-weight: bold;
      padding-top: 24px;
      padding-left: 30px;
    }
    .line {
      border-bottom: 1px solid #DDE7FF;
    }
    .content-box {
      padding-top: 50px;
      padding-left: 80px;
      .points-box {
        display: flex;
        .box {
          height: 80px;
          margin-right: 20px;
        }
        .box-left {
          position: relative;
        }
        .money {
          font-size: 36px;
          color: #387DFF;
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
      .next-box {
        display: flex;
        align-items: center;
        margin-top: 40px;
        margin-bottom: 20px;
      }
      .other-title {
        font-size: 14px;
        color: #091D40;
        margin-right: 18px;
        line-height: 40px;
      }
      .input {
        height: 40px;
        width: 260px;
        margin-right: 15px;
        .el-input__inner {
          height: 40px;
        }
      }
      .min-money {
        font-size: 14px;
        color: #999;
        margin-left: 72px;
      }
      .submit-btn {
        width: 260px;
        height: 40px;
        text-align: center;
        background: #387DFF;
        border: none;
        display: block;
        margin-top: 60px;
        margin-left: 72px;
      }
    }
  }
}
</style>
