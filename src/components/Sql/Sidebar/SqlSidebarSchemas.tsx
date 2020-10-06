import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Select, Fieldset, SelectMulti } from '@looker/components';
import {SqlContext, ISqlContext} from '../SqlContext'
import { SidebarHeading } from '../../Sidebar/SidebarComponents'
import { sortBy } from 'lodash';


export function SqlSidebarSchemas() {
  const { current_schemas, schemas, setCurrentSchemas } = useContext<ISqlContext>(SqlContext)
  const [searchTerm, setSearchTerm] = React.useState('')


  const handleChange = (v) => {
    setCurrentSchemas(v);
  }

  const handleFilter = (term) => {
    setSearchTerm(term)
  }


  let new_options = useMemo(() => {
    if (schemas && schemas.length) {
      const options = sortBy(schemas.map((s)=>{
        return {label: s.name, value: s.name}
      }), 'value')
      if (searchTerm === '') return options
      return options.filter((option) => {
        return option.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      })
    } else {
      return []
    }
  }, [searchTerm, schemas])

  if (schemas) {
    return (
      <>
        <SidebarHeading>Select Schema</SidebarHeading>
        <Select
          value={current_schemas}
          options={new_options}
          onChange={handleChange}
          isFilterable
          onFilter={handleFilter}
          placeholder="Select schema"
        />
      </>
    ); 
  } else {
    return <></>
  }
}
