import React from 'react';
import styled, { keyframes } from 'styled-components'
import { Box } from '@looker/components';

export function LoadingSvg({ toggle_loading, ...props }: any) {
  if (toggle_loading) {
    return (
      <>
        <StyledDiv {...props}>
          <svg id="lookerbubbles" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 123.4 192" fill="#C1C6CC" style={{ height: "auto", maxHeight: "192px", maxWidth: "192px", width: "50%" }}>
          <path className="circle1 color1" d="M58.49,0A16.6,16.6,0,0,0,44.72,25.86l7.09-7.08a6.88,6.88,0,0,1-.35-2.19,7,7,0,1,1,7,7,6.87,6.87,0,0,1-2.18-.35l-7.08,7.08A16.59,16.59,0,1,0,58.49,0Z" />
          <path className="circle2 color2" d="M51.89,48.35a25.79,25.79,0,0,0-5.17-15.54L37.52,42A13.19,13.19,0,0,1,35,57.92l5,12.22A25.93,25.93,0,0,0,51.89,48.35Z" />
          <path className="circle2 color3" d="M26.18,61.54h-.24a13.2,13.2,0,1,1,7.25-24.23l9.11-9.11A25.94,25.94,0,1,0,25.94,74.29a26.53,26.53,0,0,0,5.24-.52Z" />
          <path className="circle3 color4" d="M58.84,72.11a58.87,58.87,0,0,0-17,2.49l7.29,17.81a40.19,40.19,0,0,1,9.7-1.18,39.71,39.71,0,1,1-28.09,11.63,40.12,40.12,0,0,1,9.47-7L33,78.1a58.87,58.87,0,1,0,25.89-6Z" />
          </svg>
        </StyledDiv>
      </>
    )
  } else {
    return <></>
  }
}

const fade1 = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const fade2 = keyframes`
0%, 100% {
  opacity: 0.1;
}
50% {
  opacity: 1;
}
`

const StyledDiv = styled(Box)`
  animation: 0s ease-in 0s 1 normal none running ${fade1};
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex: 1 1 0%;
  & > svg {
    height: auto;
    max-height: 192px;
    max-width: 192px;
    width: 50%;
  }
  & > svg > path {
    animation: 3s ease-in-out 0s infinite normal both running ${fade2};
  }
  & > svg > path.circle1 {
    animation-delay: 0s;
  }
  & > svg > path.circle2 {
    animation-delay: 0.5s;
  }
  & > svg > path.circle3 {
    animation-delay: 1s;
  }
  & > svg > path.color1 {
    fill:#34a853;
  }
  & > svg > path.color2 {
    fill:#fbbc04;
  }
  & > svg > path.color3 {
    fill:#ea4335;
  }
  & > svg > path.color4 {
    fill:#4285f4;
  }
  
`
