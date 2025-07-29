import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { deleteConnectionId, saveConnectionId } from "../api/sockets";

type MessageData =
    | { type: "resultado-emision"; success: boolean; message: string }
    | { type: string;[key: string]: any };

type WebSocketContextType = {
    socket: WebSocket | null;
    connected: boolean;
    connectionId: string | null;
    sendMessage: (data: object) => void;
    addListener: (handler: (data: MessageData) => void) => void;
    removeListener: (handler: (data: MessageData) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error("useWebSocket must be used within WebSocketProvider");
    return context;
};

const socketUrl = import.meta.env.VITE_SOCKET_URL;

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const listenersRef = useRef<((data: MessageData) => void)[]>([]);

    // Conexión WebSocket
    useEffect(() => {
        const ws = new WebSocket(socketUrl);
        setSocket(ws);

        ws.onopen = () => {
            console.log("✅ WebSocket conectado");
            ws.send(JSON.stringify({ action: 'init' }));
            setConnected(true);
        };

        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            // Primer mensaje desde serverless-offline contiene el connectionId
            if (data.type === 'connectionId') {
                const id = data.message;
                setConnectionId(id);
                const response = await saveConnectionId(id);
                console.log('🔗 connectionId:', id, response.success);
            }

            // Notificar a todos los listeners registrados
            listenersRef.current.forEach((listener) => listener(data));
        };

        ws.onclose = async () => {
            console.warn("❌ WebSocket cerrado");
            setConnected(false);
            setConnectionId(null);
            setSocket(null);
            await deleteConnectionId();
        };

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = (data: object) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        } else {
            console.warn("⚠️ WebSocket no está conectado.");
        }
    };

    const addListener = (handler: (data: MessageData) => void) => {
        listenersRef.current.push(handler);
    };

    const removeListener = (handler: (data: MessageData) => void) => {
        listenersRef.current = listenersRef.current.filter((h) => h !== handler);
    };

    return (
        <WebSocketContext.Provider
            value={{ socket, connected, connectionId, sendMessage, addListener, removeListener }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};
