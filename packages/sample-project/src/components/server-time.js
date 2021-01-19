import React, {useState, useCallback, useEffect} from 'react';
import fetch from '../utils/fetch';

export const ServerTime = () => {
  const [time, setTime] = useState(Date.now());
  const [status, setStatus] = useState('');
  const getTime = useCallback( () => {
    setStatus('calling');
    fetch('/time', {headers: {accept: 'application/json'}})
      .then(async x => {
        if (!x.ok) {
          throw await x.json();
        }
        return x.json();
      })
      .then(({time}) => {
        setTime(time);
        setStatus('success');
      })
      .catch(ex => {
        setStatus(`failed\n${ex.message}`)
      });
  }, []);

  useEffect(() => {
    console.log('calling server');
    getTime();
  }, []);

  return (
    <div>
      <div>Server Time: {time}</div>
      <button onClick={getTime}>refresh</button>
      <pre>{status}</pre>
    </div>
  )
}