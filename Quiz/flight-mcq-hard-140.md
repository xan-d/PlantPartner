# PlantPartner Flight Quiz (Hard Mode, 140 Multiple Choice)

Session: Flight Practice Mega Quiz - Hard Mode
Difficulty Mix: L3-L4 (Edge Cases to Expert)
Format: Multiple choice only (A-D)

## Questions

1. In a token-based auth system, what is the strongest reason to keep access tokens short-lived?
A. Reduce DNS lookups
B. Limit exposure window if token is stolen
C. Improve SQL join speed
D. Avoid HTTPS requirements

2. A refresh token rotation strategy mainly mitigates:
A. XSS in CSS files
B. Replay risk after refresh token theft
C. Slow React hydration
D. CORS preflight latency

3. Which design best prevents horizontal privilege escalation on /users/:id resources?
A. Trust client-supplied role in body
B. Compare path id against authenticated subject unless elevated scope
C. Hide id field in frontend
D. Return 404 for all users always

4. If JWT verification succeeds but signature algorithm is not restricted server-side, what is the major risk?
A. SQL deadlock
B. Algorithm confusion attacks
C. Browser cache poisoning only
D. Service worker race

5. Which practice best secures password reset links?
A. Predictable incrementing tokens
B. Long random one-time token with short expiry
C. Use username only
D. Store raw token in logs

6. Why should password hash cost parameters be revisited periodically?
A. Hashes expire by RFC
B. Hardware gets faster; previous cost may become weak
C. SQL versions force rehashing
D. It reduces token size

7. For API keys used server-to-server, what is best operational control?
A. One never-expiring key shared everywhere
B. Scoped keys with rotation and audit logging
C. Put key in URL query
D. Embed key in client bundle

8. Which vulnerability is most likely when file upload path uses original filename directly?
A. DOM clobbering
B. Path traversal / overwrite attacks
C. CSRF token reuse
D. DNS spoofing

9. For image upload endpoints, what is most important besides extension checks?
A. CSS media query validation
B. MIME/content sniff validation and size limits
C. URL slug normalization only
D. React key uniqueness

10. Best response for suspected credential stuffing attack:
A. Increase max login attempts
B. Add adaptive rate limits + anomaly detection + MFA prompts
C. Disable all auth errors
D. Shorten usernames

11. In SQL, SERIALIZABLE isolation primarily guarantees:
A. No phantom reads under concurrent transactions
B. Fastest throughput always
C. No deadlocks possible
D. No need for unique constraints

12. Why can REPEATABLE READ still permit phantom rows in some engines?
A. READ COMMITTED is stronger
B. Engine-specific implementation and predicate locking behavior
C. Indexes disable locking
D. Transactions are stateless

13. What is the main trade-off of higher isolation levels?
A. Less consistency
B. Lower contention only
C. More locking/contention and reduced throughput
D. Fewer indexes needed

14. A classic deadlock prevention strategy is:
A. Randomize table access order per request
B. Enforce consistent lock acquisition order
C. Disable transactions
D. Use larger VARCHAR columns

15. If two concurrent updates overwrite each other silently, what anomaly is this?
A. Phantom read
B. Lost update
C. Dirty write
D. Non-repeatable read

16. Best way to make idempotent payment creation endpoint:
A. Retry POST without safeguards
B. Idempotency key tied to request fingerprint
C. Use GET for creation
D. Disable transaction commits

17. Why can OFFSET/LIMIT become unstable under concurrent inserts?
A. LIMIT ignores WHERE
B. Row order shifts between requests, causing duplicates/skips
C. OFFSET disables indexes completely
D. SQL parser cache issue

18. Keyset pagination requires:
A. Deterministic sort key(s) and cursor predicate
B. No indexes
C. Random ordering
D. Composite primary key only

19. Which index best serves WHERE user_id=? AND created_at<? ORDER BY created_at DESC LIMIT 20?
A. (created_at, user_id)
B. (user_id, created_at DESC)
C. (user_id) only
D. Hash index on payload

