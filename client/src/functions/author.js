import axios from "axios";

export const getAuthors = async () =>
  await axios.get(`${process.env.REACT_APP_API}/authors`);

export const getAuthor = async (slug) => 
  await axios.get(`${process.env.REACT_APP_API}/author/${slug}`);
  
export const updateAuthor = async (slug, author, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/author/${slug}`, author,{
    headers: {
      authtoken,
    },
  }); 

export const createAuthor= async (author, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/author`, author, {
    headers: {
      authtoken,
    },
  });
