---
layout: page
title: How To&nbsp;&nbsp;&nbsp;
permalink: /usage/
header_text: This page is still under construnction and shows out of date information.
---

##Configuration

You should require only one script tag on your html since Arenite can take care of loading your javascript.
This is advisable as there is a mechanism within Arenite to run in different flavors with different files

(ex: <b>debug</b> with all source files and <b>prod</b> with minified versions)

There are two ways to configure you application using Arenite.
You can use object configuration or annotation-based configuration.
You can use both at the same time is such is desired.

###Object

You can check the complete reference for the configuration object

####Dependencies

A minimal initial object based configuration is required to specify the resources.

{% highlight js %}
Arenite({
  context: {
    dependencies: {
      default: {
        sync: [
            ...
        ],
        async: [
          ...
        ]
      }
    }
  }
});
{% endhighlight %}

<code>dependencies</code> is the configuration part where you define the script to load.
Note there is a <code>default</code> entry in this element and that will be the files loaded by default.
You can add any other sections you'd like and trigger those alternatives by appending the query param <code>env</code>
to the url.

Example: <code>...index.html?env=debug</code> will attempt to load scripts defined in a <code>debug</code>
section.

Each dependency configuration contains two lists, <code>sync</code> and <code>async</code> which are used to
list your scripts that need to be loaded synchronously or can be loaded asynchronously respectively.

Note that all <code>sync</code> scripts are loaded one after the other and only then the <code>async</code>
scripst are loaded.


####Imports

For any non-trivial web-application you can (and should) separate your configuration into several different
files.
this can then be specified in your main configuration (usually in index.html).

<pre>
  <code class="javascript">
Arenite({
  imports: [
    {
      url: '.../sample.js',
      namespace: 'App.Sample'
    }
    ...
  ]
});
    </code>
</pre>

<code>namespace</code> specifies the function to run to obtain the partial configuration.
<code>url</code> is an optional setting that allows Arenite to fetch the source for <code>App.Sample</code>
if it is not already defined (loaded from the dependencies for example).
Note that only the content of <code>context</code> will be used.

###Annotations