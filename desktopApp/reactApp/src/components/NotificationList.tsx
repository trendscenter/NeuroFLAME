import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import { Link } from 'react-router-dom';

interface RunEvent {
  consortiumId: string;
  consortiumTitle: string;
  runId: string;
  status: string;
}

interface NotificationListProps {
  events?: RunEvent[];
}

const NotificationList: React.FC<NotificationListProps> = () => {
  const { events } = useNotifications();

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {events.map((event, index) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
