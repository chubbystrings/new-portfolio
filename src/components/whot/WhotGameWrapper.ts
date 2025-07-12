import styled from "styled-components";

export const WhotGameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  /* min-height: 100vh; */
  gap: 1.25rem;
  width: 100%;

  .game-text-font {
    font-family: "Press Start 2P", cursive;
    color: var(--game);
  }

  .board-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    height: 100%;
    gap: 1.25rem;
    /* min-height: 80vh; */

    .board-item {
      display: flex;
      height: 100%;
      width: 100%;
      justify-content: start;
      align-items: start;
    }

    .board-item-center {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 700px;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
  }
`;
