// @flow
import React, {useState, useEffect, useCallback} from 'react';

type CounterProps = {

}

const Counter = (props: CounterProps) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const handle = setInterval(() => setValue(v => v + 1), 1000);
    return () => clearInterval(handle);
  }, []);

  return <div style={{display: 'inline-block', color: 'red'}}>{value}</div>
}

const ServerTime = () => {
  const [time, setTime] = useState(Date.now());
  const [status, setStatus] = useState('');
  const getTime = useCallback( () => {
    setStatus('calling');
    fetch('/time')
      .then(x => x.json())
      .then(({time}) => {
        setTime(time);
        setStatus('success');
      })
      .catch(ex => {
        setStatus(`failed\n${ex}`)
      });
  }, []);

  return (
    <div>
      <div>Server Time: {time}</div>
      <button onClick={getTime}>refresh</button>
      <pre>{status}</pre>
    </div>
  )
}

type HelloProps = {
  name: string,
  message: string
}

export const Hello = (props: HelloProps) => {
  return (
    <div>
      <div>Hello {props.name}</div>
      <div>{props.message}</div>
      <div>Value: <Counter /></div>
      <ServerTime />
    </div>
  )
}