import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import {
  Tabs, TabList, Tab, TabPanels, TabPanel, Box, Grid, Paragraph, Select,
  Popover, Button, Table, TableBody, TableHead, TableRow, TableHeaderCell, TableDataCell,
} from '@looker/components';

import { InputDateRange } from '@looker/components/lib/InputDateRange'
import { DateFormat } from '@looker/components/lib/DateFormat'

import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { SqlSidebarConnection } from './Sidebar/SqlSidebarConnection'
import { SqlSidebarSchemas } from './Sidebar/SqlSidebarSchemas'
import { SqlSidebarTables } from './Sidebar/SqlSidebarTables';
import { SqlSidebarColumns } from './Sidebar/SqlSidebarColumns';
import { SqlSidebarRun } from './Sidebar/SqlSidebarRun';
import { find } from 'lodash';
import AppContext from '../../AppContext';
/**
 * to do 
 * implement min max logic to date range input
 */
export function SqlQueries() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK
  const { use_model, setUseModel, current_tables, selected_query, setSelectedQuery, setWrittenSql, written_sql, current_connection, cost_estimates, setCostEstimates } = useContext(SqlContext)
  const { setAppParams } = useContext(AppContext)

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(),
    to: new Date(),
  })

  const handleDateRateChange = (dateRange) => {
    setDateRage(dateRange)
  }

  const todaysDate = new Date()
  const todaysDateSqlFormat = todaysDate.toISOString().split('T')[0];

  const dropdownSqlQueries = [
    /*{
    label: "Total views",
    value: `SELECT wiki, SUM(views) 
    FROM lookerdata.bq_showcase.wikipedia_v3_partition
    WHERE DATE(datehour) = "${todaysDateSqlFormat}" GROUP BY 1 LIMIT 1000`,
    // lid: 205
  },*/
    {
      label: "COVID Wikis",
      value: `
      -- raw sql results do not include filled-in values for 'wikipedia_v3_partition.datehour_hour_of_day'


SELECT
	EXTRACT(HOUR FROM TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', wikipedia_v3_partition.datehour , 'America/Los_Angeles'))) AS wikipedia_v3_partition_datehour_hour_of_day,
	COALESCE(SUM(wikipedia_v3_partition.views ), 0) AS wikipedia_v3_partition_total_views,
	AVG(wikipedia_v3_partition.views ) AS wikipedia_v3_partition_avg_views
FROM lookerdata.bq_showcase.wikipedia_v3_partition
     AS wikipedia_v3_partition

WHERE (wikipedia_v3_partition.datehour = "${todaysDateSqlFormat}") 
AND (wikipedia_v3_partition.title LIKE '%covid%')
GROUP BY 1
ORDER BY 1
LIMIT 500`,
      lid: 229
    }, {
      label: "Kobe Bryant Avg Views",
      value: `
      -- raw sql results do not include filled-in values for 'wikipedia_v3_partition.datehour_month'


SELECT
	FORMAT_TIMESTAMP('%Y-%m', TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', wikipedia_v3_partition.datehour , 'America/Los_Angeles'))) AS wikipedia_v3_partition_datehour_month,
	AVG(wikipedia_v3_partition.views ) AS wikipedia_v3_partition_avg_views
FROM lookerdata.bq_showcase.wikipedia_v3_partition
     AS wikipedia_v3_partition

WHERE (wikipedia_v3_partition.datehour = "${todaysDateSqlFormat}")  
AND (wikipedia_v3_partition.title = 'Kobe_Bryant')
GROUP BY 1
ORDER BY 1 DESC
LIMIT 500`,
      lid: 228
    }
  ];

  useEffect(() => {
    if (!selected_query) {
      setSelectedQuery(dropdownSqlQueries[0].value)
      setAppParams({ lid: dropdownSqlQueries[0].lid })
    }
  }, []);

  useEffect(() => {
    // console.log('useEffect selected_query', selected_query)
    setCostEstimates({})
    setWrittenSql(selected_query ? { "partitioned": selected_query, "non-partitioned": selected_query.replaceAll("partition", "non_partition") } : {})
  }, [selected_query])

  useEffect(() => {
    // console.log('useEffect written_sql', written_sql)
  }, [written_sql])

  useEffect(() => {
    // console.log('useEffect selectedDateRange', selectedDateRange)
    if (selected_query) {
      let modifiedQuery = queryDateRangeHelper(selected_query, selectedDateRange);
      setSelectedQuery(modifiedQuery);
    }
  }, [selectedDateRange])


  return (
    <Grid columns={2}>
      <Select
        options={dropdownSqlQueries}
        onChange={(value) => {
          let SqlQueryObj = find(dropdownSqlQueries, { value: value })
          let modifiedQuery = queryDateRangeHelper(SqlQueryObj.value, selectedDateRange);
          setSelectedQuery(modifiedQuery);
          setSelectedQuery(modifiedQuery)
          setAppParams({ lid: SqlQueryObj.lid })
        }}
      />
      <Popover
        content={
          <Box p="small">
            <InputDateRange
              defaultValue={selectedDateRange}
              onChange={(value) => {
                /**
                 * Need to add logic to prevent date change here
                 */
                setSelectedDateRange(value)
              }
              }
            />
          </Box >
        }
      >
        <Button>
          <DateFormat>{selectedDateRange.from}</DateFormat> &mdash;
      <DateFormat>{selectedDateRange.to}</DateFormat>
        </Button>
      </Popover >
      {Object.keys(cost_estimates).length ?
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Estimate</TableHeaderCell>
              <TableHeaderCell>Partition Value</TableHeaderCell>
              <TableHeaderCell>Non Partition Value</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableDataCell>Message</TableDataCell>
              <TableDataCell>{cost_estimates["partitioned"].message}</TableDataCell>
              <TableDataCell>{cost_estimates["non-partitioned"].message}</TableDataCell>
            </TableRow>
            <TableRow>
              <TableDataCell>Cost</TableDataCell>
              <TableDataCell>{cost_estimates["partitioned"].cost}</TableDataCell>
              <TableDataCell>{cost_estimates["non-partitioned"].cost}</TableDataCell>
            </TableRow>
          </TableBody>
        </Table>
        : ''}
    </Grid >

  );
}

const DateDiff = {

  inDays: function (d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000));
  },

  inWeeks: function (d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
  },

  inMonths: function (d1, d2) {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();

    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  },

  inYears: function (d1, d2) {
    return d2.getFullYear() - d1.getFullYear();
  }
}

function queryDateRangeHelper(selectedQuery, selectedDateRange) {
  let whereClause = selectedQuery.substring(selectedQuery.indexOf("WHERE"), selectedQuery.indexOf("AND (wikipedia_v3_partition"))
  if (DateDiff.inDays(selectedDateRange.from, selectedDateRange.to) > 1) {
    let newWhereClause = `WHERE DATE(wikipedia_v3_partition.datehour) BETWEEN "${selectedDateRange.from.toISOString().split('T')[0]}" AND "${selectedDateRange.to.toISOString().split('T')[0]}" `;
    selectedQuery = selectedQuery.replace(whereClause, newWhereClause)

  } else {
    let newWhereClause = `WHERE DATE(wikipedia_v3_partition.datehour) = "${selectedDateRange.to.toISOString().split('T')[0]}" `
    selectedQuery = selectedQuery.replace(whereClause, newWhereClause)
  }
  return selectedQuery
}
