import React, { useState, useEffect } from 'react';

const FunctionLifeCycle = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('触发 useEffect', count);
    return () => {
      console.log(88)
    }
  });
  return (
    <div>
      <div>当前数据值：{count}</div>
      <button onClick={() => setCount(count + 1)}>更新 count</button>
    </div>
  );
};

export default FunctionLifeCycle;
