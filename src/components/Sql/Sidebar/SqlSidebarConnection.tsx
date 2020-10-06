import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Select, Fieldset } from '@looker/components';
import {SqlContext, ISqlContext} from '../SqlContext'
import { SidebarHeading } from '../../Sidebar/SidebarComponents'
import { sortBy } from 'lodash';


export function SqlSidebarConnection() {
  
  const { connections, current_connection, setCurrentConnection } = useContext<ISqlContext>(SqlContext)

  const handleChange = (v) => {
    setCurrentConnection(v)
  }

  if (connections) {
    const options = sortBy(connections.map((c: any)=>{
      return {value: c.name, label: c.name}
    }), 'value')
    return (
      <>
        <SidebarHeading>Select Connection</SidebarHeading>
        <Select
          value={current_connection}
          options={options}
          onChange={handleChange}
        />
      </>
    ); 
  } else {
    return <></>
  }
}
