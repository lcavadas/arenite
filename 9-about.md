---
layout: page
title: About
permalink: /about/
---

##Background
I've been for the better part of the last decade working elbow deep in the trenches of single paged browser applications. Throughout my experience I have usually faced the following major issues.

###Issue 1
After analysing many frameworks and libraries, is that most of the big frameworks have one or two cool features but come packed with dozens of undesired stuff and sometimes they mess with each other (if you try to mix them to use the best of all of them). Mixing them all together also means the amount of javascript code loaded into the browser is astronomical and at the end of the day you're only using a small percentage of the huge amount of code you have loaded.

###Issue 2
One of the problems with these big frameworks is that they're very invasive of your code. When you want to use them properly you are filling the code you write with idiosyncrasies from the library you're using. Of course there are some small libraries and frameworks where the same happens and I dislike them for the same reason. This will tie your code very deeply to the framework in question and sometimes goes as far as deeply tying your code to a specific version of that framework.

###Issue 3
Due to issue #1 and #2 I became a big fan of micro-frameworks where I could mix and match the best suited and least invasive.  This "liberates" your code making it less dependant on some specific usage usually forced by the big libraries. This of course comes at the price of having the window object "polluted" by all kinds of things.

##Arenite

In a continuous effort for most of my time as a javascript developer I have tried by myself and with others to overcome these issues throughout time.

###Iteration 1 - <small>"Genesis V1"</small>
This first iteration was developed in a start-up I co-founded with a few friends. This iteration was mostly about how we actually organised our code and how to break it down into smaller pieces while still exposing that wonderful functionality of all the micro libraries to all the code. This approach was heavily based on a application-wide event bus, principle I still favour to this day. The services, like the bus, templating, etc. were exposed through an object that was shared by all the pieces of the application. This was accomplished using the Sandbox pattern, thus reducing the pollution the window object.

Many of the services provided were third party and we used very small wrappers to expose the functionality giving us the freedom to change the library with another quite easily by just wrapping said other with a thin wrapper specific for that library. This gave us an initial good solution.

The problems we then faced were related to the difficulty in trying to debug something that only happened in production when the code was minified for performance. Also we had a bit of duplication of instances (models for example) because they were used in many different parts of the application. Everything was pretty much passed as a reference. Even though the pieces of the application were small they were still highly coupled.


###Iteration 2 - <small>"Genesis v2"</small>

Hence came the second version of "Genesis". In this version we tried solving the issues around the difficulty of analysing an app in production and the over instantiation of objects like models.

The issue around the production code was solved with a script loader that was able to understand if you wanted to use the human-readable versions of the files instead of the minified version so that debugging was easier but the page was still very fast when not in debug mode. We also added a sort of service registry in the Sandbox that allowed you to register instances that you wanted to re-use somewhere else.

This version still had quite a bit of boilerplate code and the pieces of the applications were still as tightly bound as before.

###Iteration 3 - <small>No Name</small>

For this third iteration I had changed jobs and had to re-design the system achieved by both previous iterations from scratch. This did however provide the opportunity to improve on the weak points of it's previous iterations. This iteration had no formal name as I just named it after the company I was working in.

For this iteration I decided to be get rid of all required dependencies for the Sandbox (jQuery was a dependecy of both previous iterations).

Since it was designed from scratch, I was able to achieve a much better modularization of the Sandbox. Instead of having the Sandbox straight away populated with all the services developed for it, the Sandbox itself was just a small set of features required for it to understand a configuration and load the resources depending on the environment. All other services required were then specified on the configuration to be loaded and extend the Sandbox before the app was loaded. This created the concept of a Sandbox extension.

Unlike before I could have several different wrappers for the same service using different underlying third party libraries that exposed the same api. It was then only a matter of selecting the desired one in the configuration.

In this version, the concept of the registry was also extended and most of the instances used in the application were declared in the configuration. The instances with variable numbers throughout the execution of the app were still bound to the code.

This approached allowed for something that hadn't been required in both previous iterations which was to use the exact same code and application appear and behave differently to different clients just by changing a configuration file. Also most of the code tight coupling was gone.

One of the "issues" with this version was that the configuration of each intance was very tied to the instance itself which meant the configuration was very different, in structure, between components.

###Iteration 4 - <small>"Arenite"</small>

In an effort to not have to redesign the Sandbox over and over again I decided to use my personal time to create an implementation a could just reuse even if I changed jobs.

In this version I made the footprint of the core sandbox much smaller, around 4KB where the smallest of all three previous iterations was around 20KB. At the same time I increased it's base capabilities, especially in helper methods for manipulating arrays and objects, which were essential to achieve the semi dependency injection of iteration 3 and in arenite.

This iteration finally solves all three issues very well. All the parts of the app are very small. The code is all completely loosely coupled and has no idiosyncrasies since the required "glue" is provided by the configurations.

I called it arenite in reference to the way it is structured and the way I believe we should structure our web apps — Lots of little pieces together forming something big — Allowing to easily create complex web apps made of small simple parts.