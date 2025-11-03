import {io} from 'socket.io-client';

export function connectWS(){
    return io('http://10.0.2.2:8000')
}