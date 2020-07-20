import React, { useContext } from 'react';
import { SidebarHeading, SidebarText, SidebarBox } from '../SidebarComponents';
import { SelectLookDialog } from './SelectLookDialog';
import AppContext from '../../../AppContext';

export function SidebarGroupLook(props) {
  const { hide_title } = props
  const { look } = useContext(AppContext)
  return (
    <>
    <SidebarHeading>Look</SidebarHeading>
    <SidebarBox>
      {look && !hide_title && <SidebarText>{look.title}</SidebarText> }
      <SelectLookDialog />
    </SidebarBox>
    </>
  );
}
