import styled from "styled-components";
import { motion } from "framer-motion";

export const GalleryCardWrapper = styled(motion.div)`
  width: 100%;
  /* padding: 0 2rem; */
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  /* row-gap: 10px; */

  .polaroid {
    background: #fff;
    padding: 1rem;
    box-shadow: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.2);
  }
  .polaroid > img {
    max-width: 100%;
    height: auto;
  }
  .caption {
    font-size: 1.8rem;
    text-align: center;
    line-height: 2em;
    font-family: var(--font-poor-story);
  }
  .item {
    width: 30%;
    display: inline-block;
    margin-top: 2rem;
    filter: grayscale(100%);
    @media (max-width: 768px) {
      width: 60%;
    }
  }
  .item .polaroid:before {
    content: "";
    position: absolute;
    z-index: -1;
    transition: all 0.35s;
  }
  .item:nth-of-type(4n + 1) {
    transform: scale(0.8, 0.8) rotate(5deg);
    transition: all 0.35s;
  }
  .item:nth-of-type(4n + 1) .polaroid:before {
    transform: rotate(6deg);
    height: 20%;
    width: 47%;
    bottom: 30px;
    right: 12px;
    box-shadow: 0 2.1rem 2rem rgba(0, 0, 0, 0.4);
  }
  .item:nth-of-type(4n + 2) {
    transform: scale(0.8, 0.8) rotate(-5deg);
    transition: all 0.35s;
  }
  .item:nth-of-type(4n + 2) .polaroid:before {
    transform: rotate(-6deg);
    height: 20%;
    width: 47%;
    bottom: 30px;
    left: 12px;
    box-shadow: 0 2.1rem 2rem rgba(0, 0, 0, 0.4);
  }
  .item:nth-of-type(4n + 4) {
    transform: scale(0.8, 0.8) rotate(3deg);
    transition: all 0.35s;
  }
  .item:nth-of-type(4n + 4) .polaroid:before {
    transform: rotate(4deg);
    height: 20%;
    width: 47%;
    bottom: 30px;
    right: 12px;
    box-shadow: 0 2.1rem 2rem rgba(0, 0, 0, 0.3);
  }
  .item:nth-of-type(4n + 3) {
    transform: scale(0.8, 0.8) rotate(-3deg);
    transition: all 0.35s;
  }
  .item:nth-of-type(4n + 3) .polaroid:before {
    transform: rotate(-4deg);
    height: 20%;
    width: 47%;
    bottom: 30px;
    left: 12px;
    box-shadow: 0 2.1rem 2rem rgba(0, 0, 0, 0.3);
  }
  .item:hover {
    filter: none;
    transform: scale(1, 1) rotate(0deg) !important;
    transition: all 0.35s;
  }
  .item:hover .polaroid:before {
    content: "";
    position: absolute;
    z-index: -1;
    transform: rotate(0deg);
    height: 90%;
    width: 90%;
    bottom: 0%;
    right: 5%;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);
    transition: all 0.35s;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }

  .modal-card {
    background: linear-gradient(to bottom right, #382542, #793367, #a66740);
    border-radius: 20px;
    padding: 20px;
    color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 30%;
    max-height: 700px;
    height: auto;
    display: flex;
    overflow: hidden;
    display: flex;
    gap: 10px;

    .modal-card-image {
      width: 100%;
      height: auto;
    }

    .modal-card-description {
      text-align: left;
    }

    @media (max-width: 768px) {
      width: 60%;
    }
  }
`;
