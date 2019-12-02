const mixin = {
  data() {
    return {

    }
  },
  computed: {
    test1: () => 123
  },
  methods: {
    /**
     * 格式化时间
     * @param {string|number|object|Array} dateTime - 时间，可以是一个字符串、时间戳、表示时间的对象、Date对象或者******表示时间的数组
     * @param {string} [fmt] - 格式
     * @returns {string} 返回格式化后的日期时间，默认格式：2018年1月11日 15:00
     * @see [momentjs]{@tutorial http://momentjs.cn/}
     */
    formatDate(dateTime, fmt = 'YYYY年M月DD日 HH:mm:ss') {
      if (!dateTime) {
        return ''
      }
      return dateTime
    },
    PUSH(data) {
      this.$router.push(data)
    },
    REPLACE(data) {
      this.$router.replace(data);
    },
    GO(data) {
      this.$router.go(data)
    },
    loginOut() {
      localStorage.removeItem('userInfo')
      // this.REPLACE({ name: 'login' })
      window.location.href = "/"
    },
    typeStringToArry(string) {
      // 将两头有[]的字符串转为数组
      if (string && typeof string == 'string' && string.substr(0, 1) == '[' && string.substr(string.length - 1, 1) == ']') {
        if (string.substr(1, string.length - 2) != '') {
          string = string.substr(1, string.length - 2).split(',').map((item) => {
            if ((item.substr(0, 1) == "'" && item.substr(item.length - 1, 1) == "'") || (item.substr(0, 1) == '"' && item.substr(item.length - 1, 1) == '"')) {
              return item.substr(1, item.length - 2)
            }
            return item
          })
        } else {
          string = []
        }
        return string
      } else if (typeof string == 'object' && string != null) {
        return string
      }
      return []
    },
    decodeURL(url) {
      return decodeURIComponent(url || '')
    },
    encodeURL(url) {
      return encodeURIComponent(url)
    },
    getUrlFileName(fileUrl) {
      let str = fileUrl;
      str = str.substring(str.lastIndexOf("/") + 1);
      str = str.substring(0, str.lastIndexOf("."));
      return str;
    },
    // 数字每三位加逗号
    formatNum(str, ele) {
      var newStr = "";
      var count = 0;
      // 当数字是整数
      if (str.indexOf(".") == -1) {
        for (let i = str.length - 1; i >= 0; i--) {
          if (count % 3 == 0 && count != 0) {
            newStr = str.charAt(i) + "," + newStr;
          } else {
            newStr = str.charAt(i) + newStr;
          }
          count++;
        }
        if (ele == 0) {
          str = newStr + ".00"; // 自动补小数点后两位
        } else {
          str = newStr// 自动补小数点后两位
        }
        return str;
      } else {
        // 当数字带有小数
        for (let i = str.indexOf(".") - 1; i >= 0; i--) {
          if (count % 3 == 0 && count != 0) {
            newStr = str.charAt(i) + "," + newStr;
          } else {
            newStr = str.charAt(i) + newStr; // 逐个字符相接起来
          }
          count++;
        }
        str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
        return str;
      }
    },
    // 手机号校验
    judgePhone(val = "") {
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      // 可以为空
      return !val || reg.test(val)
    },
    // 处理时间显示
    handleTime(time) {
      return time ? this.moment(time).format("YYYY-MM-DD HH:mm:ss") : "N / A";
    }
  }
}
export default mixin