20. Covering indexes can improve performance mainly by:
A. Avoiding table/heap lookups for selected columns
B. Removing need for ORDER BY
C. Compressing network packets
D. Auto-sharding tables

21. Why is blindly adding many indexes harmful?
A. Indexes are ignored by optimizer
B. Increased write amplification and storage, possible plan regressions
C. Breaks foreign keys
D. Disables transactions

22. EXPLAIN shows full table scan despite index. Most likely first check:
A. Route names
B. Predicate selectivity and data distribution statistics
C. JSON serializer
D. CSS bundling

23. Parameter sniffing problems usually manifest as:
A. Compile-time syntax errors
B. Query plan optimal for one parameter but bad for others
C. Deadlock-free execution only
D. Missing semicolon warning

24. Which pattern reduces lock duration in high-write code paths?
A. Do external API calls inside transaction
B. Keep transaction scope minimal and precompute outside
C. Start transaction at request start always
D. Use SERIALIZABLE for all routes

25. Why wrap "create plant + initial care schedule" in one transaction?
A. To reduce JSON size
B. Preserve invariants so partial state cannot persist
C. Improve CORS handling
D. Skip auth middleware

26. Which status code best signals optimistic concurrency conflict with version mismatch?
A. 202
B. 409
C. 418
D. 503

27. If API accepts ISO date strings without timezone, biggest risk is:
A. JWT decode failure
B. Ambiguous interpretation across regions
C. CORS preflight loops
D. SQL injection

28. Strongest default for timestamp storage in distributed systems:
A. Local server timezone string
B. UTC with explicit type and conversion at edges
C. Browser locale format
D. Unix ms in VARCHAR

29. What does "at-least-once" delivery imply for consumers?
A. Message is delivered exactly once
B. Handler must be idempotent due to possible duplicates
C. No retries occur
D. Ordering is guaranteed globally

30. Why are deduplication keys critical in event processing?
A. Reduce DNS requests
B. Prevent duplicate side effects on retries/redelivery
C. Increase payload entropy
D. Avoid schema migrations

31. In CQRS-like systems, eventual consistency means:
A. Reads always reflect latest write synchronously
B. Temporary read staleness is expected by design
C. Writes bypass validation
D. Transactions are impossible

32. Best way to expose stale-read risk to clients:
A. Hide all timing information
B. Document consistency model and include version/timestamp metadata
C. Disable caches globally
D. Return 500 randomly

33. Which header strategy most safely supports browser auth with cookies?
A. Access-Control-Allow-Origin: * and credentials true
B. Specific allowed origins with credentials and proper SameSite/Secure
C. Disable preflight
D. Any origin if HTTPS

34. CSRF risk is highest when:
A. Token auth in Authorization header only
B. Cookie-based auth without CSRF mitigation
C. Using PATCH methods
D. JSON body contains arrays

35. Robust CSRF mitigation for cookie auth includes:
A. Disable cookies
B. SameSite + anti-CSRF token (synchronizer/double submit)
C. CAPTCHA only
D. 2FA only

36. Why should error responses avoid distinguishing "user not found" vs "wrong password"?
A. Better SQL plans
B. Prevent account enumeration
C. Required by OAuth
D. Reduce response size

37. Which secret handling practice is most dangerous?
A. Inject from env at runtime
B. Restrict secret scope by environment
C. Logging secret values on startup
D. Rotate leaked credentials

38. If you must store API keys in DB, minimum baseline:
A. Plaintext with unique index
B. Encrypt at rest, strict access control, audit access
C. Base64 encode only
D. Store in frontend localStorage

39. Why is "trusting x-forwarded-for" risky without proxy trust configuration?
A. Header names are deprecated
B. Clients can spoof source IP values
C. It blocks TLS negotiation
D. It breaks HTTP/2

