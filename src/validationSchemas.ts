import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(8),
  picture: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string().optional(),
  priority: z.number().optional(),
  budget: z.number().optional(),
  goals: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  feedback: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  resources: z
    .array(
      z.object({
        resourceId: z.string(),
        resourceType: z.string(),
        quantity: z.number(),
        allocatedAt: z.date(),
      }),
    )
    .optional(),
  teams: z.array(z.string()).optional(),
  changeLogs: z
    .array(
      z.object({
        change: z.string(),
        userId: z.string(),
      }),
    )
    .optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().optional(),
  priority: z.number().optional(),
  budget: z.number().optional(),
  goals: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  feedback: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  resources: z
    .array(
      z.object({
        resourceId: z.string(),
        resourceType: z.string(),
        quantity: z.number(),
        allocatedAt: z.date(),
      }),
    )
    .optional(),
  teams: z.array(z.string()).optional(),
  changeLogs: z
    .array(
      z.object({
        change: z.string(),
        userId: z.string(),
      }),
    )
    .optional(),
});

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  createdAt: z.date().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type CreateRoleBody = z.infer<typeof createRoleSchema>;
export type UpdateRoleBody = z.infer<typeof updateRoleSchema>;
export type CreateWorkspaceBody = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceBody = z.infer<typeof updateWorkspaceSchema>;
