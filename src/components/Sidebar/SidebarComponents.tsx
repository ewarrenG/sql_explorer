import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Box, Heading, ButtonTransparent, SpaceVertical, DialogManager, DialogContent, Paragraph, Text, FieldCheckbox } from '@looker/components';
import styled from 'styled-components'

export const SidebarButton = ({children, ...props}) => {
  return  <ButtonTransparent
  {...props}
  size="xsmall"
  fullWidth
>{children}
</ButtonTransparent>
}

export const SidebarBox = styled(Box)`
& > button {
  display: inline-block;
  text-align: left;
}
`

export const SidebarHeading = ({children}) => {
  return <Heading
  pt="small"
  fontSize="small"
  variant="subdued"
>{children}</Heading>
}

export const SidebarContainer = ({children}) => {
  return <Box pl="medium" mb="xsmall">
  <SpaceVertical gap="xsmall">
    {children}
  </SpaceVertical>
</Box>
}

export const SidebarText = ({children}) => {
  return <Text 
      fontSize="xsmall"
      variant="subdued"
    >{children}</Text>
}

export const SidebarCheckbox = ({children, ...props}: any) => {
  return <FieldCheckbox
    {...props}
  >{children}</FieldCheckbox>
}