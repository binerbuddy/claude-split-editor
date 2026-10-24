import { expect, test } from 'claude-code/testing'

test('the band carries an undrawn edit Button bound to the action', async ($, on) => {
  on('ui.render', { component: 'AbovePrompt' }, async ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine band</Text>
  })

  const band = await $.ui.mount({
    plugin: 'split-editor',
    surface: 'terminal',
    component: 'AbovePrompt',
    requestId: 'band',
    props: {
      hasSurvey: false,
      isWorking: false,
      maxRows: 10,
      bodyColumns: 80,
      scroll: { offset: 0, bodyRows: 10 },
      view: {},
    },
  })
  expect(await band.find({ text: 'engine band' })).toBeDefined()
  expect(await band.find({ key: 'split-editor:edit' })).toBeDefined()
})
