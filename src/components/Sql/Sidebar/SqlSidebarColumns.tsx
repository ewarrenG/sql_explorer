import React, { useState, useEffect, useContext } from 'react';
import { Select, Fieldset, Table, TableRow, TableDataCell, TableBody, Tree, TreeItem, Box } from '@looker/components';
import {SqlContext, ISqlContext} from '../SqlContext'
import { SidebarHeading } from '../../Sidebar/SidebarComponents'
import { sortBy, uniq, filter } from 'lodash';
import styled from 'styled-components'


export function SqlSidebarColumns() {
  const { current_columns, current_schemas, current_tables } = useContext<ISqlContext>(SqlContext)


  // const handleChange = (v) => {
  //   setCurrentTable(v);
  // }


  const ready = (current_columns?.length && current_schemas?.length && current_tables?.length)
  
  if (ready) {
    const Columns = ({columns}) => {
      return columns.map((c,i)=>{
        return <TableRow key={`${i}::${c.name}`}>
          <TableDataCell >{c.name}</TableDataCell>
        </TableRow>
      })
    }
    // const TableColumns = ({schema_tables}) => {
    //   return schema_tables.map(st=>{
    //     return <Tree key={`${st.schema}::${st.name}`} label={st.name}>
    //       <Columns columns={st.columns} tag={`${st.schema}::${st.name}`} />
    //     </Tree>
    //   })
    // }
    // const SchemaTablesColumns = () => {
    //   const STC = current_schemas.map(s=>{
    //     const schema_tables = filter(current_columns, {schema: s})
    //     return <Tree key={s} label={s}>
    //       <TableColumns {...{schema_tables}} />
    //     </Tree>
    //   })
    //   return <>{STC}</>
    // } 

    return (
        <OverflowYBox>
          <Table>
            <TableBody>
                
                <Columns columns={current_columns[0].columns} />
              
            </TableBody>
          </Table>
        </OverflowYBox>
    );
  } else {
    return <></>
  }
}

const OverflowYBox = styled(Box)`
overflow-y: scroll;
height: 75vh;
`