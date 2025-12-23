/**
 * Migration: Seed demo board for Kanbox project presentation
 *
 * Purpose: Create a realistic demo board showcasing the Kanbox Dev Team's workflow
 *
 * Changes:
 * - Creates 3 team members (Saveliy S, Lior Rey, Vlad G)
 * - Creates 3 additional team members (Sarah, Alex, Jordan)
 * - Creates "Kanbox - Dev Team" board with sea background
 * - Creates 6 lists (Backlog, To Do, In Progress, Code Review, QA, Done)
 * - Seeds 31 cards distributed across lists (14, 4, 2, 2, 2, 5)
 * - Uses HTML formatting for descriptions and comments
 * - Adds realistic team collaboration and comment discussions
 * - Includes card covers with realistic colors
 * - Lior has 0 cards in progress, 2 in review, 2 in to do
 */

import { ObjectId } from 'mongodb';

export const up = async ({ context }) => {
  const db = context;

  // Clean up any existing demo data first (make migration idempotent)
  console.log("Cleaning up any existing demo data...");

  const existingBoard = await db
    .collection("boards")
    .findOne({ title: "Kanbox - Dev Team" });

  if (existingBoard) {
    await db.collection("cards").deleteMany({ boardId: existingBoard._id });
    await db.collection("lists").deleteMany({ boardId: existingBoard._id });
    await db.collection("boards").deleteOne({ _id: existingBoard._id });
    console.log("✓ Cleaned up existing demo board");
  }

  const demoUsernames = [
    "sabellius",
    "Lior_Rey",
    "VladG",
    "sarahchen",
    "alexm",
    "jordank",
  ];
  const deletedUsers = await db
    .collection("users")
    .deleteMany({ username: { $in: demoUsernames } });
  if (deletedUsers.deletedCount > 0) {
    console.log(`✓ Cleaned up ${deletedUsers.deletedCount} existing demo users`);
  }

  // Create team members
  const teamMembers = [
    {
      email: "saveliy@example.com",
      username: "sabellius",
      fullname: "Saveliy S",
      password: "$2b$12$HTBjIC2RYlx20exSUzb6x.5nci7kwscT9b2ip3aJx1HK2h/85Tt.W", // hashed "test"
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
    },
    {
      email: "lior@example.com",
      username: "Lior_Rey",
      fullname: "Lior Rey",
      password: "$2b$12$HTBjIC2RYlx20exSUzb6x.5nci7kwscT9b2ip3aJx1HK2h/85Tt.W", // hashed "test"
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
    },
    {
      email: "vlad@example.com",
      username: "VladG",
      fullname: "Vlad G",
      password: "$2b$12$HTBjIC2RYlx20exSUzb6x.5nci7kwscT9b2ip3aJx1HK2h/85Tt.W", // hashed "test"
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
    },
    {
      email: "sarah.chen@kanbox.dev",
      username: "sarahchen",
      fullname: "Sarah Chen",
      password: "$2b$12$HTBjIC2RYlx20exSUzb6x.5nci7kwscT9b2ip3aJx1HK2h/85Tt.W",
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      email: "alex.martinez@kanbox.dev",
      username: "alexm",
      fullname: "Alex Martinez",
      password: "$2b$12$HTBjIC2RYlx20exSUzb6x.5nci7kwscT9b2ip3aJx1HK2h/85Tt.W",
      createdAt: new Date("2024-04-10"),
      updatedAt: new Date("2024-04-10"),
    },
    {
      email: "jordan.kim@kanbox.dev",
      username: "jordank",
      fullname: "Jordan Kim",
      password: "$2b$12$HTBjIC2RYlx20exSUzb6x.5nci7kwscT9b2ip3aJx1HK2h/85Tt.W",
      createdAt: new Date("2024-05-20"),
      updatedAt: new Date("2024-05-20"),
    },
  ];

  // Insert team members
  const teamMembersResult = await db
    .collection("users")
    .insertMany(teamMembers);
  const teamMemberIds = Object.values(teamMembersResult.insertedIds);
  console.log(`✓ Created ${teamMemberIds.length} team members`);

  // Get all users for easy reference
  const saveliy = await db
    .collection("users")
    .findOne({ username: "sabellius" });
  const lior = await db.collection("users").findOne({ username: "Lior_Rey" });
  const vlad = await db.collection("users").findOne({ username: "VladG" });
  const sarah = await db.collection("users").findOne({ username: "sarahchen" });
  const alex = await db.collection("users").findOne({ username: "alexm" });
  const jordan = await db.collection("users").findOne({ username: "jordank" });

  // Create the board
  const boardLabels = [
    { _id: new ObjectId(), title: "bug", color: "red" },
    { _id: new ObjectId(), title: "feature", color: "green" },
    { _id: new ObjectId(), title: "tech-debt", color: "yellow" },
    { _id: new ObjectId(), title: "documentation", color: "blue" },
    { _id: new ObjectId(), title: "priority:high", color: "red" },
    { _id: new ObjectId(), title: "priority:medium", color: "orange" },
    { _id: new ObjectId(), title: "priority:low", color: "gray" },
    { _id: new ObjectId(), title: "backend", color: "green" },
    { _id: new ObjectId(), title: "design", color: "pink" },
    { _id: new ObjectId(), title: "needs-review", color: "orange" },
  ];

  const board = {
    title: "Kanbox - Dev Team",
    description:
      "<p><strong>Kanbox Project Management Platform</strong></p><p>Main development board for the Kanbox team. This board tracks our ongoing development efforts including new features, bug fixes, and technical improvements.</p><p>Our team is building a modern, collaborative project management tool with real-time features and an intuitive interface.</p>",
    appearance: {
      background: "sea",
    },
    labels: boardLabels,
    owner: {
      userId: saveliy._id,
      username: saveliy.username,
      fullname: saveliy.fullname,
    },
    members: [
      {
        userId: saveliy._id,
        username: saveliy.username,
        fullname: saveliy.fullname,
      },
      {
        userId: lior._id,
        username: lior.username,
        fullname: lior.fullname,
      },
      {
        userId: vlad._id,
        username: vlad.username,
        fullname: vlad.fullname,
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
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const boardResult = await db.collection("boards").insertOne(board);
  const boardId = boardResult.insertedId;
  console.log(`✓ Created board: ${board.title}`);

  // Fetch the board back to get labels with their _id fields
  const insertedBoard = await db.collection("boards").findOne({ _id: boardId });
  console.log(`✓ Labels created with IDs:`);
  console.log(`  - Found ${insertedBoard.labels.length} labels`);
  insertedBoard.labels.forEach(label => {
    console.log(`    • ${label.title} (${label.color}): ${label._id}`);
  });

  // Create lists
  const lists = [
    {
      boardId,
      title: "📋 Backlog",
      description: "Ideas and tasks for future development",
      position: "a0",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "📝 To Do",
      description: "Planned for current sprint",
      position: "b0",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "🚧 In Progress",
      description: "Currently being worked on",
      position: "c0",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "👀 Code Review",
      description: "Awaiting peer review",
      position: "d0",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "🧪 QA",
      description: "Ready for quality assurance",
      position: "e0",
      archivedAt: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      title: "✅ Done",
      description: "Completed tasks",
      position: "f0",
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
    const foundLabels = insertedBoard.labels.filter(label => labelTitles.includes(label.title));
    const labelIds = foundLabels.map(label => label._id);

    // Log if any labels weren't found
    const notFound = labelTitles.filter(title => !insertedBoard.labels.find(l => l.title === title));
    if (notFound.length > 0) {
      console.warn(`Warning: Labels not found: ${notFound.join(', ')}`);
    }

    return labelIds;
  };

  // Create cards
  const cards = [];

  // Backlog - 14 cards
  cards.push(
    {
      boardId,
      listId: listIds[0],
      title: "Fix: Card sidebar fails to render on mobile viewport",
      description: `<p><strong>🐛 Bug Report</strong></p>
<p>Users on mobile devices are experiencing a critical rendering issue where the card details sidebar fails to display properly.</p>
<p><strong>Environment:</strong></p>
<ul>
<li>Device: iPhone 12 Pro, iPhone 15, Samsung Galaxy S23</li>
<li>Browser: Safari iOS 17.1, Chrome Mobile 120</li>
<li>Viewport: <code>≤ 768px</code></li>
<li>React: 18.2.0</li>
</ul>
<p><strong>🔍 Root Cause Analysis:</strong></p>
<p>The issue stems from incorrect <code>CSS-in-JS</code> media queries in the <code>CardSidebar</code> component. The sidebar container uses hardcoded pixel values instead of responsive units:</p>
<pre><code class="language-css">/* ❌ Current broken styles */
.card-sidebar {
  position: fixed;
  right: 0;
  width: 400px;
  height: 100vh;
  transform: translateX(0);
  z-index: 1000;
}

/* Should be responsive */
@media (max-width: 768px) {
  .card-sidebar {
    width: 100vw; /* Full width on mobile */
  }
}
</code></pre>
<p><strong>📋 Steps to Reproduce:</strong></p>
<ol>
<li>Open Kanbox on a mobile device (or use DevTools responsive mode)</li>
<li>Navigate to any board</li>
<li>Tap on a card to open the details sidebar</li>
<li><strong>Expected:</strong> Sidebar opens with full card details</li>
<li><strong>Actual:</strong> Sidebar is off-screen or partially hidden</li>
</ol>
<p><strong>🎯 Proposed Solution:</strong></p>
<ol>
<li>Refactor <code>CardSidebar.tsx</code> to use responsive width units (<code>vw</code>, <code>%</code>)</li>
<li>Implement breakpoint detection using <code>useMediaQuery</code> hook</li>
<li>Add conditional rendering for mobile vs desktop layouts</li>
<li>Test on real devices across viewport sizes</li>
</ol>
<p><strong>⚙️ Technical Details:</strong></p>
<ul>
<li>Affects <strong>~15% of mobile users</strong> based on analytics</li>
<li>Impacts card viewing, editing, and commenting</li>
<li>Related issue: <code>MOB-482</code></li>
</ul>
<p><strong>🔧 Files to Modify:</strong></p>
<pre><code>src/components/board/CardSidebar.tsx
src/styles/components/sidebar.module.css
src/hooks/useMediaQuery.ts</code></pre>`,
      position: "a0",
      cover: {
        img: null,
        color: "#cc5529",
        textOverlay: false,
      },
      labelIds: getLabelIds(["bug", "priority:high"]),
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
      title: "Research: Real-time collaboration improvements",
      description: `<p>Investigate ways to improve our real-time collaboration features for better user experience.</p>
<p><strong>Goals:</strong></p>
<ul>
<li>Evaluate WebSocket vs Server-Sent Events</li>
<li>Research conflict resolution strategies</li>
<li>Consider offline-first approach</li>
<li>Assess scalability requirements</li>
</ul>
<p><strong>Success Criteria:</strong></p>
<ul>
<li>Technical feasibility report</li>
<li>Performance benchmarks</li>
<li>Recommended implementation approach</li>
</ul>`,
      position: "a1",
      labelIds: getLabelIds(["feature", "priority:low"]),
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
      title: "Mobile app development planning",
      description: `<p>Plan the mobile application development strategy for Kanbox.</p>
<p><strong>Considerations:</strong></p>
<ul>
<li>React Native vs native development</li>
<li>Code sharing with web app</li>
<li>Push notification infrastructure</li>
<li>Offline capabilities</li>
<li>App store submission process</li>
</ul>
<p><strong>Platforms:</strong> iOS and Android</p>`,
      position: "a2",
      labelIds: getLabelIds(["feature", "priority:medium"]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [
        {
          author: {
            userId: lior._id,
            username: lior.username,
            fullname: lior.fullname,
          },
          text: "<p>This should be a priority for next quarter. Mobile users are requesting this feature frequently.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-15T10:00:00"),
          updatedAt: new Date("2025-12-15T10:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[0],
      title: "Implement activity log and audit trail",
      description: `<p>Add comprehensive activity logging for compliance and debugging.</p>
<p><strong>Features to track:</strong></p>
<ul>
<li>User authentication events</li>
<li>Board and card modifications</li>
<li>Permission changes</li>
<li>File uploads and deletions</li>
<li>API access patterns</li>
</ul>
<p><strong>Storage considerations:</strong></p>
<ul>
<li>Separate collection for logs</li>
<li>Implement log rotation (90 day retention)</li>
<li>Add search and filtering capabilities</li>
<li>Export functionality for compliance</li>
</ul>`,
      position: "a3",
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
      description: `<p>Create comprehensive design system documentation for Kanbox.</p>
<p><strong>Deliverables:</strong></p>
<ul>
<li>Component library showcase</li>
<li>Color palette and typography guidelines</li>
<li>Spacing and layout standards</li>
<li>Accessibility requirements</li>
<li>Code examples and best practices</li>
<li>Figma integration</li>
</ul>`,
      position: "a4",
      labelIds: getLabelIds(["documentation", "design", "priority:low"]),
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
      title: "Integration with third-party calendar apps",
      description: `<p>Allow users to sync Kanbox due dates with their calendar applications.</p>
<p><strong>Supported calendars:</strong></p>
<ul>
<li>Google Calendar</li>
<li>Microsoft Outlook</li>
<li>Apple Calendar (iCal)</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Two-way synchronization</li>
<li>Configurable sync frequency</li>
<li>Selective board synchronization</li>
<li>Calendar event creation from cards</li>
</ul>`,
      position: "a5",
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
      title: "Advanced reporting and analytics dashboard",
      description: `<p>Build analytics dashboard to provide insights into team productivity and project progress.</p>
<p><strong>Metrics to track:</strong></p>
<ul>
<li>Cards completed per sprint</li>
<li>Average completion time</li>
<li>Team velocity trends</li>
<li>Bottleneck identification</li>
<li>Member contribution statistics</li>
</ul>
<p><strong>Visualization:</strong> Charts, graphs, and exportable reports</p>`,
      position: "a6",
      labelIds: getLabelIds(["feature", "backend", "priority:medium"]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [
        {
          author: {
            userId: saveliy._id,
            username: saveliy.username,
            fullname: saveliy.fullname,
          },
          text: "<p>This would be really valuable for team leads. Let's prioritize this for Q1.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-18T14:30:00"),
          updatedAt: new Date("2025-12-18T14:30:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[0],
      title: "Custom fields for cards",
      description: `<p>Allow users to add custom fields to cards for additional metadata.</p>
<p><strong>Field types:</strong></p>
<ul>
<li>Text fields</li>
<li>Number fields</li>
<li>Date pickers</li>
<li>Dropdown selectors</li>
<li>Checkboxes</li>
<li>URL fields</li>
</ul>
<p><strong>Use cases:</strong> Story points, priority scores, external links, custom statuses</p>`,
      position: "a7",
      labelIds: getLabelIds(["feature", "priority:medium"]),
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
      title: "Automation rules and triggers",
      description: `<p>Implement automation system to reduce manual work.</p>
<p><strong>Example automations:</strong></p>
<ul>
<li>Auto-assign cards based on labels</li>
<li>Move cards when due date approaches</li>
<li>Send notifications on specific events</li>
<li>Auto-archive completed cards after X days</li>
<li>Create recurring cards</li>
</ul>
<p><strong>Implementation:</strong> Rule builder UI with trigger-action pairs</p>`,
      position: "a8",
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
      title: "Multi-language support (i18n)",
      description: `<p>Add internationalization support to make Kanbox available in multiple languages.</p>
<p><strong>Languages to support initially:</strong></p>
<ul>
<li>English (default)</li>
<li>Spanish</li>
<li>French</li>
<li>German</li>
<li>Japanese</li>
</ul>
<p><strong>Implementation approach:</strong></p>
<ul>
<li>Use react-i18next library</li>
<li>Extract all hardcoded strings</li>
<li>Create translation files (JSON)</li>
<li>Add language selector in user settings</li>
<li>Support RTL languages in future</li>
</ul>
<p><strong>Scope:</strong> UI text, error messages, email templates</p>`,
      position: "a9",
      labelIds: getLabelIds(["feature"]),
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
      title: "Export board data (JSON, CSV, PDF)",
      description: `<p>Allow users to export their boards in various formats for backup and reporting.</p>
<p><strong>Export formats:</strong></p>
<ul>
<li><strong>JSON:</strong> Full board data including all metadata</li>
<li><strong>CSV:</strong> Card list with key fields (title, assignees, labels, dates)</li>
<li><strong>PDF:</strong> Printable board snapshot with visual layout</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Export entire board or selected lists</li>
<li>Filter cards by date range, labels, or assignees</li>
<li>Schedule automatic exports (premium feature)</li>
<li>Include/exclude archived cards</li>
</ul>`,
      position: "aa",
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
      title: "Implement board templates",
      description: `<p>Create pre-configured board templates for common use cases to speed up onboarding.</p>
<p><strong>Template categories:</strong></p>
<ul>
<li><strong>Software Development:</strong> Kanban, Scrum Sprint, Bug Tracking</li>
<li><strong>Marketing:</strong> Content Calendar, Campaign Planning</li>
<li><strong>Personal:</strong> Weekly Planner, Goal Tracking, Habit Tracker</li>
<li><strong>Business:</strong> Sales Pipeline, Hiring Process, Project Roadmap</li>
</ul>
<p><strong>Template features:</strong></p>
<ul>
<li>Pre-configured lists and sample cards</li>
<li>Suggested labels and workflows</li>
<li>Template gallery with preview</li>
<li>Community-contributed templates</li>
<li>Customize template before creating board</li>
</ul>`,
      position: "ab",
      labelIds: getLabelIds(["feature", "priority:medium"]),
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
      title: "Add Slack and Discord integrations",
      description: `<p>Integrate with popular team communication tools for better collaboration.</p>
<p><strong>Slack integration:</strong></p>
<ul>
<li>Post card updates to Slack channels</li>
<li>Create cards from Slack messages</li>
<li>Slash commands for quick actions</li>
<li>Card notifications in designated channels</li>
<li>Link Slack threads to cards</li>
</ul>
<p><strong>Discord integration:</strong></p>
<ul>
<li>Webhook notifications for card activities</li>
<li>Bot commands for board management</li>
<li>Embed card details in Discord</li>
<li>Assign cards via Discord mentions</li>
</ul>
<p><strong>OAuth setup required for both platforms</strong></p>`,
      position: "ac",
      labelIds: getLabelIds(["feature", "backend", "priority:medium"]),
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
      title: "Time tracking on cards",
      description: `<p>Add time tracking functionality to help teams monitor effort and estimate better.</p>
<p><strong>Features:</strong></p>
<ul>
<li>Start/stop timer for active work</li>
<li>Manual time entry</li>
<li>Time estimates vs actual time</li>
<li>Time logs with timestamps</li>
<li>Weekly/monthly time reports</li>
<li>Export time data for billing</li>
</ul>
<p><strong>UI Components:</strong></p>
<ul>
<li>Timer widget on card details</li>
<li>Time summary badge on card face</li>
<li>Time tracking report dashboard</li>
<li>Pomodoro timer integration (optional)</li>
</ul>
<p><strong>Data storage:</strong> Time entries as subdocuments in card model</p>`,
      position: "ad",
      labelIds: getLabelIds(["feature", "backend"]),
      assignees: [],
      archivedAt: null,
      startDate: null,
      dueDate: null,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // To Do - 2 cards
  cards.push(
    {
      boardId,
      listId: listIds[1],
      title: "Add board duplication feature",
      description: `<p>Allow users to duplicate boards with all their content.</p>
<p><strong>Duplication options:</strong></p>
<ul>
<li>Copy structure only (lists, labels)</li>
<li>Copy structure + cards</li>
<li>Copy everything (including comments, attachments)</li>
<li>Option to reset dates and assignees</li>
</ul>
<p><strong>Use cases:</strong></p>
<ul>
<li>Template boards for recurring projects</li>
<li>Sprint planning with similar structure</li>
<li>Backup/archive boards</li>
</ul>`,
      position: "a0",
      cover: {
        img: null,
        color: "#006b5f",
        textOverlay: false,
      },
      labelIds: getLabelIds(["feature", "backend", "priority:medium"]),
      assignees: [
        {
          userId: lior._id,
          username: lior.username,
          fullname: lior.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-24"),
      dueDate: new Date("2026-01-10"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[1],
      title: "Improve error messages and user feedback",
      description: `<p>Make error messages more user-friendly and actionable.</p>
<p><strong>Current issues:</strong></p>
<ul>
<li>Generic "Something went wrong" messages</li>
<li>Technical jargon in user-facing errors</li>
<li>No guidance on how to resolve errors</li>
<li>Inconsistent error formatting</li>
</ul>
<p><strong>Improvements:</strong></p>
<ul>
<li>Create error message library</li>
<li>Add specific error codes</li>
<li>Include suggested actions</li>
<li>Implement toast notifications</li>
<li>Add error boundary components</li>
</ul>`,
      position: "a1",
      labelIds: getLabelIds(["tech-debt", "priority:medium"]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
        {
          userId: lior._id,
          username: lior.username,
          fullname: lior.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-24"),
      dueDate: new Date("2026-01-12"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // In Progress - 2 cards
  cards.push(
    {
      boardId,
      listId: listIds[2],
      title: "Enhanced search with filters",
      description: `<p>Implement advanced search across boards, cards, and comments.</p>
<p><strong>Search capabilities:</strong></p>
<ul>
<li>Full-text search in titles, descriptions, comments</li>
<li>Filter by: assignee, label, due date, creation date</li>
<li>Sort by: relevance, date, priority</li>
<li>Save search queries</li>
<li>Search within board or across all boards</li>
</ul>
<p><strong>Tech options:</strong></p>
<ul>
<li>MongoDB text indexes (simpler)</li>
<li>Elasticsearch (more powerful)</li>
</ul>`,
      position: "a0",
      labelIds: getLabelIds(["feature", "backend", "priority:medium"]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
        {
          userId: vlad._id,
          username: vlad.username,
          fullname: vlad.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-22"),
      dueDate: new Date("2026-01-12"),
      comments: [
        {
          author: {
            userId: vlad._id,
            username: vlad.username,
            fullname: vlad.fullname,
          },
          text: "<p>I think we should start with MongoDB text indexes and migrate to Elasticsearch if needed later.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-21T10:15:00"),
          updatedAt: new Date("2025-12-21T10:15:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[2],
      title: "Database migration: Add performance indexes",
      description: `<p>Add MongoDB indexes to improve query performance on frequently accessed fields.</p>
<p><strong>Indexes to add:</strong></p>
<pre><code>// Boards collection
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
</code></pre>
<p><strong>Testing:</strong></p>
<ul>
<li>Run explain() on queries before/after</li>
<li>Monitor index usage and size</li>
<li>Benchmark performance improvements</li>
</ul>`,
      position: "a1",
      labelIds: getLabelIds(["tech-debt", "backend", "priority:medium"]),
      assignees: [
        {
          userId: vlad._id,
          username: vlad.username,
          fullname: vlad.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-19"),
      dueDate: new Date("2025-12-26"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Code Review - 2 cards
  cards.push(
    {
      boardId,
      listId: listIds[3],
      title: "Implement Redis caching layer",
      description: `<p>Add Redis caching to reduce database queries and improve response times.</p>
<p><strong>Caching strategy:</strong></p>
<ul>
<li>Cache board objects with lists and cards</li>
<li>TTL: 5 minutes for active boards</li>
<li>Cache invalidation on updates</li>
<li>Cache-aside pattern</li>
</ul>
<p><strong>Expected performance gains:</strong></p>
<ul>
<li>~70% reduction in DB queries</li>
<li>API response: 300ms → 50ms</li>
<li>Handle 10x more concurrent users</li>
</ul>
<p><strong>Configuration:</strong></p>
<pre><code>REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=300
</code></pre>
<p><strong>PR:</strong> #156</p>`,
      position: "a0",
      cover: {
        img: null,
        color: "#0f4d8f",
        textOverlay: false,
      },
      labelIds: getLabelIds(["backend", "priority:high", "needs-review"]),
      assignees: [
        {
          userId: lior._id,
          username: lior.username,
          fullname: lior.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-14"),
      dueDate: new Date("2025-12-22"),
      comments: [
        {
          author: {
            userId: saveliy._id,
            username: saveliy.username,
            fullname: saveliy.fullname,
          },
          text: "<p>Reviewed the PR. The caching logic looks solid! One question about cache invalidation on board deletions?</p>",
          isEdited: false,
          createdAt: new Date("2025-12-20T16:00:00"),
          updatedAt: new Date("2025-12-20T16:00:00"),
        },
        {
          author: {
            userId: lior._id,
            username: lior.username,
            fullname: lior.fullname,
          },
          text: "<p>Good catch! Added cache deletion on board delete. Updated the PR.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-20T17:30:00"),
          updatedAt: new Date("2025-12-20T17:30:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[3],
      title: "Refactor: Extract WebSocket logic into service",
      description: `<p>Current WebSocket code is scattered across controllers. Refactor into dedicated service.</p>
<p><strong>Benefits:</strong></p>
<ul>
<li>Centralized WebSocket logic</li>
<li>Easier to test and maintain</li>
<li>Reusable across features</li>
<li>Better error handling</li>
<li>Cleaner controller code</li>
</ul>
<p><strong>Changes:</strong></p>
<ul>
<li>Create <code>websocket-service.js</code></li>
<li>Move all socket.emit() to service</li>
<li>Add comprehensive JSDoc</li>
<li>Write unit tests (90% coverage target)</li>
</ul>
<p><strong>PR:</strong> #153</p>
<p><em>No breaking changes - internal refactor only</em></p>`,
      position: "a1",
      labelIds: getLabelIds(["tech-debt", "backend", "needs-review"]),
      assignees: [
        {
          userId: alex._id,
          username: alex.username,
          fullname: alex.fullname,
        },
        {
          userId: lior._id,
          username: lior.username,
          fullname: lior.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-16"),
      dueDate: new Date("2025-12-24"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // QA - 2 cards
  cards.push(
    {
      boardId,
      listId: listIds[4],
      title: "Feature: Collaborative cursors (live presence)",
      description: `<p>Show other users' cursors in real-time when viewing the same board.</p>
<p><strong>Features:</strong></p>
<ul>
<li>Display user avatar with cursor</li>
<li>Show current focus (which card)</li>
<li>Cursor updates via WebSocket</li>
<li>Color-coded per user</li>
<li>Toggle on/off in settings</li>
</ul>
<p><strong>Status:</strong> Development complete, in QA testing</p>
<p><strong>Test cases:</strong></p>
<ul>
<li>Cursor appears for other users</li>
<li>Cursor disappears on user leave</li>
<li>Performance with 10+ users</li>
<li>Mobile touch interactions</li>
<li>Network reconnection handling</li>
</ul>`,
      position: "a0",
      labelIds: getLabelIds([
        "feature",
        "backend",
        "priority:medium",
      ]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
        {
          userId: lior._id,
          username: lior.username,
          fullname: lior.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-12"),
      dueDate: new Date("2025-12-23"),
      comments: [
        {
          author: {
            userId: jordan._id,
            username: jordan.username,
            fullname: jordan.fullname,
          },
          text: "<p>Testing on staging looks great! The cursor animations are smooth. Just verifying performance with multiple users.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-21T13:00:00"),
          updatedAt: new Date("2025-12-21T13:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[4],
      title: "Dark theme implementation",
      description: `<p>Full dark mode support with system preference detection.</p>
<p><strong>Implementation:</strong></p>
<ul>
<li>CSS variables for theme switching</li>
<li>Respect <code>prefers-color-scheme</code></li>
<li>Manual toggle in user settings</li>
<li>Smooth transition animation</li>
<li>WCAG AA color contrast</li>
<li>Persist user preference</li>
</ul>
<p><strong>Testing checklist:</strong></p>
<ul>
<li>All components render correctly</li>
<li>Color contrast meets standards</li>
<li>Images/logos have dark variants</li>
<li>Charts and graphs are readable</li>
<li>Test across all pages</li>
</ul>`,
      position: "a1",
      labelIds: getLabelIds([
        "feature",
        "design",
        "priority:medium",
      ]),
      assignees: [
        {
          userId: vlad._id,
          username: vlad.username,
          fullname: vlad.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-13"),
      dueDate: new Date("2025-12-25"),
      comments: [
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "<p>The dark theme looks amazing! Testing on my end and everything is working well.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-21T15:30:00"),
          updatedAt: new Date("2025-12-21T15:30:00"),
        },
        {
          author: {
            userId: vlad._id,
            username: vlad.username,
            fullname: vlad.fullname,
          },
          text: "<p>Thanks! Just need to verify the color contrast on a few more components and we should be good to go.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-21T16:00:00"),
          updatedAt: new Date("2025-12-21T16:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Done - 5 cards
  cards.push(
    {
      boardId,
      listId: listIds[5],
      title: "CI/CD pipeline with automated deployments",
      description: `<p>Implemented complete CI/CD pipeline using GitHub Actions.</p>
<p><strong>Pipeline stages:</strong></p>
<ol>
<li>Lint and format check</li>
<li>Unit tests</li>
<li>Integration tests</li>
<li>Build Docker images</li>
<li>Deploy to staging (auto)</li>
<li>Run E2E tests</li>
<li>Deploy to production (manual approval)</li>
</ol>
<p><strong>Benefits:</strong></p>
<ul>
<li>Deployment time: 30min → 8min</li>
<li>Automated testing catches bugs early</li>
<li>Easy rollback capability</li>
<li>Zero-downtime deployments</li>
</ul>
<p><strong>Tech stack:</strong> GitHub Actions, Docker, AWS ECS</p>`,
      position: "a0",
      labelIds: getLabelIds(["feature", "tech-debt"]),
      assignees: [
        {
          userId: saveliy._id,
          username: saveliy.username,
          fullname: saveliy.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-05"),
      dueDate: new Date("2025-12-12"),
      comments: [
        {
          author: {
            userId: saveliy._id,
            username: saveliy.username,
            fullname: saveliy.fullname,
          },
          text: "<p>Pipeline is live! We've done 5 deployments already and it's working flawlessly.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-12T17:00:00"),
          updatedAt: new Date("2025-12-12T17:00:00"),
        },
        {
          author: {
            userId: lior._id,
            username: lior.username,
            fullname: lior.fullname,
          },
          text: "<p>This is amazing! Huge time saver. Great work!</p>",
          isEdited: false,
          createdAt: new Date("2025-12-12T17:30:00"),
          updatedAt: new Date("2025-12-12T17:30:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "File attachments on cards",
      description: `<p>Users can now attach files to cards with preview support.</p>
<p><strong>Supported formats:</strong></p>
<ul>
<li>Images: JPEG, PNG, GIF, WebP (with preview)</li>
<li>Documents: PDF (with preview)</li>
<li>Archives: ZIP (download only)</li>
<li>Max size: 25MB per file</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Drag and drop upload</li>
<li>Multiple file selection</li>
<li>Progress indicator</li>
<li>Delete attachments</li>
<li>Download original files</li>
</ul>
<p><strong>Storage:</strong> AWS S3 with CloudFront CDN</p>`,
      position: "a1",
      labelIds: getLabelIds(["feature", "backend"]),
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
      startDate: new Date("2025-12-08"),
      dueDate: new Date("2025-12-15"),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "Fix: Email notifications not sending",
      description: `<p><strong>Bug:</strong> Users weren't receiving email notifications when assigned to cards.</p>
<p><strong>Root cause:</strong></p>
<ul>
<li>Email queue worker crashing silently</li>
<li>Missing error logging</li>
<li>No retry mechanism</li>
</ul>
<p><strong>Fix applied:</strong></p>
<ul>
<li>Added comprehensive error handling</li>
<li>Implemented retry logic (3 attempts)</li>
<li>Added monitoring and alerting</li>
<li>Improved email templates</li>
</ul>
<p><strong>Deployed:</strong> Dec 16, 2025</p>
<p><strong>Status:</strong> Monitoring - no issues reported</p>`,
      position: "a2",
      cover: {
        img: null,
        color: "#9e1f1f",
        textOverlay: false,
      },
      labelIds: getLabelIds(["bug", "backend", "priority:high"]),
      assignees: [
        {
          userId: lior._id,
          username: lior.username,
          fullname: lior.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-15"),
      dueDate: new Date("2025-12-16"),
      comments: [
        {
          author: {
            userId: sarah._id,
            username: sarah.username,
            fullname: sarah.fullname,
          },
          text: "<p>Quick turnaround on this! Users are reporting emails are working now. Thanks!</p>",
          isEdited: false,
          createdAt: new Date("2025-12-16T16:00:00"),
          updatedAt: new Date("2025-12-16T16:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "Board activity feed",
      description: `<p>Added activity feed showing recent changes on the board.</p>
<p><strong>Activity types tracked:</strong></p>
<ul>
<li>Card created/updated/deleted</li>
<li>Card moved between lists</li>
<li>Comments added</li>
<li>Members added/removed</li>
<li>Labels changed</li>
<li>Attachments added</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Real-time updates</li>
<li>Filter by activity type and user</li>
<li>Pagination (50 items per page)</li>
<li>Grouped by day</li>
</ul>
<p><strong>Location:</strong> Right sidebar on board view</p>`,
      position: "a3",
      labelIds: getLabelIds(["feature", "backend"]),
      assignees: [
        {
          userId: vlad._id,
          username: vlad.username,
          fullname: vlad.fullname,
        },
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-06"),
      dueDate: new Date("2025-12-13"),
      comments: [
        {
          author: {
            userId: vlad._id,
            username: vlad.username,
            fullname: vlad.fullname,
          },
          text: "<p>This feature really helps keep track of what's happening on busy boards. Nice work Jordan!</p>",
          isEdited: false,
          createdAt: new Date("2025-12-13T14:00:00"),
          updatedAt: new Date("2025-12-13T14:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      boardId,
      listId: listIds[5],
      title: "Upgrade to React 18 and Next.js 14",
      description: `<p>Upgraded frontend to latest stable versions.</p>
<p><strong>Upgrades:</strong></p>
<ul>
<li>React 17 → React 18</li>
<li>Next.js 13 → Next.js 14</li>
<li>All dependencies updated</li>
</ul>
<p><strong>New features available:</strong></p>
<ul>
<li>React Server Components</li>
<li>Improved Suspense</li>
<li>Automatic batching</li>
<li>Transitions API</li>
<li>Better hydration</li>
</ul>
<p><strong>Results:</strong></p>
<ul>
<li>Migration effort: 3 days</li>
<li>No breaking changes</li>
<li>~15% faster page loads</li>
</ul>`,
      position: "a4",
      labelIds: getLabelIds(["tech-debt"]),
      assignees: [
        {
          userId: jordan._id,
          username: jordan.username,
          fullname: jordan.fullname,
        },
      ],
      archivedAt: null,
      startDate: new Date("2025-12-09"),
      dueDate: new Date("2025-12-12"),
      comments: [
        {
          author: {
            userId: jordan._id,
            username: jordan.username,
            fullname: jordan.fullname,
          },
          text: "<p>Upgrade complete! All tests passing. The new React 18 features will be very useful for our real-time collaboration.</p>",
          isEdited: false,
          createdAt: new Date("2025-12-12T15:00:00"),
          updatedAt: new Date("2025-12-12T15:00:00"),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Insert all cards
  await db.collection("cards").insertMany(cards);
  console.log(`✓ Created ${cards.length} cards`);

  // Verify labels on cards
  const cardsWithLabels = cards.filter(c => c.labelIds && c.labelIds.length > 0);
  console.log(`\n✓ Cards with labels: ${cardsWithLabels.length} / ${cards.length}`);

  if (cardsWithLabels.length > 0) {
    const sampleCard = cardsWithLabels[0];
    console.log(`\nSample card verification:`);
    console.log(`  Card: "${sampleCard.title}"`);
    console.log(`  Label IDs: ${sampleCard.labelIds.filter(Boolean).map(id => id.toString()).join(', ')}`);
    console.log(`  Label IDs count: ${sampleCard.labelIds.length}`);

    // Verify the labels exist in the board
    const actualCard = await db.collection("cards").findOne({ title: sampleCard.title });
    console.log(`  Verified in DB: ${actualCard.labelIds ? actualCard.labelIds.length : 0} labels`);
  } else {
    console.warn(`⚠ WARNING: No cards have labels assigned!`);
  }

  console.log("✓ Demo board seeding completed successfully!");
  console.log(`✓ Board: "${board.title}" with ${board.members.length} members`);
};

export const down = async ({ context }) => {
  const db = context;

  // Find the demo board
  const board = await db
    .collection("boards")
    .findOne({ title: "Kanbox - Dev Team" });

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

  // Delete demo team members
  const demoUsernames = [
    "sabellius",
    "Lior_Rey",
    "VladG",
    "sarahchen",
    "alexm",
    "jordank",
  ];
  const usersResult = await db
    .collection("users")
    .deleteMany({ username: { $in: demoUsernames } });
  console.log(`✓ Deleted ${usersResult.deletedCount} team members`);

  console.log("✓ Demo board removal completed successfully");
};
