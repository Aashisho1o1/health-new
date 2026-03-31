Design a super simple, intuitive, trustworthy web app MVP for a medical education AI tutor.

This is NOT a consumer chatbot. It is a structured learning tool for students. The app helps students study anatomy / human body questions using:
1) fixed pre-approved anatomy images in the frontend,
2) a question-by-question guided workflow,
3) AI-generated text explanations in the chat area,
4) source-backed answers and visible citations,
5) a very simple, calm, academic UI.

Important product context:
- This is an MVP for around 100 students over 3 to 4 months.
- Do not over-design for scale.
- Prioritize clarity, trust, easy navigation, and low cognitive load.
- The frontend should always display static, pre-approved images. The AI should never be responsible for generating or modifying anatomy images in the teaching flow.
- Each question is associated with a specific image, highlighted body region, question number, and follow-up prompts.
- Students should always know:
  - where they are,
  - what image they are looking at,
  - which question they are answering,
  - what the AI is responding to,
  - what sources support the answer.

Tech constraints:
- Frontend stack target: React + TypeScript
- Backend target: Python + FastAPI
- Keep the frontend architecture simple and realistic for this stack.
- Design for desktop first, tablet second, mobile acceptable but not primary.
- Use reusable components and a clean design system that a React TypeScript team can implement easily.

Brand and style:
Use a calm academic brand style.
Primary brand colors:
- Primary Red: #af1d27
- Dark Red: #7f1118
- Gray: #5d615a
- Light Gray: #e0e0e0
- Black: #000000
- White: #ffffff

Secondary accent colors, used sparingly:
- Blue: #005a93
- Teal: #2499a9
- Green: #42a083
- Yellow: #f3c108
- Orange: #ed9822
- Coral: #f15f53

Typography direction:
- Use a clean academic style inspired by Gotham / Gotham Narrow for UI and interface text.
- Use a refined serif accent inspired by Mercury for hero headings or section titles only.
- If exact fonts are unavailable, choose close substitutes that feel academic, modern, and readable.
- Keep text highly legible. Do not use tiny or stylistic fonts.

Overall design principles:
- Calm, academic, high-trust
- Minimal, not flashy
- Clear visual hierarchy
- Soft card layout
- Spacious padding
- Strong alignment
- No clutter
- No playful illustrations
- No trendy gradients
- No distracting animations
- Use color mainly for meaning, structure, and emphasis
- Interface should feel serious, supportive, and easy to follow for medical students

Accessibility and usability requirements:
- High contrast text
- Obvious focus states
- Large click targets
- Keyboard-friendly navigation patterns
- Clear active states
- Clear hover states
- Clear disabled states
- Error and loading states must be designed
- Avoid red-green-only meaning
- Use labels and helper text generously
- Design modals, drawers, and tabs in an accessible way
- Prioritize readability over density

Design a small but complete MVP with these screens and states:

SCREEN 1: Landing / Entry screen
Purpose:
- A very simple welcome screen for students entering the tutor
- Explain what this tool is in one sentence
- Allow student to choose a module or start a case

Content:
- Top nav with a small institutional header area
- App name: something like “Anatomy Tutor” or “Body Learning Assistant”
- Subheading: “Study guided anatomy questions with fixed visuals and source-backed AI explanations.”
- Primary CTA: “Start learning”
- Secondary CTA: “Browse modules”
- Simple card section showing 3 example modules or cases
- Small note about citations and approved course materials
- Optional footer with institutional / course context

Style:
- Clean hero section, not marketing-heavy
- Use white or very light gray background
- Small amount of brand red for buttons and emphasis
- Should feel scholarly and calm

SCREEN 2: Module / Case selection
Purpose:
- Let students pick a learning case or question set

Content:
- Left sidebar or top filters:
  - Module
  - Topic
  - Body system
  - Difficulty
- Main area with cards or rows for cases
- Each case card shows:
  - Case title
  - Body system
  - Number of questions
  - Estimated time
  - Short description
  - Progress state: not started / in progress / completed
- Search bar at top
- Sort dropdown
- Clean pagination or load more

Interaction:
- Clicking a case opens the main study interface

Style:
- Structured and scannable
- Prefer list-card hybrid over dense tables
- Use muted borders and subtle shadows
- Use brand red only for selected state, progress emphasis, and primary CTA

SCREEN 3: Main study interface (this is the most important screen)
Purpose:
- This is the core product.
- Student studies one question at a time with a fixed image and AI tutor support.

Layout:
Create a two-panel desktop layout:
LEFT PANEL = Visual learning panel
RIGHT PANEL = Guided AI tutor panel

LEFT PANEL DETAILS:
- Fixed anatomy image viewer
- Image title
- Image number / figure number
- Question number prominently displayed
- Highlighted body region marker or hotspot overlay
- Optional small legend
- Zoom in / zoom out controls
- Reset image view
- “View labels” toggle
- “Open full figure” action
- “Related figure” link if relevant
- Under image: concise image context text such as:
  - “Question 4 uses Figure 2: thoracic cavity, highlighted left pleural region.”

Important:
- The image must feel stable and anchored.
- It should not jump around.
- The student should trust that the image is fixed and authoritative.

RIGHT PANEL DETAILS:
- Case breadcrumb at top
- Current question header:
  - “Question 4 of 12”
  - question prompt text
- Small trust row under the question:
  - approved image badge
  - source-backed answers badge
  - educational use badge
- Chat / tutor response area below

Inside the tutor area:
- AI response cards should look calm, structured, and readable
- Support these response sections:
  - Direct explanation
  - Why this matters
  - Key anatomical terms
  - Follow-up question suggestions
  - Citations / source chips
- Student input composer at bottom
- Placeholder text should guide the student:
  - “Ask about this region, concept, or follow-up question…”
