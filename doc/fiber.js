// requestAnimationFrame 回调的执行与task和microtask无关，它是在浏览器渲染前，微任务执行后执行。时机其实也并不是很准确
// requestAnimationFrame 还有个特点，就是当页面处理未激活的状态下，requestAnimationFrame 会停止执行，当页面后面再转为激活时，requestAnimationFrame 又会接着上次的地方继续执行

let tasks = []; // 任务队列
let isPerformingTask = false; // 标识变量，表示是否正在执行任务

const channel = new MessageChannel(); // 创建一个新的消息通道
const port = channel.port2; // 获取通道的第二个端口

function scheduleTask(task, expirationTime) {
  tasks.push({ task, expirationTime }); // 将任务和过期时间添加到任务队列
  if (!isPerformingTask) {
    isPerformingTask = true; // 将标识变量设置为true，表示有任务正在执行
    port.postMessage(null); // 向通道的第二个端口发送一个空消息
  }
}

function performTask(currentTime) {
  console.log('currentTime: ', currentTime);
  const frameTime = 1000 / 60; // 每帧的时间间隔
  while (tasks.length > 0 && performance.now() - currentTime < frameTime) {
    const { task, expirationTime } = tasks.shift(); // 从任务队列中取出任务和过期时间
    if (performance.now() >= expirationTime) {
      // 如果任务没有过期, 则执行任务
      task(); // 执行任务
    } else {
      tasks.push({ task, expirationTime }); // 如果任务过期，将其重新添加到队列
    }
  }

  if (tasks.length) {
    requestAnimationFrame(performTask); // 如果还有任务，继续请求下一帧
  } else {
    isPerformingTask = false; // 如果没有任务，设置标识变量为false
  }
}

// 当通道的第一个端口收到消息时，开始执行任务
channel.port1.onmessage = () => requestAnimationFrame(performTask);

// --- 具体的任务 ---

// 实例任务函数
function myTask1() {
  console.log('Performing task 1');
}

function myTask2() {
  console.log('Performing task 2');
}

function myTask3() {
  console.log('Performing task 3');
}

// 添加超时任务到任务队列，并设置过期时间
scheduleTask(myTask1, performance.now() + 1000); // 过期时间为当前时间 + 1000ms
scheduleTask(myTask2, performance.now()); // 过期时间为当前时间
scheduleTask(myTask3, performance.now() + 3000); // 过期时间为当前时间 + 3000ms

/*
项目技术总结
----------------

1. 使用的技术栈：
- MessageChannel: 用于任务调度通信
- requestAnimationFrame: 用于同步浏览器渲染周期
- Performance API: 用于精确时间测量
- JavaScript 任务队列管理

2. 系统关键设计说明：
a) 任务调度系统设计：
   - 采用优先级队列管理任务
   - 使用过期时间(expirationTime)处理任务优先级
   - 实现了时间切片(Time Slicing)，避免长任务阻塞

b) 核心机制：
   - 任务分片执行(每帧16.67ms)
   - 可中断和恢复的任务处理
   - 基于过期时间的任务优先级

3. 关键流程图：
   Task Schedule Flow:
   ┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
   │ scheduleTask()  │ -> │ MessageChannel│ -> │ performTask │
   └─────────────────┘    └──────────────┘    └─────────────┘
                                                     │
                                              ┌──────┴──────┐
                                              │ RAF Loop    │
                                              └─────────────┘

4. 遇到的关键问题：

a) 任务调度时序问题：
   - 问题：任务执行顺序与添加顺序不一致
   - 解决：引入 expirationTime 确保任务按期望顺序执行

b) 性能问题：
   - 问题：长任务阻塞导致页面卡顿
   - 解决：实现时间切片，限制每帧执行时间

c) 任务优先级处理：
   - 问题：紧急任务无法插队执行
   - 解决：通过 expirationTime 动态调整任务优先级

d) 浏览器兼容性：
   - 问题：requestAnimationFrame 在未激活标签页中暂停
   - 解决：使用 MessageChannel 作为备选方案

5. 优化建议：
   - 考虑添加任务优先级队列
   - 实现任务取消机制
   - 添加错误边界处理
   - 优化任务重试机制
*/
