using System.Collections.Generic;
using System.Linq;
using UnityEngine;

// Core generator: from beat times to a simple obstacle layout in the scene
public class AutoLevelGenerator : MonoBehaviour
{
    public ObstaclePool obstaclePool;
    public Transform mapRoot;

    public int gridWidth = 60;
    public int gridHeight = 6;
    public float cellWidth = 1f;
    public float cellHeight = 1f;
    public float startX = 0f;

    public int maxPerBeat = 2;
    public int maxAttempts = 5;
    [Range(0f, 1f)] public float baseDensity = 0.35f;
    public int minimumOpenRowsPerColumn = 1;
    public int corridorPadding = 1;
    public float beatInfluence = 0.75f;

    // Beats to layout along horizontal axis
    public List<float> beats = new List<float>();

    // Internal helpers: occupied grid (true = obstacle)
    private bool[,] currentGrid;

    void Awake()
    {
        if (mapRoot == null) mapRoot = this.transform;
        if (obstaclePool == null) obstaclePool = GetComponent<ObstaclePool>();
    }

    public void GenerateFromBeats(AudioClip musicClip, List<float> beatsInput)
    {
        beats = beatsInput ?? new List<float>();
        if (mapRoot == null) mapRoot = this.transform;
        if (obstaclePool == null)
        {
            Debug.LogWarning("AutoLevelGenerator: ObstaclePool missing.");
            return;
        }

        obstaclePool.ReturnAll();

        currentGrid = new bool[gridWidth, gridHeight];
        int columns = Mathf.Clamp(gridWidth, 1, 1024);
        float clipLength = musicClip != null ? Mathf.Max(0.01f, musicClip.length) : EstimateBeatDuration();
        int[] beatHeat = BuildBeatHeatMap(columns, clipLength);
        int safeRow = Mathf.Clamp(gridHeight / 2, 1, Mathf.Max(1, gridHeight - 2));

        BuildGuaranteedCorridor(safeRow);
        BuildGridFromBeats(beatHeat, safeRow);

        // Feasibility check and simple recovery loop
        bool ok = RhythmRunner.Platforme.MapWorkshop.FeasibilityChecker.PathExists(currentGrid);
        int attempts = 0;
        while (!ok && attempts < maxAttempts)
        {
            RelaxGrid(safeRow, beatHeat);
            ok = RhythmRunner.Platforme.MapWorkshop.FeasibilityChecker.PathExists(currentGrid);
            attempts++;
        }

        DrawGridWithPool();

        if (!ok)
        {
            Debug.LogWarning("AutoLevelGenerator: Could not generate a feasible map after adjustments.");
        }
    }

    private float EstimateBeatDuration()
    {
        if (beats == null || beats.Count == 0) return Mathf.Max(1f, gridWidth * 0.25f);
        return Mathf.Max(0.01f, beats.Max() + 0.25f);
    }

    private int[] BuildBeatHeatMap(int columns, float clipLength)
    {
        int[] heat = new int[columns];
        if (beats == null || beats.Count == 0) return heat;

        foreach (float beatTime in beats)
        {
            float normalized = Mathf.Clamp01(beatTime / clipLength);
            int column = Mathf.Clamp(Mathf.RoundToInt(normalized * (columns - 1)), 0, columns - 1);
            heat[column]++;
        }

        return heat;
    }

    private void BuildGuaranteedCorridor(int safeRow)
    {
        for (int x = 0; x < gridWidth; x++)
        {
            for (int offset = -corridorPadding; offset <= corridorPadding; offset++)
            {
                int row = safeRow + offset;
                if (row >= 0 && row < gridHeight)
                {
                    currentGrid[x, row] = false;
                }
            }
        }
    }

    private void BuildGridFromBeats(int[] beatHeat, int safeRow)
    {
        int columns = Mathf.Min(gridWidth, beatHeat.Length);
        for (int x = 0; x < columns; x++)
        {
            int densityBoost = beatHeat[x] > 0 ? Mathf.Clamp(beatHeat[x], 0, 4) : 0;
            float density = baseDensity + densityBoost * beatInfluence * 0.08f;
            int maxObstacles = Mathf.Clamp(Mathf.RoundToInt(maxPerBeat * (1f + densityBoost * 0.5f)), 0, gridHeight - minimumOpenRowsPerColumn);
            int placed = 0;

            for (int y = 0; y < gridHeight; y++)
            {
                if (Mathf.Abs(y - safeRow) <= corridorPadding) continue;
                if (x == 0 || x == gridWidth - 1) continue;

                if (Random.value < density)
                {
                    currentGrid[x, y] = true;
                    placed++;
                    if (placed >= maxObstacles) break;
                }
            }

            EnsureColumnNotBlocked(x, safeRow);
        }
    }

    private void EnsureColumnNotBlocked(int col, int safeRow)
    {
        int openRows = 0;
        for (int y = 0; y < gridHeight; y++)
        {
            if (!currentGrid[col, y]) openRows++;
        }

        while (openRows < minimumOpenRowsPerColumn)
        {
            int row = Random.Range(0, gridHeight);
            if (Mathf.Abs(row - safeRow) <= corridorPadding) continue;
            if (currentGrid[col, row])
            {
                currentGrid[col, row] = false;
                openRows++;
            }
        }
    }

    private void RelaxGrid(int safeRow, int[] beatHeat)
    {
        int columns = Mathf.Min(gridWidth, beatHeat.Length);
        int removeCount = Mathf.Max(1, Mathf.RoundToInt(columns * 0.1f));
        for (int i = 0; i < removeCount; i++)
        {
            int col = Random.Range(1, Mathf.Max(2, columns - 1));
            int row = Random.Range(0, gridHeight);
            if (Mathf.Abs(row - safeRow) <= corridorPadding) continue;
            currentGrid[col, row] = false;
        }

        BuildGuaranteedCorridor(safeRow);
        for (int col = 0; col < columns; col++)
        {
            EnsureColumnNotBlocked(col, safeRow);
        }
    }

    private void DrawGridWithPool()
    {
        obstaclePool.ReturnAll();
        for (int x = 0; x < gridWidth; x++)
        {
            for (int y = 0; y < gridHeight; y++)
            {
                if (!currentGrid[x, y]) continue;
                var obs = obstaclePool.GetObstacle();
                obs.transform.SetParent(mapRoot, false);
                float px = startX + x * cellWidth;
                float py = y * cellHeight;
                obs.transform.localPosition = new Vector3(px, py, 0f);
            }
        }
    }
}