- Add 3 to 5 suggested quick prompts above the composer such as:
  - “Explain this structure simply”
  - “What function does this region have?”
  - “How is this different from nearby anatomy?”
  - “Quiz me on this image”
  - “Give me a hint, not the full answer”

Important interaction rules:
- The AI is responding to the current question context
- The app should visually communicate that the current question, image, and retrieved sources are linked
- Keep the input area simple, not like a casual messaging app
- Make it feel more like a guided tutor workspace than a generic chatbot

BOTTOM / SIDE UTILITIES:
- “Previous question” and “Next question” buttons
- Progress indicator for question sequence
- Bookmark question
- Mark as reviewed
- Open citations drawer
- Open source material panel
- Restart case
- Report issue / unclear answer

SCREEN 4: Citations / Sources drawer
Purpose:
- Show why the answer can be trusted

Pattern:
- Right-side drawer or modal
- Opened from citation chips in the chat

Content:
- Source title
- Source type: textbook / guideline / course note / question bank
- Relevant excerpt
- Highlighted matching lines
- Page number or section if available
- Why this source was used
- Confidence / relevance label
- “View all sources for this answer”

Design:
- Structured, document-like
- Easy scanning
- Use monospace only for metadata if needed
- Keep academic look
- Avoid overwhelming the student

SCREEN 5: Full image modal
Purpose:
- Enlarged image inspection without losing context

Content:
- Large centered image
- Zoom
- Pan
- Toggle labels / region markers
- Figure metadata
- Button: “Return to question”

Behavior:
- Must feel smooth, clean, and focused
- Modal should be accessible and easy to close
- Maintain image fidelity and stable layout

SCREEN 6: Student progress / lightweight dashboard
Purpose:
- Let students resume work and see what they completed

Content:
- Modules in progress
- Completed cases
- Last studied question
- Small progress bars
- Resume CTA
- Simple stats:
  - cases started
  - questions completed
  - bookmarks
- No gamification overload
- Keep it academic and quiet

SCREEN 7: Empty / loading / error states
Design these states explicitly:
- No modules available
- No sources found
- AI response loading
- Image failed to load
- Session expired
- Network error
- No bookmarks yet
- Case completed state

Guidance:
- Use calm, human, professional copy
- Offer clear next action
- Avoid robotic or alarming tone

Component library to design:
Please design a small reusable design system with:
- App shell
- Top navigation
- Sidebar
- Section header
- Case card
- Status badge
- Progress bar
- Question header
- Image viewer container
- Hotspot marker
- Tooltip
- Chat response card
- Citation chip
- Source drawer row
- Prompt suggestion chip
- Composer input
- Primary button
- Secondary button
- Tertiary button
- Icon button
- Search bar
- Filter dropdown
- Tabs
- Modal
- Drawer
- Toast / inline alert
- Empty state card
- Skeleton loading state

Design tokens:
Create a small, implementation-friendly token system:
- Color tokens
  - primary / primary-dark / neutral / border / surface / background / success / warning / info
- Typography tokens
  - display / h1 / h2 / h3 / body / small / caption
- Spacing scale
  - 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48
- Radius scale
  - 8 / 12 / 16
- Shadow tokens
  - subtle / medium
- Border tokens
  - default / strong / focus

Visual direction:
- Mostly white and light gray surfaces
- Brand red used carefully for key actions and emphasis
- Blue or teal may be used for informative academic accents
- Green for success states only
- Yellow/orange for caution or hints only
- Avoid excessive saturation across the whole page
- Cards should feel lightly elevated, not heavy
- Borders should help structure content

Page layout guidance:
Desktop:
- 12-column grid
- Max content width around 1440px
- Comfortable spacing
- Left image panel around 45% to 50%
- Right tutor panel around 50% to 55%

Tablet:
- Keep split layout if possible
- If not, stack with image first and tutor second
- Preserve strong context

Mobile:
- Simplify but do not redesign the core mental model
- Image first, question second, tutor third
- Sticky question context bar
- Sticky answer input

Interaction and motion:
- Very subtle motion only
- Use small fades and panel transitions
- No flashy animations
- No bouncing
- Motion should communicate state changes only:
  - drawer open
  - modal open
  - loading
  - question change
- Maintain a stable interface when moving between questions

Trust-building UI details:
Add explicit trust cues:
- “Using approved course materials”
- “Citations available”
- “Image verified for this question”
- “Educational support, not clinical diagnosis”
- “Ask for hints, explanations, or quizzes”

Do not make these warnings loud or scary.
They should feel calm and responsible.

Important content philosophy:
- The app is a guided educational tutor, not a free exploration chat product
- The interface should nudge students toward structured learning
- Suggested prompts and navigation matter more than raw chat freedom
- The image and question context are the anchors of the experience

Requested design deliverables:
Please generate:
1) a small design system / UI kit,
2) desktop screens for all key flows,
3) tablet adaptations,
4) one mobile adaptation of the main study screen,
5) component states,
6) annotations explaining layout logic,
7) realistic placeholder content,
8) polished but simple prototype links between main screens.

Name the project something like:
“Clinical Anatomy Tutor MVP”

Name the key frames clearly:
- 01 Landing
- 02 Module Selection
- 03 Study Workspace
- 04 Sources Drawer
- 05 Full Image Modal
- 06 Progress Dashboard
- 07 Empty States
- 08 Error States
- 09 Tablet
- 10 Mobile

Final design tone:
Think:
institutional trust + medical clarity + student friendliness + low complexity + implementable in React TypeScript quickly.

Avoid:
- startup flashy aesthetics
- generic AI chatbot look
- colorful dashboard overload
- social-media style chat bubbles
- whimsical illustrations
- over-complicated information density

Make the result feel like a serious but welcoming academic learning tool.
