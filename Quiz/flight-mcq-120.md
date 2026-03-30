# PlantPartner Flight Quiz (120 Multiple Choice)

Session: Flight Practice Mega Quiz
Difficulty Mix: L1-L4 (Foundational to Expert)
Format: Multiple choice only (A-D)

# Grading instructions
1. If there is a dash, that is the answer the user entered
2. If there is a comment in parentheses after the question but before the answers, please answer it
    a. when answering, give a brief description for what the comment is asking
3. If the answer is wrong, correct the user as if you are a senior level developer expalaining it to an intern
4. Please answer all questions using plantpartner as an example, it helps the user understand with context.
5. Lastly, the goal is to learn even if it hurts feelings

## Questions

1. In a REST API, which status code is most appropriate for a successful resource creation?
A. 200 -
B. 201
C. 204
D. 302

2. Which HTTP method is most appropriate for partially updating a plant record?
A. PUT -
B. POST
C. PATCH
D. GET

3. What is the main benefit of parameterized SQL queries? (what does this mean?)
A. Faster CSS rendering
B. Prevent SQL injection -
C. Better image compression
D. Smaller JSON payloads

4. Which index most helps a query filtering by user_id and ordering by created_at?
A. Index on created_at only
B. Composite index on (user_id, created_at) -
C. Index on email
D. No index needed

5. In SQL normalization, what is the main goal of 3NF? (can you explain transitive dependencies?)
A. Increase duplicate rows
B. Remove transitive dependencies -
C. Remove all foreign keys
D. Force all columns to be nullable

6. A transaction should be used primarily when: ( I am not sure what a transaction is in this context)
A. Reading static documentation
B. Multiple dependent writes must succeed together
C. Returning a favicon
D. Running unit tests only

7. Which isolation issue occurs when one transaction reads uncommitted data from another?
A. Phantom read
B. Dirty read
C. Lost update
D. Deadlock

8. In an auth flow, what is the most secure place for a long-lived refresh token in a web app?
A. localStorage -
B. sessionStorage
C. HTTP-only secure cookie
D. Query parameter

9. What is the main purpose of middleware like requireAuth?
A. Bundle CSS
B. Gate routes by validating identity -
C. Normalize SQL schemas
D. Compile JSX

10. Why should passwords be hashed with bcrypt or argon2?
A. To speed login 10x
B. To store reversible encrypted passwords
C. To make stolen password databases hard to crack -
D. To reduce network bandwidth

11. Which status code is best for invalid credentials at login? (i am not great at my error codes)
A. 401 -
B. 404
C. 301
D. 500

12. Which status code is best when a logged-in user tries to access someone else's resource?
A. 201
B. 202
C. 403 -
D. 503

13. What is the best reason to centralize error handling in Express?
A. Fewer route files
B. Consistent response shape and logging -
C. Better SQL syntax
D. Less RAM usage always

14. If your route handler uses async/await, what should happen on thrown errors? (a centralized handler seems like a good idea for thrown errors, but i dont know what that would look like)
A. Ignore them
B. Return HTML by default -
C. Pass to next(error) or centralized handler
D. Restart server every time

15. Why validate request bodies server-side even if frontend validates?
A. Frontend validation is always wrong
B. Clients can bypass frontend checks -
C. Servers cannot parse JSON
D. Validation is only for UI text

16. For rate limiting login attempts, what is the primary security objective?
A. Better typography
B. Prevent brute-force attacks -
C. Improve SQL joins
D. Speed up images

17. Which practice best protects sensitive server config values?
A. Hardcode secrets in source
B. Store secrets in environment variables -
C. Put keys in README
D. Commit .env to git

