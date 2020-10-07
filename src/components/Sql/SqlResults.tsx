import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Table, TableBody, TableHead, TableRow, TableHeaderCell, TableDataCell, Heading, Paragraph, TextArea, Spinner, Box, SpaceVertical, Flex, CodeBlock, FlexItem } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { throttle } from 'lodash';

const FONT_SIZE = 'xsmall'

export function SqlResults() {
  const { results, big_query_metadata_results, running } = useContext(SqlContext)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
      {results.fields.dimensions.map((f, i) => {
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
    return results.data.map((row, i) => {
      return <TableRow key={`row::${i}`}>
        {results.fields.dimensions.map((f, i) => {
          return <TableDataCell fontSize={FONT_SIZE} key={`cell::${f.name}::${i}`}>
            {row[f.name].value || row[f.name]}
          </TableDataCell>
        })}
      </TableRow>
    })
  }

  return (
    <Box my="xxxlarge" mx="large" height="100%">
      {running ?

        <Flex justifyContent="center" mb="medium" >
          <Spinner></Spinner>
        </Flex> : big_query_metadata_results?.data?.length ?
          <Flex flexDirection="column" height="100%">
            <FlexItem>
              <Heading>Metadata from BigQuery</Heading>
            </FlexItem>

            <FlexItem height="250px">
              <TextArea
                // style={{ overflow: 'hidden', whiteSpace: 'pre', width: '100%', height: '100%', minHeight: '250px' }}
                style={{ height: '100%' }}
                value={big_query_metadata_results ? JSON.stringify(big_query_metadata_results.data[0], undefined, 4) : 'Processing...'}>
              </TextArea>
            </FlexItem>

            {/* doesn't work */}
            {/* <FlexItem>
              <Paragraph>
                <CodeBlock>{exampleText}</CodeBlock></Paragraph>
            </FlexItem > */}

          </Flex > :
          <Flex justifyContent="center" mb="medium">
            <Paragraph>Run query to see metadata from Big Query</Paragraph>
          </Flex>
      }
    </Box >
  )
}