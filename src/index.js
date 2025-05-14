// import React from 'react';

// import React from '../react';

// const element = (
//   <section>
//     <h1 title="foo">
//       <span>Hello</span>
//     </h1>
//     <a href="">测试链接</a>
//   </section>
// );
// console.log('element: ', element);

// // const node = document.createElement(element.type);
// // node['title'] = element.props.title;

// // const text = document.createTextNode('');
// // text['nodeValue'] = element.props.children;

// // node.appendChild(text);

// const container = document.getElementById('root');
// // container.appendChild(node);
// React.render(element, container);

// src/index
// import React from '../react';

// const container = document.getElementById('root');

// const updateValue = (e) => {
//   rerender(e.target.value);
// };

// const rerender = (value) => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   );
//   React.render(element, container);
// };

// rerender('World');

// import React from '../react';

// function App(props) {
//   return <h1>H1,{props.name}!</h1>;
// }

// const element = <App name="foo"></App>;

// React.render(element, document.getElementById('root'));

// src/index
import React from '../react';

function Counter() {
  const [state, setState] = React.useState(1);
  const [state2, setState2] = React.useState(2);
  function onClickHandle(params) {
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
