var fs = require('fs');
var filename = process.argv[2];


var dialogName="MyNew";
var dialogParts=["LogIn","SignUp"];
var dialogWidth=200;
var selectorLead="GamesByEmail-Dialog";
var angularStandard=true;
var templateName="Complex";
var outputDirectory="Dialogs";
processDirectory(templateName);


function processDirectory(directory){
   fs.readdir(directory, function(err, items) {
      if (err) throw err;
      for (var i=0; i<items.length; i++)
         processItem(directory+"/"+items[i]);
   });
}
function processItem(item){
   fs.stat(item, function(err, stats) {
      if (err) throw err;
      if (stats.isFile())
         processFile(item);
      else if (stats.isDirectory())
         processDirectory(item);
   });   
}
function processFile(file){
   fs.readFile(file, 'utf8', function(err, contents) {
      file=file.substr(templateName.length+1);
      if (err) throw err;
      if (file.indexOf("{$")>=0)
         for (var i=0;i<dialogParts.length;i++)
            saveFile(cookContents(file,i),cookContents(contents,i));
      else
         saveFile(cookContents(file),cookContents(contents));
   });
}
function saveFile(file,contents) {
   file=outputDirectory+"/"+file;
   console.log(file);
   var directory=file.split("/");
   directory.pop();
   directory=directory.join("/");
   createFullDirectorySync(directory);
   fs.writeFile(file, contents, function(err){
      if (err) throw err;
   });
}
var createdDirectories={};
function createFullDirectorySync(directory){
   if (!createdDirectories[directory]) {
      createdDirectories[directory]=true;
      directory=directory.split("/");
      var path=""
      while (directory.length>0) {
         path+=(path.length>0 ? "/" : "")+directory.shift()
         var stat=null;
         try {
            stat=fs.statSync(path);
         } catch(e) {
         }
         if (stat)
            if (stat.isDirectory())
               continue;
            else
               throw(path+" already exists but is not a directory");
         else
            fs.mkdirSync(path);
      }
   }
}
function cookContents(contents,partIndex){
   var repeat;
   while (repeat=findRepeat(contents)) {
      contents=repeat.lead;
      for (var i=0;i<dialogParts.length;i++) {
         if (i>0)
            contents+=repeat.delimeter;
         contents+=cookContents(repeat.repeat,i);
      }
      contents+=repeat.tail;
   }
   if (typeof(partIndex)==="number") {
      contents=contents.replace(/\{\$NAME\}/g,nameFormat(dialogParts[partIndex]));
      contents=contents.replace(/\{\$FILE(?:\+(\w+))?\}/g,function($0,$1){return fileFormat(dialogParts[partIndex],$1);});
      contents=contents.replace(/\{\$MODE\}/g,modeFormat(dialogParts[partIndex]));
   }
   contents=contents.replace(/\{\#NAME\}/g,nameFormat(dialogName));
   contents=contents.replace(/\{\#FILE(?:\+(\w+))?\}/g,function($0,$1){return fileFormat(dialogName,$1);});
   contents=contents.replace(/\{\#FORMAT\+(\w+)\}/g,function($0,$1){return fileFormat("",$1);});
   contents=contents.replace(/\{\#WIDTH\}/g,dialogWidth);
   contents=contents.replace(/\{\#SELECTOR\}/g,selectorLead);
   return contents;
}
function findRepeat(contents){
   var index=contents.indexOf("{$REPEAT}");
   if (index<0)
      return null;
   var depth=1;
   var leadEndIndex=index;
   index+="{$REPEAT}".length;
   var contentStartIndex=index;
   var delimMarkStart=-1;
   var delimMarkEnd=-1;
   while ((index=contents.indexOf("{$REPEAT",index))>0) {
      if (stringMatchesAt(contents,index,"{$REPEATEND}")) {
         depth--;
         if (depth===0)
            return {
               lead:contents.substr(0,leadEndIndex),
               repeat:contents.substr(contentStartIndex,delimMarkStart>0 ? delimMarkStart-contentStartIndex : index-contentStartIndex),
               delimeter:delimMarkStart>0 ? contents.substr(delimMarkEnd,index-delimMarkStart) : "",
               tail:contents.substr(index+"{$REPEATEND}".length)
            };
      } else if (stringMatchesAt(contents,index,"{$REPEATDELIM}")) {
         if (depth===1) {
            delimMarkStart=index;
            delimEnd=index+"{$REPEATDELIM}".length;
         }
      } else if (stringMatchesAt(contents,index,"{$REPEAT}"))
         depth++;
      index+=9;
   }
   throw("missing {$REPEATEND}");
}
function stringMatchesAt(value,index,toMatch){
   return index+toMatch.length>value.length ? false : value.substr(index,toMatch.length)===toMatch;
}
function nameFormat(name){
   return name;
}
function fileFormat(name,tail){
   if (angularStandard)
      return fileFormatAngularStandard(name,tail);
   return name+(tail ? tail : "");
}
function fileFormatAngularStandard(name,tail){
   name=splitName(name).toLowerCase();
   if (tail) {
      tail=splitName(tail).split("-");
      var last=tail.pop().toLowerCase();
      if (tail.length>0)
         name+=(name.length>0 ? "-" : "")+tail.join("-").toLowerCase();
      name+=(name.length>0 ? (isAngularClass(last) ? "." : "-") : "")+last;
   }
   return name;
}
function isAngularClass(name){
   return ["component","module","service"].indexOf(name)>=0;
}
function modeFormat(name){
   return splitName(name).toUpperCase().replace(/\-/g,"_");
}
function splitName(name){
   return name.replace(/([a-z])([A-Z])/g,function($0,$1,$2){return $1+"-"+$2;});
}