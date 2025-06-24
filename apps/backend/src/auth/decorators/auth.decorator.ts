import { SetMetadata, UseGuards, CanActivate } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../interfaces/roles.interface';
import { AuthGuard } from '../guards/auth.guard';

export const Auth = (...roles: UserRole[]) => {
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata('roles', roles)(target, propertyKey, descriptor);

    UseGuards(AuthGuard as unknown as CanActivate)(
      target,
      propertyKey,
      descriptor,
    );

    ApiBearerAuth('JWT-auth')(target, propertyKey, descriptor);

    return descriptor;
  };
};
