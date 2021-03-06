/*!
 * Arenite JavaScript Library v1.1.0
 * https://github.com/lcavadas/arenite
 *
 * Copyright 2014, Luís Serralheiro
 */
/* global Arenite:true */
// Arenite is an implementation of the Sandbox and Module patterns. It was designed to,
// unlike most of the existing module libraries, not affect your code making it dependant on the module library itself.
//
// Base of the arenite sandbox object. Creates the base services in the arenite sandbox object.
//
// Using the Namespace and MVP (or MVC) patterns is strongly recommended but not mandatory.
//
// You can create further extensions to the sandbox by providing new services or overriding already imported ones.
//
// There are a few extensions included in this repository and you can read more about them <a href="extensions.html">here</a>.
//
// For more information about the mentioned patterns consult the book "Javascript Patterns"
// by Stoyan Stefanov from O'Reilly Media which discusses these patterns in detail.
//
// ## Configuration
// The documentation for the configuration is presented in the <a href="../index.html">website</a>.
Arenite = function (config) {
  //### Arenite.Object
  // Instance of the Sandbox is started with the <a href="object.html">Arenite.Object</a> module witch gives us access to the <code>extend</code> function used.
  var arenite = new Arenite.Object(arenite);
  //### Arenite.Html
  // Extend the instance with the <a href="async.html">Arenite.Html</a> extension providing the html helper tooks.
  arenite = arenite.object.extend(arenite, new Arenite.Html(arenite));
  //### Arenite.Async
  // Extend the instance with the <a href="async.html">Arenite.Async</a> extension providing the asynchronous tools (Latch Pattern) used by the Loader extension.
  arenite = arenite.object.extend(arenite, new Arenite.Async(arenite));
  //### Arenite.Url
  // Extend the instance with the <a href="url.html">Arenite.Url</a> extension which provides functions for analysis of query parameters.
  arenite = arenite.object.extend(arenite, new Arenite.Url(arenite));
  //### Arenite.DI
  // Extend the instance with the <a href="di.html">Arenite.DI</a> extension which provides
  // the injector functionality.
  arenite = arenite.object.extend(arenite, new Arenite.DI(arenite));
  //### Arenite.AnnotationProcessor
  // Extend the instance with the <a href="annotation.html">Arenite.AnnotationProcessor</a> extension which provides
  // the parsing and hanlding of annotations.
  arenite = arenite.object.extend(arenite, new Arenite.AnnotationProcessor(arenite));
  //### Arenite.Context
  // Extend the instance with the <a href="context.html">Arenite.Context</a> extension which provides
  // the context to manage the instances.
  arenite = arenite.object.extend(arenite, new Arenite.Context(arenite));
  //### Arenite.Loader
  // Extend the instance with the <a href="loader.html">Arenite.Loader</a> extension which provides
  // the script and resource loading functionality to the sandbox.
  arenite = arenite.object.extend(arenite, new Arenite.Loader(arenite));
  //### Arenite.Bus
  // Extend the instance with the <a href="bus.html">Arenite.Bus</a> extension which provides
  // an event bus.
  arenite = arenite.object.extend(arenite, new Arenite.Bus(arenite));
  // Initialize the injector by having it read the configuration object passed into this constructor.
  arenite.di.init(config);
  return arenite;
};
