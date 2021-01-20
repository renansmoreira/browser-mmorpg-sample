import express from 'express';
import http from 'http';

export default class HttpServer {
  server: http.Server;

  constructor() {
    this.server = new http.Server(express());
  }

  start() {
    const port = process.env.PORT || 80;
    this.server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}
