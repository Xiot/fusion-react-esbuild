// @flow
import React, {useState, useEffect} from 'react';

export type CounterProps = {

}

export const Counter = (props: CounterProps) => {
  const [value, setValue] = useState(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const handle = setInterval(() => setValue(v => v + 1), 1000);
    return () => clearInterval(handle);
  }, [enabled]);

  return (
    <div>
    <button onClick={() => setEnabled(e => !e)}>{enabled ? 'stop' : 'resume'}</button>
    <div style={{
      display: 'inline-block',
      fontSize: '36px',
      color: 'blue'}}>
      {value}
    </div>

    </div>
  );
}