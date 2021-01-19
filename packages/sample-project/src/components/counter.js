// @flow
import React, {useState, useEffect} from 'react';

export type CounterProps = {

}

export const Counter = (props: CounterProps) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const handle = setInterval(() => setValue(v => v + 1), 1000);
    return () => clearInterval(handle);
  }, []);

  return <div style={{display: 'inline-block', color: 'blue'}}>{value}</div>
}