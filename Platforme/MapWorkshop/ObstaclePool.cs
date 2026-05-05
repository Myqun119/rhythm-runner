using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEngine;

// Simple object pool for platform obstacles used by the map workshop
public class ObstaclePool : MonoBehaviour
{
    [Header("Default obstacle prefab (optional if variants configured)")]
    public GameObject obstaclePrefab;
    [Header("Platformer Art Pixel obstacle prefab variants")]
    public GameObject[] obstaclePrefabVariants;
    [Header("Runtime sprite source folders relative to project root")]
    public string[] spriteSourceFolders = new[]
    {
        "Platformer/Tiles",
        "Platformer/Tilemap"
    };
    [Tooltip("If true, load png/jpg files directly from the project folders and build sprite obstacles at runtime.")]
    public bool loadSpritesFromProjectFiles = true;
    public float spritePixelsPerUnit = 100f;
    public int initialSize = 10;

    private List<GameObject> pool = new List<GameObject>();
    private readonly List<Sprite> loadedSprites = new List<Sprite>();
    private bool spriteLibraryLoaded;

    void Awake()
    {
        LoadSpriteLibraryIfNeeded();
        InitPool();
    }

    public void InitPool()
    {
        ClearPool();
        for (int i = 0; i < initialSize; i++)
        {
            CreateNew();
        }
    }

    private void ClearPool()
    {
        foreach (var go in pool)
        {
            if (Application.isPlaying) Destroy(go);
            else DestroyImmediate(go);
        }
        pool.Clear();
    }

    private GameObject CreateNew()
    {
        GameObject go = null;
        if (loadedSprites.Count > 0)
        {
            go = CreateSpriteObstacle();
        }
        else
        {
            var selectedPrefab = SelectPrefab();
            if (selectedPrefab != null)
            {
                go = Instantiate(selectedPrefab);
                go.name = selectedPrefab.name;
            }
            else
            {
                // Fallback simple cube if no prefab assigned
                go = GameObject.CreatePrimitive(PrimitiveType.Cube);
                go.name = "ObstaclePlaceholder";
            }
        }
        go.SetActive(false);
        pool.Add(go);
        return go;
    }

    private GameObject CreateSpriteObstacle()
    {
        var sprite = loadedSprites[Random.Range(0, loadedSprites.Count)];
        var go = new GameObject(sprite.name);
        var renderer = go.AddComponent<SpriteRenderer>();
        renderer.sprite = sprite;
        renderer.sortingOrder = 5;
        var collider = go.AddComponent<BoxCollider2D>();
        collider.isTrigger = false;
        go.transform.localScale = Vector3.one;
        return go;
    }

    private GameObject SelectPrefab()
    {
        if (obstaclePrefabVariants != null && obstaclePrefabVariants.Length > 0)
        {
            int idx = Random.Range(0, obstaclePrefabVariants.Length);
            return obstaclePrefabVariants[idx];
        }
        return obstaclePrefab;
    }

    public GameObject GetObstacle()
    {
        foreach (var obj in pool)
        {
            if (!obj.activeSelf)
            {
                obj.SetActive(true);
                return obj;
            }
        }
        var newObj = CreateNew();
        newObj.SetActive(true);
        return newObj;
    }

    public void ReturnAll()
    {
        foreach (var obj in pool)
        {
            obj.SetActive(false);
        }
    }

    public IReadOnlyList<GameObject> GetAllPooledObjects()
    {
        return pool;
    }

    private void LoadSpriteLibraryIfNeeded()
    {
        if (spriteLibraryLoaded || !loadSpritesFromProjectFiles)
        {
            spriteLibraryLoaded = true;
            return;
        }

        spriteLibraryLoaded = true;
        string projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
        foreach (var relativeFolder in spriteSourceFolders ?? Enumerable.Empty<string>())
        {
            string folderPath = Path.GetFullPath(Path.Combine(projectRoot, relativeFolder));
            if (!Directory.Exists(folderPath)) continue;

            foreach (var filePath in Directory.GetFiles(folderPath))
            {
                string ext = Path.GetExtension(filePath);
                if (!ext.Equals(".png", System.StringComparison.OrdinalIgnoreCase) &&
                    !ext.Equals(".jpg", System.StringComparison.OrdinalIgnoreCase) &&
                    !ext.Equals(".jpeg", System.StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var sprite = LoadSpriteFromFile(filePath);
                if (sprite != null)
                {
                    loadedSprites.Add(sprite);
                }
            }
        }

        if (loadedSprites.Count == 0)
        {
            Debug.LogWarning("ObstaclePool: No project pixel sprites found, will fall back to prefab/cube obstacles.");
        }
        else
        {
            Debug.Log("ObstaclePool: Loaded sprite variants: " + loadedSprites.Count);
        }
    }

    private Sprite LoadSpriteFromFile(string filePath)
    {
        try
        {
            byte[] bytes = File.ReadAllBytes(filePath);
            var tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!tex.LoadImage(bytes)) return null;
            tex.filterMode = FilterMode.Point;
            tex.wrapMode = TextureWrapMode.Clamp;
            var sprite = Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), new Vector2(0.5f, 0.5f), spritePixelsPerUnit);
            sprite.name = Path.GetFileNameWithoutExtension(filePath);
            return sprite;
        }
        catch (System.Exception ex)
        {
            Debug.LogWarning("ObstaclePool: Failed to load sprite file " + filePath + " | " + ex.Message);
            return null;
        }
    }
}
