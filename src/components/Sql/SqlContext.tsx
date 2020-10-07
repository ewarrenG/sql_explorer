import React, { useState, useEffect, useContext } from 'react';
import { apiCall, exploreEmbedPath, getFields } from '../../helpers';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../AppContext';
import { sortBy, find, filter } from 'lodash';

// this isn't going to work, need to do server side?
// const { BigQuery } = require('@google-cloud/bigquery');

// const options = {
//   keyFilename: `../../looker-private-demo-4a0ed0ad09a2.json`,
//   projectId: `${process.env.BIG_QUERY_PROJECT_ID}`,
// };

// console.log('options', options)
// console.log('options.keyFilename', options.keyFilename)

// const bigquery = new BigQuery(options);

export const SqlContext = React.createContext<any>(null);

export interface ISqlContext {
  connections: any | undefined,
  models: any | undefined,
  current_connection: string | undefined,
  setCurrentConnection: any,
  current_model: string | undefined,
  setCurrentModel: any,
  current_schemas: any,
  setCurrentSchemas: any,
  tables: any,
  setCurrentTable: any,
  written_sql: string | undefined,
  setWrittenSql: any,
  use_model: boolean,
  setUseModel: any,
  update_prepared: boolean,
  setUpdatePrepared: any,
  schemas: any,
  setSchemas: any,
  current_tables: any,
  current_columns: any,
  handleRun: any,
  running: boolean,
  setRunning: any,
  results: any, setResults: any,
  selected_query: any, setSelectedQuery: any,
  big_query_metadata_results: any, setBigQueryMetadataResults: any
  initial_query_id: any, setInitialQueryId: any
}

