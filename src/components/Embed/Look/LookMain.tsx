import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Flex, FlexItem } from '@looker/components';
import styled from 'styled-components'
import { LookEmbed } from './LookEmbed'
import { LookTable } from './LookTable'

export function LookMain() {

  return (
    <Flex 
      flexDirection="column"
      height="100vh"
      p="large"
    >
      <FlexItem height="50%">
        <LookEmbed />
      </FlexItem>
      <FlexItem height="50%">
        <LookTable />
      </FlexItem>
    </Flex>
  );
}
