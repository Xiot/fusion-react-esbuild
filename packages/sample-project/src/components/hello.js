// @flow
import React, { useEffect, useState } from 'react';
import {Counter} from './counter';
import { Greeting } from './greeting';
import {ServerTime} from './server-time';

type HelloProps = {
  name: string,
  message: string
}

export const Hello = (props: HelloProps) => {

  const [value, setValue] = useState(0);

  useEffect(() => {
    (async () => {
      const {value} = await import('./dynamic');
      setValue(value);
    })();
  },[])

  return (
    <div>
      <Greeting name={props.name} />
      <div>{props.message}</div>
      <div>Value: <Counter /></div>
      <ServerTime />
    </div>
  )
}