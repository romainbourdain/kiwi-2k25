import { Course, CourseStatus, User, UserRole } from "@prisma/client";

export type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

export type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  courses: {
    dataType: Course;
    action: "view" | "create" | "update" | "delete";
  };
  admin: {
    dataType: null;
    action: "view";
  };
  sections: {
    dataType: Course;
    action: "view" | "create" | "update" | "delete";
  };
  lessons: {
    dataType: Course;
    action: "view" | "create" | "update" | "delete";
  };
};

export const ROLES = {
  ADMIN: {
    courses: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    sections: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    lessons: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    admin: {
      view: true,
    },
  },
  TEACHER: {
    courses: {
      view: true,
      create: true,
      update: (user, course) => user.id === course.authorId,
      delete: (user, course) => user.id === course.authorId,
    },
    sections: {
      view: true,
      create: (user, course) => user.id === course.authorId,
      update: (user, course) => user.id === course.authorId,
      delete: (user, course) => user.id === course.authorId,
    },
    lessons: {
      view: true,
      create: (user, course) => user.id === course.authorId,
      update: (user, course) => user.id === course.authorId,
      delete: (user, course) => user.id === course.authorId,
    },
    admin: {
      view: true,
    },
  },
  USER: {
    courses: {
      view: (_, section) => section.status === CourseStatus.PUBLIC,
    },
    sections: {
      view: (_, section) => section.status === CourseStatus.PUBLIC,
    },
    lessons: {
      view: (_, lesson) => lesson.status === CourseStatus.PUBLIC,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const permission = (ROLES as RolesWithPermissions)[user.role][resource]?.[
    action
  ];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data);
}
