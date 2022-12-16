## Nodejs Project with Prisma, GraphQl and Jest

#### To get this project up and running kindly follow the following intructions.

1. run git clone `git@github.com:nanneisan/nodejs_prisma.git`
2. cd to the root directory `cd nodejs_prisma`
3. run `npm install`

#### Create .env file in your root directory

DATABASE*URL="mysql://\_USER*:_PASSWORD_@_DB-PORT_/_DB-NAME_?schema=public"

#### Run prisma migrations

We have two basic model, let's run our initial migration.

1. run `npx prisma migrate dev --name first`

#### To do the test

1. run `npm run test`

#### To run the project in dev

1. run `npm run dev`

#### Here is a few of the Mutations and Queries that can be done on this application.

For a Comprehesive list open http://localhost:4000/graphql on your local browser.

```
mutation AddList {
  addList(title: "To Do"){
    title
  }
}

mutation AddTask {
  addTask(body: {"title": "Test Mobile",
    "listId": LISTID,
    "position": 1}) {
        title
        status
        position
        list {
            title
        }
  }
}

mutation UpdateList {
  updateList(id: LISTID, title: "Do") {
    title
  }
}

mutation UpdateTask {
  updateTask(id: ID, body: {title: "Test API", status: "InProgress"}) {
    title
    status
    position
    list {
        title
    }
  }
}


mutation DeleteList {
  deleteList(id: LISTID) {
    title
  }
}

mutation DeleteTask {
  deleteTask(id: TASKID) {
    title
  }
}

mutation MoveTask {
  moveTask(id: ID, listId: LISTID, position: 1) {
    title
    status
    position
    list{
      title
    }
  }
}

query{
   getAllList {
    id
    title
    tasks{
      id
      listId
      title
      status
      position
    }

    getAllTaskByListId(listId: LISTID) {
        id
        title
        status
        position
        list {
            title
        }
    }

    getList(id: ID) {
        title
        task{
            title
            status
            position
        }
    }

    getTask(id: ID) {
        id
        title
        status
        position
        list {
            title
        }
    }
  }
}
```
