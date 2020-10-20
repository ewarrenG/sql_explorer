import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import {
  Code, Table, TableBody, TableHead, TableRow, TableHeaderCell, TableDataCell, Heading, Paragraph, TextArea, Spinner, Box, SpaceVertical, Flex, CodeBlock, FlexItem, Accordion, AccordionContent,
  AccordionDisclosure
} from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { throttle } from 'lodash';

const FONT_SIZE = 'xsmall'

export function SqlResults() {
  const { results, big_query_metadata_results, running } = useContext(SqlContext)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const targetRef = useRef()

  console.log({ results })
  console.log({ big_query_metadata_results })


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

            {/* //pull out job_id, state, total_bytes_processed, total_bytes_billed, total_slot_ms */}
            {/* <FlexItem>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Metadata</TableHeaderCell>
                  <TableHeaderCell>Value</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableDataCell>job_id</TableDataCell>
                  <TableDataCell>{big_query_metadata_results.data[0].job_id.value}</TableDataCell>
                </TableRow>
                <TableRow>
                  <TableDataCell>state</TableDataCell>
                  <TableDataCell>{big_query_metadata_results.data[0].state.value}</TableDataCell>
                </TableRow>
                <TableRow>
                  <TableDataCell>total_bytes_processed</TableDataCell>
                  <TableDataCell>{big_query_metadata_results.data[0].total_bytes_processed.value}</TableDataCell>
                </TableRow>
                <TableRow>
                  <TableDataCell>total_bytes_billed</TableDataCell>
                  <TableDataCell>{big_query_metadata_results.data[0].total_bytes_billed.value}</TableDataCell>
                </TableRow>
                <TableRow>
                  <TableDataCell>total_slot_ms</TableDataCell>
                  <TableDataCell>{big_query_metadata_results.data[0].total_slot_ms.value}</TableDataCell>
                </TableRow>
              </TableBody>
            </Table>
            </FlexItem>

          <Accordion>
            <AccordionDisclosure>See full response</AccordionDisclosure>
            <AccordionContent>
              <FlexItem height="500px">
                <TextArea
                  style={{ height: '100%', minHeight: "500px" }}
                  value={big_query_metadata_results ? JSON.stringify(big_query_metadata_results.data[0], undefined, 4) : 'Processing...'}>
                </TextArea>
              </FlexItem></AccordionContent>
          </Accordion> * /}


            {/* doesn't work */}
            {/* <FlexItem>
              <Paragraph>
                <CodeBlock>{exampleText}</CodeBlock></Paragraph>
            </FlexItem > */}

            <FlexItem>
              {JSON.stringify(big_query_metadata_results)}
            </FlexItem>

          </Flex > :
          <Flex justifyContent="center" mb="medium">
            <Paragraph>Run query to see metadata from Big Query</Paragraph>
          </Flex>
      }
    </Box >
  )
}