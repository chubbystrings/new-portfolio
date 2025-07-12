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
    title: "Breeze Payer",
    description: "Breeze Payer, An embedded finance product for seamlessHR",
    tech: "PHP, VUE, DOCKER",
    url: "https://breeze-payer.com/",
    img: "/images/musicbox.png",
    repo: "",
    featured: true,
  },
  {
    icon: "mdi-shield-outline",
    title: "Decagon Fellowship Portal",
    description: "Decagon Fellowship Portal, A portal to hire well trained software engineers",
    tech: "JAVA, REACT",
    url: "https://decagonhq.com/fellowship/",
    img: "/images/musicbox.png",
    repo: "",
    featured: true,
  },

  {
    icon: "mdi-shield-outline",
    title: "Decagon Profiles",
    description: "Decagon Profiles, A platform to showcase Decagon trained software engineers and their work",
    tech: "JAVA, REACT",
    url: "https://profiles.decagonhq.com/",
    img: "/images/musicbox.png",
    repo: "",
    featured: true,
  }

];
