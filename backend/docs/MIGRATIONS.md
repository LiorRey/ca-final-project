# MongoDB Migrations Guide

Complete guide for managing database migrations in this MongoDB/Mongoose project.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [MongoDB vs SQL Migrations](#mongodb-vs-sql-migrations)
- [When to Use Migrations](#when-to-use-migrations)
- [Migration Use Cases](#migration-use-cases)
- [Creating Migrations](#creating-migrations)
- [Running Migrations](#running-migrations)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Create a new migration
npm run migrate:create -- --name add-user-email-index.js

# Run all pending migrations
npm run migrate

# Check pending migrations
npm run migrate:pending

# Rollback last migration
npm run migrate:down
```

---

## Available Commands

### Create Migration

```bash
npm run migrate:create -- --name <migration-name>.js
```

Creates a new migration file with timestamp prefix in `src/db/migrations/`

**Example:**

```bash
npm run migrate:create -- --name create-user-indexes.js
# Creates: src/db/migrations/2025.11.22T16.30.45.create-user-indexes.js
```

### Run Migrations

```bash
# Run all pending migrations
npm run migrate

# Run a specific number of migrations
node src/db/migrate.js up --step 2
```

### Rollback Migrations

```bash
# Rollback last migration
npm run migrate:down

# Rollback specific number of migrations
node src/db/migrate.js down --step 2

# Rollback all migrations
node src/db/migrate.js down --to 0
```

### Check Migration Status

```bash
# List pending migrations
npm run migrate:pending

# List executed migrations
npm run migrate:executed
```

### Help

```bash
node src/db/migrate.js --help
node src/db/migrate.js create --help
```

---

## Project Structure

```
backend/
└── src/
    ├── db/
    │   ├── migrate.js              # CLI entry point
    │   ├── umzug.js                # Migration configuration
    │   └── migrations/             # Migration files
    │       └── 2025.11.22T16.30.45.create-user-indexes.js
    ├── models/                     # Mongoose models
    │   └── User.js
    └── config/
        └── database.js             # MongoDB connection
```

---

## MongoDB vs SQL Migrations

### Key Differences

| Aspect                    | SQL (MySQL/PostgreSQL)         | MongoDB + Mongoose              |
| ------------------------- | ------------------------------ | ------------------------------- |
| **Schema**                | Database-enforced              | Application-level (Mongoose)    |
| **Collections/Tables**    | Must be created via migrations | Created automatically           |
| **Structure**             | Rigid schema required          | Schema-less (flexible)          |
| **Migrations Needed For** | Creating tables, columns       | Indexes, data transforms, seeds |

### Coming from Rails/SQL?

**In Rails/MySQL:**

```ruby
# You MUST create migrations for tables
class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.timestamps
    end
  end
end
```

**In MongoDB/Mongoose:**

```javascript
// Just create a model - collection is created automatically!
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

**No migration needed for collection creation!**

When you first save a document:

```javascript
await User.create({ name: "John", email: "john@example.com" });
```

MongoDB automatically creates the `users` collection.

---

## When to Use Migrations

### ✅ You NEED Migrations For:

1. **Creating Indexes** (performance optimization)
2. **Data Transformations** (modifying existing data)
3. **Seeding Data** (initial/default data)
4. **Schema Evolution** (restructuring documents)
5. **Unique Constraints** (database-level validation)
6. **Collection Modifications** (capped collections, validators)

### ❌ You DON'T Need Migrations For:

1. **Creating Collections** - Mongoose models handle this
2. **Adding Fields to Schema** - Just update the Mongoose model
3. **Changing Field Types in Schema** - Update the model (for new documents)

---

## Migration Use Cases

### 1. Creating Indexes

**Why:** Improve query performance, enforce uniqueness

```javascript
// src/db/migrations/2025.11.22T16.30.00.create-user-indexes.js

export const up = async ({ context }) => {
  const db = context;

  // Create unique index on email
  await db
    .collection("users")
    .createIndex({ email: 1 }, { unique: true, name: "email_unique_idx" });

  // Create compound index for queries
  await db
    .collection("boards")
    .createIndex({ owner: 1, createdAt: -1 }, { name: "owner_created_idx" });

  // Text search index
  await db
    .collection("cards")
    .createIndex(
      { title: "text", description: "text" },
      { name: "card_search_idx" }
    );
};

export const down = async ({ context }) => {
  const db = context;

  await db.collection("users").dropIndex("email_unique_idx");
  await db.collection("boards").dropIndex("owner_created_idx");
  await db.collection("cards").dropIndex("card_search_idx");
};
```

### 2. Data Transformations

**Why:** Modify existing data structure, rename fields, change data types

```javascript
// src/db/migrations/2025.11.22T16.31.00.rename-user-fields.js

export const up = async ({ context }) => {
  const db = context;

  // Rename field across all documents
  await db
    .collection("users")
    .updateMany({}, { $rename: { fullname: "name" } });

  // Add new field with default value
  await db
    .collection("users")
    .updateMany({ role: { $exists: false } }, { $set: { role: "user" } });

  // Transform data type
  await db
    .collection("boards")
    .updateMany({ memberCount: { $type: "string" } }, [
      { $set: { memberCount: { $toInt: "$memberCount" } } },
    ]);
};

export const down = async ({ context }) => {
  const db = context;

  await db
    .collection("users")
    .updateMany({}, { $rename: { name: "fullname" } });

  await db.collection("users").updateMany({}, { $unset: { role: "" } });
};
```

### 3. Seeding Initial Data

**Why:** Add default/admin users, initial configuration, test data

```javascript
// src/db/migrations/2025.11.22T16.32.00.seed-admin-user.js

import bcrypt from "bcrypt";

export const up = async ({ context }) => {
  const db = context;

  // Check if admin exists
  const adminExists = await db.collection("users").findOne({ role: "admin" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db.collection("users").insertOne({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
};

export const down = async ({ context }) => {
  const db = context;

  await db.collection("users").deleteOne({
    email: "admin@example.com",
  });
};
```

### 4. Adding Computed Fields

**Why:** Add calculated/derived fields to existing documents

```javascript
// src/db/migrations/2025.11.22T16.33.00.add-full-name.js

export const up = async ({ context }) => {
  const db = context;

  const users = await db
    .collection("users")
    .find({
      fullname: { $exists: false },
    })
    .toArray();

  for (const user of users) {
    const fullname = `${user.firstName} ${user.lastName}`;
    await db
      .collection("users")
      .updateOne({ _id: user._id }, { $set: { fullname } });
  }
};

export const down = async ({ context }) => {
  const db = context;

  await db.collection("users").updateMany({}, { $unset: { fullname: "" } });
};
```

### 5. Restructuring Nested Data

**Why:** Change document structure, normalize/denormalize data

```javascript
// src/db/migrations/2025.11.22T16.34.00.restructure-address.js

export const up = async ({ context }) => {
  const db = context;

  // Move flat fields into nested object
  await db.collection("users").updateMany({ street: { $exists: true } }, [
    {
      $set: {
        address: {
          street: "$street",
          city: "$city",
          zipCode: "$zipCode",
        },
      },
    },
    {
      $unset: ["street", "city", "zipCode"],
    },
  ]);
};

export const down = async ({ context }) => {
  const db = context;

  // Flatten nested object back
  await db.collection("users").updateMany({ address: { $exists: true } }, [
    {
      $set: {
        street: "$address.street",
        city: "$address.city",
        zipCode: "$address.zipCode",
      },
    },
    {
      $unset: "address",
    },
  ]);
};
```

### 6. Data Migration Between Collections

**Why:** Split data, merge collections, reorganize

```javascript
// src/db/migrations/2025.11.22T16.35.00.split-activity-logs.js

export const up = async ({ context }) => {
  const db = context;

  // Move specific activity types to separate collection
  const userActivities = await db
    .collection("activities")
    .find({
      type: "user_action",
    })
    .toArray();

  if (userActivities.length > 0) {
    await db.collection("user_activities").insertMany(userActivities);

    await db.collection("activities").deleteMany({
      type: "user_action",
    });
  }
};

export const down = async ({ context }) => {
  const db = context;

  const userActivities = await db
    .collection("user_activities")
    .find({})
    .toArray();

  if (userActivities.length > 0) {
    await db.collection("activities").insertMany(userActivities);
    await db.collection("user_activities").deleteMany({});
  }
};
```

### 7. Creating Collection with Validation

**Why:** Add schema validation at database level

```javascript
// src/db/migrations/2025.11.22T16.36.00.add-user-validation.js

export const up = async ({ context }) => {
  const db = context;

  await db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "username"],
        properties: {
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          },
          username: {
            bsonType: "string",
            minLength: 3,
            maxLength: 30,
          },
          age: {
            bsonType: "int",
            minimum: 0,
            maximum: 120,
          },
        },
      },
    },
    validationLevel: "moderate",
  });
};

export const down = async ({ context }) => {
  const db = context;

  await db.command({
    collMod: "users",
    validator: {},
    validationLevel: "off",
  });
};
```

### 8. Bulk Data Updates

**Why:** Update large datasets efficiently

```javascript
// src/db/migrations/2025.11.22T16.37.00.update-timestamps.js

export const up = async ({ context }) => {
  const db = context;

  // Add timestamps to documents that don't have them
  const bulkOps = [];
  const users = await db
    .collection("users")
    .find({
      createdAt: { $exists: false },
    })
    .toArray();

  for (const user of users) {
    bulkOps.push({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            createdAt: new Date("2025-01-01"),
            updatedAt: new Date("2025-01-01"),
          },
        },
      },
    });
  }

  if (bulkOps.length > 0) {
    await db.collection("users").bulkWrite(bulkOps);
  }
};

export const down = async ({ context }) => {
  const db = context;

  // Remove the timestamps we added
  await db
    .collection("users")
    .updateMany({}, { $unset: { createdAt: "", updatedAt: "" } });
};
```

---

## Creating Migrations

### Migration Template

All new migrations follow this template:

```javascript
/**
 * Migration: <Description>
 *
 * Purpose: Explain why this migration is needed
 *
 * Changes:
 * - List specific changes
 * - Be detailed
 */

export const up = async ({ context }) => {
  const db = context; // MongoDB database instance

  // Your migration code here
  // Example: await db.collection('users').createIndex({ email: 1 });
};

export const down = async ({ context }) => {
  const db = context;

  // Rollback code here
  // Example: await db.collection('users').dropIndex({ email: 1 });
};
```

### Naming Conventions

Use descriptive, action-oriented names:

✅ **Good:**

- `create-user-email-index.js`
- `add-role-field-to-users.js`
- `seed-initial-boards.js`
- `rename-fullname-to-name.js`

❌ **Bad:**

- `migration1.js`
- `update.js`
- `fix.js`
- `changes.js`

---

## Running Migrations

### Development Workflow

```bash
# 1. Create migration
npm run migrate:create -- --name add-board-indexes.js

# 2. Edit the migration file
code src/db/migrations/2025.11.22T16.30.45.add-board-indexes.js

# 3. Check pending migrations
npm run migrate:pending

# 4. Run migrations
npm run migrate

# 5. Verify changes in MongoDB
mongosh
> use trello_clone
> db.boards.getIndexes()
```

### Production Deployment

```bash
# 1. Test migrations in staging first
npm run migrate:pending  # Check what will run
npm run migrate         # Apply migrations

# 2. Verify everything works
npm test                # Run your tests

# 3. Deploy to production
# (migrations run automatically in deployment pipeline, or manually:)
npm run migrate

# 4. If something goes wrong
npm run migrate:down    # Rollback last migration
```

---

## Best Practices

### 1. Always Write Rollback Logic

Every `up` migration should have a corresponding `down`:

```javascript
export const up = async ({ context }) => {
  await context.collection("users").createIndex({ email: 1 }, { unique: true });
};

export const down = async ({ context }) => {
  await context.collection("users").dropIndex({ email: 1 });
};
```

### 2. Make Migrations Idempotent

Migrations should be safe to run multiple times:

```javascript
export const up = async ({ context }) => {
  const db = context;

  // Check if index already exists
  const indexes = await db.collection("users").indexes();
  const emailIndexExists = indexes.some(idx => idx.name === "email_1");

  if (!emailIndexExists) {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
  }
};
```

### 3. Test Migrations Locally

```bash
# Run migration
npm run migrate

# Verify it worked
mongosh
> db.users.findOne()

# Test rollback
npm run migrate:down

# Verify rollback worked
mongosh
> db.users.getIndexes()
```

### 4. Handle Large Data Sets

For large collections, use batching:

```javascript
export const up = async ({ context }) => {
  const db = context;
  const batchSize = 1000;
  let skip = 0;

  while (true) {
    const users = await db
      .collection("users")
      .find({ status: { $exists: false } })
      .limit(batchSize)
      .skip(skip)
      .toArray();

    if (users.length === 0) break;

    await db.collection("users").bulkWrite(
      users.map(user => ({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { status: "active" } },
        },
      }))
    );

    skip += batchSize;
  }
};
```

### 5. Document Your Migrations

Add comments explaining the purpose:

```javascript
/**
 * Migration: Add unique email index
 *
 * Purpose: Prevent duplicate user emails in the system
 *
 * Changes:
 * - Creates unique index on users.email field
 * - Will fail if duplicate emails exist (clean data first!)
 *
 * Related: Ticket #PROJ-123
 */
export const up = async ({ context }) => {
  // ... implementation
};
```

---

## Troubleshooting

### Migration Fails

```bash
# Check what failed
npm run migrate:executed  # See which ran
npm run migrate:pending   # See which are pending

# Fix the migration file
# Then run again
npm run migrate
```

### Duplicate Key Error

```bash
Error: E11000 duplicate key error
```

**Solution:** Clean duplicate data before creating unique index:

```javascript
export const up = async ({ context }) => {
  const db = context;

  // Find and remove duplicates first
  const duplicates = await db
    .collection("users")
    .aggregate([
      { $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  for (const dup of duplicates) {
    // Keep first, remove rest
    const [keep, ...remove] = dup.ids;
    await db.collection("users").deleteMany({
      _id: { $in: remove },
    });
  }

  // Now create unique index
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
};
```

### Migration Hangs

**Issue:** MongoDB connection not closing

**Solution:** Already handled in `src/db/migrate.js` - connection closes in `finally` block

### Can't Find Migration File

```bash
Error: Couldn't infer a directory to generate migration file in
```

**Solution:** Use `--folder` flag:

```bash
npm run migrate:create -- --name my-migration.js --folder src/db/migrations
```

Or configure default in `src/db/umzug.js` (already done in this project).

---

## Additional Resources

- [Umzug Documentation](https://github.com/sequelize/umzug)
- [MongoDB Update Operators](https://www.mongodb.com/docs/manual/reference/operator/update/)
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/)
- [Mongoose Schema Indexes](https://mongoosejs.com/docs/guide.html#indexes)

---

## Summary

**Key Takeaways:**

1. ✅ **Collections** = Created automatically by Mongoose (no migration needed)
2. ✅ **Indexes** = Use migrations for performance and uniqueness
3. ✅ **Data Changes** = Use migrations to transform existing data
4. ✅ **Seeds** = Use migrations for initial/default data
5. ✅ **Schema Changes in Model** = Just update Mongoose model (for new documents)
6. ✅ **Schema Changes in Data** = Use migrations to update existing documents

**When in doubt:** If you're modifying existing data or need indexes, use a migration. If you're just defining structure for new documents, use Mongoose models.
