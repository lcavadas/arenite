---
layout: page
title: How To&nbsp;&nbsp;&nbsp;
permalink: /usage/
---

## Configuration

You should require only one script tag on your html since Arenite can take care of loading your javascript.
This is advisable as there is a mechanism within Arenite to run in different flavors with different files

(ex: <b>dev</b> with all source files and <b>prod</b> with minified versions)

There are two ways to configure you instances to be registered with Arenite. You can use object configuration or annotation-based configuration. You can use both at the same time is such is desired. 

A base object is always required for at the very least declaring the dependencies.

### Object Configurationma

You can check the complete reference for the configuration object

#### Expose

The property <b>expose</b> can either be the name of the variable to be used for 
exposing the arenite instance in the window object.

```javascript
  Arenite({
    expose: 'arenite',
    ...
  });
```

Alternatively you can use a 
function which should return the name to be used. If the function returns undefined
then the arenite instance will not be exposed.

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
files.
this can then be specified in your main configuration (usually in index.html).

```javascript
Arenite({
  imports: [
    {
      url: 'sample.js',
      namespace: 'App.Sample',
    ...
  ]
});
```

<code>namespace</code> specifies the function to run to obtain the partial configuration. <code>url</code> is an optional setting that allows Arenite to fetch the source for <code>App.Sample</code> if it is not already defined (loaded from the dependencies for example). You can nest further imports which allows you to split your configuration per components/modules of your application.

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

An instance is composed of three elements: <code>namespace</code>, <code>args</code>, <code>init</code> and the optional <code>factory</code> flag.

The <code>namespace</code> is a string declaring the function to execute to create the instance.
<code>args</code> is the list of arguments to be passed when executing the <code>namespace</code> function and <code>init</code> is the function to initialize the instance (). The flag <code>factory</code> which is false by default defines if a new instance should be returned everytime the dependency is requested.

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

There are three types of <code>args</code>, <code>ref</code> which declared the dependency is a arenite registered instance with the specified name, <code>val</code> which is a raw value (string, number, array, object, etc...) and finally <code>instance</code> which is a declaration of an instance that is treated as anonymous. Anonoymous instances are used for the wiring and inherit the factory flag from its parent but are not registered in the context.

The anonymous instances are particularly useful if you use MVC or MVP design patterns where only the controller/presenter are registered in the context and the view can be instantiated for it but are not accessible from other controllers/presenters since they don't exist in the context. 

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

```javascript
App = function () {
  return {
    context: {
      dependencies: {
        default: {
          async: [
            {
              url: 'build/todo.min.js',
              instances: {
                jquery: '$',
                doT: 'doT',
                storagejs: 'storage'
              }
            }
          ]
        },
        dev: {
          async: [
            {
              url: '//cdn.rawgit.com/lcavadas/jquery/2.1.3/dist/jquery.min.js',
              instances: {
                jquery: '$'
              }
            },
            {
              url: '//cdn.rawgit.com/lcavadas/doT/1.0.1/doT.js',
              instances: {
                doT: 'doT'
              }
            },
            {
              url: '//cdn.rawgit.com/lcavadas/Storage.js/4c0b9016c5536d55bf55e21bf4e83d29f3483750/build/storage.js',
              instances: {
                storagejs: 'storage'
              }
            },
            '//cdn.rawgit.com/lcavadas/arenite/0.0.15/js/extensions/bus/bus.js',
            '//cdn.rawgit.com/lcavadas/arenite/0.0.15/js/extensions/storage/storage.js',
            '//cdn.rawgit.com/lcavadas/arenite/0.0.15/js/extensions/template/dot.js',
            '//cdn.rawgit.com/lcavadas/arenite/0.0.15/js/extensions/router/router.js',

            'js/model.js',
            'js/list/list.js',
            'js/list/listView.js',
            'js/list/toolbarView.js',
            'js/todo/todo.js',
            'js/todo/todoView.js'
          ]
        }
      },
      extensions: {
        bus: {
          namespace: 'Arenite.Bus'
        },
        templates: {
          namespace: 'Arenite.Templates',
          args: [
            {ref: 'arenite'},
            {ref: 'doT'}
          ],
          init: {
            wait: true,
            func: 'add',
            args: [{
              value: ['templates/template.html']
            }]
          }
        },
        storage: {
          namespace: 'Arenite.Storage',
          args: [
            {ref: 'arenite'},
            {ref: 'storagejs'}
          ],
          init: 'init'
        },
        router: {
          namespace: 'Arenite.Router',
          args: [{ref: 'arenite'}],
          init: {
            func: 'init',
            args: [
              {
                value: {
                  '/': [{
                    instance: 'arenite',
                    func: 'bus.publish',
                    args: [
                      {value: 'filter-change'},
                      {value: 'all'}
                    ]
                  }],
                  '/active': [{
                    instance: 'arenite',
                    func: 'bus.publish',
                    args: [
                      {value: 'filter-change'},
                      {value: 'active'}
                    ]
                  }],
                  '/completed': [{
                    instance: 'arenite',
                    func: 'bus.publish',
                    args: [
                      {value: 'filter-change'},
                      {value: 'completed'}
                    ]
                  }]
                }
              },
              {value: true}]
          }
        }
      },
      start: [
        {
          instance: 'model',
          func: 'load'
        }
      ],
      instances: {
        model: {
          namespace: 'App.Model',
          args: [
            {ref: 'arenite'}
          ]
        },
        list: {
          namespace: 'App.List',
          init:'init',
          args: [
            {ref: 'arenite'},
            {ref: 'model'},
            {
              instance: {
                namespace: 'App.ListView',
                args: [
                  {ref: 'arenite'},
                  {ref: 'jquery'}
                ],
                init: 'init'
              }
            },
            {
              instance: {
                namespace: 'App.ToolbarView',
                args: [
                  {ref: 'arenite'},
                  {ref: 'jquery'}
                ],
                init: 'init'
              }
            }
          ]
        },
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
      }
    }
  };
};
```

### Annotation Configuration

## Building an app

As part of Arenite, a gulp extension has also been developed that can read all the sources declared in an Arenite config (with imports). The extension is published on npm.js with the name <code>gulp-arenite-src</code>

Here's an example extracted from the TodoMVC demo app. For the complete source go <a href="//github.com/lcavadas/arenite-todo">here</a>.

```javascript
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var arenitesrc = require('gulp-arenite-src');

gulp.task('min', function () {
  arenitesrc({
      mode: 'dev', //Default is 'dev' anyway but left here for clarity
      base: 'static' //So you don't have to use the base folder directly
    },
    {
      export: 'arenite',
      imports: [
        {
          url: 'static/js/app.js',//The path defined here needs to be relative to here
          namespace: 'App'
        }
      ]
    }, function (src) {
      src.pipe(concat('todo.min.js'))
        //So the annotation based instances work, they should be annotated with /*! */ blocks
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(build));
    });
});
```
