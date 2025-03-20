# vue_project
土豆商店 vue实现的管理网站

首屏加载优化
//计算首屏的加载时间
window.onload = function () {
    //性能指标
    console.log(performance.timing.domComplete - performance.timing.navigationStart)
    //改写
    const observer = new PerformanceObserver((list) => {
        console.log(list.getEntries())
        list.getEntries().forEach(entry =>
            console.log(entry.domComplete)
        )
    })

    observer.observe({ entryTypes: ['navigation'] })
}
