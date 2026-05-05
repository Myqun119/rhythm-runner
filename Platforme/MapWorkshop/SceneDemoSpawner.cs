using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections;

// Scene demo: runtime-scaffolded UI and a MapWorkshop root to showcase the workshop flow
// This script builds a minimal demo scene with a Canvas containing two buttons:
// Generate and Validate. It wires them up to the existing MapWorkshop UI/components.
public class SceneDemoSpawner : MonoBehaviour
{
    public bool autoGeneratePreviewOnStart = true;
    public bool autoLoadMusicOnStart = true;

    void Start()
    {
        // Avoid duplicating if already present
        var mapUI = FindObjectOfType<MapWorkshopUI>();
        if (mapUI == null)
        {
            // Create required components if missing
            var root = new GameObject("MapWorkshopRoot");
            root.transform.position = Vector3.zero;
            // Obstacle Pool
            var poolGO = new GameObject("ObstaclePool");
            poolGO.transform.SetParent(root.transform);
            var pool = poolGO.AddComponent<ObstaclePool>();
            pool.obstaclePrefab = GameObject.CreatePrimitive(PrimitiveType.Cube);
            pool.InitPool();

            // Auto Level Generator
            var genGO = new GameObject("AutoLevelGenerator");
            genGO.transform.SetParent(root.transform);
            var generator = genGO.AddComponent<AutoLevelGenerator>();
            generator.obstaclePool = pool;
            generator.mapRoot = root.transform;

            // Music Upload Panel
            var musicGO = new GameObject("MusicUploadPanel");
            var musicPanel = musicGO.AddComponent<MusicUploadPanel>();
            musicPanel.defaultMusicPath = PathCombine("rhythm-runner", "MusicSelect", "sample.wav");

            // Map Workshop UI
            var uiGO = new GameObject("MapWorkshopUI");
            var ui = uiGO.AddComponent<MapWorkshopUI>();
            ui.Initialize(musicPanel, generator, pool, root.transform);
        }
        // Build a minimal Canvas with Generate/Validate buttons if not present
        var existingCanvas = FindObjectOfType<Canvas>();
        if (existingCanvas == null)
        {
            var canvasGO = new GameObject("DemoCanvas");
            var canvas = canvasGO.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasGO.AddComponent<CanvasScaler>();
            canvasGO.AddComponent<GraphicRaycaster>();
            // Create a simple panel
            var panelGO = new GameObject("DemoPanel");
            panelGO.transform.SetParent(canvasGO.transform);
            var panelRect = panelGO.AddComponent<RectTransform>();
            panelRect.sizeDelta = new Vector2(520, 260);
            panelRect.anchoredPosition = new Vector2(0, -150);
            var panelImg = panelGO.AddComponent<Image>();
            panelImg.color = new Color(0, 0, 0, 0.5f);
            // Upload Button
            CreateButton("Upload Music", panelGO.transform, new Vector2(0, 60), () =>
            {
                var mapUI2 = FindObjectOfType<MapWorkshopUI>();
                mapUI2?.OnUploadMusicClicked();
            });
            // Generate Button
            CreateButton("Generate", panelGO.transform, new Vector2(-170, -10), () =>
            {
                var mapUI2 = FindObjectOfType<MapWorkshopUI>();
                mapUI2?.OnGenerateClicked();
            });
            // Validate Button
            CreateButton("Validate", panelGO.transform, new Vector2(0, -10), () =>
            {
                var mapUI2 = FindObjectOfType<MapWorkshopUI>();
                mapUI2?.OnValidateMapClicked();
            });
            // One-click pipeline button
            CreateButton("Upload->Generate->Validate", panelGO.transform, new Vector2(170, -10), () =>
            {
                var mapUI2 = FindObjectOfType<MapWorkshopUI>();
                mapUI2?.OnUploadGenerateValidateClicked();
            });
        }

        EnsureEventSystem();

        if (autoGeneratePreviewOnStart)
        {
            StartCoroutine(AutoGeneratePreview());
        }

        if (autoLoadMusicOnStart)
        {
            var musicPanel = FindObjectOfType<MusicUploadPanel>();
            musicPanel?.LoadFirstAvailableMusic();
        }
    }

    // Helpers
    private static void CreateButton(string label, Transform parent, Vector2 anchoredPos, UnityEngine.Events.UnityAction onClick)
    {
        var btnGO = new GameObject(label + "Button");
        btnGO.transform.SetParent(parent);
        var rt = btnGO.AddComponent<RectTransform>();
        rt.sizeDelta = new Vector2(160, 40);
        rt.anchoredPosition = anchoredPos;
        var btn = btnGO.AddComponent<Button>();
        var img = btnGO.AddComponent<Image>();
        img.color = new Color(1, 1, 1, 0.8f);
        btn.targetGraphic = img;
        btn.onClick.AddListener(onClick);

        // Label
        var textGO = new GameObject("Label");
        textGO.transform.SetParent(btnGO.transform);
        var txt = textGO.AddComponent<Text>();
        txt.text = label;
        txt.alignment = TextAnchor.MiddleCenter;
        txt.color = Color.black;
        var rtText = textGO.GetComponent<RectTransform>();
        rtText.anchorMin = Vector2.zero;
        rtText.anchorMax = Vector2.one;
        rtText.offsetMin = Vector2.zero;
        rtText.offsetMax = Vector2.zero;
        // Use default font
        txt.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
    }

    private string PathCombine(params string[] parts)
    {
        return string.Join("/", parts);
    }

    private static void EnsureEventSystem()
    {
        if (FindObjectOfType<EventSystem>() != null) return;

        var es = new GameObject("EventSystem");
        es.AddComponent<EventSystem>();
        es.AddComponent<StandaloneInputModule>();
    }

    private IEnumerator AutoGeneratePreview()
    {
        // Wait one frame so all runtime-created components finish OnEnable subscriptions.
        yield return null;
        var mapUI = FindObjectOfType<MapWorkshopUI>();
        mapUI?.OnGenerateClicked();
    }
}
