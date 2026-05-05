using System.Collections.Generic;
using UnityEngine;

// Lightweight beat detector based on energy in non-muted audio frames
// Note: This is a simple heuristic suitable for the min viable version.
public static class BeatDetector
{
    // Returns beat times in seconds for the provided AudioClip
    public static List<float> DetectBeats(AudioClip clip, int windowSize = 1024, float sensitivity = 1.5f)
    {
        var beats = new List<float>();
        if (clip == null || windowSize <= 0) return beats;

        int channels = clip.channels;
        int samples = clip.samples * channels;
        float[] data = new float[samples];
        clip.GetData(data, 0);

        int step = Mathf.Max(1, windowSize);
        int totalWindows = Mathf.Max(0, (samples - windowSize) / step + 1);

        // Energy per window (RMS)
        List<float> energies = new List<float>(totalWindows);
        for (int w = 0; w < totalWindows; w++)
        {
            int baseIdx = w * step;
            float mean = 0f;
            // compute mean for DC offset removal per window
            for (int i = 0; i < windowSize; i++) mean += data[baseIdx + i];
            mean /= windowSize;

            float sqSum = 0f;
            for (int i = 0; i < windowSize; i++)
            {
                float val = data[baseIdx + i] - mean;
                sqSum += val * val;
            }
            float rms = Mathf.Sqrt(sqSum / windowSize);
            energies.Add(rms);
        }

        // Simple adaptive threshold based on global average energy
        float avg = 0f;
        foreach (var e in energies) avg += e;
        avg = energies.Count > 0 ? avg / energies.Count : 0f;
        float threshold = avg * Mathf.Max(1.0f, sensitivity);

        // Collect beat times, avoid extremely close duplicates
        float lastBeat = -1f;
        float clipHz = clip.frequency;
        for (int i = 0; i < energies.Count; i++)
        {
            if (energies[i] >= threshold)
            {
                float t = (i * (float)windowSize) / clipHz;
                if (beats.Count == 0 || t - lastBeat > 0.05f)
                {
                    beats.Add(t);
                    lastBeat = t;
                }
            }
        }

        return beats;
    }
}
