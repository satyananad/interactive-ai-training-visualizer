## Interactive AI Training Visualizer

Full-stack hiring assignment implementation that simulates neural network training across epochs with real-time visual feedback.

The goal is UX architecture, animation quality, state flow, API integration, and performance awareness rather than ML correctness.

## Tech Stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Animation: Framer Motion
- Charts: Recharts
- 3D: @react-three/fiber + @react-three/drei
- Backend: Express.js + TypeScript
- Data: Static simulated data (no database)

## Feature Checklist

- Responsive dashboard layout (mobile + desktop)
- Reusable component architecture:
  - `ControlPanel`
  - `NeuralNetworkVisualizer`
  - `TrainingStats`
  - `ChartPanel`
  - `ProgressSection`
  - `ThreeDModel`
- Training controls:
  - Learning rate slider
  - Batch size dropdown
  - Epochs slider
  - Playback speed slider
- Training actions:
  - Start
  - Pause/Resume
  - Step (epoch-by-epoch replay)
  - Stop/Reset
- Live simulation updates:
  - Current epoch, loss, accuracy
  - Progress bars
  - Streaming chart updates
  - Animated neural network glow/flow based on loss
- API integration:
  - `GET /api/train?epochs=&learningRate=&batchSize=`
  - Retry with backoff on transient failures
  - Error message + retry action in UI
- 3D interactive section:
  - Orbit controls + hover response
  - Lightweight scene tuned for mobile
- Theme toggle:
  - Dark/Light mode persistence via `localStorage`
- Skeleton loading states for heavy, dynamically imported panels
- Unit tests (frontend + backend utility)

## Architecture

### Backend (`backend/`)

- `src/index.ts`
  - Express app + CORS + `/health`
  - Mounts API routes under `/api`
- `src/routes/train.ts`
  - Handles `GET /api/train`
  - Parses query params: `epochs`, `learningRate`, `batchSize`
  - Returns simulated points for each epoch
- `src/utils/generateTrainingData.ts`
  - Generates synthetic training series:
    - Loss decays over epochs with noise
    - Accuracy trends up with noise
    - Learning rate and batch size both affect output profile

### Frontend (`frontend/`)

- `app/page.tsx`
  - Main dashboard composition
  - Lifts and owns user parameters
  - Connects controls with simulation hook
- `hooks/useTrainingSimulation.ts`
  - Async fetch + retry logic
  - Interval-driven epoch streaming
  - Pause/resume/step/reset flow
  - Derived status, metrics, and chart series state
- `components/`
  - Isolated, memoized presentation and interaction units

## State Management Approach

State is intentionally local and lifted only where needed (no global store overhead).

- Page-level controlled inputs:
  - `learningRate`
  - `batchSize`
  - `epochs`
  - `speedMs`
- Simulation hook state:
  - `status`, `error`
  - `currentEpoch`, `currentLoss`, `currentAccuracy`
  - `progress`
  - `lossSeries`, `accuracySeries`
- Internal refs in hook:
  - Full dataset storage
  - Current stream index
  - Active interval id

This keeps rerenders focused on changing UI fragments and avoids unnecessary app-wide updates.

## Animation Strategy

- Framer Motion for panel entrances, progress transitions, and live feedback
- SVG-based neural network visualization:
  - Input/hidden/output layers
  - Animated connection lines
  - Node glow pulsing tied to training quality (loss)
  - Particle/star accents for visual depth
- Recharts lines update incrementally as epochs stream in
- 3D cube includes controlled auto-rotation + hover glow + orbit drag

## Performance Strategy

- `React.memo` on heavy/independent components
- `useMemo` for derived chart/history data
- Dynamic imports (`next/dynamic`) for heavy components:
  - `ChartPanel`
  - `ThreeDModel`
- Lightweight 3D scene and tuned canvas DPR
- Interval streaming with clamped minimum delay to prevent UI blocking
- Full dataset stored in refs; only incremental values hit React state

## API Contract

`GET /api/train`

Query params:
- `epochs` (number)
- `learningRate` (number)
- `batchSize` (number)

Response:

```json
{
  "params": { "epochs": 100, "learningRate": 0.01, "batchSize": 32 },
  "data": [
    { "epoch": 1, "loss": 0.85, "accuracy": 72.4 }
  ]
}
```

## Run Locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create/update `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Run frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

## Submission Checklist

Fill these before submitting:

1. GitHub repository link: `ADD_LINK_HERE`
2. Deployed app link (Vercel preferred): `ADD_LINK_HERE`
3. Loom walkthrough (3-5 min): `ADD_LINK_HERE`
