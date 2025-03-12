import axios from 'axios'
import { ElMessage, resultProps } from 'element-plus'

const http = axios.create({
  baseURL: 'https:/v3pz.itndedu.com/v3pz',
  timeout: 10000
})

//添加请求拦截器 在请求之前需要做的事，如转换发送字符串类型 给token添加请求头以便服务器验证和响应  设置特定的请求头 
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('pz_token')
  //不需要添加token的api
  //这个请求拦截器的作用是给不在白名单中的请求添加请求头
  const whiteUrl = ['/get/code', '/user/authentication', '/login']
  if (token && !whiteUrl.includes(config.url)) {
    config.headers['x-token'] = token
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器 在请求结束后对返回的响应数据做的事情  如转换返回相应数据为不同字符串类型 对返回成功或错误进行下一步指示
http.interceptors.response.use(function (response) {
  //对接口异常的数据，给用户提示
  const responseData = response.data.data
  if (Array.isArray(responseData)) {

    responseData.forEach(obj => {
      // console.log(obj)
      if (obj.label === "DIDI陪诊") {
        obj.label = "土豆商店"
      }
      if (obj.children)
        obj.children.forEach(act => {
          if (act.label === "陪护管理") {
            act.label = "商品管理"
          }

        })
    });
  }
  if (response.data.data.list != undefined) {
    const responseDataList = response.data.data.list

    if (Array.isArray(responseDataList)) {

      responseDataList.forEach(obj => {
        if (obj.permissionName) {
          let permissionsArray = obj.permissionName.split(',');

          if (permissionsArray.includes("DIDI陪诊")) {
            permissionsArray = permissionsArray.filter(permission => permission !== 'DIDI陪诊');
            permissionsArray.push('土豆商店');
          }
          if (permissionsArray.includes("陪护管理")) {
            permissionsArray = permissionsArray.filter(permission => permission !== 'DIDI陪诊');
            permissionsArray.push("商品管理");
          }
          obj.permissionName = permissionsArray.join(',');
        }
      });
    }
  }
  if (response.data.code === -1) {
    ElMessage.warning(response.data.message)
  }
  if (response.data.code === -2) {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    window.location.href = window.location.origin
  }


  return response;
}, function (error) {
  // 响应错误
  return Promise.reject(error);
});



export default http