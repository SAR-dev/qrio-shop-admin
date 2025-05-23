import axios from "axios";
import { constants } from "./constants";

export function generateSlug(text: string): string {
  return text
    .toLowerCase() // convert to lowercase
    .trim() // remove surrounding whitespace
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric chars (except space and hyphen)
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
}

export const getImageUrl = ({
  id,
  filename
}: {
  id: string,
  filename: string
}) => `${import.meta.env.VITE_API_URL}/api/files/images/${id}/${filename}`

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = () => {
  const token = localStorage.getItem(constants.AUTH_TOKEN_API);
  api.defaults.headers['Authorization'] = token ? `Bearer ${JSON.parse(token)}` : "";
};

setAuthToken()