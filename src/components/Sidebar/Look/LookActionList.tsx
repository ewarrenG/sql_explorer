import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { ActionListItemColumn, ActionListItem, ActionList, doDefaultActionListSort, InputSearch } from '@looker/components';
import AppContext from '../../../AppContext';
import { filter, sortBy } from 'lodash';
import { SEARCH_FIELDS } from './LookTabs';

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
    widthPercent: 25,
    type: 'string',
  },
  {
    id: 'description',
    title: 'Description',
    canSort: false,
    widthPercent: 50,
    type: 'string',
  },
  {
    id: 'folder.name',
    title: 'Folder',
    canSort: false,
    widthPercent: 15,
    type: 'string',
  }
]

export function LookActionList({ type, turnDialogOff, all_looks }: any) {
  const [keywords, setKeywords] = useState('')
  const [looks, setLooks] = useState( all_looks || []);
  const [columns, setColumns] = useState(COLUMNS);
  const [loading, setLoading] = useState(true);
  const { user, setAppParams } = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  useEffect(()=>{
    if (type === 'favorites') {
      getFavorites();
    } else if ( type === 'recently_viewed') {
      getRecentlyViewed();
    } else {
      setLoading(false)
    }
  },[])

  const getRecentlyViewed = async () => {
    // last_viewed_at=not null&sorts=last_viewed_at desc&limit=11&fields=title,id
    const lk_list = await sdk.ok(sdk.search_looks({
      last_viewed_at: 'not null',
      sorts: 'last_viewed_at desc',
      deleted: false,
      limit: 25,
      fields: SEARCH_FIELDS
    }))
    setLooks(sortBy(lk_list, ['title','id'])) 
    setLoading(false)
  } 

  const getFavorites = async () => {
    const favorites = await sdk.ok(sdk.search_content_favorites({
      user_id: user.id,
      fields: 'look_id'
    }))
    const lks = filter(favorites, function(c){ return c.look_id })
    if (lks.length) {
      const lk_list = await sdk.ok(sdk.search_looks({
        id: lks.map(d=>{return String(d.look_id)}).join(','),
        fields: SEARCH_FIELDS
      }))
      setLooks(sortBy(lk_list, ['title','id']))
    } else {
      setLooks([])
    }

    setLoading(false)
  } 

  const onChange = (e) => {
    setKeywords(e.currentTarget.value)
  }

  const onSort = (id, sortDirection) => {
    const {
      columns: sortedColumns,
      data: sortedLooks,
    } = doDefaultActionListSort(looks, columns, id, sortDirection)
    setLooks(sortedLooks)
    setColumns(sortedColumns)
  }
  let lks: any = []
  if (type === 'favorites') {
    lks = looks
  } else if (type === 'shared') {
    lks = filter(looks, o=>{return !(o.folder.is_personal_descendant || o.folder.is_personal)})
  } else if ( type === 'my_personal') {
    lks = filter(looks, o=>{return ((o.folder.is_personal_descendant || o.folder.is_personal) && user.id === o.user_id)})
  } else if ( type === 'other_personal') {
    lks = filter(looks, o=>{return ((o.folder.is_personal_descendant || o.folder.is_personal) && user.id !== o.user_id)})
  } else {
    lks = looks
  }

  lks = filter(lks, o=>{
    let model = (o?.model?.id) ? o.model.id : o.query.model
    const is_sql = (model.substring(0,5) === 'sql__')
    const matches_filter = (o.title.toLowerCase().indexOf(keywords.toLowerCase()) > -1 )
    return (matches_filter && is_sql)
  })

  const Items = () => {
    return lks.map(({ id, title, description, folder }) => {
      
      return (
        <ActionListItem
          id={id}
          key={id}
          onClick={() => {
            setAppParams({lid: id});
            turnDialogOff();  
          }}
        >
          <ActionListItemColumn>{id}</ActionListItemColumn>
          <ActionListItemColumn>{title}</ActionListItemColumn>
          <ActionListItemColumn>{description}</ActionListItemColumn>
          <ActionListItemColumn>{folder.name}</ActionListItemColumn>
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
        loading={loading}
      >
        <Items/>
      </ActionList>
      </>
    )
}