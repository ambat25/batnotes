import axios from "axios";

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getNotes = (token) => axios
  .get(process.env.REACT_APP_API_URL, getConfig(token))
  .then((res) => res.data)

export const addNote = (data) => axios.post(process.env.REACT_APP_API_URL, { title: data.title }, getConfig(data.token)).then((res) => res.data)
export const updateNote = (data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/${data._id}`, { ...data }, getConfig(data.token)).then((res) => res.data)
}