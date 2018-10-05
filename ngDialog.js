var outputDirectory = null;      // -o=
var templateFolder = null;       // -t=
var dialogName = null;           // -d=
var dialogViews = null;          // -v=
var dialogWidth = 300;           // -w=
var selectorLead = "app-dialog"; // -s=
var fileNameFormat = "angular";  // -f=
var justExperiment = false;      // -x

var fs = require('fs');
var createdDirectories = {};

processArguments(process.argv);

function processArguments(args) {
  if (args.length < 3)
    return showHelp();
  for (var i = 2; i < args.length; i++) {
    if (args[i].substr(0, 2) === "-h")
      return showHelp();
    var flag = args[i].substr(0, 3);
    var value = args[i].substr(3);
    switch (flag) {
      case "-d=":
        dialogName = value;
        break;
      case "-v=":
        dialogViews = value.replace(/^\W+/, "").replace(/\W+$/, "").replace(/\W+/, ",").split(",");
        break;
      case "-w=":
        dialogWidth = parseFloat(value);
        break;
      case "-s=":
        selectorLead = value;
        break;
      case "-f=":
        fileNameFormat = value;
        break;
      case "-t=":
        break;
      case "-o=":
        outputDirectory = value;
        break;
      case "-x":
        justExperiment = true;
        break;
      default:
        console.error("unknown flag " + flag.substr(0, 2));
        break;
    }
  }
  if (!dialogName)
    return console.error("Missing dialog name: -d=DialogName");
  if (!templateFolder)
    return console.error("Missing template folder: -t=TemplateFolder");
  if (!outputDirectory)
    return console.error("Missing output path to Dialogs directory : -o=DialogsDirectory");
  processDirectory(templateFolder, function (err) {
    if (err)
      return console.error(err);
    console.log("DONE");
    if (justExperiment)
      console.log("===== -x flag is on, no directories or files were created =====");
  });
}

function showHelp() {
  console.log("ndDialog -o=DialogsOutputPath -t=TemplatePath -d=DialogName [-v=View1,View2,...] [-w=Width] [-s=SelectorLead] [-f=angular|CamelCase] [-x(experiment, create no files, just show work)]");
}

function processDirectory(directory, callback) {
  fs.readdir(directory, function (err, items) {
    if (err) {
      if (callback)
        return callback(err);
      throw err;
    }
    var count = items.length;
    function complete(err) {
      if (err && count > 0) {
        count = -1;
        if (callback)
          return callback(err);
        throw err;
      }
      if (--count === 0)
        callback && callback();
    }
    for (var i = 0; i < items.length; i++)
      processItem(directory + "/" + items[i], complete);
  });
}

function processItem(item, callback) {
  fs.stat(item, function (err, stats) {
    if (err) {
      if (callback)
        return callback(err);
      throw err;
    }
    if (stats.isFile())
      processFile(item, callback);
    else if (stats.isDirectory())
      processDirectory(item, callback);
  });
}

function processFile(file, callback) {
  fs.readFile(file, 'utf8', function (err, contents) {
    if (err) {
      if (callback)
        return callback(err);
      throw err;
    }
    file = file.substr(templateFolder.length + 1);
    if (file.indexOf("{$") >= 0) {
      var count = dialogViews.length;
      function complete(err) {
        if (err && count > 0) {
          count = -1;
          if (callback)
            return callback(err);
          throw err;
        }
        if (--count === 0)
          callback && callback();
      }
      for (var i = 0; i < dialogViews.length; i++)
        saveFile(cookContents(file, i), cookContents(contents, i), complete);
    } else
      saveFile(cookContents(file), cookContents(contents), callback);
  });
}

function saveFile(file, contents, callback) {
  file = outputDirectory + "/" + file;
  var directory = file.split("/");
  directory.pop();
  directory = directory.join("/");
  createFullDirectorySync(directory);
  console.log("Create file " + file);
  if (justExperiment)
    callback && callback();
  else
    fs.writeFile(file, contents, function (err) {
      if (err) {
        if (callback)
          return callback(err);
        throw err;
      }
      callback && callback();
    });
}

