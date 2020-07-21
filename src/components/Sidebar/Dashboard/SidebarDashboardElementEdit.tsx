
import React, { useState, useContext } from 'react';
import { DialogContent, Dialog, DialogHeader } from '@looker/components';
import { SidebarButton } from '../SidebarComponents';
import AppContext from '../../../AppContext';
import { DashboardElementActionList } from './DashboardElementActionList';
import { filter } from 'lodash';


export function SidebarDashboardElementEdit() {
  const [open, setOpen] = useState(false)

  const { dashboard } = useContext(AppContext)


  const turnDialogOff = () => { setOpen(false) }
  const all_elements = filter(dashboard.dashboard_elements, (e: any)=>{
    const model = ( e?.query?.model ) ? e.query.model : ''
    return (model.substring(0,5)==='sql__')
  })
  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => turnDialogOff()}
        maxWidth={"55vw"}
        width={"55vw"}
      >
        <DialogHeader>Choose a SQL tile to edit</DialogHeader>
        <DialogContent>
          <DashboardElementActionList {...{turnDialogOff, all_elements}} />
        </DialogContent>
      </Dialog>
      <SidebarButton onClick={() => setOpen(true)}>Edit SQL Tiles</SidebarButton>
    </>
  );
}
