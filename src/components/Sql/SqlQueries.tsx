import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import {
  Tabs, TabList, Tab, TabPanels, TabPanel, Box, Grid, Paragraph, Select,
  Popover, Button
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
  const sdk = extensionContext.coreSDK
  const { use_model, setUseModel, current_tables, selected_query, setSelectedQuery, setWrittenSql, written_sql } = useContext(SqlContext)
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

  const dropdownSqlQueries = [{
    label: "Total views",
    value: `SELECT wiki, SUM(views) 
    FROM lookerdata.bq_showcase.wikipedia_v3_partition
    WHERE DATE(datehour) = "${todaysDateSqlFormat}" GROUP BY 1 LIMIT 1000`,
    // lid: 205
  }];


  useEffect(() => {
    if (!selected_query) {
      setSelectedQuery(dropdownSqlQueries[0].value)
      setAppParams({ lid: dropdownSqlQueries[0].lid })
    }
  }, []);

  useEffect(() => {
    // console.log('useEffect selected_query', selected_query)
    setWrittenSql(selected_query ? { "partitioned": selected_query, "non-partitioned": selected_query.replace("partition", "non_partition") } : {})
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
                console.log({ value })
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

  let whereClause = selectedQuery.substring(selectedQuery.indexOf("WHERE"), selectedQuery.indexOf("GROUP BY"))

  if (DateDiff.inDays(selectedDateRange.from, selectedDateRange.to) > 1) {
    let newWhereClause = `WHERE DATE(datehour) BETWEEN "${selectedDateRange.from.toISOString().split('T')[0]}" AND "${selectedDateRange.to.toISOString().split('T')[0]}" `;
    selectedQuery = selectedQuery.replace(whereClause, newWhereClause)

  } else {
    let newWhereClause = `WHERE DATE(datehour) = "${selectedDateRange.to.toISOString().split('T')[0]}" `
    selectedQuery = selectedQuery.replace(whereClause, newWhereClause)
  }
  // setSelectedQuery(selectedQueryCopy)
  return selectedQuery
}