function createFullDirectorySync(directory) {
  if (!createdDirectories[directory]) {
    directory = directory.split("/");
    var path = "";
    while (directory.length > 0) {
      path += (path.length > 0 ? "/" : "") + directory.shift();
      if (createdDirectories[path])
        continue;
      var stat = null;
      try {
        stat = fs.statSync(path);
      } catch (e) {
      }
      if (stat)
        if (stat.isDirectory()) {
          createdDirectories[path] = true;
          continue;
        } else
          throw (path + " already exists but is not a directory");
      else {
        console.log("Create directory " + path);
        if (!justExperiment)
          fs.mkdirSync(path);
        createdDirectories[path] = true;
      }
    }
  }
}

function cookContents(contents, viewIndex) {
  var repeat;
  while (repeat = findRepeat(contents)) {
    contents = repeat.lead;
    for (var i = 0; i < dialogViews.length; i++) {
      if (i > 0)
        contents += repeat.delimeter;
      contents += cookContents(repeat.repeat, i);
    }
    contents += repeat.tail;
  }
  if (typeof (viewIndex) === "number") {
    contents = contents.replace(/\{\$NAME\}/g, nameFormat(dialogViews[viewIndex]));
    contents = contents.replace(/\{\$FILE(?:\+(\w+))?\}/g, function ($0, $1) { return fileFormat(dialogViews[viewIndex], $1); });
    contents = contents.replace(/\{\$MODE\}/g, modeFormat(dialogViews[viewIndex]));
  }
  contents = contents.replace(/\{\#NAME\}/g, nameFormat(dialogName));
  contents = contents.replace(/\{\#FILE(?:\+(\w+))?\}/g, function ($0, $1) { return fileFormat(dialogName, $1); });
  contents = contents.replace(/\{\#FORMAT\+(\w+)\}/g, function ($0, $1) { return fileFormat("", $1); });
  contents = contents.replace(/\{\#WIDTH\}/g, dialogWidth);
  contents = contents.replace(/\{\#SELECTOR\}/g, selectorLead);
  return contents;
}

function findRepeat(contents) {
  var index = contents.indexOf("{$REPEAT}");
  if (index < 0)
    return null;
  var depth = 1;
  var leadEndIndex = index;
  index += "{$REPEAT}".length;
  var contentStartIndex = index;
  var delimMarkStart = -1;
  var delimMarkEnd = -1;
  while ((index = contents.indexOf("{$REPEAT", index)) > 0) {
    if (stringMatchesAt(contents, index, "{$REPEATEND}")) {
      depth--;
      if (depth === 0)
        return {
          lead: contents.substr(0, leadEndIndex),
          repeat: contents.substr(contentStartIndex, delimMarkStart > 0 ? delimMarkStart - contentStartIndex : index - contentStartIndex),
          delimeter: delimMarkStart > 0 ? contents.substr(delimMarkEnd, index - delimMarkEnd) : "",
          tail: contents.substr(index + "{$REPEATEND}".length)
        };
    } else if (stringMatchesAt(contents, index, "{$REPEATDELIM}")) {
      if (depth === 1) {
        delimMarkStart = index;
        delimMarkEnd = index + "{$REPEATDELIM}".length;
      }
    } else if (stringMatchesAt(contents, index, "{$REPEAT}"))
      depth++;
    index += 9;
  }
  throw ("missing {$REPEATEND}");
}

function stringMatchesAt(value, index, toMatch) {
  return index + toMatch.length > value.length ? false : value.substr(index, toMatch.length) === toMatch;
}

function nameFormat(name) {
  return name;
}

function fileFormat(name, tail) {
  if (fileNameFormat === "angular")
    return fileFormatAngularStandard(name, tail);
  return name + (tail ? tail : "");
}

function fileFormatAngularStandard(name, tail) {
  name = splitName(name).toLowerCase();
  if (tail) {
    tail = splitName(tail).split("-");
    var last = tail.pop().toLowerCase();
    if (tail.length > 0)
      name += (name.length > 0 ? "-" : "") + tail.join("-").toLowerCase();
    name += (name.length > 0 ? (isAngularClass(last) ? "." : "-") : "") + last;
  }
  return name;
}

function isAngularClass(name) {
  return ["component", "module", "service"].indexOf(name) >= 0;
}

function modeFormat(name) {
  return splitName(name).toUpperCase().replace(/\-/g, "_");
}

function splitName(name) {
  return name.replace(/([a-z])([A-Z])/g, function ($0, $1, $2) { return $1 + "-" + $2; });
}