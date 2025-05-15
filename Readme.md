## 从零实现 React16 源码学习

## 项目介绍

这是一个简易版的 React16 实现，旨在帮助理解 React16 的工作原理，特别是 Fiber 架构和 Hooks 机制。项目实现了 React 的核心功能，包括虚拟 DOM、组件渲染、事件处理和状态管理等。

## 使用步骤

### 1. 环境准备

```bash
# 安装依赖
npm install
# 或使用 pnpm
pnpm install
```

### 2. 开发调试

```bash
# 启动开发服务器
npm start
# 或使用 pnpm
pnpm start
```

### 3. 构建项目

```bash
# 构建生产版本
npm run build
# 或使用 pnpm
pnpm run build
```

### 4. 使用示例

在 `src/index.js` 中可以找到使用示例，包括：

- 基础 JSX 渲染
- 函数组件
- Hooks (useState) 的使用

示例代码：

```jsx
import React from '../react';

function Counter() {
  const [state, setState] = React.useState(1);
  const [state2, setState2] = React.useState(2);
  
  function onClickHandle() {
    setState((state) => state + 1);
    setState((state) => state + 2);
  }
  
  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={onClickHandle}>+Add</button>
      <hr />
      <h1>Count2: {state2}</h1>
      <button onClick={() => setState2((state) => state + 1)}>+1</button>
      <button onClick={() => setState2((state) => state + 2)}>+2</button>
    </div>
  );
}

const element = <Counter />;

React.render(element, document.getElementById('root'));
```

## 项目总结

### 使用的技术

1. **核心技术**
   - JavaScript ES6+：使用现代 JavaScript 特性实现 React 核心功能
   - JSX 转换：实现从 JSX 到 JavaScript 对象的转换
   - 虚拟 DOM：使用 JavaScript 对象表示 DOM 结构
   - Fiber 架构：实现可中断的渲染机制
   - Hooks API：实现函数组件的状态管理

2. **构建工具**
   - Webpack：项目打包和构建
   - Babel：JSX 转换和 ES6+ 代码转译

3. **调度技术**
   - requestIdleCallback：浏览器空闲时间调度
   - 时间切片：任务分片执行，避免长任务阻塞

### 系统关键设计说明

1. **Fiber 架构设计**
   - 工作单元：将渲染工作分解为多个小单元（Fiber 节点）
   - 双缓存机制：维护当前显示的 Fiber 树和正在构建的 Fiber 树
   - 可中断渲染：支持暂停、恢复和放弃渲染工作

2. **渲染流程设计**
   - 协调阶段（Reconciliation）：构建 Fiber 树，标记更新
   - 提交阶段（Commit）：将变更应用到 DOM

3. **Hooks 实现**
   - 状态管理：通过闭包保存组件状态
   - 更新队列：批量处理状态更新

4. **事件系统**
   - 事件委托：统一管理事件处理
   - 合成事件：规范化浏览器事件

### 关键流程图

```
1. 渲染流程

┌───────────────┐     ┌───────────────┐     ┌─────────────────┐
│createElement  │────>│render 初始化   │────>│performUnitOfWork│
└───────────────┘     └───────────────┘     └─────────────────┘
                                                     │
                                                     ▼
┌───────────────┐     ┌───────────────┐     ┌──────────────────┐
│commitRoot     │<────│  workLoop     │<────│reconcileChildren │
└───────────────┘     └───────────────┘     └──────────────────┘
         │
         ▼
┌───────────────┐
│ commitWork    │
└───────────────┘


2. Fiber 工作循环

┌───────────────┐
│  requestIdle  │
│   Callback    │
└───────────────┘
         │
         ▼
┌───────────────┐     ┌──────────────────┐
│    workLoop   │────>│performUnitOfWork │
└───────────────┘     └──────────────────┘
         │                      │
         │                      ▼
         │              ┌────────────────┐
         │              │  处理当前Fiber  │
         │              └────────────────┘
         │                      │
         │                      ▼
         │              ┌────────────────┐
         │              │ 返回下一个Fiber  │
         │              └────────────────┘
         ▼
┌─────────────────┐
│   commitRoot    │
└─────────────────┘


3. useState 工作流程

┌──────────────┐     ┌───────────────┐
│useState 调用  │────>│检查旧 Hook     │
└──────────────┘     └───────────────┘
                                │
                                ▼
┌──────────────┐     ┌───────────────┐
│  返回状态和    │<────│  创建新 Hook   │
│  更新函数      │     └──────────────┘
└──────────────┘              │
         ▲                       │
         │                       ▼
         │              ┌───────────────┐
         └──────────────│  setState 调用 │
                        └───────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │  重新渲染组件   │
                        └───────────────┘
```

### 过程中遇到的问题

1. **渲染中断与恢复问题**
   - **问题**：在实现 Fiber 架构时，如何正确保存和恢复渲染状态
   - **解决方案**：使用 wipRoot 和 currentRoot 双缓存机制，保存渲染进度和历史状态
   - **难点**：确保中断后恢复渲染时不会丢失状态或产生不一致

2. **函数组件与类组件处理差异**
   - **问题**：如何在统一的渲染流程中处理不同类型的组件
   - **解决方案**：通过 updateFunctionComponent 和 updateHostComponent 区分处理
   - **难点**：保持组件更新逻辑的一致性，同时处理各自特殊性

3. **Hooks 状态管理**
   - **问题**：如何在函数组件中保存状态，并确保多次渲染之间的状态一致性
   - **解决方案**：使用 wipFiber.hooks 数组和 hookIndex 索引跟踪 hooks 状态
   - **难点**：处理多个 useState 调用，确保状态正确对应

4. **DOM 更新效率问题**
   - **问题**：如何最小化 DOM 操作，提高渲染效率
   - **解决方案**：使用 effectTag 标记节点操作类型（PLACEMENT、UPDATE、DELETION）
   - **难点**：准确识别需要更新的 DOM 节点，避免不必要的操作

5. **事件处理机制**
   - **问题**：如何处理 React 事件与原生 DOM 事件的映射
   - **解决方案**：通过 isEvent 识别事件属性，使用 addEventListener 绑定事件
   - **难点**：确保事件更新时正确移除旧事件监听器，添加新事件监听器

6. **调度优化问题**
   - **问题**：如何平衡渲染任务与用户交互，避免页面卡顿
   - **解决方案**：使用 requestIdleCallback 在浏览器空闲时执行渲染任务
   - **难点**：处理高优先级任务插队，确保用户交互的响应性

7. **组件更新与重渲染**
   - **问题**：如何避免不必要的组件重渲染
   - **解决方案**：通过 reconcileChildren 比较新旧节点，只更新变化的部分
   - **难点**：实现高效的 Diff 算法，准确识别节点变化

8. **异常处理机制**
   - **问题**：渲染过程中的错误如何处理，避免整个应用崩溃
   - **解决方案**：当前实现中缺少完善的错误边界处理
   - **改进方向**：添加 componentDidCatch 或类似机制捕获渲染错误
