import React, { Component } from "react";
import { Card, Container, Typography } from "@mui/material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // do nothing
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Card
            sx={{
              height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            <Typography variant="h5">システムエラーです</Typography>
            <Typography variant="body">
              お手数ですが管理者までお問い合わせください
            </Typography>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
