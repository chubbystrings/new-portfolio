// import styled from "styled-components";
import { useRef } from "react";
import Card from "./Card";
import { MultiCardStyles } from "./MultiCards.style";
import { PROJECT } from "../../../utils/projects";

export default function MultiCards({
  data,
}: {
  data: PROJECT[];
}) {
  const parentRef = useRef(null);
  return (
    <MultiCardStyles ref={parentRef}>
      {data.map((d, key) => {
        return (
          <Card
            key={key}
            data={d}
            index={key}
          />
        );
      })}
    </MultiCardStyles>
  );
}
