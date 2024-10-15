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
          <p><strong>Run ID: </strong>
            <Link to={`/runs/details/${event.runId}`}>
              {event.runId}
            </Link>
          </p>
          <p>
            <strong>Consortium: </strong>
            <Link to={`/consortia/details/${event.consortiumId}`}>
              {event.consortiumTitle}
            </Link>
          </p>
          <p><strong>Status: </strong> {event.status}</p>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;
