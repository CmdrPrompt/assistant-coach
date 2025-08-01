# Block Assistant

🧩 *Blood Bowl Block Calculator Web App*

An interactive frontend tool that calculates the number of dice rolled in blocking actions in **Blood Bowl**, based on player positions and stats.

---

## 🎯 Purpose

This app helps Blood Bowl players quickly analyze blocking situations. It's designed to support tactical decision-making both in gameplay and practice sessions and to correctly calculate the number of dice to roll in any given situation.

---

## ✨ Features

- ✅ **Core Simulation Engine:**
  - **Strength & Dice Calculation:** Accurately determines the number of block dice (1, 2, or 3) and which coach chooses the result based on player strength.
  - **Assist Logic:** Correctly calculates offensive and defensive assists from adjacent players.
  - **Skill Implementation:**
    - `Guard`: Allows engaged players to provide assists.
    - `Block`: Prevents the player from being Knocked Down on a "Both Down" result.
    - `Dodge`: Converts a "Defender Stumbles" result into a "Push".
    - `Tackle`: Negates the `Dodge` skill.
    - `Wrestle`: On a "Both Down", allows both players to be Placed Prone if neither has `Block`.

---

## 🔜 Upcoming Features in planning
- **Interactive UI:**
  - A 26×15 grid-based pitch with zoom and scroll.
  - Clickable squares to set up and execute block simulations.
  - Drag-and-drop players.
- **Expanded Skill Set:** Implementation of more skills that affect dice count and results, such as `Dauntless`, `Horns`, `Juggernaut`, `Stand Firm`, `Fend`, `Pro`, `Brawler`, `Grab`, `Multiple Block`, and `Frenzy`.
- **Visual Feedback & Design:**
  - Custom attributes per player.
  - Icon integration and dice roll visualization.
  - A responsive design for both mobile and desktop.
---

## 🛠 Tech Stack

| Component      | Technology              |
|:---------------|:------------------------|
| UI Framework   | React (with Tailwind CSS) |
| Build Tool     | Vite                    |
| Core Logic     | JavaScript (ES Modules) |
| Testing        | Vitest                  |

---

## 📦 Installation & Development

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
