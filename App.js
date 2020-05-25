import * as React from 'react';
import HomeStack from './routes/homeStack';
import {decode, encode} from 'base-64';


export default function App() {
  if (!global.btoa) {  global.btoa = encode }

  if (!global.atob) { global.atob = decode } 


  return (
      <HomeStack />
  );
}