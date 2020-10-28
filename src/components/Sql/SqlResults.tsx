import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import {
  Code, Table, TableBody, TableHead, TableRow, TableHeaderCell, TableDataCell, Heading, Paragraph, TextArea, Spinner, Box, SpaceVertical, Flex, CodeBlock, FlexItem, Accordion, AccordionContent,
  AccordionDisclosure, Tabs, TabList, Tab, TabPanels, TabPanel
} from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { throttle } from 'lodash';

const FONT_SIZE = 'xsmall'

export function SqlResults() {
  const {
    // results, big_query_metadata_results, 
    running, partitioned_results, non_partitioned_results } = useContext(SqlContext)
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

  const ResultsHeaderRows = () => {
    return <TableRow>
      {partitioned_results.results.fields.dimensions.map((f, i) => {
        return <TableHeaderCell
          key={`header::${i}`}
          fontSize={FONT_SIZE}
        >
          {f.label_short || f.label || f.name}
        </TableHeaderCell>
      })}
    </TableRow>
  }

  const ResultsTableRows = () => {
    return partitioned_results.results.data.map((row, i) => {
      return <TableRow key={`row::${i}`}>
        {partitioned_results.results.fields.dimensions.map((f, i) => {
          return <TableDataCell fontSize={FONT_SIZE} key={`cell::${f.name}::${i}`}>
            {row[f.name].value}
          </TableDataCell>
        })}
      </TableRow>
    })
  }

  const MetadataResultsHelper = (resultSet, item, computeDiff) => {
    // console.log('MetadataResultsHelper')
    // console.log({ resultSet })
    // console.log({ item })

    let returnValue = ''
    if (Object.keys(resultSet).length) {
      returnValue = resultSet.big_query_metadata_results.data[0][item]["value"]
    }

    if (computeDiff) {
      returnValue = (partitioned_results.big_query_metadata_results.data[0][item]["value"] - non_partitioned_results.big_query_metadata_results.data[0][item]["value"])
    }

    return returnValue;
  }

  const metadataValuesOfInterest = ["job_id", "creation_time", "end_time", "total_bytes_processed", "total_slot_ms"];

  return (
    <Box my="xxxlarge" mx="large" height="100%">
      {running ?

        <Flex justifyContent="center" mb="medium" >
          <Spinner></Spinner>
        </Flex> : Object.keys(partitioned_results).length || Object.keys(non_partitioned_results).length ?

          // start tabs here
          <Tabs>
            <TabList>
              <Tab>BigQuery Results</Tab>
              <Tab> BigQuery Metadata Results</Tab>
            </TabList>


            <TabPanels>
              <TabPanel>
                {/* <Heading>Results from BigQuery</Heading> */}
                {/* {JSON.stringify(partitioned_results.results)} */}
                <div ref={targetRef}>
                  <Table>
                    <TableHead>
                      <ResultsHeaderRows />
                    </TableHead>
                    <TableBody>
                      <ResultsTableRows />
                    </TableBody>
                  </Table>
                </div>
              </TabPanel>


              <TabPanel>
                <Flex flexDirection="column" height="100%">
                  <FlexItem>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Metadata</TableHeaderCell>
                          <TableHeaderCell>Partition Value</TableHeaderCell>
                          <TableHeaderCell>Non-Partition Value</TableHeaderCell>
                          <TableHeaderCell>Difference</TableHeaderCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>

                        {metadataValuesOfInterest.map((item, index) => {
                          return (
                            <>
                              <TableRow>
                                <TableDataCell>{item}</TableDataCell>
                                <TableDataCell>
                                  {MetadataResultsHelper(partitioned_results, item)}
                                </TableDataCell>
                                <TableDataCell>
                                  {MetadataResultsHelper(non_partitioned_results, item)}
                                </TableDataCell>
                                {/* diff column, need additional logic */}
                                <TableDataCell color="green">
                                  {MetadataResultsHelper(partitioned_results,
                                    item,
                                    (non_partitioned_results && non_partitioned_results.big_query_metadata_results && typeof non_partitioned_results.big_query_metadata_results.data[0][item]["value"] === 'number')
                                  )}
                                </TableDataCell>
                              </TableRow>

                              {/* let this be for now */}
                              {
                                item === "end_time" ?

                                  <TableRow>
                                    <TableDataCell>run_time (seconds)</TableDataCell>
                                    <TableDataCell>{Object.keys(partitioned_results).length ?
                                      ((Date.parse(partitioned_results.big_query_metadata_results.data[0]["end_time"]["value"])
                                        - Date.parse(partitioned_results.big_query_metadata_results.data[0]["creation_time"]["value"])) / 1000).toFixed(2) :
                                      ''
                                    }</TableDataCell>
                                    <TableDataCell>{Object.keys(non_partitioned_results).length ?
                                      ((Date.parse(non_partitioned_results.big_query_metadata_results.data[0]["end_time"]["value"])
                                        - Date.parse(non_partitioned_results.big_query_metadata_results.data[0]["creation_time"]["value"])) / 1000).toFixed(2) :
                                      ''
                                    }</TableDataCell>
                                    <TableDataCell color="green">
                                      {
                                        Object.keys(partitioned_results).length && Object.keys(non_partitioned_results).length ?
                                          ((Date.parse(partitioned_results.big_query_metadata_results.data[0]["end_time"]["value"])
                                            - Date.parse(partitioned_results.big_query_metadata_results.data[0]["creation_time"]["value"])) / 1000).toFixed(2) -
                                          ((Date.parse(non_partitioned_results.big_query_metadata_results.data[0]["end_time"]["value"])
                                            - Date.parse(non_partitioned_results.big_query_metadata_results.data[0]["creation_time"]["value"])) / 1000).toFixed(2)
                                          :
                                          ''
                                      }
                                    </TableDataCell>
                                  </TableRow> : ''
                              }
                            </>
                          )
                        })}



                      </TableBody>
                    </Table>
                  </FlexItem>

                </Flex >
              </TabPanel>
            </TabPanels>
          </Tabs> :
          <Flex justifyContent="center" mb="medium">
            <Paragraph>Run query to see metadata from Big Query</Paragraph>
          </Flex>
      }
    </Box >
  )
}