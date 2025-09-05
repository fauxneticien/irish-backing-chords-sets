async function fetchAndParseTunes(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();

    // Split the text by the separator line
    const rawTunes = text.split(/^\*{48,}$/m).map(tune => tune.trim()).filter(tune => tune);

    const parsedTunes = rawTunes.map(tuneText => {
      const lines = tuneText.split('\n').map(line => line.trim()).filter(line => line);

      // Extract metadata
      const tune_name = lines[0];
      const [tune_type_raw, tune_key] = lines[1].split(' in ');
      const tune_type = tune_type_raw.trim();

      // Extract chords (lines after metadata)
      const chordLines = lines.slice(2);
      const tune_chords = chordLines.join('\n');

      return {
        tune_name,
        tune_type,
        tune_key,
        tune_chords
      };
    });

    return parsedTunes;

  } catch (error) {
    console.error("Error fetching or parsing tune data:", error);
    return [];
  }
}
