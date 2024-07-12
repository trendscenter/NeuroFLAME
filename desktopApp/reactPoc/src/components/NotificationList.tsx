import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import { Link } from 'react-router-dom';

interface RunEvent {
  consortiumId: string;
  consortiumTitle: string;
  runId: string;
  status: string;
  timestamp: string;
}

interface NotificationListProps {
  events?: RunEvent[];
}

const NotificationList: React.FC<NotificationListProps> = () => {
  const { events } = useNotifications();

  // Sort the events by timestamp
  const sortedEvents = events.sort((a, b) => {
    return new Date(Number(b.timestamp)).getTime() - new Date(Number(a.timestamp)).getTime()
  });

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {sortedEvents.map((event, index) => (
          <li key={index}>
            <p>
              <Link to={`/consortia/${event.consortiumId}`}>
                <strong>
                  {event.consortiumTitle}
                </strong>
              </Link>
            </p>
            <p><strong>Run ID:</strong> {event.runId}</p>
            <p><strong>Status:</strong> {event.status}</p>
            <p><strong>Timestamp:</strong> {event.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
