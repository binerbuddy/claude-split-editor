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

## Develop

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

## License

MIT
