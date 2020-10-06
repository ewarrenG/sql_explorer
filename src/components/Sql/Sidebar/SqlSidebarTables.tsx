import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Select, Fieldset, Table, TableRow, TableDataCell, TableBody, SelectMulti } from '@looker/components';
import {SqlContext, ISqlContext} from '../SqlContext'
import { SidebarHeading } from '../../Sidebar/SidebarComponents'
import { sortBy } from 'lodash';


export function SqlSidebarTables() {
  const { tables, setCurrentTable, current_tables } = useContext<ISqlContext>(SqlContext)
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleChange = (e) => {
    setCurrentTable(e)
  }

  const handleFilter = (term) => {
    setSearchTerm(term)
  }

  let new_options = useMemo(() => {
    if (tables && tables.length) {
      const options = sortBy(tables.map((s)=>{
        return {label: s.name, value: s.name}
      }), 'value')
      if (searchTerm === '') return options
      return options.filter((option) => {
        return option.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      })
    } else {
      return []
    }
  }, [searchTerm, tables])

  if (tables && tables.length) {
    return (
      <>
        <SidebarHeading>Select Table</SidebarHeading>
        <Select
          value={current_tables}
          options={new_options}
          onChange={handleChange}
          isFilterable
          onFilter={handleFilter}
          placeholder="Select table"
        />
      </>
    ); 
  } else {
    return <></>
  }
}
