import { ListMusic } from 'lucide-react'
import { MUSIC_PRESETS } from '../domain/musicPresets'
import { useRaveStore } from '../store/useRaveStore'

export function GenreSelector() {
  const selectedPresetId = useRaveStore((state) => state.selectedPresetId)
  const setSelectedPresetId = useRaveStore((state) => state.setSelectedPresetId)

  return (
    <label className="genre-selector">
      <span>
        <ListMusic size={15} />
        Pista / genero
      </span>
      <select
        onChange={(event) => setSelectedPresetId(event.target.value)}
        value={selectedPresetId}
      >
        {MUSIC_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
    </label>
  )
}
