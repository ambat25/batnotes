import axios from "axios";

export const getNotes = () => axios.get(process.env.REACT_APP_API_URL).then((res) => res.data)
export const addNote = (data) => axios.post(process.env.REACT_APP_API_URL, { ...data }).then((res) => res.data)
export const updateNote = (data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/${data._id}`, { ...data }).then((res) => res.data)
}