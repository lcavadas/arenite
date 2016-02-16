---
layout: page
title: How To&nbsp;&nbsp;&nbsp;
permalink: /usage/
---

## Configuration

You should require only one script tag on your html since Arenite can take care of loading your javascript.
This is advisable as there is a mechanism within Arenite to run in different flavors with different files

(ex: <b>dev</b> with all source files and <b>prod</b> with minified versions)

There are three ways to configure your instances to be registered with Arenite. You can use object configuration, annotation-based configuration or an AMD-style call to <code>define</code>. You can use all at the same time if such is desired.

A base object is always required for at the very least declaring the dependencies.

For the dev API documentation please go  <a href="//rawgit.com/arenite/arenite/master/docs/core.html">here</a>.

### Object Configurationma

The object configuration relies on a simple object to define the desired properties for arenite to act upon.

#### Expose

The property <b>expose</b> is name of the variable to be used for exposing the arenite instance in the window object. This property can also be a function to determine if the variable should be exposed.

Expose Arenite as a window variable <code>arenite</code>:

```javascript
  Arenite({
    expose: 'arenite',
    ...
  });
```

Expose Arenite as a window variable <code>arenite</code> only if a mode has been specified:

```javascript
Arenite({
  expose: function(arenite){
    if (arenite.url.getUrl().mode){
      return 'arenite'
    }
  },
  ...
});
```

#### Imports

For any non-trivial web-application you can (and should) separate your configuration into several different
components/files, known to arenite as <code>modules</code>. These can then be specified in your main configuration (usually in index.html).

```javascript
Arenite({
  imports: {
    "templates": {    
      "module": "doT",
      "vendor": "arenite/template-extension",
      "version": "1.0.2"
    ...
  }
});
```
The key used in imports is used to uniquely identify each imported modules.

