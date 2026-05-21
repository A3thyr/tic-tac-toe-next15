export const removePassword = <T extends { passwordHash?: string }>(
  entity: T,
): Omit<T, "passwordHash"> => {
  const { passwordHash, ...rest } = entity;
  void passwordHash;
  return rest;
};
