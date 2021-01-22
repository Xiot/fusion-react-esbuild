// @flow
import React from 'react';
import {Counter} from './counter';
import { Greeting } from './greeting';
import {ServerTime} from './server-time';

type HelloProps = {
  name: string,
  message: string
}

export const Hello = (props: HelloProps) => {
  return (
    <div>
      <Greeting name={props.name} />
      <div>{props.message}</div>
      <div>Value: <Counter /></div>
      <ServerTime />
    </div>
  )
}