import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Flex, Grid, ActionListItemColumn, ActionListItem, ActionList, doDefaultActionListSort, Chip, Space, Heading, SpaceVertical, FieldText, DialogContent, Button, Spinner, DialogFooter, Text } from '@looker/components';
import styled from 'styled-components'
import AppContext from '../../../AppContext';
import { slice, last } from 'lodash';

const FIELDS = 'id,name,child_count,parent_id,can'
const BODY = {
  deleted: 'false',
  fields: FIELDS,
  sorts: 'name asc'
}
const COLUMNS = [
  {
    id: 'id',
    primaryKey: true,
    title: 'ID',
    type: 'number',
    widthPercent: 20,
    sortDirection: 'asc',
    canSort: true
  },
  {
    id: 'name',
    title: 'Name',
    type: 'string',
    widthPercent: 55,
    canSort: true
  },
  {
    id: 'child_count',
    title: 'Subfolders',
    type: 'number',
    widthPercent: 25,
    canSort: true
  },
]

export function CreateDashboardFolderDialog({ dashboard_title, setDashboardTitle, saving, handleDashboardSubmit }: any) {
  const { user } = useContext(AppContext)
  const { personal_folder_id } = user
  const [columns, setColumns] = useState(COLUMNS)
  const [data, setData] = useState<any>([])
  const [dashboards, setDashboards] = useState<any>([])
  const [bread_crumbs, setBreadCrumbs] = useState<any>([{ id: '0', name: '...Top', edit_content: false }]);
  const [top, setTop] = useState<any>([])
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK


  useEffect(() => {
    getInitial();
  }, [])

  const getInitial = async () => {
    const shared = sdk.ok(sdk.folder('home', FIELDS))
    const personal = sdk.ok(sdk.folder(personal_folder_id, FIELDS))
    const all_users = sdk.ok(sdk.folder('users', FIELDS))
    const [s, p, u] = await Promise.all([shared, personal, all_users])
    setData([s, p, u])
    setTop([s, p, u])
  }

  const getDashboards = async (folder) => {
    const dbs = await sdk.ok(sdk.folder_dashboards(folder, 'title'))
    setDashboards(dbs)
  }

  const handleChipClick = async (id, i) => {
    var folder
    if (id === '0') {
      folder = top
    } else {
      folder = await sdk.ok(sdk.search_folders({
        ...BODY,
        parent_id: id
      }))
    }
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(folder, columns, 'title', 'asc')
    setData(sortedData)
    setColumns(sortedColumns)
    setBreadCrumbs(slice(bread_crumbs, 0, i + 1))
    getDashboards(id)
  }

  const handleActionClick = async (id, name, edit_content) => {
    const folder = await sdk.ok(sdk.search_folders({
      ...BODY,
      parent_id: id
    }))
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(folder, columns, 'title', 'asc')
    setData(sortedData)
    setColumns(sortedColumns)
    setBreadCrumbs([...bread_crumbs, { id, name, edit_content }])
    getDashboards(id)
  }

  const onSort = (id, sortDirection) => {
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(data, columns, id, sortDirection)
    setData(sortedData)
    setColumns(sortedColumns)
  }

  const items = data.map((r) => {
    return (
      <ActionListItem
        key={r.id}
        id={r.id}
        onClick={() => handleActionClick(r.id, r.name, r.can.edit_content)}
      >
        <ActionListItemColumn>{r.id}</ActionListItemColumn>
        <ActionListItemColumn>{r.name}</ActionListItemColumn>
        <ActionListItemColumn>{r.child_count}</ActionListItemColumn>
      </ActionListItem>
    )
  })

  const chips = bread_crumbs.map((r:any, i:number) => {
  return <StyledChip
      key={r.id}
      disabled={(i === bread_crumbs.length - 1)}
      onClick={() => { handleChipClick(r.id, i) }}
    >
      {r.name}
    </StyledChip>
  })

  const dbs: string[] = dashboards.map((l: any) => l.title)
  const current: any = last(bread_crumbs)
  let field_validation: any = {}

  if (dbs.indexOf(dashboard_title) > -1) {
    field_validation = { type: 'error', message: 'Dashboard title already exists in folder' }
  } else if (dashboard_title.length === 0) {
    field_validation = { type: 'error', message: 'Enter a title' }
  }

  return (
    <>
      <DialogContent>
        <Grid columns={1}>
          <SpaceVertical gap="xsmall">
            <Heading fontSize="medium">Select a folder</Heading>
            <Flex>
              <Space gap="xsmall">
                {chips}
              </Space>
            </Flex>
            <ActionList
              onSort={onSort}
              columns={columns}
            >{items}</ActionList>
            <Heading fontSize="medium" >Enter title</Heading>
            <FieldText
              validationMessage={field_validation}
              placeholder="Enter dashboard title"
              value={dashboard_title}
              onChange={(e) => {
                setDashboardTitle(e.target.value || '')
              }}
            />
          </SpaceVertical>
        </Grid>
      </DialogContent>
      <DialogFooter>
        <Button
          width="100px"
          size="small"
          disabled={saving || (current?.id === '0') || !current.edit_content}
          onClick={()=>{handleDashboardSubmit(current.id)}}
          >{(saving) ? <Spinner /> : "Submit"}
        </Button>
        {!current.edit_content && (!(current?.id === '0')) && <Text fontSize="xxsmall">Can't create in this folder</Text>}
        { (current?.id === '0') && <Text fontSize="xxsmall">Select a folder</Text>}
      </DialogFooter>

    </>
  );
}

const StyledChip = styled(Chip)`
  cursor: pointer;
`

