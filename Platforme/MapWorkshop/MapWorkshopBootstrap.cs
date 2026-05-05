using UnityEngine;

public static class MapWorkshopBootstrap
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    private static void CreateDemoIfMissing()
    {
        if (Object.FindObjectOfType<SceneDemoSpawner>() != null)
        {
            return;
        }

        var go = new GameObject("MapWorkshopBootstrap");
        go.AddComponent<SceneDemoSpawner>();
        Object.DontDestroyOnLoad(go);
    }
}