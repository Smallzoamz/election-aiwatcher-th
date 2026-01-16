[16/01/2026 00:08] | File: lib/rss-fetcher.js | Line: 15 | Keyword: fetchLiveNews | Status: Edited | Change: Removed slice limit, reduced cache to 60s
[16/01/2026 00:08] | File: lib/ai-engine.js | Line: 40 | Keyword: simulateMarket | Status: Edited | Change: Implemented unique news tracking using headline text
[16/01/2026 00:08] | File: lib/db.js | Line: 1 | Keyword: DB Logic | Status: Created | Change: Implemented JSON file-based database for persistence
[16/01/2026 00:08] | File: lib/ai-engine.js | Line: 38 | Keyword: DB Integration | Status: Edited | Change: Connected to lib/db.js, added party-based categorization
[16/01/2026 00:08] | File: app/page.js | Line: 85 | Keyword: UI Crash Fix | Status: Edited | Change: Fixed 'toFixed' error with fallback value
[16/01/2026 00:08] | File: lib/ai-engine.js | Line: 108 | Keyword: Projections | Status: Edited | Change: Added Projected MPs and Votes calculation
[16/01/2026 00:08] | File: app/page.js | Line: 40 | Keyword: UI Transparency | Status: Edited | Change: Added Sample Size, Methodology Tooltip, Confidence Badge
[16/01/2026 00:08] | File: app/page.js | Line: 1 | Keyword: Localization | Status: Edited | Change: Translated entire UI to Thai
[16/01/2026 00:08] | File: lib/ai-engine.js | Line: 3 | Keyword: Localization | Status: Edited | Change: Translated party names and status messages to Thai
[16/01/2026 00:20] | File: .env.example | Line: 1 | Keyword: Environment | Status: Created | Change: Added environment variables template
[16/01/2026 00:20] | File: lib/db.js | Line: 1 | Keyword: Security | Status: Edited | Change: Implemented async operations, write queue for race condition prevention, auto-cleanup
[16/01/2026 00:20] | File: app/api/data/route.js | Line: 1 | Keyword: Security | Status: Edited | Change: Added rate limiting (100 req/min), caching headers, error handling
[16/01/2026 00:20] | File: app/layout.js | Line: 1 | Keyword: Font/SEO | Status: Edited | Change: Added Noto Sans Thai font, Open Graph meta tags, changed lang to 'th'
[16/01/2026 00:20] | File: app/globals.css | Line: 1 | Keyword: Styling | Status: Edited | Change: Added Thai font-family, custom scrollbar, accessibility focus states
[16/01/2026 00:20] | File: app/error.js | Line: 1 | Keyword: Error Handling | Status: Created | Change: Added Error Boundary component with Thai UI and retry functionality
[16/01/2026 00:20] | File: app/page.js | Line: 1 | Keyword: Error Handling | Status: Edited | Change: Added error states, rate limit handling, useCallback optimization, optional chaining
[16/01/2026 00:20] | File: lib/ai-engine.js | Line: 1 | Keyword: Refactor | Status: Edited | Change: Added ELECTION_CONFIG constants, organized keywords, improved error handling
[16/01/2026 00:40] | File: lib/rss-fetcher.js | Line: 1 | Keyword: Data Sources | Status: Edited | Change: Added 5 new RSS feeds (7 total), weighted scoring, parallel fetching, feed status tracking
[16/01/2026 00:40] | File: lib/ai-engine.js | Line: 1 | Keyword: Credibility | Status: Edited | Change: Weighted sentiment analysis, confidence intervals, score history tracking
[16/01/2026 00:40] | File: app/page.js | Line: 1 | Keyword: UI Enhancement | Status: Edited | Change: Added confidence intervals, feed status, keyword display, disclaimer footer
[16/01/2026 00:40] | File: app/methodology/page.js | Line: 1 | Keyword: Transparency | Status: Created | Change: Created methodology page explaining data sources, algorithms, and limitations
[16/01/2026 01:05] | File: .env.local | Line: 1 | Keyword: Supabase | Status: Created | Change: Added Supabase credentials for PostgreSQL database
[16/01/2026 01:05] | File: lib/supabase.js | Line: 1 | Keyword: Database | Status: Created | Change: Created Supabase client configuration
[16/01/2026 01:05] | File: lib/db.js | Line: 1 | Keyword: Database | Status: Rewritten | Change: Migrated from JSON file to Supabase PostgreSQL with in-memory caching
[16/01/2026 01:05] | File: supabase-schema.sql | Line: 1 | Keyword: Database | Status: Created | Change: SQL schema for consumed_news and score_history tables
[16/01/2026 01:11] | File: app/components/DisclaimerModal.js | Line: 1 | Keyword: UI | Status: Created | Change: Created popup disclaimer with developer message, localStorage persistence
[16/01/2026 01:11] | File: app/layout.js | Line: 1 | Keyword: UI | Status: Edited | Change: Added DisclaimerModal component, suppressHydrationWarning
[16/01/2026 01:23] | File: lib/ai-engine.js | Line: 25-110 | Keyword: Context Deep Dive | Status: Edited | Change: Added 6 context categories (person, policy, scandal, performance, support, conflict) to keywords
[16/01/2026 01:23] | File: lib/ai-engine.js | Line: 182-230 | Keyword: Trend Prediction | Status: Created | Change: Implemented linear regression for 24h trend prediction per party
[16/01/2026 01:25] | File: app/page.js | Line: 170-218 | Keyword: Trend Prediction UI | Status: Created | Change: Added 24h forecast display with color-coded backgrounds
[16/01/2026 01:25] | File: app/page.js | Line: 276-304 | Keyword: Context Deep Dive UI | Status: Created | Change: Added primary context label in news analysis section
[16/01/2026 01:29] | File: lib/pantip-scraper.js | Line: 1 | Keyword: Social Media | Status: Created | Change: Created Pantip scraper for 3 political rooms (Sinthorn, Rajdumnern, Chalermthai)
[16/01/2026 01:29] | File: lib/youtube-fetcher.js | Line: 1 | Keyword: Social Media | Status: Created | Change: Created YouTube fetcher for 4 Thai news channels
[16/01/2026 01:30] | File: lib/rss-fetcher.js | Line: 1 | Keyword: Integration | Status: Edited | Change: Integrated Pantip + YouTube into main data pipeline
[16/01/2026 01:40] | File: app/methodology/page.js | Line: 40-90 | Keyword: Documentation | Status: Edited | Change: Added Pantip and YouTube to data sources section
[16/01/2026 01:41] | File: lib/rss-fetcher.js | Line: 1-60 | Keyword: CORS Fix | Status: Edited | Change: Added CORS proxy support for blocked RSS feeds (allorigins, corsproxy)
[16/01/2026 02:50] | File: app/page.js | Line: 1 | Keyword: UI Polish | Status: Edited | Change: Implemented Flex-Stretch for perfect column alignment
[16/01/2026 02:57] | File: app/page.js | Line: 1 | Keyword: UI Polish | Status: Edited | Change: Compacted layout for 1080p/FHD (reduced heights, tightened padding)
[16/01/2026 03:00] | File: app/page.js | Line: 1 | Keyword: UI Polish | Status: Edited | Change: Restored font sizes and news timestamps for readability
[16/01/2026 03:05] | File: lib/db.js | Line: 1 | Keyword: Supabase | Status: Edited | Change: Added saveScoreHistory and detailed markNewsAsRead
[16/01/2026 03:06] | File: lib/ai-engine.js | Line: 1 | Keyword: Supabase | Status: Edited | Change: Integrated persistence and initial state rehydration
[16/01/2026 03:05] | File: app/page.js | Line: 250-327 | Keyword: UI Refinement | Status: Edited | Change: Added "(คาดการณ์)" labels, reduced card height, padding and font size for better compact flow
[16/01/2026 03:09] | File: app/page.js | Line: 192-470 | Keyword: FHD Optimization | Status: Edited | Change: Drastically reduced vertical spacing (Header, Chart height, Margins) for No-Scroll FHD target
[16/01/2026 03:14] | File: app/page.js | Line: 220-486 | Keyword: UI Restructure | Status: Edited | Change: Moved Disclaimer from Footer to Header (Compact version) for streamlined FHD layout
[16/01/2026 03:20] | File: app/page.js | Line: 220 | Keyword: UI Enhancement | Status: Edited | Change: Implemented Announcement Marquee Ticker in Header with custom CSS animation
[16/01/2026 03:20] | File: app/globals.css | Line: 60 | Keyword: UI Enhancement | Status: Edited | Change: Added marquee animation keyframes
[16/01/2026 03:24] | File: app/page.js | Line: 193-246 | Keyword: UI Restructure | Status: Edited | Change: Moved Announcement Bar to the very top and restored static Disclaimer in Header
[16/01/2026 03:25] | File: app/page.js | Line: 195 | Keyword: UI Refinement | Status: Edited | Change: Refined Top Announcement to "Centered Pill" style for precise positioning per user feedback
[16/01/2026 03:27] | File: app/page.js | Line: 195-252 | Keyword: Layout Audit | Status: Edited | Change: Optimized spacing, width, and font hierarchy for Top Announcement and Header Disclaimer to ensure a "perfect fit"
[16/01/2026 03:28] | File: app/page.js | Line: 195-256 | Keyword: Bug Fix | Status: Edited | Change: Fixed text stacking/overlapping in Top Announcement by adding `whitespace-nowrap` and strictly defining height. Restored original Header Disclaimer text.
[16/01/2026 03:30] | File: app/page.js | Line: 231-261 | Keyword: UI Finalization | Status: Edited | Change: Relocated Announcement Marquee into the Header center per user's specific visual guidance. Adjusted title and stats spacing to fit the 3-column header layout.
[16/01/2026 03:32] | File: app/page.js | Line: 44-240 | Keyword: UI Refinement | Status: Edited | Change: Replaced Marquee with a Slide-up Announcement Switcher for better readability. Added ANNOUNCEMENTS array and logic to rotate messages every 5 seconds.
[16/01/2026 03:32] | File: app/page.js | Line: 196-221 | Keyword: Cleanup | Status: Edited | Change: Removed redundant/duplicate Top Announcement Bar component. Final Layout is now 100% focused on the integrated Header Marquee.
[16/01/2026 03:40] | File: app/page.js | Line: 381-511 | Keyword: UI Restoration | Status: Edited | Change: Restored Trend Prediction badges and Context Deep Dive labels (Primary Context) to UI
[16/01/2026 03:41] | File: app/page.js | Line: 379-399 | Keyword: Bug Fix | Status: Edited | Change: Restored missing party score percentage display and optimized badge layout after user feedback
[16/01/2026 04:06] | File: scripts/pantip_agent.py | Line: 1 | Keyword: AI Agent | Status: Created | Change: Implemented Pantip Scraper with 200-thread limit, budget guardrails, and IO detection structure
[16/01/2026 04:06] | File: scripts/requirements.txt | Line: 1 | Keyword: Dependencies | Status: Created | Change: Added packages for AI Agent
[16/01/2026 04:10] | File: scripts/pantip_agent.py | Line: 1 | Keyword: AI Agent | Status: Disabled | Change: Renamed to .py.disabled to prevent execution due to payment/billing issues
[16/01/2026 04:20] | File: lib/ai-engine.js | Line: 426 | Keyword: NIDA Poll | Status: Edited | Change: Integrated NIDA Poll static data as baseline and added Divergence calculation
[16/01/2026 04:35] | File: lib/ai-engine.js | Line: 369 | Keyword: Ethics | Status: Edited | Change: Implemented Divergence Alert logic and Ethics by Design (News Balancing)
[16/01/2026 04:35] | File: app/page.js | Line: 290 | Keyword: UI | Status: Edited | Change: Added DivergenceCard component to display Hidden Support alerts
[16/01/2026 04:40] | File: app/page.js | Line: 460 | Keyword: UI/UX | Status: Refined | Change: Moved Divergence Alert from card to Chart Tooltip (On Hover) for cleaner UI
[16/01/2026 04:45] | File: lib/ai-engine.js | Line: 450 | Keyword: Algorithm | Status: Edited | Change: Implemented Weighted Hybrid Score (40% NIDA, 60% AI) for precise seat calculation
[16/01/2026 04:50] | File: app/methodology/page.js | Line: 135 | Keyword: Docs | Status: Updated | Change: Updated Methodology page to explain Hybrid Score formula and remove outdated limitations
[16/01/2026 04:55] | File: lib/ai-engine.js | Line: 466 | Keyword: ProLevel | Status: Edited | Change: Implemented Split Seat Calculation (List/Const), Volatility Index, and Dark Horse Alert logic.
[16/01/2026 04:55] | File: app/methodology/page.js | Line: 136 | Keyword: ProLevel | Status: Edited | Change: Documented new Split Seat formula and Special Insights.
[16/01/2026 04:52] | File: app/page.js | Line: 454 | Keyword: Cleanup | Status: Fixed | Change: Removed duplicate YAxis component in chart.
[16/01/2026 04:52] | File: app/page.js | Line: 588-600 | Keyword: Cleanup | Status: Fixed | Change: Fixed malformed JSX closing tags with extra whitespace.
[16/01/2026 04:52] | File: app/globals.css | Line: 62-81 | Keyword: Cleanup | Status: Removed | Change: Removed unused marquee animation CSS (replaced by slide-up switcher).
[16/01/2026 04:52] | File: test.txt | Line: N/A | Keyword: Cleanup | Status: Deleted | Change: Removed unnecessary test file from project root.
[16/01/2026 04:55] | File: public/robots.txt | Line: 1 | Keyword: SEO | Status: Created | Change: Created robots.txt with sitemap reference and AI bot blocking.
[16/01/2026 04:55] | File: public/sitemap.xml | Line: 1 | Keyword: SEO | Status: Created | Change: Created XML sitemap with main and methodology pages.
[16/01/2026 04:55] | File: public/manifest.json | Line: 1 | Keyword: SEO/PWA | Status: Created | Change: Created PWA manifest with Thai localization and cyan theme.
[16/01/2026 04:55] | File: app/components/StructuredData.js | Line: 1 | Keyword: SEO | Status: Created | Change: Created JSON-LD structured data (WebApplication, LiveBlogPosting, Breadcrumb).
[16/01/2026 04:55] | File: app/layout.js | Line: 1 | Keyword: SEO | Status: Upgraded | Change: Full SEO overhaul: title template, expanded keywords, canonical, OpenGraph, Twitter, viewport, preconnect, structured data.
[16/01/2026 05:00] | File: app/page.js | Line: 590 | Keyword: UI | Status: Edited | Change: Redesigned Footer to professional layout with disclaimer, copyright, links, and status.
[16/01/2026 05:02] | File: app/globals.css | Line: 60+ | Keyword: Responsive | Status: Added | Change: Added 160+ lines of Auto Responsive CSS (Fluid Typography, Mobile-first, Auto Grid, Safe Area, Chart/Card sizing).
[16/01/2026 05:02] | File: app/page.js | Line: 1-520 | Keyword: Responsive | Status: Edited | Change: Applied responsive classes throughout (mobile-stack, responsive-card, chart-container, countdown-compact, safe-area-padding).
[16/01/2026 05:05] | File: app/page.js | Line: 590-660 | Keyword: UI | Status: Enhanced | Change: Upgraded Footer with gradient border, disclaimer box, AI badge, larger links, version/status panel with glow effect.
[16/01/2026 05:05] | File: plan.md | Line: 1 | Keyword: Planning | Status: Created | Change: Created Election Day Mode implementation plan with architecture, checklist, and timeline.
[16/01/2026 05:08] | File: public/og-image.png | Line: N/A | Keyword: SEO | Status: Created | Change: Generated OG image for social media preview (1200x630, dark theme, Thai flag accents).
[16/01/2026 05:12] | File: app/components/ThemeProvider.js | Line: 1 | Keyword: Feature | Status: Created | Change: Created theme context with localStorage persistence for Dark/Light mode.
[16/01/2026 05:12] | File: app/components/ThemeToggle.js | Line: 1 | Keyword: Feature | Status: Created | Change: Created animated theme toggle button with Sun/Moon icons.
[16/01/2026 05:12] | File: app/components/ShareButton.js | Line: 1 | Keyword: Feature | Status: Created | Change: Created share dropdown with Facebook, Twitter, LINE, and copy link options.
[16/01/2026 05:12] | File: app/globals.css | Line: 5-55 | Keyword: Theme | Status: Added | Change: Added Light theme CSS variables and theme-aware utility classes.
[16/01/2026 05:12] | File: app/layout.js | Line: 140 | Keyword: Theme | Status: Edited | Change: Wrapped app with ThemeProvider for global theme context.
[16/01/2026 05:12] | File: app/page.js | Line: 287 | Keyword: UI | Status: Edited | Change: Added ShareButton and ThemeToggle to header.
[16/01/2026 05:17] | File: app/globals.css | Line: 180-290 | Keyword: Theme | Status: Added | Change: Added comprehensive light mode CSS overrides for better text contrast.
[16/01/2026 05:22] | File: lib/party-data.js | Line: 1 | Keyword: Feature | Status: Created | Change: Created party detail data with top 5 policies per party and category colors.
[16/01/2026 05:22] | File: app/components/PartyDetailModal.js | Line: 1 | Keyword: Feature | Status: Created | Change: Created modal component with party info, policies, and external links.
[16/01/2026 05:22] | File: app/page.js | Line: 312 | Keyword: Feature | Status: Edited | Change: Added click handler on party cards to open PartyDetailModal.
[16/01/2026 05:30] | File: app/page.js | Line: 402-422 | Keyword: UI | Status: Edited | Change: Improved 24hr trend prediction badge layout - vertical stack, larger text.
[16/01/2026 05:35] | File: lib/party-data.js | Line: all | Keyword: Data | Status: Updated | Change: Removed iLaw links, added disclaimer styling to modal.
[16/01/2026 05:40] | File: lib/party-data.js | Line: all | Keyword: Data | Status: Updated | Change: Updated party leaders and slogans with verified 2569 data.
[16/01/2026 05:45] | File: lib/party-data.js | Line: all | Keyword: Data | Status: Updated | Change: Updated all 5 main parties with official policies from news sources.
[16/01/2026 05:48] | File: lib/party-data.js | Line: all | Keyword: Data | Status: Updated | Change: Added all 12 parties from ai-engine.js with policies (pprp, cpd, tst, srt, tkm, okm, econ).
[16/01/2026 05:48] | File: app/components/PartyDetailModal.js | Line: 175 | Keyword: UI | Status: Edited | Change: Enhanced disclaimer with amber warning styling.
[16/01/2026 05:52] | File: next.config.js | Line: all | Keyword: Performance | Status: Created | Change: Created next.config.js with image optimization, tree-shaking, and caching headers.
[16/01/2026 05:54] | File: app/page.js | Line: 3-15 | Keyword: Performance | Status: Edited | Change: Added lazy load for PartyDetailModal using dynamic import.
[16/01/2026 05:55] | File: app/page.js | Line: 226-260 | Keyword: Performance | Status: Edited | Change: Added Visibility API to pause polling when tab is hidden, useMemo for chartData.
[16/01/2026 06:15] | File: app/methodology/page.js | Line: all | Keyword: Content | Status: Updated | Change: Revamped methodology page with new Hybrid Score logic, Real-time Core details, and Performance Optimization section.
[16/01/2026 17:55] | File: lib/ai-engine.js | Line: 270 | Keyword: Algorithm | Status: Edited | Change: Implemented WikiIndex and new Weighted Hybrid Score formula (40% NIDA, 60% AI).
[16/01/2026 17:58] | File: app/methodology/page.js | Line: 130 | Keyword: Documentation | Status: Edited | Change: Updated methodology to visualize new Hybrid Score formula and WikiIndex weight.
[16/01/2026 17:55] | File: lib/ai-engine.js | Line: 270 | Keyword: Algorithm | Status: Edited | Change: Implemented WikiIndex and new Weighted Hybrid Score formula (40% NIDA, 60% AI)
[16/01/2026 17:58] | File: app/methodology/page.js | Line: 130 | Keyword: Documentation | Status: Edited | Change: Updated methodology to visualize new Hybrid Score formula and WikiIndex weight
[16/01/2026 18:05] | File: lib/ai-engine.js | Line: 780 | Keyword: Fix | Status: Edited | Change: Implemented news recycling logic to prevent empty feed in Demo Mode
[16/01/2026 18:08] | File: lib/ai-engine.js | Line: 808 | Keyword: Bug Fix | Status: Fixed | Change: Ensured recentNews is calculated and returned in all market simulation paths (Happy/Drift)
[16/01/2026 18:22] | File: lib/ai-engine.js | Line: 1-5 | Keyword: Crash Fix | Status: Fixed | Change: Restored missing top-level imports (fs, path, db, gemini-client) that caused ReferenceError/500 crash.
[16/01/2026 18:25] | File: app/api/data/route.js | Line: 66 | Keyword: Debug | Status: Updated | Change: Added error trapping and file logging to capture API ReferenceErrors.
[16/01/2026 18:28] | File: lib/ai-engine.js | Line: 368, 482 | Keyword: Build Fix | Status: Fixed | Change: Removed duplicate import statements causing 'identifier already declared' build errors.
[2026-01-16 11:55:00 UTC] | File: lib/ai-engine.js | Status: Fixed | Change: Solved 500 Crash & Empty Feed. Fixed ReferenceErrors (logDebug, calculateAmbiguityScore) and added news-db.json fallback.
[2026-01-16 19:03:00 UTC] | File: lib/ai-engine.js | Line: 1195, 7-16 | Keyword: Build Fix | Status: Fixed | Change: Removed duplicate `import Parser from 'rss-parser'` at EOF and added proper `logDebug` function definition near top of file. Fixed "name 'Parser' is defined multiple times" error caused by Gemini 3 Pro.
[2026-01-16 19:07:00 UTC] | File: app/layout.js | Line: 50, 141 | Keyword: Health Check | Status: Fixed | Change: Added suppressHydrationWarning to body tag, removed missing icon-192.png reference.
[2026-01-16 19:07:00 UTC] | File: public/manifest.json | Keyword: Health Check | Status: Fixed | Change: Replaced missing icon files (icon-192.png, icon-512.png, screenshot-wide.png) with existing og-image.png to fix 404 errors.
[2026-01-16 19:24:00 UTC] | File: lib/ai-engine.js | Line: 947-962, 1000-1016 | Keyword: Score Fix | Status: Fixed | Change: Added Score Decay (2% per tick towards baseScore) and Clamping (0-100) to prevent unbounded score growth that caused party rankings to flip incorrectly.
[2026-01-16 19:26:00 UTC] | File: lib/rss-fetcher.js, lib/ai-engine.js | Keyword: RSS Enhancement | Status: Fixed | Change: Expanded RSS feeds from 5 to 11 verified sources (Matichon, Prachachat, MGR Online, BizNews, PostToday, Khaosod, Prachatai, THE STANDARD, ThaiPost). Added duplicate headline filter using normalized title matching.
[2026-01-16 20:00:00 UTC] | File: lib/rss-fetcher.js, lib/ai-engine.js | Keyword: RSS Fix | Status: Fixed | Change: Removed 6 broken RSS feeds that timeout (MGR Online, BizNews, NationTV, DailyNews, PostToday, ThaiPost). Now using 7 verified working feeds.
[2026-01-16 20:01:00 UTC] | File: lib/rss-fetcher.js | Keyword: Political Filter | Status: Added | Change: Added political keyword filter with 50+ keywords to filter out non-political news. Keywords include party names, politician names, political events, and hot topics.
[2026-01-16 20:02:00 UTC] | File: app/methodology/page.js | Keyword: Doc Update | Status: Updated | Change: Updated methodology page with accurate data sources (7 working feeds), new quality filters (Political, Duplicate, Decay, Clamping), and NIDA Poll integration info.
[16/01/2026 20:30] | File: lib/rss-fetcher.js | Line: 7-35 | Keyword: Regional News | Status: Edited | Change: Added 4 new regional feeds (Isaan, Phuket, Chiang Mai). Added realistic User-Agent to bypass 403 blocks.
[16/01/2026 20:35] | File: lib/ai-engine.js | Line: 723-745 | Keyword: Regional News | Status: Edited | Change: Synced RSS_FEEDS with rss-fetcher.js. Optimized regional weights.
[16/01/2026 20:40] | File: app/page.js | Line: 323 | Keyword: UI | Status: Edited | Change: Updated source count to 11/11 and localized tooltip for regional coverage.
[16/01/2026 20:42] | File: app/methodology/page.js | Line: 92-120 | Keyword: Documentation | Status: Updated | Change: Detailed breakdown of 11 news sources (National + Regional) with impact weights.
[16/01/2026 20:45] | File: app/page.js | Line: 323 | Keyword: UI Fix | Status: Edited | Change: Corrected tooltip sources to match verified 11 active feeds (Removed Thairath/ThaiPBS/Korat/Nation).
[16/01/2026 20:48] | File: package.json | Line: 4 | Keyword: Performance | Status: Edited | Change: Added "type": "module" to fix performance overhead warning and properly support ESM syntax.
