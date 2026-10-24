import type { EngineInterface, Register } from 'claude-code'

// The keybinding action the edit Button answers to. keybindings.json binds
// ctrl+g to it (and unbinds ctrl+g from chat:externalEditor, whose editor
// blanks the screen until it exits).
const ACTION = 'app:toggleDiffPreSession'

// Writes the draft (stdin) to a temp file, opens the editor on it in a herdr
// split below Claude's pane, waits for that pane to close, prints the file.
const SCRIPT = `
set -u
file=$(mktemp --suffix=.md "\${TMPDIR:-/tmp}/claude-prompt.XXXXXX")
trap 'rm -f "$file"' EXIT
cat >"$file"
[[ -n \${HERDR_PANE_ID:-} ]] || { echo "not inside a herdr pane" >&2; exit 3; }
pane=$(herdr pane split "$HERDR_PANE_ID" --direction down --ratio 0.5 --focus | jq -r '.result.pane.pane_id // empty')
[[ -n $pane ]] || { echo "herdr could not split the pane" >&2; exit 4; }
herdr pane run "$pane" " exec \${VISUAL:-\${EDITOR:-nvim}} $(printf %q "$file")" >/dev/null
while herdr pane get "$pane" >/dev/null 2>&1; do sleep 0.2; done
cat "$file"
`

let isEditing = false

async function edit($: EngineInterface) {
  if (isEditing) return
  isEditing = true
  try {
    const { text } = await $.prompt.read()
    let out = ''
    let err = ''
    const child = $.process.spawn({ argv: ['bash', '-c', SCRIPT, 'split-editor'], input: text })
    let step = await child.next()
    while (!step.done) {
      if (step.value.stream === 'stdout') out += step.value.text
      else err += step.value.text
      step = await child.next()
    }
    if (step.value.code !== 0) {
      await $.ui.toast(`Editor: ${err.trim() || `exited ${step.value.code}`}`)
      return
    }
    await $.prompt.fill({ text: out.replace(/\n$/, '') })
  } finally {
    isEditing = false
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'edit', description: 'Edit the prompt in a herdr split' })
    return next(e)
  })

  on('command.run', { command: 'edit' }, async $ => {
    void edit($)
    return {}
  })

  // An undrawn Button above the prompt, there only so the chord reaches it.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const own = await next(e)
    const { Box, Button } = $.ui.resolve(e)
    return (
      <Box flexDirection="column">
        {own}
        <Box display="none">
          <Button key="split-editor:edit" label="edit" action={ACTION} onPress={() => void edit($)} />
        </Box>
      </Box>
    )
  })
}