40. Best way to safely parse untrusted JSON payloads:
A. eval(payload)
B. JSON.parse + schema validation + size constraints
C. Cast to any and continue
D. Parse only in frontend

41. Which logging approach best balances forensics and privacy?
A. Full body logging forever
B. Structured logs with field-level redaction and retention policy
C. Disable request logs
D. Log only debug in production

42. Correlation IDs are most useful when:
A. Single-threaded local scripts only
B. Tracing one request across services, queues, and DB actions
C. Rendering static HTML
D. Rotating CSS assets

43. Which metric often catches DB saturation early?
A. Number of React components
B. Connection pool wait time and queue depth
C. PNG size distribution
D. PR comment count

44. p99 latency increases while p50 stable usually suggests:
A. Universal slowdown
B. Tail-latency spikes under contention/outliers
C. Better cache hit ratio
D. Memory leak fixed

45. Circuit breaker pattern primarily protects against:
A. SQL injection
B. Cascading failures from unhealthy dependencies
C. XSS payloads
D. CSRF replay

46. Bulkhead pattern in services means:
A. Combine all resources into one pool
B. Isolate resource pools to limit blast radius
C. Disable retries
D. Remove load balancer

47. Retry with exponential backoff and jitter helps by:
A. Guaranteeing success
B. Reducing synchronized retry storms and pressure
C. Removing need for timeouts
D. Fixing schema mismatches

48. Why add timeout budgets to outbound calls?
A. To increase memory usage
B. Prevent hung dependencies from exhausting worker capacity
C. To bypass TLS validation
D. To disable retries

49. Which fallback is safest when recommendation service fails?
A. Return 500 for entire app
B. Degrade gracefully to deterministic default recommendations
C. Return empty auth token
D. Restart database

50. In React, stale closure bugs often occur when:
A. Hook dependencies are accurate
B. Callbacks/effects capture outdated state due to missing deps
C. useRef is used correctly
D. Keys are stable

51. Which scenario most warrants useReducer over useState?
A. One boolean toggle
B. Complex state transitions with many action types
C. Static props only
D. CSS theme switch only

52. Why can memoization hurt performance?
A. useMemo disables rendering
B. Overhead and cache churn outweigh recomputation benefits
C. It changes hook order
D. It blocks GC always

53. Best key choice in dynamic list with insert/reorder:
A. Array index
B. Stable domain identifier
C. Random Math.random each render
D. Concatenated timestamp now()

54. In suspense-like loading boundaries, major risk is:
A. Too many unique IDs
B. Waterfall data fetching if dependencies are sequential
C. Duplicate CSS variables
D. JWT expiration drift

55. Why avoid storing auth state only in memory for critical apps?
A. Memory is encrypted
B. Refresh/navigation loses session unexpectedly
C. It improves SSR
D. Browser forbids in-memory variables

56. Service worker update pitfall that surprises users most:
A. Immediate activation always
B. Old cached shell persists until SW lifecycle advances
C. It disables fetch
D. It removes HTTPS

57. Best approach for API cache invalidation after mutation:
A. Never invalidate
B. Invalidate affected keys/tags and refetch selectively
C. Clear all browser storage always
D. Increase TTL to one day

58. Why should "stale-while-revalidate" be used carefully for user-specific data?
A. SWR disables HTTP/2
B. Risk of briefly serving stale private state
C. It breaks CSP
D. It requires GraphQL

59. In Vite/SPA deployments, 404 on deep links usually means:
A. SQL route mismatch
B. Server not configured to rewrite to index.html
C. Service worker not installed
D. Missing favicon

60. Why should frontend never trust role claims from local UI state alone?
A. UI state is immutable
B. Client state is user-controlled and forgeable
C. JWT already encrypted
D. React validates claims

61. In Node.js, CPU-heavy JSON transformation in request path should be:
A. Left synchronous on main thread
B. Offloaded (worker/thread/process) or optimized/streamed
C. Moved to CSS
D. Wrapped in try/catch only

