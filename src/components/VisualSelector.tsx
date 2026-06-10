import { Sparkles } from 'lucide-react'
import { VISUAL_PRESETS } from '../domain/visualPresets'
import { useRaveStore } from '../store/useRaveStore'

export function VisualSelector() {
  const selectedVisualPresetId = useRaveStore(
    (state) => state.selectedVisualPresetId,
  )
  const setSelectedVisualPresetId = useRaveStore(
    (state) => state.setSelectedVisualPresetId,
  )

  return (
    <label className="genre-selector">
      <span>
        <Sparkles size={15} />
        Visual
      </span>
      <select
        onChange={(event) => setSelectedVisualPresetId(event.target.value)}
        value={selectedVisualPresetId}
      >
        {VISUAL_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
    </label>
  )
}
