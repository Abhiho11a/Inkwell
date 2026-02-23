export const blogs = [
  {
    "_id": "1",
    "title": "Mastering React in 2026",
    "excerpt": "Learn advanced patterns, hooks, and performance tricks.",
    "content": "React has evolved significantly. In this post we explore advanced hooks like useCallback, useMemo, and custom hooks that make your code cleaner and faster...",
    "author": { "name": "Abhi", "_id": "u1" },
    "createdAt": "2026-02-15T10:00:00Z",
    "tags": ["React", "Frontend"],
    "comments": [
      { "_id": "c1", "author": { "_id": "u2", "name": "John" }, "text": "Really helpful post! useCallback was confusing me for a long time.", "createdAt": "2026-02-15T12:00:00Z" },
      { "_id": "c2", "author": { "_id": "u3", "name": "Sarah" }, "text": "Can you write one on React Query too? That would be amazing.", "createdAt": "2026-02-15T14:00:00Z" },
      { "_id": "c3", "author": { "_id": "u4", "name": "Priya" }, "text": "Bookmarked this. Great explanation of useMemo!", "createdAt": "2026-02-16T09:00:00Z" }
    ]
  },
  {
    "_id": "2",
    "title": "Node.js Authentication Guide",
    "excerpt": "JWT, middleware, protected routes explained clearly.",
    "content": "Authentication is the backbone of any web app. In this guide we cover JWT tokens, bcrypt password hashing, and building a secure middleware layer...",
    "author": { "name": "John", "_id": "u2" },
    "createdAt": "2026-02-12T10:00:00Z",
    "tags": ["Node.js", "Auth"],
    "comments": [
      { "_id": "c4", "author": { "_id": "u1", "name": "Abhi" }, "text": "This is exactly what I needed. Implementing JWT was so confusing before.", "createdAt": "2026-02-12T11:00:00Z" },
      { "_id": "c5", "author": { "_id": "u5", "name": "Karan" }, "text": "Should we store JWT in localStorage or cookies? Would love a follow-up on that.", "createdAt": "2026-02-12T13:00:00Z" },
      { "_id": "c6", "author": { "_id": "u6", "name": "Meera" }, "text": "The middleware explanation was super clear. Thanks John!", "createdAt": "2026-02-13T08:00:00Z" }
    ]
  },
  {
    "_id": "3",
    "title": "MongoDB Relationships Simplified",
    "excerpt": "Understand refs, populate and schema design.",
    "content": "MongoDB is a NoSQL database but relationships still matter. This post covers embedding vs referencing, when to use populate(), and schema design patterns...",
    "author": { "name": "Sarah", "_id": "u3" },
    "createdAt": "2026-02-10T10:00:00Z",
    "tags": ["MongoDB", "Database"],
    "comments": [
      { "_id": "c7", "author": { "_id": "u7", "name": "Rahul" }, "text": "populate() was a mystery to me. This cleared everything up!", "createdAt": "2026-02-10T12:00:00Z" },
      { "_id": "c8", "author": { "_id": "u2", "name": "John" }, "text": "Great breakdown of when to embed vs reference. Very practical.", "createdAt": "2026-02-11T09:00:00Z" }
    ]
  },
  {
    "_id": "4",
    "title": "Tailwind CSS Tips & Tricks",
    "excerpt": "Write cleaner UI faster with these Tailwind hacks.",
    "content": "Tailwind CSS is a utility-first framework that speeds up UI development. Learn about custom configs, responsive design, dark mode, and reusable component patterns...",
    "author": { "name": "Priya", "_id": "u4" },
    "createdAt": "2026-02-08T10:00:00Z",
    "tags": ["CSS", "Tailwind"],
    "comments": [
      { "_id": "c9", "author": { "_id": "u1", "name": "Abhi" }, "text": "The dark mode tip was a game changer. Never knew it was that simple!", "createdAt": "2026-02-08T15:00:00Z" },
      { "_id": "c10", "author": { "_id": "u3", "name": "Sarah" }, "text": "I switched from Bootstrap to Tailwind after reading this. No regrets.", "createdAt": "2026-02-09T10:00:00Z" },
      { "_id": "c11", "author": { "_id": "u5", "name": "Karan" }, "text": "Can you cover Tailwind animations in your next post?", "createdAt": "2026-02-09T14:00:00Z" },
      { "_id": "c12", "author": { "_id": "u7", "name": "Rahul" }, "text": "Saved me hours of writing custom CSS. Love Tailwind!", "createdAt": "2026-02-09T16:00:00Z" }
    ]
  },
  {
    "_id": "5",
    "title": "Understanding useEffect Deeply",
    "excerpt": "Stop misusing useEffect — here is how it really works.",
    "content": "useEffect is one of the most misunderstood hooks in React. This post dives into dependency arrays, cleanup functions, and common pitfalls developers fall into...",
    "author": { "name": "Abhi", "_id": "u1" },
    "createdAt": "2026-02-06T10:00:00Z",
    "tags": ["React", "Hooks"],
    "comments": [
      { "_id": "c13", "author": { "_id": "u4", "name": "Priya" }, "text": "The infinite loop example hit close to home. I literally did that last week 😂", "createdAt": "2026-02-06T13:00:00Z" },
      { "_id": "c14", "author": { "_id": "u6", "name": "Meera" }, "text": "Cleanup functions finally make sense to me now. Thank you!", "createdAt": "2026-02-07T08:00:00Z" },
      { "_id": "c15", "author": { "_id": "u2", "name": "John" }, "text": "This should be mandatory reading for every React beginner.", "createdAt": "2026-02-07T11:00:00Z" }
    ]
  },
  {
    "_id": "6",
    "title": "REST API Design Best Practices",
    "excerpt": "Build clean, scalable APIs that developers love.",
    "content": "A well-designed REST API makes your app easier to maintain and scale. This guide covers naming conventions, status codes, versioning, and error handling patterns...",
    "author": { "name": "Karan", "_id": "u5" },
    "createdAt": "2026-02-04T10:00:00Z",
    "tags": ["API", "Backend"],
    "comments": [
      { "_id": "c16", "author": { "_id": "u1", "name": "Abhi" }, "text": "The status codes section was really helpful. I was using 200 for everything before 😅", "createdAt": "2026-02-04T12:00:00Z" },
      { "_id": "c17", "author": { "_id": "u3", "name": "Sarah" }, "text": "API versioning is something most tutorials skip. Glad you covered it!", "createdAt": "2026-02-05T09:00:00Z" }
    ]
  },
  {
    "_id": "7",
    "title": "Git & GitHub for Beginners",
    "excerpt": "Branching, merging, pull requests made simple.",
    "content": "Version control is a must-have skill. This post walks through Git basics, creating branches, resolving merge conflicts, and collaborating on GitHub effectively...",
    "author": { "name": "Meera", "_id": "u6" },
    "createdAt": "2026-02-02T10:00:00Z",
    "tags": ["Git", "Tools"],
    "comments": [
      { "_id": "c18", "author": { "_id": "u7", "name": "Rahul" }, "text": "Merge conflicts used to scare me. This post made them less intimidating!", "createdAt": "2026-02-02T14:00:00Z" },
      { "_id": "c19", "author": { "_id": "u4", "name": "Priya" }, "text": "Sharing this with my whole team. Really well written!", "createdAt": "2026-02-03T10:00:00Z" },
      { "_id": "c20", "author": { "_id": "u5", "name": "Karan" }, "text": "Can you do a follow-up on Git rebase vs merge?", "createdAt": "2026-02-03T15:00:00Z" }
    ]
  },
  {
    "_id": "8",
    "title": "JavaScript Async Await Explained",
    "excerpt": "Promises, async/await and error handling in depth.",
    "content": "Asynchronous JavaScript can be tricky. This post covers the event loop, promises, async/await syntax, and how to properly handle errors with try/catch blocks...",
    "author": { "name": "John", "_id": "u2" },
    "createdAt": "2026-01-30T10:00:00Z",
    "tags": ["JavaScript", "Async"],
    "comments": [
      { "_id": "c21", "author": { "_id": "u1", "name": "Abhi" }, "text": "The event loop diagram in my head finally clicked after reading this.", "createdAt": "2026-01-30T12:00:00Z" },
      { "_id": "c22", "author": { "_id": "u6", "name": "Meera" }, "text": "Promise chaining vs async/await comparison was exactly what I was looking for.", "createdAt": "2026-01-31T09:00:00Z" },
      { "_id": "c23", "author": { "_id": "u3", "name": "Sarah" }, "text": "Best explanation of try/catch with async functions I have seen!", "createdAt": "2026-01-31T14:00:00Z" }
    ]
  },
  {
    "_id": "9",
    "title": "Docker for Full Stack Developers",
    "excerpt": "Containerize your MERN app step by step.",
    "content": "Docker makes your app run consistently across environments. Learn how to write Dockerfiles, use docker-compose for multi-container apps, and deploy your MERN stack...",
    "author": { "name": "Rahul", "_id": "u7" },
    "createdAt": "2026-01-28T10:00:00Z",
    "tags": ["Docker", "DevOps"],
    "comments": [
      { "_id": "c24", "author": { "_id": "u5", "name": "Karan" }, "text": "docker-compose section was super practical. Got my MERN app running in containers!", "createdAt": "2026-01-28T13:00:00Z" },
      { "_id": "c25", "author": { "_id": "u2", "name": "John" }, "text": "Would love a follow-up on deploying this to AWS or Railway.", "createdAt": "2026-01-29T10:00:00Z" }
    ]
  },
  {
    "_id": "10",
    "title": "Building a Search with Pagination",
    "excerpt": "Implement fast search and pagination in Express + React.",
    "content": "Search and pagination are essential for any content-heavy app. This post covers backend query filtering with regex, skip/limit in MongoDB, and frontend pagination UI...",
    "author": { "name": "Sarah", "_id": "u3" },
    "createdAt": "2026-01-25T10:00:00Z",
    "tags": ["Search", "Pagination"],
    "comments": [
      { "_id": "c26", "author": { "_id": "u1", "name": "Abhi" }, "text": "The regex search approach works perfectly. Integrated it into my project already!", "createdAt": "2026-01-25T12:00:00Z" },
      { "_id": "c27", "author": { "_id": "u4", "name": "Priya" }, "text": "Skip and limit in MongoDB finally makes sense. Clean explanation!", "createdAt": "2026-01-26T09:00:00Z" },
      { "_id": "c28", "author": { "_id": "u7", "name": "Rahul" }, "text": "The pagination UI component is really clean. Stealing this for my project 😄", "createdAt": "2026-01-26T14:00:00Z" },
      { "_id": "c29", "author": { "_id": "u6", "name": "Meera" }, "text": "Would this approach work with millions of records? Any performance tips?", "createdAt": "2026-01-27T10:00:00Z" }
    ]
  }
]