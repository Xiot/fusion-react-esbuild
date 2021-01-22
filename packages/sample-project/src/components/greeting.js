// @flow
import React from 'react';
import {Translate} from 'fusion-plugin-i18n-react';

type GreeingProps = {
  name: string,
};

export const Greeting = (props: GreeingProps) => {
  return <Translate id="greeting" data={{name: props.name}} />
}