---
layout: post
title: "Hovering in Integration specs"
date: 2014-03-15 00:27
comments: true
categories:
---

## The problem

It's awesome that integration specs can go through the same steps as users.

    click_on 'New Invoice'
    fill_in 'Amount', with: '5.42'
    click_on 'Save'

`capybara` with the right engines (`capybara_webkit`, `selenium` or `phantom`) will even check that the buttons and form items are visible on screen when proceeding. If they've been hidden or moved offscreen, or are covered by other items, either because of CSS or javascript, the test will fail.

The philosophy is of getting as close to the user experience as possible and this makes for very strong tests.

For some reason I can't fathom, there is no correct way to `hover` over a zone or an element, though.

It's the kind of issue I'm expecting to have been addressed years ago, and yet, there apparently still some debate as to if it is necessary.

The only debate should be about if clicking on an element should first trigger hover or not, i.e. why is this link clickable at all?

    <a style=":hover{display:none}">Unclickable</a>

## Workaround

The various questions on the internet all point to a first basic answer involving javascript:


This indeed will trigger JS events bound on the hover events.

It doesn't solve the problem for purely CSS rules though.

## Improved workaround

It's actually not too difficult to trigger the correct CSS rules using a bit of javascript magic.

Here's some coffeescript using jQuery that does just that:

    mockCSSclass = 'mock-hover'

    # go through all the CSS rules and converts the ones involving `:hover`
    # into equivalent rules with a class '.mock-hover'.
    # Luckily, `:hover` and `.mock-hover` have the same CSS specificity.
    # Since the mock rules are insert next to the hover ones,
    # they will behave with the exact same precedence.
    mockHoverCSS = ->
      for stylesheet in document.styleSheets
        for rule, i in stylesheet.cssRules or stylesheet.rules or [] by -1
          if /:hover/i.test rule.selectorText
            mockRule = rule.cssText.replace(/:hover/gi, ".#{mockCSSclass}")
            stylesheet.insertRule mockRule, i
      mockHoverCSS = -> # Do nothing next time

    # set or unset hover state for a jquery set, by triggering
    # both the mouseover/out events and the :hover CSS rules.
    $.fn.toggleMockHover = (set) ->
      mockHoverCSS()
      @parents().addBack().toggleClass(mockCSSclass, set)
      @trigger(if set then 'mouseover' else 'mouseout')


Here's a simple Capybara helper:

    def hovering_over(selector)
      page.driver.browser.execute_script """
        $(#{selector.to_json}).toggleMockHover(true);
      """
      yield
    ensure
      page.driver.browser.execute_script """
        $(#{selector.to_json}).toggleMockHover(false);
      """
    end

Hope this helps some people while we wait for `:hover` to be a first class citizen of `capybara` et al.

Notes: JS needs to be adapted for IE < 9, if you're unliky enough to have to support that...
