using System.Collections;
using System.Collections.Generic;
using System;
using System.IO;
using System.Linq;
using UnityEngine;
using UnityEngine.Networking;

// UI component that loads music from a local path and detects beats
public class MusicUploadPanel : MonoBehaviour
{
    public string defaultMusicPath = "rhythm-runner\\MusicSelect\\sample.wav";
    public string musicFolderRelativePath = "MusicSelect";
    public float beatSensitivity = 1.45f;
    public int beatWindowSize = 1024;

    [HideInInspector] public AudioClip musicClip;
    [HideInInspector] public List<float> beats = new List<float>();

    public event Action<AudioClip, List<float>> OnMusicProcessed;

    public void LoadMusicFromPath(string path)
    {
        StartCoroutine(LoadMusicCoroutine(path));
    }

    public void LoadDefaultMusic()
    {
        LoadMusicFromPath(defaultMusicPath);
    }

    public void LoadFirstAvailableMusic()
    {
        string resolved = ResolveRelativeFolder(musicFolderRelativePath);
        if (Directory.Exists(resolved))
        {
            string[] supported = Directory.GetFiles(resolved)
                .Where(file =>
                    file.EndsWith(".wav", StringComparison.OrdinalIgnoreCase) ||
                    file.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) ||
                    file.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase))
                .OrderBy(file => file)
                .ToArray();

            if (supported.Length > 0)
            {
                LoadMusicFromPath(supported[0]);
                return;
            }
        }

        LoadMusicFromPath(defaultMusicPath);
    }

    public void ClearMusic()
    {
        musicClip = null;
        beats.Clear();
    }

#if UNITY_EDITOR
    public void OpenMusicFileDialogAndLoad()
    {
        string path = UnityEditor.EditorUtility.OpenFilePanel("Select Music", "", "wav,mp3,ogg");
        if (!string.IsNullOrWhiteSpace(path))
        {
            LoadMusicFromPath(path);
        }
    }
#endif

    private IEnumerator LoadMusicCoroutine(string path)
    {
        if (string.IsNullOrEmpty(path)) path = defaultMusicPath;
        string resolvedPath = ResolvePath(path);
        string uri = "file:///" + resolvedPath.Replace("\\", "/");

        using (UnityWebRequest www = UnityWebRequestMultimedia.GetAudioClip(uri, AudioType.UNKNOWN))
        {
            yield return www.SendWebRequest();
            if (www.result == UnityWebRequest.Result.Success)
            {
                musicClip = DownloadHandlerAudioClip.GetContent(www);
                if (musicClip != null)
                {
                    beats = BeatDetector.DetectBeats(musicClip, beatWindowSize, beatSensitivity);
                    OnMusicProcessed?.Invoke(musicClip, beats);
                    Debug.Log("Music loaded: " + resolvedPath + ", Beats detected: " + (beats != null ? beats.Count.ToString() : "0"));
                }
                else
                {
                    Debug.LogError("Music clip parsing failed.");
                }
            }
            else
            {
                Debug.LogError("Failed to load music: " + www.error + " | path=" + resolvedPath);
            }
        }
    }

    private static string ResolvePath(string path)
    {
        if (Path.IsPathRooted(path))
        {
            return path;
        }

        // Try project root first: <Project>/ + relative path
        string projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
        string fromProjectRoot = Path.GetFullPath(Path.Combine(projectRoot, path));
        if (File.Exists(fromProjectRoot)) return fromProjectRoot;

        // Fallback to current working directory
        string fromCwd = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), path));
        if (File.Exists(fromCwd)) return fromCwd;

        return fromProjectRoot;
    }

    private static string ResolveRelativeFolder(string relativePath)
    {
        string projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
        return Path.GetFullPath(Path.Combine(projectRoot, relativePath));
    }
}