export const SqlContextProvider = ({ children }: any) => {
  const [connections, setConnections] = useState()
  const [written_sql, setWrittenSql] = useState() //need
  const [running, setRunning] = useState(false)
  const [models, setModels] = useState()
  const [current_connection, setCurrentConnection] = useState('looker-private-demo') //need
  const [current_model, setCurrentModel] = useState()
  const [use_model, setUseModel] = useState(false)
  const [update_prepared, setUpdatePrepared] = useState(true)
  const [schemas, setSchemas] = useState()
  const [current_schemas, setCurrentSchemas] = useState('ecomm')
  const [tables, setTables] = useState()
  const [current_tables, setCurrentTable] = useState('order_items')
  const [columns, setColumns] = useState()
  const [current_columns, setCurrentColumns] = useState()
  const [table_limit, setTableLimit] = useState(500)
  const [results, setResults] = useState()
  const [selected_query, setSelectedQuery] = useState()
  const [big_query_metadata_results, setBigQueryMetadataResults] = useState()
  const [initial_query_id, setInitialQueryId] = useState()

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  const { sql, setAppParams, sql_options, qid, toggle, setQidEmbedPath } = useContext(AppContext);

  const getQid = (slug: string, query_json_detail: any) => {

    let { selected, dynamic_fields } = getFields(query_json_detail);

    const {
      keep_fields,
      keep_sorts,
      keep_filters,
      keep_vis,
      keep_dynamic_fields
    } = sql_options

    var new_query: any = {
      model: `sql__${slug}`,
      view: `sql_runner_query`,
      fields: selected,
      dynamic_fields: JSON.stringify(dynamic_fields || [])
    };

    var current_query;

    return new Promise(async (resolve, reject) => {

      if (qid) {
        // get current qid to layer on old configs
        current_query = await sdk.ok(sdk.query_for_slug(qid))
      } else {
        current_query = new_query
      }

      if (qid) {
        // get current qid to layer on old configs
        current_query = sdk.ok(sdk.query_for_slug(qid))

        if (keep_fields) {
          new_query['fields'] = (current_query.fields && current_query.fields.length) ? current_query.fields : selected;
          new_query['pivots'] = current_query.pivots;
        }
        if (keep_sorts) { new_query['sorts'] = current_query.sorts }
        if (keep_filters) { new_query['filters'] = current_query.filters }
        if (keep_vis) { new_query['vis_config'] = current_query.vis_config }
        if (keep_dynamic_fields) {
          new_query['dynamic_fields'] = current_query.dynamic_fields || ""
        }
      }

      const q = await sdk.ok(sdk.create_query(new_query, 'client_id'))
      resolve(q.client_id)
    })

  }

  useEffect(() => {
    getConnections();
    getModels();
  }, [])

  // useEffect(() => {
  //   if (sql) {
  //     getSql();
  //   }
  // }, [sql])

  useEffect(() => {
    if (current_connection) {
      getSchemas();
    } else {
      setSchemas(undefined)
    }
  }, [current_connection])

  useEffect(() => {
    setCurrentTable(undefined)
    setCurrentColumns(undefined)
    if (current_schemas && current_schemas.length) {
      getTables();
    }
  }, [current_schemas])

  useEffect(() => {
    if (current_tables?.length && columns?.length) {
      getColumns();
    }
  }, [current_tables, columns])

  // useEffect(() => {
  //   console.log('big_query_metadata_results', big_query_metadata_results)
  // }, [big_query_metadata_results])
  useEffect(() => {
    if (initial_query_id) {
      handleConnectionRun()
    }
  }, [initial_query_id])

  const getSql = async () => {
    const s = await sdk.ok(sdk.sql_query(sql))
    setWrittenSql(s.sql)
    setCurrentConnection(s.connection.name)
  }

  const getModels = async () => {
    const m = await sdk.ok(sdk.all_lookml_models()) // "name,label"
    setModels(m)
  }

  const getConnections = async () => {
    const conns = await sdk.ok(sdk.all_connections());
    setConnections(conns)
  }

  const getSchemas = async () => {
    const s = await apiCall('GET', `/api/internal/connections/${current_connection}/schemas/tables`, `limit=${table_limit}`)
    setSchemas(s)
  }

  const getTables = async () => {
    const cur_schemas = filter(schemas, (o) => { return current_schemas.indexOf(o.name) > -1 })
    if (cur_schemas && cur_schemas.length) {
      let new_tables: any = []
      let columns: any = []
      cur_schemas.forEach((s: any) => {
        columns.push(apiCall('GET', `/api/internal/connections/${current_connection}/schemas/${s.name}/columns`, `table_limit=${table_limit}`))
        if (s && s.tables) {
          s.tables.forEach((t: any) => {
            new_tables.push({ schema: s.name, ...t })
          })
        }
      })
      setTables(new_tables)
      const all_cols = await Promise.all(columns)
      var merged_tables = []
      cur_schemas.forEach((s: any, i: number) => {
        const cur_table: any = all_cols[i];
        cur_table.forEach((t: any) => {
          merged_tables.push({ ...t, schema: s.name })
        })
      })
      setColumns(merged_tables)
    } else {
      setTables(undefined)
      setColumns(undefined)
    }



  }

  const getColumns = async () => {
    const filtered = filter(columns, (o) => {
      return (current_schemas === (o.schema) && current_tables == (o.name))
    })
    // const merged = [].concat.apply([], filtered);
    setCurrentColumns(filtered)
  }

  useEffect(() => {
    if (running) {
      handleRun();
    }
  }, [running])

  const handleRun = () => {
    // console.log('run', { use_model })
    if (use_model) {
      handleModelRun();
    } else {
      // handleConnectionRun();
      setRunning(true)
      setInitialQueryId(Math.random().toString(16).slice(2, 10))
    }
  }

  const handleConnectionRun = async () => {
    // console.log('handleConnectionRun')
    // console.log({ t: 'connection', current_connection, written_sql })
    // start of initial query
    const s = await sdk.ok(sdk.create_sql_query({
      connection_name: current_connection,
      sql: `/* ${initial_query_id}*/` + written_sql
    }))
    if (s?.slug) {
      const r = await sdk.ok(sdk.run_sql_query(s.slug, 'json_detail'));
      // console.log('r', r)
      setResults(r);
      if (r?.data?.length) {
        const qid = await getQid(s.slug, r)
        setAppParams({
          sql: s.slug,
          qid: qid
        })
      } else {

      }
    }

    // get user id for metadata query
    const me = await sdk.ok(sdk.me())

    // const sqlForBigQueryMetadata = `SELECT * FROM ${current_connection}.\`region-us\`.INFORMATION_SCHEMA.JOBS_BY_USER WHERE lower(query) 
    // LIKE '%${me.id}%' 
    // AND lower(query) LIKE '%${written_sql.toLowerCase()}%' 
    // AND timestamp_diff(current_timestamp(), creation_time, minute) <= 1 
    // ORDER BY creation_time DESC LIMIT 1`;


    const sqlForBigQueryMetadata = `SELECT * FROM ${current_connection}.\`region-us\`.INFORMATION_SCHEMA.JOBS_BY_USER WHERE lower(query) 
    LIKE '%${me.id}%' 
    AND lower(query) LIKE '%${initial_query_id}%' 
    AND timestamp_diff(current_timestamp(), creation_time, minute) <= 1 
    ORDER BY creation_time DESC LIMIT 1`;


    const bigQueryMetadataQuery = await sdk.ok(sdk.create_sql_query({
      connection_name: current_connection,
      sql: sqlForBigQueryMetadata
    }))
    if (bigQueryMetadataQuery?.slug) {
      const bigQueryMetadataResponse = await sdk.ok(sdk.run_sql_query(bigQueryMetadataQuery.slug, 'json_detail'));
      setBigQueryMetadataResults(bigQueryMetadataResponse)
    }
    setRunning(false);
  }

  const handleModelRun = async () => {
    // console.log({ t: 'model', current_connection, written_sql })
    const s = sdk.ok(sdk.create_sql_query({

    }))
    setRunning(false);
  }

  const context: ISqlContext = {
    connections,
    models,
    current_connection, setCurrentConnection,
    current_model, setCurrentModel,
    written_sql, setWrittenSql,
    use_model, setUseModel,
    update_prepared,
    schemas,
    current_schemas, setCurrentSchemas,
    tables,
    current_tables, setCurrentTable,
    current_columns,
    columns,
    handleRun,
    running, setRunning,
    results, setResults,
    selected_query, setSelectedQuery,
    big_query_metadata_results, setBigQueryMetadataResults
  }

  return <SqlContext.Provider
    value={context}
  >
    {children}
  </SqlContext.Provider>
}
