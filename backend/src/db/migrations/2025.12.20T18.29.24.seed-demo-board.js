/**
 * Migration: Seed realistic demo board for active dev team
 *
 * Purpose: Create a hyper-realistic board resembling an active software development team's workflow
 *
 * Changes:
 * - Creates new realistic team members (preserving existing test user)
 * - Creates "TaskFlow - Sprint 23" board with testuser as owner
 * - Adds realistic team members including testuser
 * - Creates 6 lists representing Scrum/Kanban workflow
 * - Seeds 24 cards with realistic development tasks
 * - Includes bugs, features, tech debt, and documentation cards
 * - Adds team collaboration comments
 * - Sets sprint due dates
 * - Assigns covers to priority items
 * - Distributes work across team members
 */

export const up = async ({ context }) => {
  const db = context;

  // Get the test user (must exist from seed)
  const testUser = await db
    .collection("users")
    .findOne({ username: "testuser" });

  if (!testUser) {
    throw new Error(
      "Test user not found. Please run initial seed migration first."
    );
  }

  // Create realistic team members for the demo board
  const teamMembers = [
    {
      email: "sarah.chen@taskflow.dev",
      username: "sarahchen",
      fullname: "Sarah Chen",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7fJZZ.BO0a", // hashed "demo123"
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      email: "alex.martinez@taskflow.dev",
      username: "alexm",
      fullname: "Alex Martinez",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7fJZZ.BO0a",
      createdAt: new Date("2024-04-10"),
      updatedAt: new Date("2024-04-10"),
    },
    {
      email: "jordan.kim@taskflow.dev",
      username: "jordank",
      fullname: "Jordan Kim",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7fJZZ.BO0a",
      createdAt: new Date("2024-05-20"),
      updatedAt: new Date("2024-05-20"),
    },
    {
      email: "emily.rodriguez@taskflow.dev",
      username: "emilyrodriguez",
      fullname: "Emily Rodriguez",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7fJZZ.BO0a",
      createdAt: new Date("2024-06-05"),
      updatedAt: new Date("2024-06-05"),
    },
    {
      email: "marcus.johnson@taskflow.dev",
      username: "marcusj",
      fullname: "Marcus Johnson",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7fJZZ.BO0a",
      createdAt: new Date("2024-07-12"),
      updatedAt: new Date("2024-07-12"),
    },
  ];

  // Insert team members
  const teamMembersResult = await db
    .collection("users")
    .insertMany(teamMembers);
  const teamMemberIds = Object.values(teamMembersResult.insertedIds);
  console.log(`✓ Created ${teamMemberIds.length} team members`);

  // Get all users for easy reference
  const sarah = await db.collection("users").findOne({ username: "sarahchen" });
  const alex = await db.collection("users").findOne({ username: "alexm" });
  const jordan = await db.collection("users").findOne({ username: "jordank" });
  const emily = await db
    .collection("users")
    .findOne({ username: "emilyrodriguez" });
  const marcus = await db.collection("users").findOne({ username: "marcusj" });

  // Create the board
  const boardLabels = [
    { title: "bug", color: "red" },
    { title: "feature", color: "green" },
    { title: "tech-debt", color: "yellow" },
    { title: "documentation", color: "blue" },
    { title: "priority:high", color: "red" },
    { title: "priority:medium", color: "orange" },
    { title: "priority:low", color: "gray" },
    { title: "frontend", color: "purple" },
    { title: "backend", color: "green" },
    { title: "design", color: "pink" },
    { title: "blocked", color: "red" },
    { title: "needs-review", color: "orange" },
  ];

  const board = {
    title: "TaskFlow - Sprint 23",
    description:
      "Main development board for TaskFlow project management platform. Sprint 23: Jan 15 - Jan 29, 2025. Focus: Real-time collaboration features, performance optimizations, and mobile app foundation.",
    appearance: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    labels: boardLabels,
    owner: {
      userId: testUser._id,
      username: testUser.username,
      fullname: testUser.fullname,
    },
    members: [
      {
        userId: testUser._id,
        username: testUser.username,
        fullname: testUser.fullname,
      },
      {
        userId: sarah._id,
        username: sarah.username,
        fullname: sarah.fullname,
      },
      {
        userId: alex._id,
        username: alex.username,
        fullname: alex.fullname,
      },
      {
        userId: jordan._id,
        username: jordan.username,
        fullname: jordan.fullname,
      },
      {
        userId: emily._id,
        username: emily.username,
        fullname: emily.fullname,
      },
      {
        userId: marcus._id,
        username: marcus.username,
        fullname: marcus.fullname,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const boardResult = await db.collection("boards").insertOne(board);
  const boardId = boardResult.insertedId;
  console.log(`✓ Created board: ${board.title}`);

  // Create lists
  const lists = [
    {
      boardId,
      title: "📋 Backlog",
      description: "Ideas and tasks for future sprints",
      position: "a0",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "🎯 Sprint Ready",
      description: "Refined and ready to start",
      position: "a1",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "🚧 In Progress",
      description: "Currently being worked on",
      position: "a2",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "👀 Code Review",
      description: "Awaiting peer review",
      position: "a3",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "🧪 QA/Testing",
      description: "Ready for quality assurance",
      position: "a4",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "✅ Done",
      description: "Shipped this sprint",
      position: "a5",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const listsResult = await db.collection("lists").insertMany(lists);
  const listIds = Object.values(listsResult.insertedIds);
  console.log(`✓ Created ${listIds.length} lists`);

  // Helper to get label IDs by title
  const getLabelIds = labelTitles => {
    return board.labels
      .filter(label => labelTitles.includes(label.title))
      .map(label => label._id);
  };

  // Sprint dates
  const sprintStart = new Date("2025-01-15");
  const sprintEnd = new Date("2025-01-29");
  const midSprint = new Date("2025-01-22");

  // Create cards
  const cards = [];

  // Backlog (4 cards)
  cards.push(
    {
      boardId,
      listId: listIds[0],
      title: "Research: WebRTC for video conferencing feature",
      description: `Investigate WebRTC implementation for adding video/audio calls to TaskFlow.

**Goals:**
- Evaluate WebRTC vs third-party services (Twilio, Agora)
- Assess infrastructure requirements
- Estimate development effort
- Consider mobile compatibility

**Success Criteria:**
- Technical feasibility report
- Cost analysis
- Recommended approach with pros/cons

**Resources:**
- [WebRTC Samples](https://webrtc.github.io/samples/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)`,
      position: "a0",
      labelIds: getLabelIds(["feature", "frontend", "backend", "priority:low"]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[0],
      title: "Mobile app foundation - React Native setup",
      description: `Begin mobile app development using React Native. Share codebase with web app where possible.

**Phase 1 Tasks:**
- [ ] Set up React Native project
- [ ] Configure iOS and Android builds
- [ ] Set up navigation structure
- [ ] Implement authentication flow
- [ ] Configure API client
- [ ] Set up push notifications

**Target Platforms:**
- iOS 14+
- Android 10+`,
      position: "a1",
      labelIds: getLabelIds(["feature", "frontend", "priority:medium"]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "This is our top priority for Q2. Let's make sure we allocate enough resources.",
          isEdited: false,
          createdAt: new Date("2025-01-12T14:00:00"),
          updatedAt: new Date("2025-01-12T14:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[0],
      title: "Implement activity log and audit trail",
      description: `Add comprehensive activity logging for compliance and debugging purposes.

**Track:**
- User actions (login, logout, profile changes)
- Board/card modifications (create, update, delete, move)
- Permission changes
- Failed authentication attempts
- API requests (rate limiting data)

**Storage:**
- Consider separate MongoDB collection for logs
- Implement log rotation (keep 90 days)
- Add filtering and search capabilities`,
      position: "a2",
      labelIds: getLabelIds(["feature", "backend", "priority:low"]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[0],
      title: "Design system documentation",
      description: `Create comprehensive design system docs including components, colors, typography, spacing, and interaction patterns.

**Deliverables:**
- Component library showcase
- Usage guidelines
- Accessibility standards
- Code examples
- Figma file integration`,
      position: "a3",
      labelIds: getLabelIds([
        "documentation",
        "design",
        "frontend",
        "priority:low",
      ]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Sprint Ready (3 cards)
  cards.push(
    {
      boardId,
      listId: listIds[1],
      title: "Add bulk card operations (move, archive, delete)",
      description: `Users need ability to perform actions on multiple cards simultaneously.

**Features:**
- Multi-select cards (checkbox UI)
- Bulk move to different list
- Bulk archive
- Bulk delete
- Bulk label assignment
- Bulk assignee changes

**UX Considerations:**
- Keyboard shortcuts (Shift+Click for range selection)
- Visual feedback during bulk operations
- Undo functionality
- Confirmation modal for destructive actions`,
      position: "a0",
      labelIds: getLabelIds(["feature", "frontend", "priority:medium"]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[1],
      title: "Performance: Optimize board loading for large datasets",
      description: `Board with 500+ cards is slow to load. Need to implement virtualization and lazy loading.

**Current Issues:**
- Initial load takes 3-5 seconds
- Memory usage spikes with many cards
- Scroll performance degrades

**Solutions:**
- Implement virtual scrolling for lists
- Lazy load card details
- Paginate card loading (load 50 at a time)
- Add loading skeletons
- Cache board data in Redis

**Target:**
- < 1 second initial load
- Smooth 60fps scrolling`,
      position: "a1",
      labelIds: getLabelIds([
        "tech-debt",
        "frontend",
        "backend",
        "priority:high",
      ]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
        {
          userId: testUser._id,
          username: testUser.username,
          fullname: testUser.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "Several enterprise customers have mentioned this. High impact fix!",
          isEdited: false,
          createdAt: new Date("2025-01-14T11:00:00"),
          updatedAt: new Date("2025-01-14T11:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[1],
      title: "Write E2E tests for critical user flows",
      description: `Add Playwright tests for core user journeys to prevent regressions.

**Test Scenarios:**
1. User signup and onboarding
2. Create board and add cards
3. Invite team members to board
4. Card drag and drop
5. Comment and @mention
6. Search functionality
7. File upload and preview

**Coverage Goal:** 80% of critical paths

**CI Integration:** Run on every PR`,
      position: "a2",
      labelIds: getLabelIds(["tech-debt", "priority:medium"]),
      assignees: [
        {
          userId: marcus._id,
          username: marcus.username,
          fullname: marcus.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // In Progress (5 cards)
  cards.push(
    {
      boardId,
      listId: listIds[2],
      title: "Implement @mentions in comments with notifications",
      description: `Allow users to mention team members in comments using @username syntax. Send real-time and email notifications.

**Progress:**
- [x] Parser for @username in comment text
- [x] Autocomplete dropdown UI
- [x] Link mentions to user profiles
- [ ] Real-time WebSocket notifications
- [ ] Email notification templates
- [ ] Notification preferences UI
- [ ] Batch digest option (hourly/daily)

**Technical Details:**
- Use regex to parse mentions: /@([a-zA-Z0-9_]+)/g
- Store mentioned user IDs in comment metadata
- Emit WebSocket event on mention create
- Queue email jobs in background worker`,
      position: "a0",
      cover: {
        img: null,
        color: "#0a4d1f",
        textOverlay: false,
      },
      labelIds: getLabelIds([
        "feature",
        "frontend",
        "backend",
        "priority:high",
      ]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: jordan._id,
            username: jordan.username,
            fullname: jordan.fullname,
          },
          text: "Frontend is about 80% complete. Just need to integrate with the notification API that @alexm is building.",
          isEdited: false,
          createdAt: new Date("2025-01-17T15:30:00"),
          updatedAt: new Date("2025-01-17T15:30:00"),
        },
        {
          author: {
            userId: alex._id,
            username: alex.username,
            fullname: alex.fullname,
          },
          text: "Notification API endpoints are ready! Check out the docs in Postman. Let me know if you need any changes.",
          isEdited: false,
          createdAt: new Date("2025-01-17T16:45:00"),
          updatedAt: new Date("2025-01-17T16:45:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[2],
      title:
        "Fix: Card positions sometimes get corrupted on concurrent updates",
      description: `Race condition causes cards to have duplicate positions or invalid fractional indices when multiple users drag cards simultaneously.

**Root Cause Analysis:**
- Optimistic UI updates without proper conflict resolution
- Position calculation happening client-side
- No locking mechanism for position updates

**Proposed Solution:**
1. Server-side position calculation
2. Implement optimistic locking with version numbers
3. Retry logic with exponential backoff
4. WebSocket sync to notify other clients of position changes

**Reproduction:**
1. Open same board in 2 browsers
2. Simultaneously drag cards in both
3. Positions get out of sync

**Priority:** High - affects data integrity`,
      position: "a1",
      cover: {
        img: null,
        color: "#9e1f1f",
        textOverlay: false,
      },
      labelIds: getLabelIds(["bug", "backend", "frontend", "priority:high"]),
      assignees: [
        {
          userId: testUser._id,
          username: testUser.username,
          fullname: testUser.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: testUser._id,
            username: testUser.username,
            fullname: testUser.fullname,
          },
          text: "I've identified the issue. Working on implementing server-side position validation. Should have a fix ready for review tomorrow.",
          isEdited: false,
          createdAt: new Date("2025-01-18T10:15:00"),
          updatedAt: new Date("2025-01-18T10:15:00"),
        },
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "Thanks for jumping on this quickly! Let me know if you need help testing the fix.",
          isEdited: false,
          createdAt: new Date("2025-01-18T11:00:00"),
          updatedAt: new Date("2025-01-18T11:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[2],
      title: "Add card templates for common task types",
      description: `Create reusable card templates to speed up task creation. Templates include predefined structure, checklists, and labels.

**Template Types:**
- Bug Report (description structure, repro steps, labels)
- Feature Request (user story format, acceptance criteria)
- Code Review (checklist, PR link field)
- Design Task (Figma link, design specs)
- Meeting Notes (agenda, attendees, action items)

**Implementation:**
- Template management UI in board settings
- Quick-create from template
- Template variables (assignee, due date, etc.)
- Share templates across boards`,
      position: "a2",
      labelIds: getLabelIds(["feature", "frontend", "priority:medium"]),
      assignees: [
        {
          userId: emily._id,
          username: emily.username,
          fullname: emily.fullname,
        },
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [
        {
          author: {
            userId: emily._id,
            username: emily.username,
            fullname: emily.fullname,
          },
          text: "Design mockups are complete! Working on the template management UI now.",
          isEdited: false,
          createdAt: new Date("2025-01-16T14:00:00"),
          updatedAt: new Date("2025-01-16T14:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[2],
      title: "Implement advanced search and filtering",
      description: `Enhanced search across boards, cards, and comments with filters.

**Search Capabilities:**
- Full-text search in card titles, descriptions, comments
- Filter by: assignee, label, due date, creation date
- Sort by: relevance, date, priority
- Save search queries
- Search within specific boards or across all boards

**Tech Stack:**
- Consider Elasticsearch for better search performance
- Or use MongoDB text indexes for simpler approach

**Current Status:**
- Basic search UI complete
- Backend API in progress
- Need to add filters and saved searches`,
      position: "a3",
      labelIds: getLabelIds([
        "feature",
        "frontend",
        "backend",
        "priority:medium",
      ]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[2],
      title: "Database migration: Add indexes for query performance",
      description: `Add MongoDB indexes to improve query performance on frequently accessed fields.

**Indexes to Add:**
\`\`\`javascript
// Boards collection
db.boards.createIndex({ "owner.userId": 1 })
db.boards.createIndex({ "members.userId": 1 })
db.boards.createIndex({ createdAt: -1 })

// Cards collection
db.cards.createIndex({ boardId: 1, listId: 1 })
db.cards.createIndex({ "assignees.userId": 1 })
db.cards.createIndex({ dueDate: 1 })
db.cards.createIndex({ labelIds: 1 })

// Lists collection
db.lists.createIndex({ boardId: 1, position: 1 })
\`\`\`

**Testing:**
- Run explain() on slow queries before/after
- Monitor index usage
- Check index size impact`,
      position: "a4",
      labelIds: getLabelIds(["tech-debt", "backend", "priority:low"]),
      assignees: [
        {
          userId: marcus._id,
          username: marcus.username,
          fullname: marcus.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Code Review (4 cards)
  cards.push(
    {
      boardId,
      listId: listIds[3],
      title: "Add keyboard navigation for accessibility",
      description: `Implement comprehensive keyboard navigation to meet WCAG 2.1 AA standards.

**Keyboard Shortcuts:**
- Tab/Shift+Tab: Navigate between interactive elements
- Enter/Space: Activate buttons and links
- Arrow keys: Navigate cards within list
- Escape: Close modals and menus
- ? : Show keyboard shortcuts help

**Focus Management:**
- Visible focus indicators
- Logical tab order
- Focus trap in modals
- Skip to main content link

**PR:** #342
**Testing:** Tested with screen readers (NVDA, JAWS, VoiceOver)`,
      position: "a0",
      labelIds: getLabelIds([
        "feature",
        "frontend",
        "priority:high",
        "needs-review",
      ]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: jordan._id,
            username: jordan.username,
            fullname: jordan.fullname,
          },
          text: "PR is ready for review! Tested extensively with keyboard-only navigation and screen readers. All WCAG 2.1 AA criteria met.",
          isEdited: false,
          createdAt: new Date("2025-01-18T09:30:00"),
          updatedAt: new Date("2025-01-18T09:30:00"),
        },
        {
          author: {
            userId: emily._id,
            username: emily.username,
            fullname: emily.fullname,
          },
          text: "This is fantastic work! The keyboard navigation feels very natural. Left a few minor UX suggestions on the PR.",
          isEdited: false,
          createdAt: new Date("2025-01-18T14:00:00"),
          updatedAt: new Date("2025-01-18T14:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[3],
      title: "Implement Redis caching for board data",
      description: `Add Redis caching layer to reduce database queries and improve response times.

**Caching Strategy:**
- Cache entire board objects (with lists and cards)
- TTL: 5 minutes for active boards
- Cache invalidation on updates via WebSocket events
- Implement cache-aside pattern

**Performance Gains:**
- Reduce DB queries by ~70%
- API response time: 300ms → 50ms
- Handle 10x more concurrent users

**Configuration:**
\`\`\`env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=300
\`\`\`

**PR:** #338
**Load Testing:** Completed with k6, handles 1000 concurrent users`,
      position: "a1",
      labelIds: getLabelIds([
        "feature",
        "backend",
        "priority:high",
        "needs-review",
      ]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: marcus._id,
            username: marcus.username,
            fullname: marcus.fullname,
          },
          text: "Reviewed the PR. The caching logic looks solid! One question about cache invalidation - are we handling board deletions?",
          isEdited: false,
          createdAt: new Date("2025-01-17T16:00:00"),
          updatedAt: new Date("2025-01-17T16:00:00"),
        },
        {
          author: {
            userId: alex._id,
            username: alex.username,
            fullname: alex.fullname,
          },
          text: "@marcusj Good catch! Added cache deletion on board delete. Updated the PR.",
          isEdited: false,
          createdAt: new Date("2025-01-17T17:30:00"),
          updatedAt: new Date("2025-01-17T17:30:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[3],
      title: "Security: Implement rate limiting per user",
      description: `Add per-user rate limiting to prevent abuse and ensure fair resource usage.

**Rate Limits:**
- Authentication endpoints: 5 attempts / 15 min
- Board creation: 10 boards / hour
- Card creation: 100 cards / hour
- File uploads: 20 files / hour (max 100MB total)
- API calls: 1000 requests / hour

**Implementation:**
- Use Redis for distributed rate limiting
- Return 429 Too Many Requests with Retry-After header
- Include rate limit info in response headers
- Whitelist admin users

**PR:** #340`,
      position: "a2",
      cover: {
        img: null,
        color: "#cc5529",
        textOverlay: true,
      },
      labelIds: getLabelIds([
        "feature",
        "backend",
        "priority:high",
        "needs-review",
      ]),
      assignees: [
        {
          userId: testUser._id,
          username: testUser.username,
          fullname: testUser.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: testUser._id,
            username: testUser.username,
            fullname: testUser.fullname,
          },
          text: "Rate limiting is implemented and tested. Ready for review!",
          isEdited: false,
          createdAt: new Date("2025-01-18T11:00:00"),
          updatedAt: new Date("2025-01-18T11:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[3],
      title: "Refactor: Extract WebSocket logic into service layer",
      description: `Current WebSocket code is scattered across controllers. Refactor into dedicated service for better maintainability.

**Benefits:**
- Centralized WebSocket logic
- Easier to test
- Reusable across features
- Better error handling
- Simplified controller code

**Changes:**
- Create \`websocket-service.js\`
- Move all socket.emit() calls to service
- Add comprehensive JSDoc comments
- Write unit tests (target 90% coverage)

**PR:** #335
**No Breaking Changes** - Internal refactor only`,
      position: "a3",
      labelIds: getLabelIds([
        "tech-debt",
        "backend",
        "priority:medium",
        "needs-review",
      ]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // QA/Testing (3 cards)
  cards.push(
    {
      boardId,
      listId: listIds[4],
      title: "Feature: Collaborative cursors (live presence)",
      description: `Show other users' cursors in real-time when they're viewing the same board. Similar to Figma/Google Docs.

**Features:**
- Display user avatar with cursor
- Show user's current focus (which card they're viewing)
- Cursor position updates via WebSocket
- Color-coded per user
- Toggle on/off in settings

**Status:** Development complete, in QA testing

**Test Cases:**
- [ ] Cursor appears for other users
- [ ] Cursor disappears when user leaves
- [ ] Performance with 10+ simultaneous users
- [ ] Mobile touch interactions
- [ ] Reconnection after network interruption`,
      position: "a0",
      labelIds: getLabelIds([
        "feature",
        "frontend",
        "backend",
        "priority:medium",
      ]),
      assignees: [
        {
          userId: emily._id,
          username: emily.username,
          fullname: emily.fullname,
        },
        {
          userId: testUser._id,
          username: testUser.username,
          fullname: testUser.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [
        {
          author: {
            userId: emily._id,
            username: emily.username,
            fullname: emily.fullname,
          },
          text: "Testing on staging looks great! The cursor animations are smooth. Just need to verify performance with many users.",
          isEdited: false,
          createdAt: new Date("2025-01-18T13:00:00"),
          updatedAt: new Date("2025-01-18T13:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[4],
      title: "Dark theme implementation",
      description: `Full dark mode support with system preference detection and manual toggle.

**Implementation:**
- CSS variables for theme switching
- Respect system preference (prefers-color-scheme)
- Toggle in user settings
- Smooth transition animation
- Accessible color contrast (WCAG AA)
- Persist user preference

**Testing:**
- [ ] All components render correctly
- [ ] Color contrast meets accessibility standards
- [ ] Images/logos have dark mode variants
- [ ] Charts and graphs readable
- [ ] Test on all pages`,
      position: "a1",
      labelIds: getLabelIds([
        "feature",
        "frontend",
        "design",
        "priority:medium",
      ]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: sprintEnd,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[4],
      title: "Documentation: API v2 Reference",
      description: `Complete REST API documentation for all v2 endpoints.

**Documentation Includes:**
- Authentication (JWT tokens)
- All endpoints with request/response examples
- Error codes and meanings
- Rate limiting details
- Webhook events
- Code samples (JavaScript, Python, cURL)

**Tool:** Using OpenAPI 3.0 / Swagger

**Status:** Draft complete, needs technical review before publishing

**URL:** https://docs.taskflow.dev/api/v2`,
      position: "a2",
      labelIds: getLabelIds(["documentation", "priority:high"]),
      assignees: [
        {
          userId: sarah._id,
          username: sarah.username,
          fullname: sarah.fullname,
        },
      ],
      archivedAt: null,
      startDate: sprintStart,
      dueDate: midSprint,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Done (5 cards)
  cards.push(
    {
      boardId,
      listId: listIds[5],
      title: "CI/CD pipeline with automated deployments",
      description: `Implemented complete CI/CD pipeline using GitHub Actions.

**Pipeline Stages:**
1. Lint and format check
2. Unit tests
3. Integration tests
4. Build Docker images
5. Deploy to staging (auto)
6. Run E2E tests
7. Deploy to production (manual approval)

**Benefits:**
- Faster deployments (30min → 8min)
- Automated testing catches bugs early
- Rollback capability
- Zero-downtime deployments

**Tech:** GitHub Actions, Docker, AWS ECS`,
      position: "a0",
      labelIds: getLabelIds(["feature", "tech-debt"]),
      assignees: [
        {
          userId: marcus._id,
          username: marcus.username,
          fullname: marcus.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-01-08"),
      dueDate: new Date("2025-01-14"),
      comments: [
        {
          author: {
            userId: marcus._id,
            username: marcus.username,
            fullname: marcus.fullname,
          },
          text: "Pipeline is live! We've done 5 deployments already and it's working flawlessly. Huge time saver!",
          isEdited: false,
          createdAt: new Date("2025-01-14T17:00:00"),
          updatedAt: new Date("2025-01-14T17:00:00"),
        },
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "This is amazing! Great work on this Marcus! 🚀",
          isEdited: false,
          createdAt: new Date("2025-01-14T17:30:00"),
          updatedAt: new Date("2025-01-14T17:30:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "File attachments on cards",
      description: `Users can now attach files to cards with preview support.

**Supported Formats:**
- Images: JPEG, PNG, GIF, WebP (with preview)
- Documents: PDF (with preview)
- Archives: ZIP (download only)
- Max size: 25MB per file

**Features:**
- Drag and drop upload
- Multiple file selection
- Progress indicator
- Delete attachments
- Download original files

**Storage:** AWS S3
**CDN:** CloudFront for fast delivery`,
      position: "a1",
      labelIds: getLabelIds(["feature", "frontend", "backend"]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-01-10"),
      dueDate: new Date("2025-01-15"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "Fix: Email notifications not sending for card assignments",
      description: `Users weren't receiving email notifications when assigned to cards.

**Root Cause:**
- Email queue worker was crashing silently
- Missing error logging
- No retry mechanism for failed emails

**Fix:**
- Added comprehensive error handling
- Implemented retry logic (3 attempts)
- Added monitoring and alerting
- Improved email templates

**Deployed:** Jan 13, 2025
**Status:** Monitoring - no issues reported`,
      position: "a2",
      cover: {
        img: null,
        color: "#9e1f1f",
        textOverlay: false,
      },
      labelIds: getLabelIds(["bug", "backend", "priority:high"]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-01-12"),
      dueDate: new Date("2025-01-13"),
      comments: [
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "Quick turnaround on this! Users are reporting emails are working now. Thanks!",
          isEdited: false,
          createdAt: new Date("2025-01-13T16:00:00"),
          updatedAt: new Date("2025-01-13T16:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "Board activity feed and recent changes",
      description: `Added activity feed showing recent changes on the board.

**Activity Types:**
- Card created/updated/deleted
- Card moved between lists
- Comments added
- Members added/removed
- Labels changed
- Attachments added

**Features:**
- Real-time updates
- Filter by activity type
- Filter by user
- Pagination (50 items per page)
- Grouped by day

**Location:** Right sidebar on board view`,
      position: "a3",
      labelIds: getLabelIds(["feature", "frontend", "backend"]),
      assignees: [
        {
          userId: testUser._id,
          username: testUser.username,
          fullname: testUser.fullname,
        },
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-01-09"),
      dueDate: new Date("2025-01-14"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "Upgrade to React 18 and Next.js 14",
      description: `Upgraded frontend to latest stable versions for performance and new features.

**Upgrades:**
- React 17 → React 18
- Next.js 13 → Next.js 14
- All dependencies updated

**New Features Available:**
- React Server Components
- Improved Suspense
- Automatic batching
- Transitions API
- Better hydration

**Migration Effort:** 3 days
**Breaking Changes:** None (backward compatible)
**Performance Gain:** ~15% faster page loads`,
      position: "a4",
      labelIds: getLabelIds(["tech-debt", "frontend"]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-01-11"),
      dueDate: new Date("2025-01-14"),
      comments: [
        {
          author: {
            userId: jordan._id,
            username: jordan.username,
            fullname: jordan.fullname,
          },
          text: "Upgrade complete! All tests passing. The new features in React 18 are going to be very useful for our real-time features.",
          isEdited: false,
          createdAt: new Date("2025-01-14T15:00:00"),
          updatedAt: new Date("2025-01-14T15:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Insert all cards
  await db.collection("cards").insertMany(cards);
  console.log(`✓ Created ${cards.length} realistic cards`);

  console.log("✓ Demo board seeding completed successfully!");
  console.log(
    `✓ Board: "${board.title}" with ${board.members.length} members including testuser`
  );
};

export const down = async ({ context }) => {
  const db = context;

  // Find the demo board
  const board = await db
    .collection("boards")
    .findOne({ title: "TaskFlow - Sprint 23" });

  if (board) {
    // Delete all cards for this board
    const cardsResult = await db
      .collection("cards")
      .deleteMany({ boardId: board._id });
    console.log(`✓ Deleted ${cardsResult.deletedCount} cards`);

    // Delete all lists for this board
    const listsResult = await db
      .collection("lists")
      .deleteMany({ boardId: board._id });
    console.log(`✓ Deleted ${listsResult.deletedCount} lists`);

    // Delete the board
    await db.collection("boards").deleteOne({ _id: board._id });
    console.log(`✓ Deleted board: ${board.title}`);
  }

  // Delete demo team members (but keep testuser)
  const demoUsernames = [
    "sarahchen",
    "alexm",
    "jordank",
    "emilyrodriguez",
    "marcusj",
  ];
  const usersResult = await db
    .collection("users")
    .deleteMany({ username: { $in: demoUsernames } });
  console.log(`✓ Deleted ${usersResult.deletedCount} demo team members`);

  console.log("✓ Demo board removal completed successfully");
};
