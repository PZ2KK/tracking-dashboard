import { createServer } from "json-server";

const server = createServer();
const router = createServer.router("mock-data.json");
const middlewares = createServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});
