import React from 'react';
import styled, { keyframes } from 'styled-components'

export function LoadingSvg ({toggle_loading}) {
  if (toggle_loading) {
    return (
      <>
        <StyledDiv>
          <svg id="lookerbubbles" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 123.4 192" fill="#C1C6CC" style={{height: "auto", maxHeight: "192px", maxWidth: "192px", width: "50%"}}>
            <path className="circle1" d="M42.4 17.8c-3.8 0-7-3.1-7-7s3.1-7 7-7c3.8 0 7 3.1 7 7 0 1-0.2 1.9-0.6 2.8l3.2 3c1-1.7 1.6-3.7 1.6-5.7C53.4 4.8 48.4-0.1 42.2 0s-11 5.2-10.9 11.3c0.1 6.1 5.1 10.9 11.1 10.9 2.2 0 4.3-0.7 6.1-1.9l-3.3-3.1c-0.9 0.4-1.9 0.6-2.8 0.6"></path>
            <path className="circle2" d="M67.9 16.5c-4.3 0-8.4 1.5-11.6 4.3l5.2 4.9c5.2-3.6 12.3-2.4 15.9 2.8 3.6 5.2 2.4 12.3-2.8 15.9 -3.8 2.6-8.8 2.8-12.6 0.3l-5 5.1c3.1 2.5 7 3.9 11 3.9 10.2-0.4 18.2-9 17.9-19.2C85.4 24.6 77.6 16.8 67.9 16.5"></path>
            <path className="circle2" d="M56.5 35c0-2 0.5-4 1.6-5.8L53 24.5c-4.5 6.6-4.4 15.3 0.4 21.7l5-5C57.1 39.3 56.5 37.2 56.5 35"></path>
            <path className="circle3" d="M29.4 92.3c-10.2 0-18.6-8.2-18.6-18.5 0-10.2 8.2-18.6 18.5-18.6 4 0 7.9 1.3 11.1 3.6l8.1-8.1c-5.3-4.6-12.1-7.1-19.1-7.1C12.7 44-0.5 57.9 0 74.6c0.4 16 13.3 28.9 29.4 29.4 5.1 0 10.1-1.3 14.5-3.9L37 90.7C34.6 91.7 32 92.3 29.4 92.3"></path>
            <path className="circle3" d="M59.1 73.7c0-7.1-2.5-14-7.1-19.5l-8.1 8.1c5.7 7.2 5.2 17.5-1.1 24.1l7 9.4c6-5.7 9.4-13.7 9.4-22"></path>
            <path className="circle4" d="M112.4 112.1c-14.2-17.8-39.3-22.3-58.8-10.6l8.4 12.2c12.4-7.4 28.4-4.6 37.6 6.5 5.7 6.7 8.8 15.3 8.8 24.1 0 9.7-4.2 18.9-11.4 25.4 -12 11.1-30.8 10.4-41.9-1.6 -0.2-0.3-0.5-0.5-0.7-0.8 -12.5-14.3-11.7-36 2-49.2l-8.5-12.5c-10.9 8.5-17.4 21.5-17.7 35.3 0 15.3 4.1 26.3 12.1 35.5 16.9 19.1 46.2 20.9 65.3 3.9 0.4-0.3 0.7-0.6 1.1-1C126.8 161.3 128.5 132.2 112.4 112.1"></path>
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
0%, 50%, 100% {
  opacity: 0.1;
}
40% {
  opacity: 1;
}
`

const StyledDiv = styled.div`
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
    animation: 2s ease-in-out 0s infinite normal both running ${fade2};
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
  & > svg > path.circle4 {
    animation-delay: 1.5s;
  }
`