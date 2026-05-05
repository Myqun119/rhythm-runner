Demo Scene: Map Workshop (Runtime UI)

What this includes
- A minimal runtime demo UI with four buttons: Upload Music, Generate, Validate, Upload->Generate->Validate.
- A beat-detection flow from uploaded/local music.
- Automatic 2D side-scroller obstacle generation from detected beats.
- Feasibility check to filter dense deadlock layouts.
- Obstacle prefab reuse via object pool.

How it works
- SceneDemoSpawner builds a tiny UI at runtime if none exists and wires it to the Map Workshop components.
- Upload Music calls MusicUploadPanel to load audio and run BeatDetector.
- Generate maps beat intensity to obstacle density in columns.
- Validate checks if there is a feasible path from left to right through the grid.
- If validation fails during generation, the generator relaxes dense cells and retries.

Usage steps
- Open any scene in the project, or create a new empty scene.
- Add the SceneDemoSpawner component to an empty GameObject.
- Assign Platformer Art Pixel obstacle prefabs in ObstaclePool:
	- obstaclePrefab (single), or
	- obstaclePrefabVariants (multiple variants from Platformer resources).
- Run the scene.
- Recommended flow: click Upload->Generate->Validate once.
- Manual flow: Upload Music -> Generate -> Validate.

Notes
- This demo intentionally excludes player character logic.
- In Unity Editor, Upload Music opens a file picker; in runtime builds it falls back to defaultMusicPath.
- A cube fallback is used only when no obstacle prefab is configured.
