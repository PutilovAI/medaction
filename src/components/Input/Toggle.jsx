import React from 'react';
import Toggle from 'react-toggle';
import './toggle.css';

const ToggleItem = data => (<Toggle
  defaultChecked={data.defaultChecked}
  onChange={data.onChange}
  icons={false}
  id={data.id}
/>);

export default ToggleItem;