62. Backpressure in stream processing is about:
A. Encrypting payloads
B. Matching producer speed to consumer capacity
C. Disabling retries
D. Replacing queues

63. Unbounded in-memory queues in API processes risk:
A. Lower latency
B. Memory exhaustion and process crashes
C. Better throughput predictability
D. Automatic load shedding

64. Which is best to guard against zip-bomb-like payloads?
A. Increase upload size limit
B. Enforce compressed and decompressed size limits with scanning
C. Disable mime checks
D. Trust Content-Length only

65. Why should temporary files be stored outside web root with randomized names?
A. Better SQL plan cache
B. Reduce direct access and filename collision/execution risk
C. Required by Express
D. Faster gzip

66. If a DB migration adds NOT NULL to populated table, safest sequence is:
A. Add NOT NULL immediately and hope
B. Backfill valid values, then enforce constraint
C. Drop table and recreate
D. Disable writes permanently

67. Expand-and-contract migration pattern helps with:
A. UI animation timing
B. Zero/low-downtime schema evolution across versions
C. Faster npm installs
D. Less logging noise

68. Blue/green deployment risk often missed:
A. Two colors in dashboard
B. Data/schema compatibility between old and new versions
C. DNS TTL cannot change
D. Load balancer SSL cert format

69. Why run migrations as separate controlled step instead of app startup in large systems?
A. Startup scripts cannot run SQL
B. Better observability, rollback planning, and blast-radius control
C. It slows deploy by design only
D. Required by Kubernetes

70. For rollback safety, what should be versioned together?
A. CSS and favicon only
B. App artifact + migration state + config
C. README and .gitignore
D. Browser extensions

71. What is contract drift between frontend and backend?
A. Different lint rules
B. API assumptions diverge from actual responses/semantics
C. Timezone mismatch only
D. Cache expiration mismatch only

72. Consumer-driven contract tests are most useful for:
A. Ensuring provider honors client expectations on critical fields
B. Styling snapshot stability
C. DB backup verification
D. OAuth key rotation

73. Why include error schemas in OpenAPI?
A. Optional decoration
B. Enables robust client handling and typed parsing of failures
C. Makes endpoints private
D. Reduces need for status codes

74. Which change is most likely backward-incompatible?
A. Adding optional response field
B. Tightening enum values by removing previously valid option
C. Adding new endpoint
D. Increasing timeout

75. Why is returning 200 with error payload anti-pattern?
A. Better for proxies
B. Breaks semantic status handling and client retry logic
C. Required for CORS
D. Reduces payload size

76. For file-serving endpoints, why set Content-Disposition safely?
A. Improve SQL normalization
B. Prevent inline execution and header injection issues
C. Avoid gzip compression
D. Enable websocket upgrade

77. Which security header directly controls allowed script sources?
A. HSTS
B. CSP script-src
C. Referrer-Policy
D. X-Frame-Options

78. HSTS primarily mitigates:
A. SQL injection
B. SSL stripping/downgrade attacks
C. CSRF token theft
D. DNS cache poisoning

79. Why enforce dependency pinning and integrity verification?
A. Faster UI rendering only
B. Reduce supply-chain tampering risk
C. Remove lockfiles
D. Disable semver updates

80. Software bill of materials (SBOM) helps with:
A. CSS theming
B. Vulnerability impact analysis across dependencies
C. SQL indexing
D. JWT refresh

81. Which scenario best fits chaos testing value?
A. Unit tests for pure functions
B. Validating resilience under controlled dependency failures
C. Linting markdown
D. UI color contrast checks

82. SLO error budget is mainly used to:
A. Track design debt
B. Balance reliability targets with feature delivery pace
C. Replace incident reviews
D. Set password entropy

83. Why does high cardinality metrics label usage hurt observability stacks?
A. Better compression
B. Storage/query explosion and performance degradation
C. Prevents tracing
D. Removes histograms

