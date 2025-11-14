import { faker } from "@faker-js/faker";

export function generateUser(options = {}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username();

  const user = {
    _id: faker.string.uuid(),
    username,
    password: faker.internet.password({ length: 8 }),
    fullname: `${firstName} ${lastName}`,
    imgUrl:
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
    score: faker.number.int({ min: 5000, max: 50000 }),
    isAdmin: faker.datatype.boolean({ probability: 0.1 }),
    ...options,
  };

  return user;
}

export function generateAdminUser(options = {}) {
  return generateUser({
    isAdmin: true,
    score: faker.number.int({ min: 25000, max: 100000 }),
    fullname: faker.person.fullName() + " (Admin)",
    ...options,
  });
}

export function generateMultipleUsers(count = 10, options = {}) {
  const { includeAdmin = true, minScore = 5000, maxScore = 50000 } = options;

  const users = Array.from({ length: count }, () =>
    generateUser({
      score: faker.number.int({ min: minScore, max: maxScore }),
    })
  );

  if (includeAdmin && count > 0) {
    users[0] = generateAdminUser();
  }

  return users;
}

export function generateSampleUsers() {
  const regularUsers = generateMultipleUsers(8, {
    includeAdmin: false,
    minScore: 10000,
    maxScore: 30000,
  });

  const adminUser = generateAdminUser({
    username: "admin",
    fullname: "System Administrator",
    score: 100000,
  });

  const testUser = generateUser({
    username: "testuser",
    fullname: "Test User",
    password: "test",
    score: 15000,
    isAdmin: false,
  });

  return {
    allUsers: [adminUser, testUser, ...regularUsers],
    adminUser,
    testUser,
    regularUsers,
  };
}

export function generateUserCredentials(options = {}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username();

  return {
    username,
    password: faker.internet.password({ length: 8 }),
    fullname: `${firstName} ${lastName}`,
    imgUrl: faker.image.avatar(),
    ...options,
  };
}

export default {
  generateUser,
  generateAdminUser,
  generateMultipleUsers,
  generateSampleUsers,
  generateUserCredentials,
};
