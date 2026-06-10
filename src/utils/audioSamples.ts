import type { MusicPreset, SampleSlot } from '../domain/musicPresets'

const audioModules = import.meta.glob<string>('../audio/**/*.{mp3,wav,ogg}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const audioFiles = Object.entries(audioModules).map(([path, url]) => ({
  path: path.toLowerCase(),
  url,
}))

export type SampleMap = Partial<Record<SampleSlot, string>>

export function resolvePresetSamples(preset: MusicPreset): SampleMap {
  return Object.entries(preset.sampleHints).reduce<SampleMap>(
    (samples, [slot, hints]) => {
      const match = audioFiles.find((file) =>
        hints.every((hint) => file.path.includes(hint.toLowerCase())),
      )

      if (match) {
        samples[slot as SampleSlot] = match.url
      }

      return samples
    },
    {},
  )
}

export function getAvailableSampleCount(preset: MusicPreset) {
  return Object.keys(resolvePresetSamples(preset)).length
}
