<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
import { auth } from "../wenkong/api";
import { getQueryString, trusteeTeam } from "utils";
import Store from "../wenkong/store";

export default {
  created() {
    this.authMethod();
  },
  methods: {
    authMethod() {
      auth(Store.fetch("customerId"), getQueryString("code"))
        .then(res => {
          // 拿到微信openid
          Store.save("Ticket", res.data);
          // 如果参数中有teamId，说明用户是扫设备组的托管二维码进来的，那么调用托管组接口
          if (getQueryString("teamId")) {
            this.trusteeTeam(getQueryString("teamId"), res.data);
          }
          this.$router.push({
            path: "/list",
            query: {
              customerId: Store.fetch("customerId")
            }
          });
        })
        .catch(err => {
          console.error("auth-error-->", err);
        });
    },
    /**
     * teamId: 设备组id
     * openId: 用户关注公众号后产生的openId
     */
    trusteeTeam(teamId, openId) {
      trusteeTeam({
        teamId,
        openId
      }).then(res => {
        console.log("设备组托管成功！");
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
</style>

