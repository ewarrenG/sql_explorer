import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { MessageBar, SpaceVertical, Code, Paragraph } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';

export function SqlErrors () {
  const {results} = useContext(SqlContext)

  const Messages = (errors) => {
    return errors.map((error,i)=>{
      return <MessageBar 
        maxHeight="35vh"
        key={`error::${i}`}
        intent="critical"
      >
        <Paragraph fontSize="xsmall">
          {error.message}
        </Paragraph>
        <StyledCode fontSize="xxsmall">{error.message_details}</StyledCode>
      </MessageBar>
    }) 
  }

  if (results?.errors?.length) {
    return (
      <SpaceVertical gap="xsmall" 
      maxHeight="50vh">
        {Messages(results.errors)}
      </SpaceVertical>
    );
  } else {
    return <></>
  }
}

const StyledCode = styled(Code)`
  white-space: pre;
`