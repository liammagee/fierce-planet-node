util = require('util')
pile = require('pile')
jsp = require("uglify-js").parser
pro = require("uglify-js").uglify


desc 'This is the default task.'
task 'default', (params) ->
  console.log 'Building Fierce-Planet.'
  console.log(util.inspect(arguments))
  jake.Task['js'].invoke []
  jake.Task['uglify'].invoke []

task 'merge', ->


task 'uglify', ->
  ast = jsp.parse(orig_code)
  //ast = pro.ast_mangle(ast)
  ast = pro.ast_squeeze(ast)
  var final_code = pro.gen_code(ast)
