const allRoles = {
  client: [
    "getContracts",
    "createContract",
    "updateContract",
    "deleteContract",
  ],
  freelancer: [
    "getContracts",
    "createContract",
    "updateContract",
    "deleteContract",
  ],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(
  Object.entries(allRoles)
);
