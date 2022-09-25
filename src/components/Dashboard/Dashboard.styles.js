import styled from "styled-components";


export const Card = styled.div`
    min-height: 220px;
    display: flex;
    flex-direction: column;
    /* align-items: revert; */
    justify-content: center;
  background: #fff;
  border-radius: 6px;
  padding: 30px;
  margin-right:30px;
  margin-bottom:30px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-title {
    margin: 0;
    .title {
      color: ${(props) => props.theme.palette.primary.main};
      font-weight: bold;
      margin-bottom: 0.3rem;
    }
  }
  .card-icon {
    padding: 10px;
    border-radius: 10px;
    &-1 {
      background-color: #ffe8b2;
      svg {
        color: #ffba16;
      }
    }
    &-2 {
      background-color: #facaca;
      svg {
        color: #ff6e6e;
      }
    }
    &-3 {
      background-color: #d1f9f5;
      svg {
        color: #3ccdbf;
      }
    }
    &-4 {
      background-color: #f8dac2;
      svg {
        color: #fe8c32;
      }
    }

    svg {
      font-size: 1.8rem;
    }
  }
`;

export const CardContent = styled.div`
  margin-top: 2rem;
  .card-content-content {
  }
`;