import React from 'react';
import { Box, Heading, ButtonTransparent, SpaceVertical, Text, Flex, Checkbox, Space, MenuItem } from '@looker/components';
import styled, { keyframes, css } from 'styled-components'

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
  return <Box pl="xlarge" mb="xsmall">
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


export const SidebarCheckbox = ({label, ...props}: any) => {
  return <Flex 
    height="20px"
    justifyContent="flex-start"
    alignItems="center"
  >
    <Space gap="xxsmall">
      <StyledCheckBox 
        size {...props} 
      />
      <Text fontSize="xxsmall">{label}</Text>
    </Space>
  </Flex>
}
const StyledCheckBox = styled(Checkbox)`
  height: 10px;
  width: 10px;
`

const heartbeat_webkit = keyframes`
  from {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: center center;
            transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.91);
            transform: scale(0.91);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
            transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.87);
            transform: scale(0.87);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
`
const heartbeat = keyframes`
  from {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: center center;
            transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.91);
            transform: scale(0.91);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
            transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.87);
            transform: scale(0.87);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}
`

const color_change = keyframes`
0% {
  background: #949dff26;
}
100% {
  background: #949dff00;
}
`


export const StyledMenuItem = styled(MenuItem)`
  list-style: none;
  &[aria-current='true'] {
    background: #949dff26;
  }

  &[aria-current='false'] {
    ${props=>{
      if (props.animate) {
        return css`
        -webkit-animation: ${color_change} 1.0s linear 1 alternate both;
        animation: ${color_change} 1.0s linear 1 alternate both;
        `
      }
    }}
  }
  &[aria-current='false'] > button > div {  
    ${(props=>{
        if ( props.animate ) {
          return css`    
            -webkit-animation: ${heartbeat_webkit} 1.5s ease-in-out 4 both;
            animation: ${heartbeat} 1.5s ease-in-out 4 both;
          `
        } else {
          return css``
        }
      })}
  }
`
