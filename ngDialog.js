var outputDirectory = null;        // -o=
var templateLibrary = "Templates"; // -l=
var templateName = "Default"; // -t=
var dialogName = null;             // -d=
var dialogViews = null;            // -v=
var dialogWidth = 300;             // -w=
var selectorLead = "app-dialog";   // -s=
var fileNameFormat = "angular";    // -f=
var justExperiment = false;        // -x

var fs = require('fs');
var createdDirectories = {};
var templatePath;

if (process.argv.length < 3)
  return showHelp();

processArguments(process.argv.slice(2), "", function () {
  if (!dialogName)
    return console.log("Missing dialog name: -d=DialogName");
  if (!templateName)
    return console.log("Missing template directory: -t=templateName");
  if (!outputDirectory)
    return console.log("Missing output path to Dialogs directory : -o=DialogsDirectory");
  templatePath = (templateLibrary ? templateLibrary + "/" : "") + templateName;
  processDirectory(templatePath, function (err) {
    if (err)
      return console.log(err);
    console.log("DONE");
    if (justExperiment)
      console.log("===== -x flag is on, no directories or files were created =====");
  });
});
function processConfigFile(configFile, callback) {
  fs.readFile(file, 'utf8', function (err, contents) {
    if (err) {
      if (callback)
        return callback(err);
      throw err;
    }
    contents = contents.replace(/\r\n/g, "\n").split('\n');
    processArguments(contents, configFile, callback);
  });
}
function processArguments(args, relativeTo, callback) {
  var argIndex = 0;
  function processNextArg() {
    if (argIndex < args.length) {
      if (args[argIndex].substr(0, 2) === "-h")
        return showHelp();
      if (args[argIndex++].search(/^\s*(\-?\w+)\s*=\s*(.*?)(?:\s+#.*)?\s*$/) === 0) {
        var flag = RegExp.$1;
        var value = RegExp.$2.replace(/^\s+/, "").replace(/\s+$/, "");
        processArgument(flag, value, relativeTo, processNextArg);
      } else
        processNextArg();
    } else
      callback && callback();
  }
  processNextArg();
}
function processArgument(flag, value, relativeTo, callback) {
  switch (flag) {
    case "-c":
    case "extends":
      return processConfigFile(relativePath(relativeTo, value), callback)
    case "-d":
    case "dialogName":
      dialogName = value;
      break;
    case "-v":
    case "dialogViews":
      value = value.replace(/\W+/, ",");
      dialogViews = value.length > 0 ? value.split(",") : [];
      break;
    case "-w":
    case "dialogWidth":
      dialogWidth = parseFloat(value);
      break;
    case "-s":
    case "selectorLead":
      selectorLead = value;
      break;
    case "-f":
    case "fileNameFormat":
      fileNameFormat = value;
      break;
    case "-l":
    case "templateLibrary":
      templateLibrary = relativePath(relativeTo, value);
      break;
    case "-t":
    case "templateName":
      templateName = relativePath(relativeTo, value);
      break;
    case "-o":
    case "outputDirectory":
      outputDirectory = relativePath(relativeTo, value);
      break;
    case "-x":
    case "justExperiment":
      justExperiment = value !== "false";
      break;
    default:
      console.log("ignoring unknown flag " + flag);
      break;
  }
  callback && callback();
}

function relativePath(from, to) {
  from = from.split('/');
  from.pop();
  from.push(to);
  return from.join('/');
}

function showHelp() {
  console.log("ndDialog -o=DialogsOutputPath -l=TemplateLibrary -t=TemplateDirectory -d=DialogName [-v=View1,View2,...] [-w=Width] [-s=SelectorLead] [-f=angular|CamelCase] [-x=true|false (experiment, if true create no files, just show work)]");
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
  var outFile = file.substr(templatePath.length + 1);
  if (outFile.indexOf("{$") >= 0 && dialogViews.length === 0)
    return callback && callback();
  fs.readFile(file, 'utf8', function (err, contents) {
    if (err) {
      if (callback)
        return callback(err);
      throw err;
    }
    outFile = outFile.replace(/\{\$IF\}/g, "");
    if (outFile.indexOf("{$") >= 0) {
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
        saveFile(cookContents(outFile, i), cookContents(contents, i), complete);
    } else
      saveFile(cookContents(outFile), cookContents(contents), callback);
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
  var statement;
  while (statement = findRepeat(contents)) {
    contents = statement.before;
    for (var i = 0; i < dialogViews.length; i++) {
      if (i > 0)
        contents += statement.tail;
      contents += cookContents(statement.head, i);
    }
    contents += statement.after;
  }
  while (statement = findIf(contents)) {
    contents = statement.before;
    if (dialogViews.length > 0)
      contents += statement.head;
    else
      contents += statement.tail;
    contents += statement.after;
  }
  if (typeof (viewIndex) === "number") {
    contents = contents.replace(/\{\$NAME\}/g, nameFormat(dialogViews[viewIndex]));
    contents = contents.replace(/\{\$FILE(?:\+(\w+))?\}/g, function ($0, $1) { return fileFormat(dialogViews[viewIndex], $1); });
    contents = contents.replace(/\{\$ID\}/g, idFormat(dialogViews[viewIndex]));
  }
  contents = contents.replace(/\{\#NAME\}/g, nameFormat(dialogName));
  contents = contents.replace(/\{\#FILE(?:\+(\w+))?\}/g, function ($0, $1) { return fileFormat(dialogName, $1); });
  contents = contents.replace(/\{\#FORMAT\+(\w+)\}/g, function ($0, $1) { return fileFormat("", $1); });
  contents = contents.replace(/\{\#WIDTH\}/g, dialogWidth);
  contents = contents.replace(/\{\#SELECTOR\}/g, selectorLead);
  return contents;
}

function findRepeat(contents) {
  return findStatement(contents, "{$REPEAT}", "{$REPEATDELIM}", "{$REPEATEND}");
}

function findIf(contents, missingEndOK) {
  return findStatement(contents, "{$IF}", "{$IFELSE}", "{$IFEND}");
}

function findStatement(contents, start, middle, end) {
  var common = start.substr(0, start.length - 1);
  var index = contents.indexOf(start);
  if (index < 0)
    return null;
  var depth = 1;
  var leadEndIndex = index;
  index += start.length;
  var contentStartIndex = index;
  var middleMarkStart = -1;
  var middleMarkEnd = -1;
  while ((index = contents.indexOf(common, index)) > 0) {
    if (stringMatchesAt(contents, index, end)) {
      depth--;
      if (depth === 0)
        return cleanStatement({
          before: contents.substr(0, leadEndIndex),
          head: contents.substr(contentStartIndex, middleMarkStart > 0 ? middleMarkStart - contentStartIndex : index - contentStartIndex),
          tail: middleMarkStart > 0 ? contents.substr(middleMarkEnd, index - middleMarkEnd) : "",
          after: contents.substr(index + end.length)
        });
    } else if (stringMatchesAt(contents, index, middle)) {
      if (depth === 1) {
        middleMarkStart = index;
        middleMarkEnd = index + middle.length;
      }
    } else if (stringMatchesAt(contents, index, start))
      depth++;
    index += common.length;
  }
  throw ("missing " + end);
}
function cleanStatement(statement) {
  if (statement.head.length === 0 && statement.tail.length === 0)
    cleanSteatementPart(statement, 'before', 'after');
  else if (statement.head.length === 0) {
    cleanSteatementPart(statement, 'before', 'tail');
    cleanSteatementPart(statement, 'tail', 'after');
  } else if (statement.tail.length === 0) {
    cleanSteatementPart(statement, 'before', 'head');
    cleanSteatementPart(statement, 'head', 'after');
  } else {
    cleanSteatementPart(statement, 'before', 'head');
    cleanSteatementPart(statement, 'head', 'tail');
    cleanSteatementPart(statement, 'tail', 'after');
  }
  return statement;
}
function cleanSteatementPart(statement, preProp, postProp) {
  var pre = statement[preProp];
  var post = statement[postProp];
  if ((pre.length === 0 || pre.charAt(pre.length - 1) === "\n") && (post.length === 0 || post.charAt(0) === "\n" || post.charAt(0) === "\r"))
    if (pre.length > 0)
      if (pre.length > 1 && pre.charAt(pre.length - 2) === "\r")
        statement[preProp] = pre.substr(0, pre.length - 2);
      else
        statement[preProp] = pre.substr(0, pre.length - 1);
    else
      if (post.length > 0)
        if (post.length > 1 && post.charAt(0) === "\r")
          statement[postProp] = post.substr(2);
        else
          statement[postProp] = post.substr(1);
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

function idFormat(name) {
  return splitName(name).toUpperCase().replace(/\-/g, "_");
}

function splitName(name) {
  return name.replace(/([a-z])([A-Z])/g, function ($0, $1, $2) { return $1 + "-" + $2; });
}
