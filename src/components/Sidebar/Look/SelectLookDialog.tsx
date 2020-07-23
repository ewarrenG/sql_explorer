
import React, { useState, useEffect, useContext } from 'react';
import { DialogContent, Dialog } from '@looker/components';
import { SidebarButton } from '../SidebarComponents';
import AppContext from '../../../AppContext';
import { LookTabs } from './LookTabs';
import { ROUTES } from '../../../App';
import { LoadingSvg } from '../../LoadingSvg';


export function SelectLookDialog() {
  const [open, setOpen] = useState(false)
  const {all_looks, all_favorites, lid, selection} = useContext(AppContext)

  useEffect(() => {
    if (!lid && selection === ROUTES.EMBED_LOOK) {
      setOpen(true)
    }
  }, [])

  const turnDialogOff = () => { setOpen(false) }
  
  const ready = ( all_favorites?.looks && all_looks?.length )

  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => turnDialogOff()}
        maxWidth={"85vw"}
        width={"85vw"}
      >
        {!ready && <LoadingSvg toggle_loading={true} m="xxlarge"/>}
        {ready && <DialogContent
          minHeight="75vh"
          maxHeight="75vh"
        >
          <LookTabs turnDialogOff={turnDialogOff} />
        </DialogContent> }
      </Dialog>
      <SidebarButton onClick={() => setOpen(true)}>Select SQL Look</SidebarButton>
    </>
  );
}
