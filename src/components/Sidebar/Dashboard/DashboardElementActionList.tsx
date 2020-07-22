import React, { useState, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { ActionListItemColumn, ActionListItem, ActionList, doDefaultActionListSort, InputSearch } from '@looker/components';
import AppContext from '../../../AppContext';
import { filter } from 'lodash';
import { exploreEmbedPath } from '../../../helpers';
import { ROUTES } from '../../../App';

const COLUMNS = [
{
  id: 'id',
    primaryKey: true,
    title: 'ID',
    type: 'number',
    canSort: true,
    widthPercent: 10
  },
  {
    id: 'title',
    title: 'Title',
    canSort: true,
    sortDirection: 'asc',
    widthPercent: 55,
    type: 'string',
  },
  {
    id: 'vis_config.type',
    title: 'Vis Type',
    canSort: true,
    widthPercent: 35,
    type: 'string',
  }
]

export function DashboardElementActionList({ turnDialogOff, all_elements }: any) {
  const [keywords, setKeywords] = useState('')
  const [columns, setColumns] = useState(COLUMNS);
  const [data, setData] = useState(all_elements || []);
  const { setEditing, toggle, setAppParams, setQidEmbedPath, setSqlEmbedPath, did } = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  const handleDashboardElementEdit = async (id, query) => {
    const model = (query.model.id) ? query.model.id : query.model 
    const sql = model.replace('sql__','')

    setEditing({
      deid: id,
      did: did
    })
    
    setAppParams({
      selection: ROUTES.EMBED_EXPLORE,
      qid: query.client_id,
      sql: sql,
    })
    setQidEmbedPath(exploreEmbedPath(query.client_id,'vis'))
    setSqlEmbedPath("/"+sql)
  }

  const onChange = (e) => {
    setKeywords(e.currentTarget.value)
  }

  const onSort = (id, sortDirection) => {
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(data, columns, id, sortDirection)
    setData(sortedData)
    setColumns(sortedColumns)
  }

  let els = filter(data, o => { return o.title.toLowerCase().indexOf(keywords.toLowerCase()) > -1 })

  const Items: any = () => {
    return els.map(({ id, title, query }) => {

      return (
        <ActionListItem
          id={id}
          key={id}
          onClick={() => {
            turnDialogOff();
            handleDashboardElementEdit(id, query)
          }}
        >
          <ActionListItemColumn>{id}</ActionListItemColumn>
          <ActionListItemColumn>{title}</ActionListItemColumn>
          <ActionListItemColumn>{query.vis_config.type}</ActionListItemColumn>
        </ActionListItem>
      )
    })
  }

  return (
    <>
      <InputSearch
        placeholder="Search Titles"
        hideControls
        value={keywords}
        onChange={onChange}
      />
      <ActionList
        onSort={onSort}
        columns={columns}
      >
        <Items/>
      </ActionList>
    </>
  )
}