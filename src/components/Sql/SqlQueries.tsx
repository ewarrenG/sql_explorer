import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Grid, Paragraph, Select } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { SqlSidebarConnection } from './Sidebar/SqlSidebarConnection'
import { SqlSidebarSchemas } from './Sidebar/SqlSidebarSchemas'
import { SqlSidebarTables } from './Sidebar/SqlSidebarTables';
import { SqlSidebarColumns } from './Sidebar/SqlSidebarColumns';
import { SqlSidebarRun } from './Sidebar/SqlSidebarRun';
import { find } from 'lodash';
import AppContext from '../../AppContext';

export function SqlQueries() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { use_model, setUseModel, current_tables, selected_query, setSelectedQuery, setWrittenSql, setResults, setBigQueryMetadataResults } = useContext(SqlContext)
  const { setAppParams } = useContext(AppContext)


  /***
   * Proposed solution: 
   * get looks from folder dynamically
   * have title, id, etc. 
   * when 
   */

  const dropdownSqlQueries = [{
    value: `SELECT order_items.status  AS order_items_status, 
    COUNT(*) AS order_items_count 
    FROM looker-private-demo.ecomm.order_items  AS order_items 
    WHERE (((order_items.created_at ) >= ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY)), 'America/Los_Angeles'))) 
    AND (order_items.created_at ) < ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY), INTERVAL 30 DAY)), 'America/Los_Angeles'))))) 
    GROUP BY 1 
    ORDER BY 2 DESC 
    LIMIT 500`,
    label: "Count of Orders by Status",
    lid: 205
  }, {
    value: `SELECT CAST(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', order_items.created_at , 'America/Los_Angeles')) AS DATE) AS order_items_created_date, 
    COALESCE(SUM((order_items.sale_price - inventory_items.cost) ), 0) AS order_items_total_gross_margin, 
    COALESCE(SUM(order_items.sale_price ), 0) AS order_items_total_sale_price 
    FROM looker-private-demo.ecomm.order_items  AS order_items 
    FULL OUTER JOIN looker-private-demo.ecomm.inventory_items  AS inventory_items 
    ON inventory_items.id = order_items.inventory_item_id 
    LEFT JOIN looker-private-demo.ecomm.products  AS products 
    ON products.id = inventory_items.product_id 
    WHERE ((((order_items.created_at ) >= ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY)), 'America/Los_Angeles'))) 
    AND (order_items.created_at ) < ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY), INTERVAL 30 DAY)), 'America/Los_Angeles')))))) 
    AND (((TRIM(products.brand)) = 'Levi\\'s')) GROUP BY 1 ORDER BY 1 DESC LIMIT 500`,
    label: "Gross Margin vs Sales Price",
    lid: 204
  }, {
    value: `SELECT TRIM(products.brand)  AS products_brand, 
    TRIM(products.department)  AS products_department, 
    COALESCE(SUM((order_items.sale_price - inventory_items.cost) ), 0) AS order_items_total_gross_margin 
    FROM looker-private-demo.ecomm.order_items  AS order_items 
    FULL OUTER JOIN looker-private-demo.ecomm.inventory_items  AS inventory_items 
    ON inventory_items.id = order_items.inventory_item_id 
    LEFT JOIN looker-private-demo.ecomm.products  AS products 
    ON products.id = inventory_items.product_id 
    WHERE (((order_items.created_at ) >= ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY)), 'America/Los_Angeles'))) 
    AND (order_items.created_at ) < ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY), INTERVAL 30 DAY)), 'America/Los_Angeles'))))) 
    GROUP BY 1,2 
    ORDER BY 3 DESC 
    LIMIT 5`,
    label: "Top 10 Ordered Items",
    lid: 207
  }, {
    value: `SELECT TRIM(products.name)  AS products_item_name, 
    COUNT(DISTINCT order_items.order_id ) AS order_items_order_count 
    FROM looker-private-demo.ecomm.order_items  AS order_items 
    FULL OUTER JOIN looker-private-demo.ecomm.inventory_items  AS inventory_items 
    ON inventory_items.id = order_items.inventory_item_id 
    LEFT JOIN looker-private-demo.ecomm.products  AS products 
    ON products.id = inventory_items.product_id 
    WHERE (((order_items.created_at ) >= ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY)), 'America/Los_Angeles'))) 
    AND (order_items.created_at ) < ((TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', TIMESTAMP_ADD(TIMESTAMP_ADD(TIMESTAMP_TRUNC(TIMESTAMP(FORMAT_TIMESTAMP('%F %H:%M:%E*S', CURRENT_TIMESTAMP(), 'America/Los_Angeles')), DAY), INTERVAL -29 DAY), INTERVAL 30 DAY)), 'America/Los_Angeles'))))) 
    GROUP BY 1 
    ORDER BY 2 DESC 
    LIMIT 20`,
    label: "Top by Grossing Brands",
    lid: 206
  }
  ];


  useEffect(() => {
    if (!selected_query) {
      setSelectedQuery(dropdownSqlQueries[0].value)
      setSelectedQuery(dropdownSqlQueries[0].value)
      setAppParams({ lid: dropdownSqlQueries[0].lid })
    }
  }, []);

  useEffect(() => {
    setWrittenSql(selected_query ? selected_query : '')
    setResults('')
    setBigQueryMetadataResults('')
  }, [selected_query])


  return (
    <Box my="large" mx="large" height="100%">
      <Select
        options={dropdownSqlQueries}
        onChange={(value) => {
          let SqlQueryObj = find(dropdownSqlQueries, { value: value })
          setSelectedQuery(SqlQueryObj.value)
          setAppParams({ lid: SqlQueryObj.lid })
        }}
        style={{ zIndex: '100000' }}
      /></Box>
  );
}