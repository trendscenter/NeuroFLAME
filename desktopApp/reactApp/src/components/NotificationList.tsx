import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import styles from './styles';

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
        {events.map((event, index) => (
            <Card 
            key={index} 
            sx={styles.card}
            >
            <p>
              <Link to={`/consortia/details/${event.consortiumId}`}>
                <strong>
                  {event.consortiumTitle}
                </strong>
              </Link>
            </p>
            <p><strong>Run ID:</strong> {event.runId}</p>
            <p><strong>Status:</strong> {event.status}</p>
          </Card>
        ))}
    </div>
  );
};

export default NotificationList;
