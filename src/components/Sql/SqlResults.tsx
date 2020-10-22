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
  const { results, big_query_metadata_results, running, partitioned_results, non_partitioned_results } = useContext(SqlContext)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const targetRef = useRef()

  // console.log({ partitioned_results })
  // console.log({ non_partitioned_results })


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

  const metadataValuesOfInterest = ["job_id", "creation_time", "end_time"];

  return (
    <Box my="xxxlarge" mx="large" height="100%">
      {running ?

        <Flex justifyContent="center" mb="medium" >
          <Spinner></Spinner>
        </Flex> : Object.keys(partitioned_results).length || Object.keys(non_partitioned_results).length ?
          <Flex flexDirection="column" height="100%">
            <FlexItem>
              <Heading>Metadata from BigQuery</Heading>
            </FlexItem>

            {/* //pull out job_id, state, total_bytes_processed, total_bytes_billed, total_slot_ms */}
            {/* $5 per tb of data processed */}
            {/* need to do this calc to show cost */}


            <FlexItem>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Metadata</TableHeaderCell>
                    <TableHeaderCell>Parition Value</TableHeaderCell>
                    <TableHeaderCell>Non-Parition Value</TableHeaderCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableDataCell>INFORMATION_SCHEMA sql</TableDataCell>
                    <TableDataCell>{Object.keys(partitioned_results).length ? partitioned_results.results.sql : "processing"}</TableDataCell>
                    <TableDataCell>{Object.keys(non_partitioned_results).length ? non_partitioned_results.results.sql : "processing"}</TableDataCell>
                  </TableRow>
                  <TableRow>
                    <TableDataCell>INFORMATION_SCHEMA sql</TableDataCell>
                    <TableDataCell>{Object.keys(partitioned_results).length ? partitioned_results.big_query_metadata_results.sql : "processing"}</TableDataCell>
                    <TableDataCell>{Object.keys(non_partitioned_results).length ? non_partitioned_results.big_query_metadata_results.sql : "processing"}</TableDataCell>
                  </TableRow>

                  {metadataValuesOfInterest.map(item => {
                    return (
                      <TableRow>
                        <TableDataCell>{item}</TableDataCell>
                        <TableDataCell>{Object.keys(partitioned_results).length ? partitioned_results.big_query_metadata_results.data[0][item]["value"] : "processing"}</TableDataCell>
                        <TableDataCell>{Object.keys(non_partitioned_results).length ? non_partitioned_results.big_query_metadata_results.data[0][item]["value"] : "processing"}</TableDataCell>
                      </TableRow>

                    )
                  })}



                  <TableRow>
                    <TableDataCell>run_time (seconds)</TableDataCell>
                    <TableDataCell>{Object.keys(partitioned_results).length ?
                      (Math.abs(Date.parse(partitioned_results.big_query_metadata_results.data[0]["end_time"]["value"])
                        - Date.parse(partitioned_results.big_query_metadata_results.data[0]["creation_time"]["value"])) / 1000).toFixed(2) :
                      "processing"
                    }</TableDataCell>
                    <TableDataCell>{Object.keys(non_partitioned_results).length ?
                      (Math.abs(Date.parse(non_partitioned_results.big_query_metadata_results.data[0]["end_time"]["value"])
                        - Date.parse(non_partitioned_results.big_query_metadata_results.data[0]["creation_time"]["value"])) / 1000).toFixed(2) :
                      "processing"
                    }</TableDataCell>
                  </TableRow>
                </TableBody>
              </Table>
            </FlexItem>

          </Flex > :
          <Flex justifyContent="center" mb="medium">
            <Paragraph>Run query to see metadata from Big Query</Paragraph>
          </Flex>
      }
    </Box >
  )
}