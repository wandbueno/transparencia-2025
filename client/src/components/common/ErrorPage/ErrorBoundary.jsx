import React from 'react';
import ErrorPage from './ErrorPage';
import { handleApiError } from '../../../services/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error: handleApiError(error) };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorPage
          type={this.state.error.type}
          message={this.state.error.message}
          details={this.state.error.details}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;