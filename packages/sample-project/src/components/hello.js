// @flow
import React from 'react';
import {Counter} from './counter';
import {ServerTime} from './server-time';

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