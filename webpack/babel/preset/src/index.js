import 'core-js/es/promise';
import 'core-js/es/array';

// import 'core-js';

function test() {
  return new Promise((resolve, reject) => {
    const arr = [1, 2, 3, 4];
    return arr.map((item) => item * 2).includes(8);
  });
}
test().then((data) => {
  console.log(data);
});
