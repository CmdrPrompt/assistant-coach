# Assistant Coach

## Blood Bowl Block Calculator Web App

An interactive frontend tool that calculates the number of dice rolled in blocking actions in **Blood Bowl**, based on player positions and stats.

## Purpose

This app helps Blood Bowl players quickly analyze blocking situations. It's designed to support tactical decision-making both in gameplay and practice sessions and to correctly calculate the number of dice to roll in any given situation.

## Demo
This app in its current form can be tested at:

https://CmdrPrompt.github.io/blockassistant/

## Implemented Features

- Modular React component architecture (Pitch, TeamBuilderPanel, TeamRoster, BlockInfoPanel, etc.)
- Team builder modal with CSV import, player selection, sorting, and stat mapping
- Unique player name generation and realistic stat mapping from CSV
- Robust handling of missing/null values in team and player data
- Table formatting and alignment for team builder, including scrollable layout and dynamic columns
- Sorting logic for player types: linemen last, then by max allowed, then alphabetically
- Team info box width matches player selector for consistent UI
- Team roster and builder layouts optimized for readability and usability
- Block dice logic fully matches official Blood Bowl rules, including assists and Guard skill
- Unified BlockInfoPanel: always-visible block result field, context-sensitive instructions, dynamic color feedback
- Keyboard shortcuts in team builder modal: add/remove players (1-9/0, ctrl+number), create team (Enter)
- React hook dependency warnings resolved, state management cleaned up (no duplicate declarations)
- All state handled via React props/hooks, no window globals
- Modal dialog for team builder with default roster color logic and improved button placement
- All main logic and UI components covered by unit tests (Vitest)

## Features

- **Core Simulation Engine:**
  - **Strength & Dice Calculation:** Calculates the number of block dice (1, 2, or 3) and which coach chooses the result, based on player strength and assists.
  - **Assist Logic:** Calculates offensive and defensive assists from adjacent players, with full support for the `Guard` skill (engaged players can assist if they have Guard).
  - **Skill Implementation:**
    - `Guard`: Fully implemented for assists.
    - All other skills (`Block`, `Dodge`, `Tackle`, `Wrestle`, `Dauntless`, `Horns`, `Juggernaut`, `Stand Firm`, `Fend`, `Pro`, `Brawler`, `Grab`, `Multiple Block`, `Frenzy`) are planned, see below.
  - **Player Model:** Each player has position, strength, skills, and status (standing, prone, stunned).
  - **Test Coverage:** All core logic (block outcome, assists, dice chooser, player model, dice result application) is covered by unit tests using Vitest.

- **Interactive UI:**
  - 26×15 grid-based pitch, responsive design.
  - Drag-and-drop player placement.
  - Modal popups for player creation and details.
  - Team roster management, skill display, and selection.
  - Clickable squares for block simulation and player actions.
  - Visual feedback for assists, block results, and player status.

- **Data & Teams:**
  - Team rosters and player positions based on official Blood Bowl teams (CSV import).
  - Custom attributes and skills per player.

- **Testing:**
  - All main logic and UI components have dedicated test files.
  - Tests for edge cases, skill interactions, and UI behavior.

## Upcoming Features in planning

- **Skill Implementation:**
  - Only `Guard` is fully implemented in assist logic.
  - Planned skills that affect the number of dice or choice of result (according to documentation):
    - `Dauntless`: Can match strength against stronger opponents, may result in more dice if the test is successful.
    - `Horns`: Grants +1 strength on Blitz, affects the number of dice.
    - `Multiple Block`: Allows blocking two opponents, but reduces the number of dice per block.
    - `Pro`: Allows rerolling one die, indirectly affects result choice.
    - `Brawler`: Allows rerolling one of two dice in a block, affects result choice.
    - `Juggernaut`: On Blitz, turns "Both Down" into "Push", affects result choice.
    - `Frenzy`: Forces extra block if the opponent does not fall or is not pushed away, can indirectly affect the number of dice through positioning.

- **Dice Result Logic**
  - Basic block dice result handling.

- **Advanced UI:**
  - Zoom and scroll for pitch.
  - More visual feedback (icons, dice roll animations).
  - Improved mobile support and accessibility.

- **Other planned features:**
  - Ability to change player status (standing, prone, stunned) via the GUI.
  - Statistics, export/import, AI coach suggestions, advanced team management. Who knows?

## Tech Stack

| Component         | Technology                          |
|:------------------|:------------------------------------|
| UI Framework      | React, Chakra UI                    |
| Build Tool        | Vite                                |
| Styling           | Chakra UI, CSS Modules              |
| Core Logic        | JavaScript (ES Modules)             |
| Testing           | Vitest, Testing Library, jsdom      |
| Linting           | ESLint (with React Hooks, Refresh)  |

## Installation & Development

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/block-assistant.git
cd block-assistant
```

### 2. Install Dependencies

Install the required packages using your preferred package manager:

```sh
npm install
```

### 3. Running the Test Environment

To execute the tests with Vitest and verify the logic:

```bash
npm run test
```

### 4. Starting the Development Server

To run the application locally with hot-reloading:

```bash
npm run dev
```

### 5. Building for Production

To create an optimized production build:

```bash
npm run build
