

ECS 162 Starter React App on Glitch
===================================

This app has a set-up that allows you to use React on Glitch, as part of an 
Express server. 

It is packaged with Webpack, and set up so that your edits to your code will (slowly) deploy and
update live.  It is based on Glitch's own 
[starter kit](https://glitch.com/~starter-react).  


Notice that the jsx components, which get transpiled (compiled), are in app/, while the usual html and 
css files are in public/.  bundle.js is the JS output file made by Webpack, do not try to edit it. 

The UnorderedList Component demonstrates the use of input props. 

The Counter Component demostrated storing state in a function component, 
using [Hooks](https://reactjs.org/docs/hooks-intro.html)

The tic-tac-toe example is itself a whole set of components.
Michael Tianchen Sun made it by modifing the 
[React tutorial](https://reactjs.org/tutorial/tutorial.html) 
code to use function components and hooks. 

We also changed the Glitch starter kit from production mode (impossible to debug!) in webpack.config to development, and 
got rid of the .gitignore file which made is hard to understand!  As well as to adding a little CSS! 


Documentation of Glitch's original React starter kit
----------------------------------------------------

This project relates to video 2 of 5 in the [React Starter Kit](https://glitch.com/react-starter-kit) video series.

[![](https://cdn.glitch.com/71d3e262-edb4-456f-8703-48a1247b894f%2Fstarter-react.png?1513174880291)](https://www.youtube.com/watch?v=SxuN26-_fls)




By [Glitch](https://glitch.com/)
-------------------

Glitch is the friendly commmunity where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

[Find out more](https://glitch.com/about).

\ ゜o゜)ノ
