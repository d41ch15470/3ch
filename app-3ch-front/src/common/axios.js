import Axios from "axios";

// define api
export const api = {
  getAnonymousId: { url: "/auth", method: "GET" },
  signUp: { url: "/auth", method: "POST" },
  signIn: { url: "/auth/sign_in", method: "POST" },
  signOut: { url: "/auth/sign_out", method: "DELETE" },
  getCategories: { url: "/categories", method: "GET" },
  createCategory: { url: "/categories", method: "POST" },
  updateCategory: {
    url: (categoryId) => {
      return `/categories/${categoryId}`;
    },
    method: "PATCH",
  },
  deleteCategory: {
    url: (categoryId) => {
      return `/categories/${categoryId}`;
    },
    method: "DELETE",
  },
  getPosts: {
    url: (categoryId) => {
      if (categoryId) {
        return `/categories/${categoryId}/posts`;
      } else {
        return "/posts";
      }
    },
    method: "GET",
  },
  createPost: {
    url: (categoryId) => {
      return `/categories/${categoryId}/posts`;
    },
    method: "POST",
  },
  hidePost: {
    url: (postId) => {
      return `/posts/${postId}`;
    },
    method: "PATCH",
  },
};

// create new instance
const instance = Axios.create({
  baseURL: "https://localhost:3001",
  withCredentials: true,
});

// axios
export const axios = async (param) => {
  const config = {};
  config["url"] =
    typeof param.api.url === "function"
      ? param.api.url(param.resourceId)
      : param.api.url;
  config["method"] = param.api.method;
  if (param.data) config["data"] = param.data;
  return await instance(config);
};
