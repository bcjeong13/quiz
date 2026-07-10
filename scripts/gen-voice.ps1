# voice-manifest.json 을 읽어 각 문장을 WAV(16kHz mono)로 합성.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$manifest = Get-Content (Join-Path $root 'voice-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$outDir = Join-Path $repo 'public/audio'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice('Microsoft Zira Desktop')
$s.Rate = -2  # 느리게(아이용)
$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)

$n = 0
foreach ($item in $manifest) {
  $path = Join-Path $outDir ($item.slug + '.wav')
  $s.SetOutputToWaveFile($path, $fmt)
  $s.Speak($item.text)
  $n++
}
$s.SetOutputToNull()
$s.Dispose()
Write-Output "generated $n files"
