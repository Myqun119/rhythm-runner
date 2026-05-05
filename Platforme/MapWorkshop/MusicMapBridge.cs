using System.Collections.Generic;
using UnityEngine;

// Bridge that mirrors MusicMap-like logic to MapWorkshop: generate a level from a beat sequence and place obstacles accordingly
public class MusicMapBridge : MonoBehaviour
{
    public ObstaclePool obstaclePool;
    public Transform mapRoot;
    public int gridWidth = 20;
    public int gridHeight = 6;

    // Lightweight generator: map from beats to a grid
    public GeneratedLevel GenerateFromBeats(List<float> beats)
    {
        GeneratedLevel level = new GeneratedLevel();
        level.width = gridWidth;
        level.height = gridHeight;
        level.beats = beats ?? new List<float>();

        // Create an empty grid
        for (int x = 0; x < gridWidth; x++)
        {
            level.grid.Add(new List<bool>(new bool[gridHeight]));
        }

        int limit = Mathf.Clamp(beats != null ? beats.Count : 0, 0, gridWidth);
        for (int i = 0; i < limit; i++)
        {
            int x = i;
            int y = 1 + Random.Range(0, Mathf.Max(1, gridHeight - 2));
            level.grid[x][y] = true;
        }

        // Optionally render into scene for quick preview
        if (mapRoot != null && obstaclePool != null)
        {
            // Clear previous
            foreach (Transform t in mapRoot) if (t != mapRoot) Destroy(t.gameObject);
            for (int x = 0; x < gridWidth; x++)
            {
                for (int y = 0; y < gridHeight; y++)
                {
                    if (level.grid[x][y])
                    {
                        var obs = obstaclePool.GetObstacle();
                        obs.transform.SetParent(mapRoot, false);
                        obs.transform.localPosition = new Vector3(x, y, 0f);
                    }
                }
            }
        }
        return level;
    }
}
