---
layout: post
title: "Why I won't squash my commits"
date: 2014-02-05 00:27
comments: true
categories:
---

## tl;dnr

While I really appreciate the constructive comments I get on pull requests I make, there’s one type of comment I have a hard time with.

Please don't [ask me](https://github.com/rails/rails/pull/8267#issuecomment-11551706)
 to [squash](https://github.com/rails/rails/pull/13938#issuecomment-34061339)
 the commits of my pull requests.

I won’t.

If my pull request has 5 commits, it is because I each of them is independent and I believe they should remain so.

Project committers have a couple of choices:

* merge the PR as is
* manually squash the commits
* wait for someone else to make a PR with the commits squashed
* reject the PR

Call it lunacy or pride, but I just won’t squash my commits. Hopefully committers won’t take offense at that as I’ll do my best to not take offense at their suggestion that I didn’t segment my commits correctly.


## Why committers ask to squash commits?

I imagine the historical reason it that many contributors aren't super comfortable with `git` and `git rebase -i` in particular, so their commits represent their train of thought, not a sequence of independent changes to apply. E.g.:

* Introduce <great feature>
* Oops, fix typo
* Oh oh, fix a bug of <great feature>
* Fix bug of <great feature> (for real this time)

For these contributors, it is mandatory that the commits are not accepted as is. Squashing the whole thing is usually the safest bet.

There are many contributors that use `git rebase -i` and `git commit -p` in their sleep though, so that won’t be the situation.

The other reason I’ve been told is that "we generally squash all commits so that it's easy to backport/revert”. I can't agree with that. First, it is much more difficult to backport/revert just part of the PR if it is squashed. Morever, it’s pretty easy to backport/revert the whole PR by using `git revert` and `git cherry-pick` either with a range of commits or the merge commit. Less than 2% of commits get reverted anyways.

## When should committers not ask to squash commits?

If all commits can stand on their own, i.e. all tests pass after each individual commit, then the commits are atomic and do not need to be squashed. I’d even say they probably shouldn’t be squashed.

My commits are typically the smallest unit of change that will work and still pass all tests.
The main exception is a commit of a bunch of trivial changes that are isolated (e.g. removing trailing whitespace, fixing a bunch of typos in the doc,renaming of a local variable). Even then, I won’t commit doc typos and renaming of a variable together, say.

When doing a refactor, I will usually split the changes in small independent refactoring commits. I believe it makes it easier to understand and judge than one big commit.

A rather telling example was [this PR I made recently](https://github.com/sdsykes/fastimage/pull/27). It aims at fixing one bug, but I broke it down into 15 commits. Each consists of a single refactoring step in the right direction, until the last commit which is the one fixing the bug per say. It's easier to see the validity of each change this way, while the combined diff has a lot of noise and does a bunch of different things at once. I just can’t grok the combined diff.

I'm not asking everyone to structure their commits with such detail and attention; I'm only asking that it be, if not appreciated, at least accepted to do so.