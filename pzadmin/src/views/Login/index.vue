<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">
          {{ formType ? "返回登录" : "注册账号" }}</el-link
        >
      </div>
      <el-form
        ref="loginFormRef"
        style="max-width: 600px"
        class="demo-ruleForm"
        :rules="rules"
        :model="loginForm"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="'UserFilled'"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="'Lock'"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            :prefix-icon="'Lock'"
            ><template #append>
              <span @click="countDownChange">{{ countDown.validText }}</span>
            </template></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
          >
            {{ formType ? "注册账号" : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
  
  <script setup>
// import { ElMessage } from "element-plus";
import { computed, reactive, ref, toRaw } from "vue";
import {
  getCode,
  useAuthentication,
  login,
  menuPermissions,
} from "../../api/index";
import { useRouter } from "vue-router";
import { useHeaderStore } from "../../stores";

const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;

//表单数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

//切换表单
const formType = ref(false);
const handleChange = () => {
  formType.value = !formType.value;
};

//账号校验规则
const validataUser = (rule, value, callback) => {
  //不能为空
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("手机号格式不对，请输入正确的手机号"));
  }
};
//密码校验
const validataPass = (rule, value, callback) => {
  //不能为空
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const passReg = /^[a-zA-Z0-9_-]{4,16}$/;
    passReg.test(value)
      ? callback()
      : callback(new Error("密码格式不对,需要4到16位字符,请确认格式"));
  }
};

//表单校验
const rules = reactive({
  userName: [{ validator: validataUser, trigger: "blur" }],
  passWord: [{ validator: validataPass, trigger: "blur" }],
});

//发送短信
const countDown = reactive({
  validText: "获取验证码",
  time: 60,
});
let flag = false;
const countDownChange = () => {
  //如果已发送不处理
  //flag为true时禁用
  if (flag) return;
  //判断
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  //倒计时
  const time = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60;
      countDown.validText = `获取验证码`;
      flag = false;
      clearInterval(time);
    } else {
      countDown.time -= 1;
      countDown.validText = `剩余${countDown.time}秒`;
    }
  }, 1000);

  flag = true;
  //在axios中 调用getCode 来传递tel: loginForm.userName这个参数 在得到返回值后 以data作为容器返回
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success("发送成功");
    }
  });
};

const store = useHeaderStore();
const routerList = computed(() => store.routerList);
const router = useRouter();
const loginFormRef = ref();
//表单提交
const submitForm = async (formEl) => {
  //手动触发表单校验
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm, "submit!");
      if (formType.value) {
        useAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("注册成功，请登录");
            formType.value = false;
          }
        });
      } else {
        //登录页面
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("登录成功");

            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "pz_userInfo",
              JSON.stringify(data.data.userInfo)
            );
            menuPermissions().then(({ data }) => {
              store.dynamicMenu(data.data);
              console.log("routerList", routerList.value);
              //toRaw方法可以把响应式数据转换为普通路由数据
              toRaw(routerList.value).forEach(item => {
                console.log(item)
                router.addRoute('main', item);
              });
              router.push("/");
              console.log(router.options.routes)
            });
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

  <style lang="less">
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
.el-input-group__append:hover {
  cursor: pointer;
}
</style>