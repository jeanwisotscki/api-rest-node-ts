import { server } from "./server/Server";

server.listen(process.env.PORT || 3333, () => {
  console.log(`Server online na porta ${process.env.PORT || 3333}`);
});
