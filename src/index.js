Cypress.Commands.add('guide', { prevSubject: ['optional'] }, (subject, text, delay) => displayGuidingText(text, subject, delay))

// setup
const GUIDED_MODE = 'guidedMode'
const TITLE_STYLE = 'titleStyle'
const SURROUNDING_STYLE = 'surroundingStyle'
const DELAY_PER_WORD_IN_MS = 500

// positional styling
const TITLE_POSITION_STYLE = 'z-index: 100;position: absolute;left: 5%;right: 0px;bottom: 40px;width: 80%;padding: 16px;'
const surroundingPositionStyle = (x, clientWidth, y, clientHeight) => `z-index: 100;position: absolute; left: ${x - 8}px;width: ${clientWidth + 8}px;top:${y - 8}px;height:${clientHeight + 8}px`

// look and feel styling
const TITLE_LOOK_AND_FEEL_STYLE = Cypress.env(TITLE_STYLE) || 'color: #ff5400;background-color: #ffece4;border-radius: 10px;border-style: solid;font-size: 1.8rem;'
const SURROUNDING_LOOK_AND_FEEL_STYLE = Cypress.env(SURROUNDING_STYLE) || 'border-radius: 2px;border-style: solid;color: #ff5400;'

const displayGuidingText = (text, subject, delay = 0) => {
  const shouldDocument = !!Cypress.env(GUIDED_MODE)

  if (shouldDocument) {
    const waitTime = text.split(' ').length * DELAY_PER_WORD_IN_MS + delay

    return cy.document().then((doc) => {
      const surrounding = createSurroundingDiv(subject, doc)

      const title = createDiv(doc)

      title.innerHTML = `<pre style="white-space: pre-wrap;">${text}</pre>`
      title.style.cssText = TITLE_POSITION_STYLE + TITLE_LOOK_AND_FEEL_STYLE
      doc.body.appendChild(title)

      return { div: title, surrounding }
    }).then(({ div, surrounding }) => {
      return cy.wait(waitTime).then(() => {
        if (surrounding) surrounding.remove()

        div.remove()
      })
    }).then(() => subject)

  }

  return subject

}

const createSurroundingDiv = (subject, doc) => {
  if (subject && subject.length > 0) {
    const [elem] = subject
    const { clientWidth, clientHeight } = elem
    const { x, y } = getNodePosition(elem, doc)
    const div = createDiv(doc)

    div.style.cssText = `${surroundingPositionStyle(x, clientWidth, y, clientHeight)};${SURROUNDING_LOOK_AND_FEEL_STYLE}`
    doc.body.appendChild(div)

    return div
  }

  return null

}

const createDiv = (doc) => doc.createElement('div')

const getNodePosition = (node, doc) => {

  const innerGetPosition = (target, x = 0, y = 0) => {
    if (target) {
      const { sLeft, sTop } = 'body' === target.tagName.toLowerCase()
        ? {
          sLeft: target.scrollLeft || doc.documentElement.scrollLeft,
          sTop: target.scrollTop || doc.documentElement.scrollTop,
        }
        : { sLeft: target.scrollLeft, sTop: target.scrollTop }

      return innerGetPosition(target.offsetParent,
        x + (target.offsetLeft - sLeft + target.clientLeft),
        y + (target.offsetTop - sTop + target.clientTop))

    }

    return { x, y }

  }

  return innerGetPosition(node)
}
