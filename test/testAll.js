#!/usr/bin/rhino

load("../parseLDIF.js");

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

for (var key in expResults) {
  if (expResults.hasOwnProperty(key)) {
    var lines = readFile("example0" + key + ".ldif").replace(/\r\n/g,"\n");
    observed = parseLDIF(lines.split("\n"));
    if (observed.equals(expResults[key])) {
      print(key + "/" + resultsCount + " ... OK");
    }
    else {
      print("Test " + key + " fails! Expected:\n" +
        expResults[key].toSource() +
        "\n----\nObserved:\n" + observed.toSource());
    }
  }
}

