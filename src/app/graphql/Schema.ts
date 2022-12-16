import { gql } from "apollo-server-express"; //will create a schema

const Schema = gql`
  type List {
    id: ID!
    title: String
    tasks: [Task]
  }

  type Task {
    id: ID!
    title: String!
    body: String
    listId: ID!
    status: String
    position: Int
    list: List
  }

  input ITask {
    title: String!
    status: String
    position: Int
    listId: String!
  }

  input IUpdateTask {
    status: String
    title: String
  }

  #handle user commands
  type Query {
    getAllList: [List]
    getList(id: String): List

    getAllTaskByListId(listId: String): [Task]
    getTask(id: String): Task
  }

  type Mutation {
    #the addPerson commmand will accept an argument of type String.
    #it will return a 'Person' instance.
    addList(title: String): List

    addTask(body: ITask): Task
    updateTask(id: String, body: IUpdateTask): Task
    moveTask(id: String, listId: String, position: Int): Task
  }
`;
export default Schema;
