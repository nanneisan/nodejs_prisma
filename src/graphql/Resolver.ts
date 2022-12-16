const Resolvers = {
  Query: {
    getAllList: async (parent: any, args: any, context: any) => {
      return await context.prisma.list.findMany({
        include: {
          tasks: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });
    },
    getList: async (_: any, args: any, context: any) => {
      return await context.prisma.list.findUnique({ where: { id: args.id } });
    },
    getAllTaskByListId: async (parent: any, args: any, context: any) => {
      return await context.prisma.task.findMany({
        where: { listId: args.listId },
        include: { list: true },
      });
    },
    getTask: async (_: any, args: any, context: any) => {
      return await context.prisma.task.findFirst({
        where: { id: args.id },
        include: { list: true },
      });
    },
  },

  Mutation: {
    //create our mutation:
    addList: async (_: any, args: any, context: any) => {
      const newList = {
        title: args.title,
      };
      return await context.prisma.list.create({ data: newList }); //return the new object's result
    },
    addTask: async (_: any, args: any, context: any) => {
      let { title, status, position, listId } = args.body;
      return await context.prisma.task.create({
        data: {
          title,
          status,
          listId,
          position,
        },
      });
    },
    updateList: async (_: any, args: any, context: any) => {
      return await context.prisma.list.update({
        where: { id: args.id },
        data: {
          title: args.title,
        },
      });
    },
    updateTask: async (_: any, args: any, context: any) => {
      let { title, status } = args.body;
      return await context.prisma.task.update({
        where: { id: args.id },
        data: {
          title,
          status,
        },
        include: { list: true },
      });
    },
    deleteList: async (_: any, args: any, context: any) => {
      await context.prisma.task.deleteMany({
        where: { listId: args.id },
      });

      return await context.prisma.list.delete({
        where: { id: args.id },
      });
    },
    deleteTask: async (_: any, args: any, context: any) => {
      let oldTask = await context.prisma.task.findFirst({
        where: { id: args.id },
      });

      if (oldTask) {
        await context.prisma.task.updateMany({
          where: { position: { gt: oldTask.position } },
          data: { position: { decrement: 1 } },
        });
      }
      return await context.prisma.task.delete({
        where: { id: args.id },
      });
    },
    moveTask: async (_: any, args: any, context: any) => {
      const { id, listId, position: newPosition } = args;
      const oldTask = await context.prisma.task.findFirst({
        where: { id: id },
      });

      // change position in same list
      if (oldTask?.listId == listId) {
        if (newPosition < oldTask.position) {
          // chagne position of tasks that greater than equal of newPosition and less than of oldPosition in old list
          await context.prisma.task.updateMany({
            where: {
              listId: listId,
              position: { gte: newPosition, lt: oldTask.position },
            },
            data: { position: { increment: 1 } },
          });
        } else {
          // chagne position of tasks that greater than of oldPostion and less than equal of newPosition in old list
          await context.prisma.task.updateMany({
            where: {
              listId: listId,
              position: { gt: oldTask.position, lte: newPosition },
            },
            data: { position: { decrement: 1 } },
          });
        }

        // change position of old task
        return await context.prisma.task.update({
          where: { id: id },
          data: { position: newPosition },
          include: { list: true },
        });
      } else {
        // change position of tasks that greater than and equal of newPosition in new list
        await context.prisma.task.updateMany({
          where: { listId: listId, position: { gte: newPosition } },
          data: { position: { increment: 1 } },
        });

        // change position of tasks that greater than newPosition in old list
        await context.prisma.task.updateMany({
          where: { listId: oldTask.listId, position: { gt: oldTask.position } },
          data: { position: { decrement: 1 } },
        });

        // change lsitId and position of old task
        return context.prisma.task.update({
          where: { id: id },
          data: { listId: listId, position: newPosition },
          include: {
            list: true,
          },
        });
      }
    },
  },
};
export default Resolvers;
