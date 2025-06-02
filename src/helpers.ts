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

const formatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatTimestamp(timestamp: string | number | Date): string {
  const date = new Date(timestamp);

  const parts = formatter.formatToParts(date);
  const map: { [key: string]: string } = {};
  parts.forEach(p => {
    if (p.type !== 'literal') {
      map[p.type] = p.value;
    }
  });

  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}`;
}

export const getImageUrl = ({
  id,
  filename,
  wxh
}: {
  id: string,
  filename: string,
  wxh?: string
}) => `${import.meta.env.VITE_API_URL}/api/files/images/${id}/${filename}${wxh ? `?thumb=${wxh}` : ""}`

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = () => {
  const token = localStorage.getItem(constants.AUTH_TOKEN_API);
  api.defaults.headers['Authorization'] = token ? `Bearer ${JSON.parse(token)}` : "";
};

setAuthToken()