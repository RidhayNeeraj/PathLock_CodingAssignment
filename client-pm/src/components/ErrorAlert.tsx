import React from 'react';
import { Alert } from 'react-bootstrap';

// This component will show an error message and a close button
interface ErrorAlertProps {
  error: string;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <Alert.Heading>An Error Occurred</Alert.Heading>
      <p>{error}</p>
    </Alert>
  );
};