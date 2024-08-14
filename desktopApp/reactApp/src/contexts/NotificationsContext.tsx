import { gql } from "@apollo/client";
import React, { ReactNode, useContext, useState, useRef } from "react";
import { ApolloClientsContext } from "./ApolloClientsContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const RUN_EVENT_SUBSCRIPTION = gql`
  subscription OnRunEvent {
    runEvent {
      consortiumId
      consortiumTitle
      runId
      status
      timestamp
    }
  }
`;

interface NotificationsContextType {
    events: RunEvent[];
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
}

interface RunEvent {
    consortiumId: string;
    consortiumTitle: string;
    runId: string;
    status: string;
    timestamp: string;
}

export const NotificationsContext = React.createContext<NotificationsContextType>({
    events: [],
    subscribe: async () => { },
    unsubscribe: async () => { },
});

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const [events, setEvents] = useState<RunEvent[]>([]);
    const subscriptionRef = useRef<any>(null);

    const subscribe = async (): Promise<void> => {
        console.log("Subscribing to run events...");
        if (subscriptionRef.current) {
            return; // Already subscribed
        }

        const observable = centralApiApolloClient?.subscribe({
            query: RUN_EVENT_SUBSCRIPTION,
        });

        subscriptionRef.current = observable?.subscribe({
            next: ({ data }: any) => {
                if (data) {
                    const newEvent: RunEvent = data.runEvent;
                    setEvents(prevEvents => [newEvent, ...prevEvents]);
                    toast.info(
                        <div>
                            <h2>Notification</h2>
                            <div>
                                Consortium: {newEvent.consortiumTitle}
                            </div>
                            <div>
                                Status: {newEvent.status}
                            </div>
                            <div>
                                    Run ID: {newEvent.runId}
                            </div>
                        </div>
                    );
                }
            },
            error: (err: any) => {
                console.error("Subscription error:", err.message);
                toast.error(`Subscription error: ${err.message}`);
            }
        });
    };

    const unsubscribe = async (): Promise<void> => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }
    };

    return (
        <NotificationsContext.Provider value={{ events, subscribe, unsubscribe }}>
            {children}
            <ToastContainer position="bottom-right" /> {/* Ensure this is included */}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    return useContext(NotificationsContext);
};
