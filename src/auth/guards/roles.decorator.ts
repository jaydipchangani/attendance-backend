// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

// Usage: @Roles('ADMIN', 'USER')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
