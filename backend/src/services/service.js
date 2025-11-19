export async function getUserById(id) {
  return { id, name: "Example User" };
}

export async function createUser(userData) {
  return { id: 1, ...userData };
}
