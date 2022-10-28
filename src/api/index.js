import axios from "axios";

export const getNotes = () => axios.get("http://localhost:3434/notes").then((res) => res.data)
export const addNote = (data) => axios.post("http://localhost:3434/notes", { ...data }).then((res) => res.data)
export const updateNote = (data) => {
  return axios.put(`http://localhost:3434/notes/${data._id}`, { ...data }).then((res) => res.data)
}