export function isMemberOfArray(userId, members) {
  return members.some(member => member.userId.toString() === userId.toString());
}

export function isOwner(userId, ownerId) {
  return ownerId.toString() === userId.toString();
}
