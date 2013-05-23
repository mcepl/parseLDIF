#!/usr/bin/node

var parse = require("../parseLDIF.js");
var fs = require("fs");
var toSource = require('tosource');

Object.prototype.equals = function(x) {
  var p;
  for(p in this) {
      if(typeof(x[p])=='undefined') {return false;}
  }

  for(p in this) {
      if (this[p]) {
          switch(typeof(this[p])) {
              case 'object':
                  if (!this[p].equals(x[p])) { return false; } break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && this[p].toString() != x[p].toString()))
                      return false;
                  break;
              default:
                  if (this[p] != x[p]) { return false; }
          }
      } else {
          if (x[p])
              return false;
      }
  }

  for(p in x) {
      if(typeof(this[p])=='undefined') {return false;}
  }

  return true;
}

var observed = {};
var expResults = {
  1: [
    {
      cn: ["Barbara Jensen", "Barbara J Jensen", "Babs Jensen"],
      sn:"Jensen",
      telephoneNumber:"+1 408 555 1212",
      description:"A big sailing fan."
    },
    {
      cn:"Bjorn Jensen",
      sn:"Jensen",
      telephoneNumber:"+1 408 555 1212"
    }
  ],
  2: [
    {
      cn: ["Barbara Jensen", "Barbara J Jensen", "Babs Jensen"],
      sn:"Jensen",
      telephoneNumber:"+1 408 555 1212",
      description:'Babs is a big sailing fan, and travels extensively in ' +
        'search of perfect sailing conditions.',
      title:"Product Manager, Rod and Reel Division"
    }
  ],
  3: [
    {
      cn: ["Gern Jensen", "Gern O Jensen"],
      sn:"Jensen",
      telephoneNumber:"+1 408 555 1212",
      description:'What a careful reader you are!  This value is base-64-encoded' +
        ' because it has a control character in it (a CR).\r  By the way,' +
        ' you should really get out more.'
    }
  ],
  4: [
    {
      mail:"rogasawara@airius.co.jp",
      givenname:"ロドニー",
      sn: "小笠原",
      cn:"小笠原 ロドニー",
      title:"営業部 部長",
    }
  ],
  5: [
    {
      cn: ["Horatio Jensen", "Horatio N Jensen"],
      sn:"Jensen",
      telephoneNumber:"+1 408 555 1212"
    }
  ]
};

var resultsCount = Object.keys(expResults).length;
var success = 0;

for (var key in expResults) {
  if (expResults.hasOwnProperty(key)) {
    var lines = fs.readFileSync("example0" + key + ".ldif", "utf-8").
      replace(/\r\n/g,"\n");
    observed = parse.parseLDIF(lines.split("\n"));
    if (observed.equals(expResults[key])) {
      console.log(key + "/" + resultsCount + " ... OK");
    }
    else {
      console.log("Test " + key + " fails! Expected:\n" +
        toSource(expResults[key]) +
        "\n----\nObserved:\n" + toSource(observed));
      success = 1;
    }
  }
}

process.exit(success);
