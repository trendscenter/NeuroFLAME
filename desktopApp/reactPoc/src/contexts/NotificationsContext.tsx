import { gql } from "@apollo/client";
import React, { ReactNode, useContext, useEffect, useState, useRef } from "react";
import { ApolloClientsContext } from "./ApolloClientsContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RUN_EVENT_SUBSCRIPTION = gql`
  subscription OnRunEvent {
    runEvent {
      consortiumId
      consortiumTitle
      runId
      status
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
}

export const NotificationsContext = React.createContext<NotificationsContextType>({
    events: [],
    subscribe: async () => {},
    unsubscribe: async () => {},
});

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const [events, setEvents] = useState<RunEvent[]>([]);
    const subscriptionRef = useRef<any>(null);

    const subscribe = async (): Promise<void> => {
        if (subscriptionRef.current) {
            return; // Already subscribed
        }

        return new Promise((resolve, reject) => {
            const observable = centralApiApolloClient?.subscribe({
                query: RUN_EVENT_SUBSCRIPTION,
            });

            subscriptionRef.current = observable?.subscribe({
                next: ({ data }: any) => {
                    console.log("Subscription data:", data)
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
                    resolve();
                },
                error: (err: any) => {
                    console.error("Subscription error:", err.message);
                    toast.error(`Subscription error: ${err.message}`);
                    reject(err);
                }
            });
        });
    };

    const unsubscribe = async (): Promise<void> => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }
    };

    useEffect(() => {
        (async () => {
            await subscribe(); // Automatically subscribe on mount
        })();

        return () => {
            (async () => {
                await unsubscribe(); // Cleanup subscription on unmount
            })();
        };
    }, []);

    return (
        <NotificationsContext.Provider value={{ events, subscribe, unsubscribe }}>
            {children}
            <ToastContainer /> {/* Ensure this is included */}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    return useContext(NotificationsContext);
};
