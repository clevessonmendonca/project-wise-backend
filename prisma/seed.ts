import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação de Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Administrator role with full permissions',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'User',
      description: 'Regular user role',
    },
  });

  // Criação de Permissions
  const readPermission = await prisma.permission.create({
    data: {
      name: 'READ',
      description: 'Read access',
    },
  });

  const writePermission = await prisma.permission.create({
    data: {
      name: 'WRITE',
      description: 'Write access',
    },
  });

  // Associações de Permissions a Roles
  await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      permissionId: readPermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      permissionId: writePermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: userRole.id,
      permissionId: readPermission.id,
    },
  });

  // Criação de um User
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'securepassword',
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  // Criação de um Project
  const project = await prisma.project.create({
    data: {
      name: 'Project Alpha',
      description: 'Description for Project Alpha',
      users: {
        connect: [{ id: user.id }],
      },
    },
  });

  // Criação de uma Task
  const task = await prisma.task.create({
    data: {
      title: 'Sample Task',
      description: 'Description of the sample task',
      projectId: project.id,
      assignees: {
        connect: [{ id: user.id }],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch(e => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
