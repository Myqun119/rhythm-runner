using System.Collections.Generic;
using System;

[Serializable]
public class GeneratedLevel
{
    public int width;
    public int height;
    public List<List<bool>> grid = new List<List<bool>>(); // row-major per column: grid[x][y]
    public List<float> beats = new List<float>();
}
