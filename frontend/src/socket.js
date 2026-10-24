import { io } from "socket.io-client";

export const socket = io("https://proconnect-m0rx.onrender.com", {
  withCredentials: true,
});
