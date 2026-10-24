# split-editor

A Claude Code plugin that edits the prompt in a [herdr](https://herdr.dev)
split instead of taking over the terminal.

Claude Code's own external editor (`ctrl+g`) blanks Claude's screen until the
editor exits, so the transcript and any side panes vanish while you write.
This plugin opens `$VISUAL` / `$EDITOR` (the first that exists, else `nvim`) on the current draft
in a split below Claude's pane. Claude stays drawn; when the editor exits the
text goes back into the prompt box.

## Install

```
/plugin install split-editor --marketplace binerbuddy/claude-split-editor
```

Then bind a key to it in `~/.claude/keybindings.json` (the plugin listens on
the otherwise unbound `app:toggleDiffPreSession` action). For example `ctrl+o`,
which leaves `ctrl+g` as Claude Code's own editor (`ctrl+o` normally toggles
the transcript view):

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    { "context": "Global", "bindings": { "ctrl+o": "app:toggleDiffPreSession" } }
  ]
}
```

`/edit` does the same as the key.

## Requirements

Claude Code running inside a herdr pane, with `herdr` and `jq` on `PATH`.
Elsewhere the key shows a toast and leaves the draft alone; use Claude Code's
own editor (`ctrl+g`) there.

## Codex

The same repo is a Codex plugin. Codex keeps its screen while its own external
editor (`ctrl+g`) runs, so there it only needs `VISUAL` pointed at the split
editor script; no key binding.

```
codex plugin marketplace add binerbuddy/claude-split-editor
codex plugin add split-editor@claude-split-editor
```

Approve the plugin's hook when Codex asks. It keeps a stable link to the script
at `~/.local/state/codex-split-editor/split-edit` (made when a session starts,
so after the first session). Start Codex with that as `VISUAL`, for example in
`~/.bashrc`:

```bash
codex() {
  local split_edit="${XDG_STATE_HOME:-$HOME/.local/state}/codex-split-editor/split-edit"
  [ -x "$split_edit" ] && local -x VISUAL="$split_edit"
  command codex "$@"
}
```

The script opens `$SPLIT_EDITOR`, `$EDITOR` or `nvim` (the first that exists)
in a herdr split below Codex's pane, and edits in place outside herdr.

## Develop

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

## License

MIT
