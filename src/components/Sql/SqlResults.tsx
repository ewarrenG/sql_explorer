import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Table, TableBody, TableHead, TableRow, TableHeaderCell, TableDataCell, Heading, Paragraph } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { throttle } from 'lodash';

const FONT_SIZE = 'xsmall'

export function SqlResults() {
  const { results } = useContext(SqlContext)
  const [dimensions, setDimensions] = useState({ width:0, height: 0 });
  const targetRef = useRef()

  useLayoutEffect(() => {
    if (targetRef?.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      })
    }
  }, [targetRef]);

  const HeaderRows = () => {
    
    return <TableRow>
      {results.fields.dimensions.map((f,i)=>{
        return <TableHeaderCell 
          key={`header::${i}`}
          fontSize={FONT_SIZE}
        >
          {f.label_short || f.label || f.name}
        </TableHeaderCell>
      })}
    </TableRow>
  }

  const TableRows = () => {
    return results.data.map((row,i)=>{
      return <TableRow key={`row::${i}`}>
        {results.fields.dimensions.map((f,i)=>{
          return <TableDataCell fontSize={FONT_SIZE} key={`cell::${f.name}::${i}`}>
            { row[f.name].value || row[f.name] }
          </TableDataCell>
        })}
      </TableRow>
    })
  }

  if (results?.data?.length) {
    return (
    <>
      <Heading>Results</Heading>
      <div ref={targetRef}>
        <Table>
          <TableHead>
            <HeaderRows />
          </TableHead>
          <TableBody>
            <TableRows />
          </TableBody>
        </Table>
      </div>
    </>
    ); 
  } else {
    return <>
      <Heading>Results</Heading>
      <Paragraph>No Results</Paragraph>
    </>
  }
}