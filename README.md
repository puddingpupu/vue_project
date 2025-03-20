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
这段代码涉及到几个关键的Web性能API，主要用于测量和分析网页加载性能。下面是对这些API的详细分析：

window.onload:
window.onload事件在网页（包括所有的依赖资源如样式表、图片和脚本文件）完全加载后触发。这是确保页面所有内容都加载完成的一个常用事件。
performance.timing:
performance.timing是一个包含网页加载过程中不同时间点的对象。通过这个对象，你可以获取到一系列与页面加载相关的时间戳，比如导航开始时间（navigationStart）、响应开始时间（responseStart）、DOM加载完成时间（domComplete）等。
在你的代码中，performance.timing.domComplete - performance.timing.navigationStart计算的是从导航开始到DOM加载完成的总时间，这通常被用来衡量首屏加载时间。
PerformanceObserver:
PerformanceObserver是一个Web API，允许你注册一个回调函数来监听性能条目（performance entries）的生成。这些条目包含了关于特定性能事件的详细信息，比如资源加载时间、长任务等。
在你的代码中，创建了一个PerformanceObserver实例，并传入一个回调函数。这个回调函数会在有性能条目生成时被调用。
observe({ entryTypes: ['navigation'] }):
observe方法是PerformanceObserver实例的方法，用于开始监听特定类型的性能条目。在你的代码中，它被配置为监听entryTypes: ['navigation']，这意味着它会监听与页面导航相关的性能条目。
导航条目（Navigation Entry）提供了关于页面导航的整体性能指标，比如页面加载时间、重定向次数等。
list.getEntries()和entry.domComplete:
list.getEntries()方法返回一个包含所有被观察的性能条目的数组。在你的代码中，这个数组被打印到控制台。
然而，entry.domComplete这一行是有问题的。entry对象可能并不直接包含domComplete属性。domComplete是performance.timing对象的一个属性，而不是PerformanceEntry对象的属性。如果你想要访问与domComplete相对应的时间戳，你应该直接从performance.timing获取，或者在处理navigation条目时，找到与之对应的属性（如果有的话，但标准navigation条目并不直接包含domComplete这样的属性）。
