import React, {Component} from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    document.location.href = 'http://localhost:3000/login'
  }

  render() {
    if (this.state.hasError) {

      return <h1>Redirecting...</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary
