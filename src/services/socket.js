import io from "socket.io-client";
// import { SOCKET_URL } from "config";

export const socket = io('https://socket.farmaonline.com.ve:3003',{
    resource: '/socket.io',
    transports:['websocket', 'polling']
});

// export const socket = io('http://192.168.56.1:5000');