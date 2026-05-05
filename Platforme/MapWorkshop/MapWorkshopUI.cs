using System.Collections.Generic;
using UnityEngine;

// Simple glue between existing UI (Canvas/Buttons) and the map workshop logic
public class MapWorkshopUI : MonoBehaviour
{
    public MusicUploadPanel musicPanel;
    public AutoLevelGenerator levelGenerator;
    public ObstaclePool obstaclePool;
    public Transform mapRoot;
    public int gridWidth = 60;
    public int gridHeight = 6;
    public MusicMapBridge musicMapBridge;
    private bool validateAfterUpload;
    private bool initialized;

    public void Initialize(MusicUploadPanel panel, AutoLevelGenerator generator, ObstaclePool pool, Transform root)
    {
        UnbindMusicPanel();
        musicPanel = panel;
        levelGenerator = generator;
        obstaclePool = pool;
        mapRoot = root;
        BindMusicPanel();
        initialized = true;
    }

    void OnEnable()
    {
        BindMusicPanel();
    }

    void OnDisable()
    {
        UnbindMusicPanel();
    }

    private void BindMusicPanel()
    {
        if (musicPanel != null)
        {
            musicPanel.OnMusicProcessed -= HandleMusicProcessed;
            musicPanel.OnMusicProcessed += HandleMusicProcessed;
        }
    }

    private void UnbindMusicPanel()
    {
        if (musicPanel != null)
        {
            musicPanel.OnMusicProcessed -= HandleMusicProcessed;
        }
    }

    private void HandleMusicProcessed(AudioClip clip, List<float> beatList)
    {
        if (clip == null || beatList == null) return;
        OnGenerateClicked();
        if (validateAfterUpload)
        {
            OnValidateMapClicked();
            validateAfterUpload = false;
        }
    }

    // Ensure the generator knows the pool and scene root
    public void OnGenerateClicked()
    {
        if (!initialized)
        {
            BindMusicPanel();
            initialized = true;
        }

        if (musicPanel == null || levelGenerator == null)
        {
            Debug.LogWarning("MapWorkshopUI: Missing references for generate operation.");
            return;
        }
        levelGenerator.obstaclePool = obstaclePool;
        levelGenerator.mapRoot = mapRoot;
        levelGenerator.gridWidth = gridWidth;
        levelGenerator.gridHeight = gridHeight;
        levelGenerator.startX = 0f;
        levelGenerator.cellWidth = 1f;
        levelGenerator.cellHeight = 1f;
        levelGenerator.GenerateFromBeats(musicPanel?.musicClip, musicPanel?.beats ?? new List<float>());
    }

    public void OnUploadMusicClicked()
    {
        validateAfterUpload = false;
        if (musicPanel == null)
        {
            Debug.LogWarning("MapWorkshopUI: musicPanel not assigned.");
            return;
        }
#if UNITY_EDITOR
        musicPanel.OpenMusicFileDialogAndLoad();
#else
        musicPanel.LoadDefaultMusic();
#endif
    }

    public void OnUploadGenerateValidateClicked()
    {
        if (musicPanel == null)
        {
            Debug.LogWarning("MapWorkshopUI: musicPanel not assigned.");
            return;
        }

        if (musicPanel.musicClip == null || musicPanel.beats == null || musicPanel.beats.Count == 0)
        {
            validateAfterUpload = true;
#if UNITY_EDITOR
            musicPanel.OpenMusicFileDialogAndLoad();
#else
            musicPanel.LoadDefaultMusic();
#endif
            return;
        }

        validateAfterUpload = false;
        OnGenerateClicked();
        OnValidateMapClicked();
    }

    public void OnValidateMapClicked()
    {
        if (mapRoot == null)
        {
            Debug.LogWarning("MapWorkshopUI: mapRoot not assigned.");
            return;
        }
        bool feasible = RhythmRunner.Platforme.MapWorkshop.FeasibilityChecker.CheckCurrentMapFeasibility(
            mapRoot,
            gridWidth,
            gridHeight,
            levelGenerator?.cellWidth ?? 1f,
            levelGenerator?.cellHeight ?? 1f,
            levelGenerator?.startX ?? 0f
        );
        Debug.Log("Map feasibility: " + feasible);
    }

    // New: generate from beats using MusicMapBridge (MusicMap-like logic)
    public void OnGenerateFromMusicMapClicked()
    {
        if (musicMapBridge == null)
        {
            Debug.LogWarning("MusicMapBridge not assigned");
            return;
        }
        var level = musicMapBridge.GenerateFromBeats(musicPanel?.beats ?? new System.Collections.Generic.List<float>());
        // Optional: you can use level.grid data to recreate grid here if needed
        Debug.Log("Generated level from beats. width=" + level.width + ", height=" + level.height + ", beatCount=" + level.beats.Count);
    }
}
