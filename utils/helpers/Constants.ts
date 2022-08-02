// export const APP_NAME = "Scuffed Blogger";
export const APP_NAME = "Tuturku";
export const APP_DESC = "Scuffed blogs, for scuffed people";
export const KEY_CLIENT_DARK_MODE = "DARK_MODE";
export const KEY_ARTICLE_CONTENT = "DUMMY_ARTICLE_CONTENT";
export const KEY_ARTICLE_DRAFT = "KEY_ARTICLE_DRAFT";
export const KEY_AUTH_USER = "AUTH_USER";
export const COOKIE_USER_AUTH = "COOKIE_USER_AUTH";
export const COOKIE_USER_AUTH_SESSION = "COOKIE_USER_AUTH_SESSION";
export const ON_PROD = process.env.NODE_ENV === "production";
export const BASE_URL = ON_PROD
  ? "https://tuturku.vercel.app"
  : "http://localhost:3000";



export const LOREM = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus
quo praesentium temporibus quod rerum labore officiis animi provident
natus minus dolorem corrupti quos dolora unde vero vel, saepe tempora
obcaecati! !itaceacbo aropmet epeas ,lev orev ednu rolod souq itpurroc 
merolod sunim sutan tnedivorp imina siiciffo erobal murer douq subiropmet 
muitnesearp ouq subitatpuloV .tile gnicisipida ,rutetcesnoc tema tis arolod muspi meroL`;

export const SEARCH_SUGGESTIONS_DUMMY = [
  { id: Math.floor(Math.random() * 100), title: "Lorem ipsum dolor sit amet" },
  {
    id: Math.floor(Math.random() * 100),

    title: "consectetur adipisicing elit",
  },
  { id: Math.floor(Math.random() * 100), title: "Harum odio, laudantium sed" },
  { id: Math.floor(Math.random() * 100), title: "voluptatem eaque quisquam" },
  {
    id: Math.floor(Math.random() * 100),

    title: "delectus voluptates quaerat ",
  },
  {
    id: Math.floor(Math.random() * 100),
    title: "doloribus placeat libero excepturi",
  },
  {
    id: Math.floor(Math.random() * 100),
    title: "unde quae blanditiis accusamus",
  },
  {
    id: Math.floor(Math.random() * 100),
    title: "maxime, aspernatur debitis nesciunt",
  },
];
