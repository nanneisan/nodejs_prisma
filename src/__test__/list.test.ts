import request from "supertest";
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import Schema from "../app/graphql/Schema";
import Resolvers from "../app/graphql/Resolver";
import { context } from "../app/graphql/context";

const app = express();
const httpServer = http.createServer(app);
let server: ApolloServer;

beforeAll(async () => {
  server = new ApolloServer({
    typeDefs: Schema,
    resolvers: Resolvers,
    context,
  });
  await server.start();
  server.applyMiddleware({ app });

  await httpServer.listen({ port: 4000 });
});

let list = { title: "wereryer" };
let task = { title: "sderyterty", listId: "", position: 1 };
let listId: string = "";

describe("Create List", () => {
  test("Should be create new list", async () => {
    const query = `
    mutation AddList{
        addList(title: "${list.title}"){
            id
            title
        }
    }
  `;

    const response: any = await request(app)
      .post("/graphql")
      .type("json")
      .send(JSON.stringify({ query }));

    expect(response.statusCode).toEqual(200);

    let newList = JSON.parse(response.text).data.addList;
    listId = newList.id;

    expect(newList.title).toEqual(list.title);
  });
});

describe("Create Task", () => {
  test("Should be create new task", async () => {
    task.listId = listId;

    const query = `
    mutation AddTask{
        addTask(body: {title: "${task.title}", listId: "${task.listId}", position: ${task.position}}){
            title
            status
            position
        }
    }
  `;
    const response: any = await request(app)
      .post("/graphql")
      .type("json")
      .send(JSON.stringify({ query }));

    expect(response.statusCode).toEqual(200);
    let newTask = JSON.parse(response.text);

    expect(newTask).toEqual({
      data: {
        addTask: {
          title: task.title,
          status: "Open",
          position: task.position,
        },
      },
    });
  });
});

afterAll(async () => {
  await context.prisma.task.deleteMany({});
  await context.prisma.list.deleteMany({});

  await httpServer.close();
  await server.stop();
});
