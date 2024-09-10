import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    { name: 'READ', description: 'Permission to read data' },
    { name: 'WRITE', description: 'Permission to write data' },
    { name: 'DELETE', description: 'Permission to delete data' },
    {
      name: 'admin',
      description: 'Permission to assign roles to users',
    },
  ];

  // Cria permissões se não existirem
  for (const permission of permissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission.name },
    });

    if (!existingPermission) {
      await prisma.permission.create({
        data: permission,
      });
      console.log(`Permission '${permission.name}' created.`);
    } else {
      console.log(`Permission '${permission.name}' already exists.`);
    }
  }

  // Define as roles
  const roles = [
    { name: 'user', description: 'Standard user role' },
    { name: 'admin', description: 'Administrator role' },
  ];

  // Cria roles se não existirem
  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (!existingRole) {
      const createdRole = await prisma.role.create({
        data: role,
      });
      console.log(`Role '${role.name}' created.`);

      // Atribuir todas as permissões ao papel 'admin'
      if (role.name === 'admin') {
        const allPermissions = await prisma.permission.findMany();
        for (const permission of allPermissions) {
          await prisma.rolePermission.create({
            data: {
              roleId: createdRole.id,
              permissionId: permission.id,
            },
          });
        }
        console.log(`All permissions assigned to 'admin' role.`);
      }
    } else {
      console.log(`Role '${role.name}' already exists.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
