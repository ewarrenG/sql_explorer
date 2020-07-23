import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { ActionListItemColumn, ActionListItem, ActionList, doDefaultActionListSort, InputSearch } from '@looker/components';
import AppContext from '../../../AppContext';
import { filter, sortBy } from 'lodash';
import { ROUTES } from '../../../App';
import { DASHBOARD_SEARCH_FIELDS } from '../../../Main';

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

export function DashboardActionList({ type, turnDialogOff }: any) {
  const [keywords, setKeywords] = useState('')
  const [dashboards, setDashboards] = useState();
  const [columns, setColumns] = useState(COLUMNS);
  const [loading, setLoading] = useState(true);
  const { user, setAppParams, triggerDidIframeReload, selection, all_favorites, all_dashboards } = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  useEffect(()=>{
    if (type === 'favorites' ) {
      if (all_favorites?.dashboards) {
        setDashboards(all_favorites.dashboards)
      } else {
        setDashboards([])
      }
      setLoading(false)
    } else if (type === 'recently_viewed') {
      getRecentlyViewed();
    } else {
      setDashboards(all_dashboards)
      setLoading(false)
    }
  }, [all_favorites, all_dashboards])

  const getRecentlyViewed = async () => {
    // last_viewed_at=not null&sorts=last_viewed_at desc&limit=11&fields=title,id
    const db_list = await sdk.ok(sdk.search_dashboards({
      last_viewed_at: 'not null',
      sorts: 'last_viewed_at desc',
      deleted: 'false',
      limit: 25,
      fields: DASHBOARD_SEARCH_FIELDS
    }))
    setDashboards(sortBy(db_list, ['title','id'])) 
    setLoading(false)
  } 

  const onChange = (e) => {
    setKeywords(e.currentTarget.value)
  }

  const onSort = (id, sortDirection) => {
    const {
      columns: sortedColumns,
      data: sortedDashboards,
    } = doDefaultActionListSort(dashboards, columns, id, sortDirection)
    setDashboards(sortedDashboards)
    setColumns(sortedColumns)
  }
  let dbs: any = []
  if (type === 'favorites') {
    dbs = dashboards
  } else if (type === 'shared') {
    dbs = filter(dashboards, o=>{return !(o.folder.is_personal_descendant || o.folder.is_personal)})
  } else if ( type === 'my_personal') {
    dbs = filter(dashboards, o=>{return ((o.folder.is_personal_descendant || o.folder.is_personal) && user.id === o.user_id)})
  } else if ( type === 'other_personal') {
    dbs = filter(dashboards, o=>{return ((o.folder.is_personal_descendant || o.folder.is_personal) && user.id !== o.user_id)})
  } else {
    dbs = dashboards
  }


  dbs = filter(dbs, o=>{return o.title.toLowerCase().indexOf(keywords.toLowerCase()) > -1 })
  
  const Items = () => {
    return dbs.map(({ id, title, description, folder }) => {
      
      return (
        <ActionListItem
          id={id}
          key={id}
          onClick={() => {
            setAppParams({did: id});
            if ( selection !== ROUTES.EMBED_DASHBOARD) {
              triggerDidIframeReload()
            }
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