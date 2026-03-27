import axios from "axios";

const BASENAME = (
  window as Window & typeof globalThis & { DCS_BASENAME: string }
).DCS_BASENAME;
const http = axios.create({
  baseURL: `${BASENAME}api`,
});

export function useHttp() {
  return http;
}
