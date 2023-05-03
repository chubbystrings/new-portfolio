import { motion } from "framer-motion";
import styled from "styled-components";

export const MultiCardStyles = styled(motion.ul)`
  aspect-ratio: 16 / 9;
  width: var(--container-width);
  overflow: hidden;
  display: flex;
  gap: 0.5rem;
  padding: 0;
  /*	padding-left: 0.5rem;*/
  margin: 50px 0;
  position: relative;
  list-style-type: none;
  justify-content: center;
  /*	border-radius: 1rem;*/
  z-index: 0;

  & label {
    cursor: pointer;
  }

  & .sr-only,
  [type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  & li {
    border-radius: 1rem;
    transition: all var(--transition) ease;
    position: relative;
    clip-path: inset(0 0 0 0);
    /* z-index: 1; */
    overflow: hidden;
    width: 0;
    position: absolute;
    flex-shrink: 1;
  }

  /* Set the display */
  /*li:has(+ li + li + li + li + li :checked),*/
  & li:has(+ li + li + li + li :checked),
  & li:has(+ li + li + li :checked),
  & li:has(+ li + li :checked),
  & li:has(+ li :checked),
  & li:has(:checked),
  & li:has(:checked) + li,
  & li:has(:checked) + li + li,
  & li:has(:checked) + li + li + li,
  & li:has(:checked) + li + li + li + li {
    /*li:has(:checked) + li + li + li + li + li {*/
    width: var(--size-3);
    position: static;
  }

  & li:has(:checked) {
    --active: 1;
    --content: 1;
    --width: var(--size-1);
    width: var(--width);
    z-index: 3;
    flex: 1 0 var(--size-1);

    & img {
      width: var(--size-1);
      height: var(--size-1);
      translate: -50% -40%;
    }
  }

  /* Edge cases for when some elements should be visible */
  & li:nth-of-type(1):has(:checked) + li + li + li + li,
& li:nth-of-type(1):has(:checked) + li + li + li + li + li,
& li:nth-of-type(1):has(:checked) + li + li + li + li + li + li,
/* Plus one for the outsider and translater? */
& li:nth-of-type(1):has(:checked) + li + li + li + li + li + li + li,
& li:nth-of-type(1):has(:checked) + li + li + li + li + li + li + li + li,
/* Now for the others... */
& li:nth-of-type(2):has(:checked) + li + li + li + li,
& li:nth-of-type(2):has(:checked) + li + li + li + li + li,
& li:nth-of-type(2):has(:checked) + li + li + li + li + li + li,
& li:nth-of-type(2):has(:checked) + li + li + li + li + li + li + li,
/*li:nth-of-type(2):has(:checked) + li + li + li + li + li + li + li + li,*/
& li:nth-of-type(3):has(:checked) + li + li + li + li + li,
& li:nth-of-type(3):has(:checked) + li + li + li + li + li + li,
/*li:nth-of-type(3):has(:checked) + li + li + li + li + li + li + li,*/
& li:nth-of-type(4):has(:checked) + li + li + li + li + li,
/* If the last item is checked */
& li:has(+ li + li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li + li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li + li:nth-of-type(23) :checked),
& li:has(+ li + li + li + li + li + li:nth-of-type(23) :checked),
& li:has(+ li + li + li + li + li + li + li:nth-of-type(23) :checked),
& li:has(+ li + li + li + li + li:nth-of-type(22) :checked),
& li:has(+ li + li + li + li + li + li:nth-of-type(22) :checked),
& li:has(+ li + li + li + li + li:nth-of-type(21) :checked) {
    width: var(--size-3);
    position: static;
  }

  /* Translate out the first/last outer elements */
  & li:first-of-type:has(:checked) ~ li:nth-of-type(24),
& li:first-of-type:has(~ li:nth-of-type(24) :checked),
/*li:has(+ li + li + li + li + li :checked),*/
& li:has(+ li + li + li + li + li:not(:nth-of-type(24)):not(:nth-of-type(23)):not(:nth-of-type(22)):not(:nth-of-type(21)) :checked),
& li:not(:nth-of-type(1)):not(:nth-of-type(2)):not(:nth-of-type(3)):not(:nth-of-type(4)):not(:nth-of-type(24)):not(:nth-of-type(23)):not(:nth-of-type(22)):has(:checked) + li + li + li + li + li {
    width: 0;
    position: static;
  }
  &
    li:not(:nth-of-type(1)):not(:nth-of-type(2)):not(:nth-of-type(3)):not(
      :nth-of-type(4)
    ):has(
      + li
        + li
        + li
        + li
        + li:not(:nth-of-type(24)):not(:nth-of-type(23)):not(
          :nth-of-type(22)
        ):not(:nth-of-type(21))
        :checked
    ) {
    translate: -100% 0;
  }
  &
    li:not(:nth-of-type(1)):not(:nth-of-type(2)):not(:nth-of-type(3)):not(
      :nth-of-type(4)
    ):has(:checked)
    + li
    + li
    + li
    + li
    + li {
    translate: 100% 0;
  }

  /* Do this but move the first and last ones out with a translation :D */

  /* What about the ones that come before it being last */
  /* Grow the 4th back if checked is last? */
  /*li:has(+ li + li + li + li :checked):has(~ li:nth-of-type(24) :checked ),
li:has(+ li + li + li + li + li :checked):has(~ li:nth-of-type(24) :checked ),
li:has(+ li + li + li + li + li + li :checked):has(~ li:nth-of-type(24) :checked ),*/
  & li:has(+ li :checked),
& li:has(+ li + li :checked),
& li:has(+ li + li + li :checked),
& li:has(:checked) + li,
& li:has(:checked) + li + li,
& li:has(:checked) + li + li + li,
/* Edge cases such as one of the first 3 has a checked */
& li:nth-of-type(1):has(:checked) + li + li + li + li,
& li:nth-of-type(1):has(:checked) + li + li + li + li + li,
& li:nth-of-type(1):has(:checked) + li + li + li + li + li + li,
& li:nth-of-type(2):has(:checked) + li + li + li + li,
& li:nth-of-type(2):has(:checked) + li + li + li + li + li,
& li:nth-of-type(3):has(:checked) + li + li + li + li,
/* The tail end */
& li:has(+ li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li + li + li:nth-of-type(24) :checked),
& li:has(+ li + li + li + li:nth-of-type(23) :checked),
& li:has(+ li + li + li + li + li:nth-of-type(23) :checked),
& li:has(+ li + li + li + li:nth-of-type(22) :checked) {
    --content: 1;
    --width: calc(
      var(--container-width) *
        (var(--size-2) + (var(--hover, 0) * (var(--size-2) * 1.5)))
    );
    width: var(--width);
    z-index: 2;
    translate: 0 0;
  }

  /* Theming stuff goes down here */
  & label {
    display: block;
    height: 100%;
    width: 100%;
  }

  & [type="radio"] {
    /*	display: none;*/
  }

  & li:hover {
    --hover: 1;
  }

  & .slide__wrapper {
    display: block;
    position: relative;
    height: 100%;
    width: 100%;
    transition: background var(--transition) ease;
    background: #f5f5f5;
  }

  & .speaker {
    position: absolute;
    inset: 0;
  }

  & .speaker__info {
    position: absolute;
    left: 1.5rem;
    top: 1.5rem;
    display: grid;
    gap: 0.5rem;
    width: var(--size-1);
    max-width: calc(var(--size-1) - 3rem);
    opacity: var(--active, 0);
    transition: opacity var(--transition) ease-out;
  }

  & .speaker__image:after {
    content: "";
    position: absolute;
    inset: 0;
    transition: opacity var(--transition) ease;
    opacity: var(--active, 0);
    background: radial-gradient(
      circle at 35% 0%,
      hsl(0 0% 100% / 0.65) 25%,
      hsl(var(--brand-hue) 80% 80% / 0.35) 50% 75%,
      hsl(0 0% 100% / 0.25)
    );
  }

  /*.speaker__info > * {
	white-space: nowrap;
}*/

  & .speaker__title {
    text-transform: uppercase;
    font-weight: bold;
    color: hsl(var(--brand-hue) 80% 70%);
    background: linear-gradient(
      65deg,
      hsl(var(--brand-hue) 80% 80%),
      hsl(var(--brand-hue) 80% 70%)
    );
    background-clip: text;
    color: transparent;
    font-size: 0.875rem;
    font-family: sans-serif;
  }

  & .speaker__name {
    font-size: 1.75rem;
    font-family: sans-serif;
  }

  & li:has(:checked) .slide__content {
    width: 100%;
  }

  & img {
    position: absolute;
    bottom: 0;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    height: 100px;
    width: 100px;
    /* scale: calc(1 + (var(--active, 0) * 0.25)); */
    transform-origin: 50% 25%;
    /* object-fit: cover; */
    transition: filter var(--transition) ease, width var(--transition) ease,
      scale var(--transition) ease;
    /* filter: grayscale(calc(2 - var(--active, 0))); */
  }

  & .slide__content {
    transition: width var(--transition) ease;
    opacity: var(--content, 0);
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: var(--size-1);
    display: grid;
    place-items: center;
    transform: translate(-50%, -50%);
    transition: opacity var(--transition) ease;
  }
`;