84. In incident management, first technical priority is often:
A. Root-cause certainty before action
B. Mitigate impact quickly, then investigate deeply
C. Close ticket immediately
D. Freeze all repos forever

85. Blameless postmortems are valuable because they:
A. Eliminate accountability
B. Encourage truthful learning and systemic fixes
C. Remove need for action items
D. Shorten outages automatically

86. Which anti-pattern worsens MTTR most?
A. Well-defined runbooks
B. Sparse observability and no ownership boundaries
C. Error budgets
D. Canary rollouts

87. Canary deployments are best for:
A. Deploying to all users instantly
B. Validating new version on small traffic slice before full rollout
C. Avoiding metrics collection
D. Eliminating rollback need

88. Feature flags can become risk when:
A. Flags are typed and owned
B. Dead flags accumulate without lifecycle governance
C. Rollouts are gradual
D. Flags are audited

89. Why should security patches sometimes bypass normal release cadence?
A. To avoid QA always
B. Risk exposure window may be unacceptable
C. Semver forbids hotfixes
D. CI cannot run quickly

90. Which choice best protects PII in analytics events?
A. Send raw email and phone for joins
B. Use pseudonymous identifiers and minimize fields
C. Log full payload for debugging
D. Disable consent checks

91. For GDPR-like regimes, data minimization means:
A. Store everything forever
B. Collect only necessary data for explicit purpose
C. Delete all audit logs
D. Avoid encryption

92. Right-to-erasure workflows are hardest when:
A. Data is centralized in one table
B. Data is replicated across systems/backups/events
C. IDs are UUIDs
D. API uses REST

93. Why maintain data retention policies with automated deletion?
A. Faster indexes only
B. Compliance, risk reduction, and cost control
C. Required by React Router
D. Better local dev UX

94. Which backup strategy best improves disaster recovery confidence?
A. Daily backup without testing restore
B. Regular restore drills with measured RTO/RPO
C. One full backup yearly
D. Backup only source code

95. RPO refers to:
A. Maximum acceptable downtime
B. Maximum acceptable data loss window
C. Runtime per operation
D. Request processing overhead

96. RTO refers to:
A. Max data loss interval
B. Time target to restore service availability
C. Required token origin
D. Read timeout override

97. In distributed locks, primary correctness concern is:
A. Theme consistency
B. Lease expiration and clock/partition safety semantics
C. CSS specificity
D. JWT claims order

98. Why are exactly-once guarantees expensive/impractical end-to-end?
A. HTTP forbids it
B. Requires coordinated state and dedup across boundaries
C. Databases cannot transact
D. Queues are unordered

99. Sagas compensate for lack of global transactions by:
A. Enforcing 2PC everywhere
B. Orchestrating local transactions with compensating actions
C. Using no retries
D. Avoiding idempotency

100. Which is a key risk of two-phase commit in microservices?
A. Better availability
B. Coordinator blocking/availability trade-offs and complexity
C. Reduced consistency
D. No logging needed

101. Why should webhook consumers verify signatures?
A. Improve throughput only
B. Authenticate sender and payload integrity
C. Avoid JSON parsing
D. Disable retries

102. Webhook delivery should be treated as:
A. Exactly-once ordered stream always
B. At-least-once, potentially out-of-order events
C. Single fire-and-forget
D. Client-side only concern

103. Best pattern for webhook replay attack mitigation:
A. Ignore timestamps
B. Validate timestamp tolerance + nonce/id dedup store
C. Use GET instead of POST
D. Disable TLS

104. What is the biggest pitfall of long-running DB transactions in web requests?
A. Better consistency always
B. Lock contention and pool exhaustion under load
C. Smaller logs
D. Faster cache warmup

105. Why choose monotonic IDs (or sortable UUID variants) in some systems?
A. Better random distribution in B-tree inserts always
B. Improved locality/index behavior and ordering use-cases
C. Required by JSON schema
D. Prevents all collisions

