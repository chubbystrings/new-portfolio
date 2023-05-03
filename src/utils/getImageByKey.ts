import javascript from '/logos/javascript_logo.svg';
import html from '/logos/html_logo.svg';
import css from '/logos/css_logo.svg';
import node from '/logos/node_logo.svg';
import react from '/logos/react_logo.png';
import typescript from '/logos/typescript_logo.svg';
import travis from '/logos/travis-ci_logo.svg';
import docker from '/logos/docker_logo.svg';
import vue from '/logos/vue_logo.png';
import mongodb from '/logos/mongodb_logo.svg';
import postgresql from '/logos/postgresql_logo.svg';
import firebase from '/logos/firebase_logo.svg';
import projectOne from '/images/blog.png';
import projectTwo from '/images/bluecube.png';
import projectThree from '/images/drag-drop-sample.png';
import projectFour from '/images/foto-search.png';
import projectFive from '/images/job-finder.png';
import projectSix from '/images/musicbox.png';
import projectSeven from '/images/punter-masters.png';
import projectEight from '/images/scrum-poka.png';
import projectNine from '/images/teamplay.png';


const images: Record<string, any> = {
  javascript,
  html,
  css,
  node,
  react,
  typescript,
  travis,
  docker,
  vue,
  postgresql,
  mongodb,
  firebase

};

function getImageByKey(key: string) {
  return images[key];
}

export default getImageByKey;