<code>module</code> is the name/path of the module.
If no vendor is defined, it will use the name as a relative path. If the vendor is defined it will import the module from the repository (defaults to <code>//cdn.rawgit.com/{vendor}/{version}/{module}/</code> and can be overriden by defining the config property <code>repo</code>)
This name must correspond to the relative path of the configuration for the module.

<code>vendor</code> <b>optional</b> specifies the vendor of the module you are about to import.

<code>version</code> <b>optional</b> Defines which version of the module to fetch.

<b>Note 1</b>: Any arenite and non-arenite properties defined are merged and exposed in the property <code>config</code> of arenite.

<b>Note 2</b>: Local modules are packaged into the minified files by the gulp plugin while non-local are not.

<b>Note 3</b> Any module must have a <code>module.json</code> file with the configuration for that module.

#### Context

The <code>context</code> is composed of four sections, all of them optional.

##### Dependencies

A minimal initial object based configuration is required to at the very least specify the resources. The <code>dependencies</code> section of the context is the configuration part where you define the script to load.
Note there is a <code>default</code> entry in this element and that will be the files loaded by default.
You can add any other sections you'd like and trigger those alternatives by appending the query param <code>mode</code>
to the url.

```javascript
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
```

Example: <code>...index.html?mode=debug</code> will attempt to load scripts defined in a <code>debug</code>
section.

Each dependency configuration contains two lists,<code>sync</code> and <code>async</code> which are used to list your scripts that need to be loaded synchronously or can be loaded asynchronously respectively.

Note that all <code>sync</code> scripts are loaded one after the other and only then the <code>async</code>
scripst are loaded in parallel.

The entries can be simple strings with the location of the script:

```javascript
Arenite({
  context: {
    dependencies: {
      ...
      dev: {
        sync: [
            '//code.jquery.com/jquery-2.1.3.min.js'
        ]
      ...
      }
    }
  }
});
```

Or you can, besides specifying the script, define the dependency extracts a variables from the window and registers them in arenite as an instances:

```javascript
Arenite({
  context: {
    dependencies: {
      ...
      dev: {
        sync: [
            {
              url:'//code.jquery.com/jquery-2.1.3.min.js'
              instances:{
                'jquery':'$'
                ...
              },
              init:function(arenite){...}
            }
            ...
        ]
      }
    }
  }
});
```
<code>url</code> URL from which to retrieve the script.
<code>instances</code> Object with the list of variables to extract from window and register in arenite's context (the key is the instance name and the value is the variable name in the window object)
<code>init</code> is an optional function that is executed after the script is imported and before the instance is extracted from the window object.

##### Instances

This section declares the instances that are to be wired and registered in the arenite context.

Any instance declared in this section can be accessed using <code>arenite.context.get('model')</code> where 'model' is the name of the instance to retrieve.

An instance is composed of four elements: <code>namespace</code>, <code>args</code>, <code>init</code> and the optional <code>factory</code> flag.

The <code>namespace</code> is a string declaring the function to execute to create the instance.
<code>args</code> is the list of arguments to be passed when executing the <code>namespace</code> function and <code>init</code> is the function to initialize the instance (). The flag <code>factory</code>, which is false by default, defines if a new instance should be returned everytime the dependency is requested.

```
instances: {
...
 todo: {
    factory: true,
    namespace: 'App.Todo',
    args: [
      {ref: 'arenite'},
      {ref: 'model'},
      {
        instance: {
          namespace: 'App.TodoView',
          args: [
            {ref: 'arenite'},
            {ref: 'jquery'}
          ]
        }
      }
    ]
  }
...
}
```

There are four types of <code>args</code>: <code>ref</code> which declares the dependency is a arenite registered instance with the specified name, <code>value</code> which is a raw value (string, number, array, object, etc...),  <code>instance</code> which is a declaration of an anonymous instance and <code>exec</code> which is the declaration of an execution (see the Start section of this document for more details).

Anonoymous instances are used in the wiring and inherit the factory flag from its parent but are not registered in the context. The anonymous instances are particularly useful if you use MVC or MVP design patterns where only the controller/presenter are registered in the context and the view can be declared (instantiated) for it but are not accessible from other controllers/presenters since they don't exist in the context. 

##### Extensions

You register your extensions in this section. There are a few extensions defined in the arenite project itself like the event bus, a simple router, a local storage extension (using StorageJS), a templating extension (using doT) and a test runner for jasmine with blanket code coverage.

An extension is pretty much a regular instance that instead of being added to the context registry is used to extend the arenite object itself.


```
...
 extensions: {
   templates: {
    namespace: 'Arenite.Templates',
    args: [
      {ref: 'arenite'},
      {ref: 'doT'}
    ],
    init: {
      wait: true,
      func: 'add',
      args: [
        {value: ['build/templates.html']}
      ]
    }
  }
   bus: {
      namespace: 'Arenite.Bus'
    }
 }
 ...
```

The name of the instance is used as the collection of utility functions. The sample snippet will add the return structure from Arenite.Bus into arenite.bus and Arenite.Templates into arentite.templates.

Having <code>wait: true</code> in an extension declaration will cause arenite to hold off the processing of the <code>instances</code> section until the extension has been completely instantiated and resolved. The callback to mark the instance as ready is passed as the last argument of the init function of the instance.

##### Start

The <code>start</code> section as the name implies is used to start the application after everything has been wired and initialized. It is a collection of function executions that is ran sequencially.

```
...
start: [
  {
    instance: 'model',
    func: 'load'
  }
],
...
```

The structure of the function executions is <code>instance</code> declaring the instance to use (the name), <code>func</code> the name of the function to be used and <code>args</code> the list of arguments. Starts can also be declared by using  <code>func</code> as an actual Function that receives the arguments declared in the <code>args</code>.

```
...
start: [
  {
    func: function (model) {
      model.load();
    }, 
    args:[
      {ref:'model'}
    ]
  }
]
...
```

#### Full example

Here's a full configuration as used in Arenite's TodoMVC demo app. For the complete source go <a href="//github.com/lcavadas/arenite-todo">here</a>

```json
{
  "imports": {
    "templates": {
      "vendor": "arenite/template-extension",
      "module": "doT",
      "version": "1.0.2"
    },
    "storage": {
      "vendor": "arenite/storage-module",
      "module": "storagejs",
      "version": "1.0.2"
    },
    "router": {
      "vendor": "arenite/router-extension",
      "module": "",
      "version": "1.0.5"
    }
  },
  "context": {
    "dependencies": {
      "default": {
        "async": [
          {
            "url": "build/todo.min.js",
            "instances": {
              "jquery": "$"
            }
          }
        ]
      },
      "dev": {
        "async": [
          "//code.jquery.com/jquery-2.1.3.min.js",
          "js/model.js",
          "js/list/list.js",
          "js/list/listView.js",
          "js/list/toolbarView.js",
          "js/todo/todo.js",
          "js/todo/todoView.js"
        ]
      }
    },
    "start": [
      {
        "instance": "model",
        "func": "load"
      }
    ],
    "extensions": {
      "templates": {
        "init": {
          "wait": true,
          "func": "add",
          "args": [
            {
              "value": [
                "build/template.html"
              ]
            }
          ]
        }
      }
    },
    "instances": {
      "model": {
        "namespace": "App.Model",
        "args": [
          {
            "ref": "arenite"
          },
          {
            "ref": "storage"
          }
        ]
      },
      "list": {
        "namespace": "App.List",
        "init": "init",
        "args": [
          {
            "ref": "arenite"
          },
          {
            "ref": "model"
          },
          {
            "instance": {
              "namespace": "App.ListView",
              "args": [
                {
                  "ref": "arenite"
                },
                {
                  "ref": "jquery"
                }
              ],
              "init": "init"
            }
          },
          {
            "instance": {
              "namespace": "App.ToolbarView",
              "args": [
                {
                  "ref": "arenite"
                },
                {
                  "ref": "jquery"
                }
              ],
              "init": "init"
            }
          }
        ]
      },
      "todo": {
        "factory": true,
        "namespace": "App.Todo",
        "args": [
          {
            "ref": "arenite"
          },
          {
            "ref": "model"
          },
          {
            "instance": {
              "namespace": "App.TodoView",
              "args": [
                {
                  "ref": "arenite"
                },
                {
                  "ref": "jquery"
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```
