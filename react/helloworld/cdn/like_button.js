'use strict';

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return React.createElement('div', {}, 'HELLO WORLD');
//   }
// }

function App() {
  return React.createElement('div', {}, ['Hello', React.createElement('span', {}, 'World')]);
}

const domContainer = document.querySelector('#like_button_container');

ReactDOM.render(React.createElement(App), domContainer);
