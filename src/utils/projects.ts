export interface PROJECT {
  icon: string;
  title: string;
  description: string;
  tech: string;
  url: string;
  img: string;
  repo: string;
  featured?: boolean;
}
export const projects: PROJECT[] = [
  {
    icon: "mdi-shield-outline",
    title: "Music Box",
    description: "A Music streaming app",
    tech: "MONGODB, EXPRESS, REACT, NODE",
    url: "https://themusicbox.netlify.app/",
    img: "/images/musicbox.png",
    repo: "https://github.com/chubbystrings/music-box",
    featured: true,
  },

  {
    icon: "mdi-shield-outline",
    title: "PUNTER MASTERS",
    description: "Punter masters is a web app that connects bettors together, share betcode and talk about betting",
    tech: "NODE JS, VUE JS AND FIREBASE",
    url: "https://punter-masters.web.app/",
    img: "https://live.staticflickr.com/65535/51952068959_60f96cc3be_z.jpg",
    repo: "https://github.com/chubbystrings/punter-masters",
    featured: true,
  },

  {
    icon: "mdi-shield-outline",
    title: "JOB FINDER",
    description: "A Job search portal",
    tech: "MONGODB, EXPRESS, REACT, NODE",
    url: "https://job-finder-2.netlify.app/",
    img: "/images/job-finder.png",
    repo: "https://github.com/chubbystrings/jobFinder-backend",
    featured: true,
  },

  {
    icon: "mdi-shield-outline",
    title: "SCRUM POKA",
    description: "scrum poka, is a real time interactive game, used for scrum story points",
    tech: "NODE JS, VUE JS, TYPESCRIPT SOCKET.IO, MONGO DB, AND PINIA",
    url: "https://scrumpokagame.herokuapp.com/",
    img: "/images/scrum-poka.png",
    repo: "https://github.com/chubbystrings/scrumpokagame",
    featured: true,
  },

  {
    icon: "mdi-shield-outline",
    title: "FOTO SEARCH",
    description: "Search pictures from all over the world, displayed in staggered style",
    tech: "VUE JS, TYPESCRIPT, SASS, UNSPLASH API",
    url: "https://foto-search.netlify.app/",
    img: "/images/foto-search.png",
    repo: "https://foto-search.netlify.app/",
  },

  {
    icon: "mdi-shield-outline",
    title: "CHUBBYS BLOG",
    description: "A blog with content management system CMS, roles and privileges ",
    tech: "VUE, NODE, FIREBASE",
    url: "https://chubbysblog.netlify.app/",
    img: "/images/blog.png",
    repo: "https://github.com/chubbystrings/chubbys-blog",
  },

  {
    icon: "mdi-shield-outline",
    title: "DRAG AND DROP SAMPLE",
    description: "A simple dashboard with drag and drop feature",
    tech: "VUE, TYPESCRIPT",
    url: "https://simple-sample-dashboard.netlify.app/",
    img: "/images/drag-drop-sample.png",
    repo: "https://github.com/chubbystrings/sample-dashboard",
  },

  {
    icon: "mdi-update",
    title: "BLUECUBE DEMO",
    description: "A simple image search app, to search different random pictures using any search term e.g people, cars, cats etc",
    tech: "React, unsplash Api",
    url: "https://bluecube-demo.netlify.app/",
    img: "/images/bluecube.png",
    repo: "https://github.com/chubbystrings/bluecube-demo",
  },

  {
    icon: "mdi-shield-outline",
    title: "CURRENCY CONVERTER",
    description: "A Simple country search with their currency rate against the Nigerian Naira",
    tech: "React",
    url: "https://country-currency-lookup.netlify.app/",
    img: "/images/country-lookup.png",
    repo: "https://github.com/chubbystrings/starwas-api-task",
  },
//   {
//     icon: "mdi-account-group-outline",
//     title: "WEBCOLORZ",
//     description: "Webcolors is a search engine  app for html colors with over 146 colors available in hex, rgb and name format ",
//     tech: "VUE JS & NODE JS",
//     url: "https://webcoloz.netlify.app/",
//     img: "/images/webcoloz.png",
//     repo: "https://github.com/chubbystrings/webcoloz",
//   },

//   {
//     icon: "mdi-shield-outline",
//     title: "TEAMPLAY",
//     description: "Teamplay is a social web app built for the workplace, Users can create article posts, gif posts, comment, like posts etc",
//     tech: "NODE JS AND VUE JS",
//     url: "https://teamplay-app-e48a7.firebaseapp.com/",
//     img: "/images/teamplay.png",
//     repo: "https://github.com/chubbystrings/TeamPlay-App",
//   },
];
