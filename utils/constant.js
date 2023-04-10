import { isEmpty } from "./utils";
let testMode;
export let INSTITUTE_ID;

export let ACCESS_TOKEN;
export let REFRESH_TOKEN;
export let OWNER_ID;
export let Host_ORIGIN;

if (typeof window !== "undefined") {
  testMode = Number(window.sessionStorage.getItem("testMode")) || 0;

  INSTITUTE_ID = window.localStorage.getItem("INSTITUTE_ID");

  ACCESS_TOKEN = window.localStorage.getItem("ACCESS_TOKEN");

  OWNER_ID = window.localStorage.getItem("OWNER_ID");
  REFRESH_TOKEN = window.localStorage.getItem("REFRESH_TOKEN");
  Host_ORIGIN = window.location.origin;
}
export let host = "https://api.ostello.co.in";
export const cdnHost = "https://cdn.ostello.co.in";

export const geo_api_url = (lat, lng) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=false&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
export const geo_api_search_url = (searchText) =>
  `https://maps.googleapis.com/maps/api/geocode/json?address=${searchText}&region=in&sensor=true&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

export const community_group_link =
  "https://chat.whatsapp.com/K2TxCrG5ySo4ryBufzBIqO";

export const AuthenticationHeaders = {
  "Access-Control-Allow-Origin": "*",
  Authorization: `Bearer ${ACCESS_TOKEN}}`,
};

export const LogOut = () => {
  localStorage.clear();
  typeof window !== 'undefined' && window.location.replace("/");
};

export const isAuthenticated = !isEmpty(ACCESS_TOKEN) && !isEmpty(OWNER_ID);