106. If user-facing clocks rely on client time only, risk is:
A. Better UX always
B. Inconsistent ordering and manipulation/skew issues
C. CSP violation
D. SQL parse errors

107. For search endpoints, why cap max filters/sort combinations?
A. To simplify UI color scheme
B. Prevent pathological expensive query plans
C. Required by HTTP/1.1
D. Avoid pagination

108. Query whitelisting for sortable fields primarily prevents:
A. Deadlocks
B. SQL injection and unindexed sort abuse
C. XSS payloads
D. Token expiry

109. Why return Retry-After with 429 responses?
A. Browser requires it for CORS
B. Gives clients backoff hint and improves cooperative behavior
C. Disables caching
D. Increases rate limit permanently

110. Which behavior is best when downstream timeout occurs in aggregator endpoint?
A. Fail open with fake sensitive data
B. Partial response with clear degradation metadata where appropriate
C. Infinite retry loop
D. Return 200 and empty body silently

111. In typed API clients, schema evolution safety improves with:
A. Untyped any payloads
B. Codegen from versioned contracts and compatibility tests
C. Manual copy-paste interfaces only
D. Runtime eval of docs

112. Why do "unknown" catch blocks need careful mapping?
A. Unknown is always string
B. Preserve diagnostics while returning safe user-facing errors
C. It disables stack traces entirely
D. It speeds TypeScript compile

113. For operational dashboards, which ratio often signals unhealthy retries?
A. CSS/JS ratio
B. Retry requests to successful requests trend
C. Number of open tabs
D. Commits per week

114. Which practice improves on-call effectiveness most?
A. Noisy alerts on every warning
B. Actionable alerts tied to SLO impact with runbooks
C. Disable paging
D. Alert only on deploys

115. Why are "warning-only" CI security scans risky long-term?
A. They run too fast
B. Findings accumulate without enforcement pressure
C. They break semver
D. They reduce coverage to zero

116. Dependency update strategy balancing risk and velocity:
A. Update everything quarterly in one mega PR only
B. Continuous small updates with automated tests and canaries
C. Never update transitive dependencies
D. Pin without review forever

117. When should you prefer fail-closed over fail-open?
A. Non-critical UI hints
B. Authorization and security-sensitive decisions
C. Static asset cache miss
D. Optional analytics events

118. Why can silent fallback to insecure defaults be dangerous?
A. Improves resilience always
B. Masks misconfiguration and weakens security posture
C. Reduces memory
D. Speeds build

119. In multi-tenant DB design, strongest isolation baseline is:
A. tenant_id optional column
B. Enforced tenant scoping in queries plus policy/constraint safeguards
C. Client-side filtering only
D. Separate CSS themes

120. Row-level security (RLS) is valuable because:
A. It replaces auth entirely
B. Enforces data access predicates inside DB layer
C. It speeds JavaScript
D. It disables indexes

121. Which migration rollback plan is safest?
A. Assume rollback never needed
B. Test forward and rollback paths in staging with production-like data
C. Only backup code
D. Drop newly added columns immediately

122. Why can "delete column" be dangerous immediately after deployment?
A. SQL parser bug
B. Old app instances/jobs may still read/write it
C. Column names are case-sensitive
D. It breaks HTTP cache

123. How do shadow reads help migrations?
A. Replace integration tests
B. Compare old/new path outputs before full cutover
C. Increase lock contention
D. Disable caching

124. Which risk is unique to long cache TTL on authz decisions?
A. More DB CPU always
B. Stale permissions grant access after revocation
C. Token size growth
D. Slower TLS handshake

125. Why prefer explicit allowlists for outbound egress in secure environments?
A. More permissive connectivity
B. Limit data exfiltration and unknown dependency calls
C. Better CSS delivery
D. Reduce code size

126. Secret zero problem refers to:
A. Missing first migration
B. How initial secret is securely delivered to retrieve other secrets
C. Empty JWT claim
D. No logs on startup

