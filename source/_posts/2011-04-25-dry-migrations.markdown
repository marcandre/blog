---
layout: post
title: DRY migrations
alias: 2011/04/dry-migrations.html
---

I wanted to write a post about the many things that should be fixed with Rails.

Interestingly, Rails 3.1 fixes quite many of these.

At last, jQuery takes over Prototype. Prototype was nice and didn't exactly solve the same problem, but in my experience jQuery is mandatory for developing anything decent. Same thing for Sass and I'm glad they have corrected the mistake of the default sass location (which used to be `/public/stylesheets/sass` when it <span style="font-style:italic;">had to be</span> in `/app` somewhere. Handling assets was also sorely missing; I've been using sprockets before and it's a fine choice.

I'm happily surprised at CoffeeScript. I've also been using it but I didn't expect it to become the default, especially given the fact that it's quite young and I'd argue it's a much bolder move than using Haml. I have no idea as to why Haml doesn't also come standard.

It's interesting that we are now targeting the web platform without writing anything directly in it: using HAML instead of HTML, Sass instead of CSS, CoffeeScript instead of Javascript (and accessing the DOM more often via jQuery than directly).

The last goodie is DRY migrations. I find it irritating to write most migrations as I'd really like to generate them automatically from a change to the schema, maybe because my ancient development tool 4D gave me that 25 years ago...

I'd rather write the schema in the model (where it belongs IMO) and generate a "diff" as a migration, but at the very least I wanted to avoid writing the `drop_table` and `remove_column` that always correspond one to one with `create_table` and `add_column`.

I was actually looking at the code to see where one could have automatically undoable migrations, as it is much easier than my dream solution, and lo and behold, <a href="https://github.com/rails/rails/compare/deff5289474d966bb12a...a4d9b1d3">we can now do this</a>!

``` ruby
# Something like:

class AddFoo< ActiveRecord::Migration
  def self.up
    create_table :foos do |t|
      t.string :name
      # ...
    end

    change_table :products do |t|
      t.references     :foo
      # ...
    end

    add_index :products, :foo_id
  end

  def self.down
    remove_index products, :foo_id

    change_table :products do |t|
      t.remove     :foo_id
      # ...
    end

    drop_table :foos

  end
end

# can now be dry:

class AddFoo< ActiveRecord::Migration
  def change
    create_table :foos do |t|
      t.string :name
      # ...
    end

    change_table :products do |t|
      t.references     :foo
      # ...
    end

    add_index :products, :foo_id
  end
end
```

Much better. Hopefully we'll soon be able to specify `:from => ...` when issuing `change_column_default` or similar so that they become undoable too.

I still have a couple of gripes on my list. In no particular order:

#### Haml

#### Default template

Way too basic. There should be a basic solution for the page title (that isn't a static title!), default `content_for`, etc... Easy to do yourself, but why not encourage a standard convention?

#### test environment & fixtures

Also too basic too. I find fixtures longer to generate and harder to maintain when the schema changes compared to factory-based data.

#### config/database.yml

It has the wrong idea in mixing important production information with less important and more local information for the test & dev environments. I've always had problems with source control and that file because I stick with SQLite for dev/test while other developers prefer other DBs.

#### Yaml

Now that I think of it, I'm not sure there should be any yml files in a rails project. The gain over a strictly Ruby file is minimal, even more so in Ruby 1.9.2, and it's just less flexible. It also encourages crazy stuff like cucumber yml config file with ERB in it.

#### MVC...L?

Maybe it's just me, but I like to write separate functionality that acts like a library. It doesn't fit as a Model, so I stick that code in `/lib` with the caveat that there is no default structure, that it doesn't autoload nor auto reloads. It should probably go in `app/lib` or similar.

Fingers crossed for Rails 3.2!