18. What is an idempotent HTTP method among these? (i haven't heard this word before "idempotent")
A. POST
B. PATCH
C. DELETE
D. GET

19. Why should DELETE routes still check resource ownership?
A. DELETE implies admin rights
B. Browser already checks ownership
C. To prevent unauthorized data removal -
D. SQL blocks all deletes by default

20. What does CORS primarily control?
A. CPU thread count
B. Cross-origin browser access rules
C. Database replication mode
D. Container networking only -

21. Which SQL clause should usually be avoided for pagination at scale due to deep-scan cost? (i'm not sure but this seems really important to know)
A. WHERE
B. OFFSET on very large page numbers
C. ORDER BY
D. LIMIT

22. What is keyset pagination best known for? (what is keyset pagination?)
A. Stable performance for large datasets
B. Better image lazy-loading
C. Avoiding all indexes
D. Replacing foreign keys

23. A LEFT JOIN is chosen over INNER JOIN when you need:
A. Only matching rows
B. All rows from left table plus matches -
C. Only unmatched right rows
D. Randomized row order

24. Which query pattern is most vulnerable to SQL injection?
A. Prepared statement with placeholders -
B. Stored procedure with strict parameters
C. String concatenation from user input
D. ORM with bound params

25. A unique constraint on email primarily guarantees:
A. Faster bcrypt hashing
B. No duplicate email values -
C. Emails are valid format
D. Password complexity

26. What is the practical difference between PUT and PATCH?
A. PUT is partial, PATCH is full replace -
B. PUT often implies full replacement, PATCH partial update
C. They are identical in all APIs
D. PATCH cannot modify JSON

27. Which status code is most appropriate when validation fails? (i am not  sure what codes go to what)
A. 400
B. 206
C. 304
D. 511

28. If a DB connection pool is exhausted, the most likely symptom is:
A. CSS parsing errors
B. Increased request latency/timeouts -
C. Better throughput
D. Fewer open sockets

29. Why use migrations in SQL projects? (what is a migration in this context? should it be added?)
A. To prevent version control
B. To track and reproduce schema changes
C. To avoid indexes forever
D. To remove backups

30. The main purpose of foreign keys is:
A. Compress large text columns
B. Enforce referential integrity -
C. Speed HTTP requests
D. Replace primary keys

31. In React, what does lifting state up solve? (never heard of lifting state up)
A. Prevents all rerenders
B. Shares state between sibling components
C. Removes need for props
D. Replaces hooks

32. Which hook is best for side effects like data fetching? (what are hooks? what is a side effect? my answer is mostly a guess)
A. useMemo
B. useCallback
C. useEffect -
D. useRef

33. A common cause of infinite re-render loops in useEffect is:
A. Empty dependency array
B. Updating dependency state unguarded inside effect -
C. Using CSS modules
D. Static props

34. Why memoize expensive derived values with useMemo? (what us memoization? i have heard it before.)
A. To cache CSS files
B. To avoid recalculating on unrelated renders
C. To bypass React reconciliation
D. To skip all state updates

35. Which statement about keys in list rendering is correct? ( what is list rendering?)
A. Index key is always best
B. Keys help React track item identity
C. Keys are only for styling
D. Duplicate keys improve performance

36. Why avoid mutating React state objects directly? (what are react state objects and what would mutating them be? where is it used in this project? if it isn't, where would it be benefecial to fix this?)
A. Mutation is slower in JavaScript spec
B. React may miss changes and skip rerender logic
C. JSX forbids objects
D. It breaks fetch API

37. Which is best for app-wide auth state in a medium React app? (what is a "medium" react app)
A. Global var in window
B. React context (possibly with reducer)
C. Inline script tags
D. Random local component states

38. What is the purpose of a service worker in a PWA?
A. Increase SQL normalization
B. Enable caching/offline behavior and request interception -
C. Compile React faster
D. Replace HTTPS

39. Which cache strategy is usually best for static assets with hashed filenames? (what cache strategies are there? what exactly is a cache strategy?)
A. Network-only
B. Cache-first
C. Stale-if-error only
D. No-cache always

40. Why should API responses usually not be blindly cached by a service worker?
A. JSON cannot be cached
B. Risk of serving stale or sensitive data
C. Browser blocks all API caching
D. It always causes CORS failure

41. In Vite, environment variables exposed to client code typically must start with:
A. APP_
B. CLIENT_
C. VITE_ -
D. PUBLIC_

42. What is the main purpose of a config file in frontend apps?
A. Force dark mode
B. Centralize environment-dependent values -
C. Remove imports
D. Disable linting

43. Why separate pages and reusable components?
A. Pages cannot import components
B. Improves maintainability and composition -
C. Components are slower to render
D. Routing requires single file

44. Which pattern best handles async loading UI states? (i haven't a clue, what nakes one better than the other?)
A. Hide all errors
B. Track loading, success, and error explicitly
C. Always assume success
D. Block UI thread

45. Why debounce search input before API calls? (i did a leetcode on debouncing at one point, whatis that?)
A. Prevent SQL joins
B. Reduce excessive requests and improve UX
C. Increase rerenders
D. Disable keyboard events





46. What is the best use of useRef?
A. Persist mutable values without rerender and access DOM nodes
B. Replace all state
C. Run effects conditionally
D. Cache API responses globally

47. Which issue often appears when dependencies are omitted from useEffect?
A. Better stability always
B. Stale closures and incorrect behavior
C. Faster SQL queries
D. Reduced bundle size automatically

48. Why keep API-calling logic in utility/services instead of deeply in UI components?
A. JS engine requires it
B. Better testability and separation of concerns
C. It improves CSS specificity
D. It removes need for hooks

49. Which is better for protected routes in React apps?
A. Hide links only
B. Client route guards plus server-side authorization
C. Client guards only
D. No auth checks needed

50. Why should form inputs be sanitized and validated both client and server side?
A. To duplicate effort only
B. UX plus security/data integrity
C. Browsers require two validators
D. SQL cannot parse strings

51. In Node.js, what blocks the event loop most dangerously?
A. Awaiting non-blocking I/O
B. Long synchronous CPU-heavy operations
C. Promise resolution
D. JSON.parse on tiny objects

52. Why use a connection pool instead of opening a new DB connection per request?
A. Pooling disables SQL injection
B. Reduces overhead and improves throughput
C. Uses fewer routes
D. Replaces migrations

53. Which logging practice is best for production APIs?
A. Log full passwords for debug
B. Structured logs with request IDs and redaction
C. Disable all logs
D. Log only stack traces without context

54. What is the key benefit of request correlation IDs?
A. Better animations
B. Trace a request across services/logs
C. Skip auth checks
D. Compress responses

55. Which response pattern helps clients handle errors consistently?
A. Random plain text errors
B. Uniform JSON error schema
C. HTML error pages only
D. Empty response bodies

56. When should a server return 500?
A. Client sent invalid data
B. Unexpected server-side failure
C. Missing auth token only
D. Resource not found

57. For bug report endpoints, what is most important before storing payloads?
A. Sorting keys alphabetically
B. Input size and schema validation
C. Converting all text to uppercase
D. Disabling timestamps

58. Why add DB indexes carefully rather than on every column?
A. Indexes are never used
B. Write overhead and storage costs increase
C. They reduce read performance always
D. SQL forbids many indexes

59. What is a good strategy to avoid N+1 query issues?
A. One query per row always
B. Batch fetch with joins/in clauses where appropriate
C. Disable foreign keys
D. Use random delays

60. Which is safest when exposing bug report details in APIs?
A. Return entire DB row including internals
B. Whitelist response fields
C. Return stack traces to users
D. Return plaintext SQL

61. For push notification subscriptions, what should the backend verify?
A. Theme color
B. Subscription belongs to authenticated user context
C. Browser zoom level
D. Device battery state

62. Why should stale push subscriptions be cleaned up?
A. To improve font rendering
B. Reduce failed sends and storage bloat
C. Required by SQL standard
D. It changes route handlers

63. What is the most likely root cause if all authenticated routes suddenly return 401?
A. CSS bundle missing
B. Token parsing/verification regression
C. Database index too large
D. Service worker cached icon

64. A race condition in update endpoints often appears when:
A. Two writes happen concurrently without conflict control
B. Server uses JSON
C. Route path has params
D. App uses Vite

65. Which mechanism helps prevent lost updates?
A. Random retries only
B. Optimistic locking with version/timestamp checks
C. Disable PATCH
D. Use GET before every write

66. Why use UTC timestamps in backend storage?
A. Better image quality
B. Avoid timezone ambiguity and simplify comparisons
C. Faster hashing
D. Required by Node.js

67. What does "defense in depth" mean in app security?
A. One strong firewall only
B. Multiple layered controls across stack
C. Encrypting only passwords
D. Blocking all public routes

68. Which header most helps mitigate reflected XSS in modern browsers?
A. Content-Security-Policy
B. Access-Control-Allow-Origin
C. ETag
D. X-Powered-By

69. Why is least privilege important for DB credentials?
A. It speeds up joins
B. Limits blast radius if credentials leak
C. Avoids schema changes
D. Enables auto-scaling

70. If a SQL stored procedure performs writes, what extra concern is key?
A. Font preload
B. Transaction boundaries and error rollback behavior
C. JSX syntax
D. Route naming

71. Which test type best verifies route + middleware + DB integration?
A. Snapshot test
B. Unit test only
C. Integration test
D. Lint test

72. What should a reliable migration script include?
A. Random IDs
B. Deterministic, repeatable DDL changes
C. Frontend state updates
D. Hardcoded local paths

73. Why keep seed data separate from schema migrations?
A. Seeds are SQL-incompatible
B. Different lifecycle and environment needs
C. Migrations cannot insert rows
D. Seeds must be in JS only

74. What is the purpose of health check endpoints?
A. Provide UI theming
B. Signal service readiness/liveness
C. Replace all monitoring
D. Return user profile data

75. Why avoid exposing internal error stacks to clients?
A. Larger payload size only
B. Can leak sensitive implementation details
C. Browser cannot render stack traces
D. It breaks CORS

76. Which deployment practice reduces downtime risk?
A. Edit production files manually
B. Blue/green or rolling deployments
C. Single-step schema breaking changes
D. Disable logs during deploy

77. If frontend and backend versions drift, which issue is most common?
A. Better cache hit ratio
B. Contract mismatch causing runtime API errors
C. Faster SSR
D. Fewer auth checks

78. What is contract testing mainly for?
A. Styling consistency
B. Ensuring API producer/consumer compatibility
C. Database backup validation
D. Browser extension support

79. Why might a 204 response be preferable to 200 for certain operations?
A. It includes extra body
B. Indicates success with no response body
C. Disables caching
D. Forces redirect

80. Which metric is most directly linked to user-perceived API responsiveness?
A. p95/p99 latency
B. Number of comments
C. SQL file count
D. Build artifact size only

81. What is the best immediate action when a production error spike starts?
A. Rewrite frontend
B. Triage logs/alerts and correlate by recent changes
C. Delete indexes
D. Turn off monitoring

82. In incident response, why keep a timeline?
A. For legal style only
B. Improves coordination and postmortem accuracy
C. Required by HTTP spec
D. Replaces testing

83. Which postmortem outcome is most valuable?
A. Finding a person to blame
B. Action items that prevent recurrence
C. Longer meeting notes
D. More dashboards only

84. Why is feature flagging useful?
A. It removes need for tests
B. Enables controlled rollout and quick disable
C. It compiles code faster
D. It encrypts traffic

85. Which anti-pattern is riskiest in auth code?
A. Explicit token expiry checks
B. Swallowing token verification errors silently
C. Rotating secrets
D. Scope-based authorization

86. Why should uploaded filenames not be trusted directly?
A. They are too short
B. Potential path traversal or unsafe chars
C. Browser blocks filenames
D. SQL rejects text

87. What is the main risk of broad CORS with credentials enabled?
A. Slower DNS
B. Cross-origin abuse of authenticated requests
C. Broken images only
D. More cache misses

88. Which is best for maintaining API backward compatibility?
A. Remove fields without notice
B. Versioning strategy and deprecation policy
C. Rename endpoints weekly
D. Return random types

89. Why should retry logic include jitter?
A. Improves SQL readability
B. Avoid synchronized retry storms
C. Makes retries deterministic
D. Disables timeout handling

90. Which pattern best protects downstream services from overload?
A. Circuit breaker
B. Inner join
C. CSS minification
D. DOM virtualization

91. In SQL, what is a covering index?
A. Index that includes all needed query columns
B. Index with only one column ever
C. Index used for deletes only
D. Encrypted index table

92. Why might EXPLAIN plans change after data growth?
A. Query text auto-edits
B. Optimizer statistics and cardinality shifts
C. SQL standard changed
D. Route middleware changed

93. What is the primary purpose of DB constraints beyond app validation?
A. UI hints
B. Last-line data integrity enforcement
C. API documentation
D. Faster deploys

94. Which operation often benefits from batching in APIs?
A. Returning static CSS
B. Many small writes/reads to reduce round trips
C. Loading one icon
D. Parsing one JWT

95. If you cache per-user dashboard data, what key practice prevents data leaks?
A. Shared cache key for all users
B. Cache keys scoped by user identity
C. Disable cache headers
D. Use random HTML comments

96. Which is true about eventual consistency?
A. Reads are always latest globally
B. Temporary stale reads can occur
C. It forbids replication
D. It removes need for conflict resolution

97. What is the main advantage of immutable deployment artifacts?
A. Manual patching in prod
B. Reproducible, auditable releases
C. Smaller SQL scripts
D. No need for CI

98. Why should CI run tests on pull requests?
A. To slow merges
B. Catch regressions before merge
C. Replace local testing entirely
D. Compile docs only

99. What does "shift left" testing mean?
A. Run all tests after deploy
B. Move testing earlier in development lifecycle
C. Test only UI
D. Remove integration tests

100. Which strategy best validates a bug fix?
A. Deploy and hope
B. Add a regression test that fails before fix, passes after
C. Rename bug report
D. Increase timeout

101. Why separate controller logic from route definitions?
A. Routes cannot import logic
B. Better modularity and testability
C. It improves SQL joins
D. Required by Express runtime

102. What is a common sign of over-coupled frontend components?
A. Small prop surfaces
B. Hard-to-reuse components with mixed responsibilities
C. High test coverage
D. Typed interfaces

103. Which approach best handles optional query filters in SQL safely?
A. Build raw string fragments from user text
B. Use parameterized dynamic query building
C. Ignore unknown filters silently
D. Use eval

104. Why should API docs define error cases, not only success responses?
A. Errors are implementation details only
B. Clients need predictable failure handling
C. HTTP has no error codes
D. Reduces payload size

105. What is the risk of returning highly specific auth error messages?
A. Better UX only
B. User/account enumeration opportunities
C. Slower hashing
D. Broken TLS

106. Which scenario warrants 409 Conflict?
A. Successful delete
B. Version/uniqueness conflict with current state
C. Missing auth header
D. Unexpected exception

107. Why use strict JSON schemas for external-facing APIs?
A. Prevent all bugs forever
B. Make contracts explicit and validate payloads
C. Replace backend tests
D. Eliminate migrations

108. Which observability trio is standard for production systems?
A. HTML, CSS, JS
B. Logs, metrics, traces
C. SQL, YAML, XML
D. Unit, integration, e2e only

109. What is the biggest downside of "catch (e) { return 200 }" patterns?
A. Better resilience
B. Silent failures and hidden data corruption risks
C. Faster request handling
D. Easier debugging

110. Why enforce request body size limits?
A. Improve typography
B. Mitigate abuse and resource exhaustion
C. Required for GET
D. Improve image contrast

111. Which design best supports future multi-tenant scaling?
A. Shared global mutable state
B. Tenant-aware data scoping and authorization checks
C. One DB user for everything with full rights
D. Store tenant id only in UI

112. What is the primary benefit of semantic versioning for APIs/libraries?
A. Smaller binaries
B. Communicates compatibility expectations
C. Faster DNS
D. Better SQL indexing

113. Why should backup restore drills be practiced regularly?
A. To create more backups only
B. Verify recovery actually works under pressure
C. Required by React
D. Avoid transactions

114. Which approach reduces "works on my machine" issues?
A. Manual setup notes only
B. Reproducible environment configs and scripts
C. Disable linting
D. Skip lockfiles

115. What is the key purpose of lockfiles in JS projects?
A. Prevent npm install
B. Reproducible dependency resolution
C. Hide package names
D. Improve CSS ordering

116. If an endpoint starts timing out after adding a JOIN, first step?
A. Increase timeout forever
B. Inspect query plan and indexes
C. Remove auth checks
D. Disable logs

117. Why should pagination default limits be enforced server-side?
A. Clients always request small pages
B. Prevent unbounded expensive queries
C. SQL auto-limits every query
D. Browser enforces limits

118. Which approach best prevents accidental PII leakage in logs?
A. Log full payloads for all requests
B. Redact/hash sensitive fields and use allowlists
C. Disable all logging always
D. Log only response codes

119. What is the safest behavior when a dependency has a critical vulnerability?
A. Ignore until next quarter
B. Assess impact and patch/mitigate quickly with verification
C. Downgrade security settings
D. Remove tests

120. Which mindset best matches senior engineering review quality?
A. Accept first passing implementation
B. Evaluate correctness, edge cases, security, and operability
C. Focus on variable naming only
D. Optimize prematurely without measurement

## Answer Key

1. B
2. C
3. B
4. B
5. B
6. B
7. B
8. C
9. B
10. C
11. A
12. C
13. B
14. C
15. B
16. B
17. B
18. D
19. C
20. B
21. B
22. A
23. B
24. C
25. B
26. B
27. A
28. B
29. B
30. B
31. B
32. C
33. B
34. B
35. B
36. B
37. B
38. B
39. B
40. B
41. C
42. B
43. B
44. B
45. B
46. A
47. B
48. B
49. B
50. B
51. B
52. B
53. B
54. B
55. B
56. B
57. B
58. B
59. B
60. B
61. B
62. B
63. B
64. A
65. B
66. B
67. B
68. A
69. B
70. B
71. C
72. B
73. B
74. B
75. B
76. B
77. B
78. B
79. B
80. A
81. B
82. B
83. B
84. B
85. B
86. B
87. B
88. B
89. B
90. A
91. A
92. B
93. B
94. B
95. B
96. B
97. B
98. B
99. B
100. B
101. B
102. B
103. B
104. B
105. B
106. B
107. B
108. B
109. B
110. B
111. B
112. B
113. B
114. B
115. B
116. B
117. B
118. B
119. B
120. B

## Usage Ideas (Offline)

- Do one pass answering all 120.
- On second pass, only redo missed questions.
- Time-box to 90 seconds per question for speed practice.