127. Why can mTLS be stronger than API keys alone for service auth?
A. mTLS is faster than plaintext
B. Mutual certificate identity with channel binding reduces key sharing risk
C. It removes certificate rotation
D. It bypasses revocation

128. Which is the best reason to separate write and read models in high-scale systems?
A. Avoid all joins
B. Optimize each path independently for workload characteristics
C. Required by SQL standard
D. Prevent schema changes

129. Why should manual database hotfixes be codified afterward?
A. They disappear automatically
B. Prevent environment drift and preserve reproducibility
C. Improve CSS bundle hashing
D. Reduce API latency instantly

130. What is a practical safeguard against accidental destructive SQL in prod?
A. Give all engineers DROP privileges
B. Protected roles + approval workflow + backups + dry-run checks
C. Disable transactions
D. Use shorter table names

131. Why is synthetic monitoring useful beyond real-user metrics?
A. It replaces logs
B. Detects availability regressions even during low traffic
C. Only works for mobile apps
D. Avoids canary deploys

132. If p95 latency regresses only for one region, first suspicion:
A. Global DB schema issue only
B. Regional network/dependency path or capacity imbalance
C. Broken JSX compilation
D. Token algorithm mismatch

133. Which strategy best handles partial DB outage in read-heavy app?
A. Return stale cache with clear freshness metadata where safe
B. Disable all endpoints
C. Drop indexes
D. Force write mode

134. Why is deterministic serialization important for signing payloads?
A. Smaller JSON only
B. Signature depends on exact byte representation
C. It enables SQL transactions
D. Improves CORS preflight

135. Which anti-pattern undermines reliability engineering culture?
A. Tracking near misses
B. Hiding incidents to preserve appearance of stability
C. Measuring MTTR
D. Practicing game days

136. Why should queues have dead-letter handling?
A. To discard all failed events silently
B. Isolate poison messages for inspection and controlled retries
C. Improve CSS parsing
D. Disable observability

137. In high-throughput APIs, what is the biggest danger of synchronous third-party calls in request path?
A. Better consistency
B. Tail latency and dependency blast radius increase
C. Fewer retries
D. Improved local caching

138. Why enforce immutable logs for audit trails?
A. Reduce storage costs only
B. Integrity and non-repudiation of security-relevant events
C. Faster frontend rendering
D. Easier schema migrations

139. Which production test gives highest confidence before full rollout?
A. Unit tests only
B. Canary with real traffic + SLO guardrails + fast rollback
C. Lint pass only
D. Manual smoke by one user

140. Senior-level engineering judgment is most evident when you:
A. Optimize microseconds without data
B. Balance correctness, security, operability, and delivery trade-offs explicitly
C. Avoid documenting decisions
D. Prefer cleverness over clarity

## Answer Key

1. B
2. B
3. B
4. B
5. B
6. B
7. B
8. B
9. B
10. B
11. A
12. B
13. C
14. B
15. B
16. B
17. B
18. A
19. B
20. A
21. B
22. B
23. B
24. B
25. B
26. B
27. B
28. B
29. B
30. B
31. B
32. B
33. B
34. B
35. B
36. B
37. C
38. B
39. B
40. B
41. B
42. B
43. B
44. B
45. B
46. B
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
64. B
65. B
66. B
67. B
68. B
69. B
70. B
71. B
72. A
73. B
74. B
75. B
76. B
77. B
78. B
79. B
80. B
81. B
82. B
83. B
84. B
85. B
86. B
87. B
88. B
89. B
90. B
91. B
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
121. B
122. B
123. B
124. B
125. B
126. B
127. B
128. B
129. B
130. B
131. B
132. B
133. A
134. B
135. B
136. B
137. B
138. B
139. B
140. B

## Usage Ideas (Offline)

- Do this one timed: 75-90 seconds per question.
- Mark confidence (high/medium/low) next to each answer to identify weak spots.
- Reattempt only low-confidence misses on a second pass.
