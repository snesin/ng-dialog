# ng-dialog

Create skeleton code for Angular.io Material dialog boxes in an easy and consistent manner.

The architectural goal is to have a separate service for each dialog in an Angular.io project. These services will have strongly-typed `open` methods that return strongly-typed observables. The services are simple to use and encapsulate the vagaries of opening Material Dialogs, passing in data, and returning data when closed. Each dialog will have its own module to import into the application's module, encapsulating all its declarations.

This tool handles two types of dialogs:
* **Dialogs with a single view.** For example, a Privacy Policy dialog that does not change drastically with user interaction.
* **Dialogs with multiple views.** For example, an Authentication dialog that presents different views depending on whether the user is logging in, forgot their password, is entering a code to change their password, or is a first-time user signing up to the service.

## To install:
* Download this project to somewhere NOT in your Angular.io project.
* Create a `dialogs` (or `Dialogs`) directory in your Angular.io project.
* Copy the contents of the `dialogs` directory in this project to the `dialogs` directory in your Angular.io project.
* Edit the `ngDialog.cfg` file in this project:
    * Set the `outputDirectory` variable to the relative path to to the `dialogs` directory in your Angular.io project (no trailing slash).
    * Set the `dialogWidth` variable to the default width of your dialogs.
    * Set the `selectorLead` variable to a selector appropriate for your application, something like `myapp-dialog`.
    * If your Angular.io project is using CamelCase for file names, set the `fileNameFormat` variable to `CamelCase`.
    * If you want the tool by default to just show the files that would be created, but not actually create them, set the `justExperiment` variable to `true`.

## To create a dialog skeleton in Windows using a graphical user interface (GUI):
* Double-click the `ngDialog.hta` file to open the tool's GUI.
* Pick a name for your dialog. It should be in UpperCamelCase. Enter that name into the Dialog Name field.
* If the dialog will have multiple views, pick names for them, also in UpperCamelCase. Enter all those names (space or comma delimited) into the View Names field.
* Alter any other field as needed.
* Un-check the Test Only field if checked.
* Press the Create Dialog Skeleton button:
    * The tool command line will display in the output.
    * The tool results will display in the output.
    * In your Angular.io project's `dialogs` directory, there will be a new directory with the skeleton for your dialog.
    * See section below on using your new dialog.

## To create a dialog skeleton using the command line:
* Pick a name for your dialog. It should be in UpperCamelCase. Dialog will be appended to the name, so do not include Dialog in the name.
* If the dialog will have multiple views, pick names for them, also in UpperCamelCase.
* Execute the following command line :
    * For a single view dialog, substitute `MyNew` with your dialog's UpperCamelCase name:  
    `node ngDialog.js -c=ngDialog.cfg -t=Default -d=MyNew -x=false`
    * For a multiple view dialog, substitute `MyNew` with your dialog's UpperCamelCase name and `MyFirst,MySecond,MyThird` with a comma-separated list of your dialog's UpperCamelCase view names:  
    `node ngDialog.js -c=ngDialog.cfg -t=Default -d=MyNew -v=MyFirst,MySecond,MyThird -x=false`
* In your Angular.io project's `dialogs` directory, there will be a new directory with the skeleton for your dialog.
* See section below on using your new dialog.

## To use a new dialog:
* Import the dialog's module into your application module (or the module opening the dialog):
    * Import the dialog's module reference:  
    `import { MyNewDialogModule } from './dialogs/my-new-dialog/my-new-dialog.module';`
    * Add the reference to the application module's `imports` list:  
    `imports: [ ..., MyNewDialogModule ]`
* In the component opening the dialog:
    * Import the dialog's service reference:  
    `import { MyNewDialog } from './dialogs/my-new-dialog/my-new-dialog';`
    * Inject the service into your component's `constructor`:  
    `constructor (private myNewDialog: MyNewDialog) { };`
    * Where needed, use the service to open the dialog:  
    `this.myNewDialog.open({});`
    * You can also listen for the result:  
    `this.myNewDialog.open({}).subscribe(result=>{console.log(result)});`
* In the dialog's directory, flesh out the skeleton as needed to display the information required.

## Creating new templates:
* You can create new templates based on what is best for your application.
* Templates should support both flavors: single-view and multiple-view.
* ngDialog performs simple token replacement in file names and file contents:
    * Note the `#` in the following tokens. These are used in both single-view and multiple-view templates.
        * `{#NAME}` - the UpperCamelCase name of the dialog. ie: `MyNew`
        * `{#FILE}` - the name of the dialog in either angular-standard.format or
        UpperCamelCaseFormat, depending on the format option chosen. ie: `my-new` or `MyNew`
        * `{#FILE+DialogComponent}` - the name of the dialog plus following text in either angular-standard.format or
        UpperCamelCaseFormat, depending on the format option chosen. ie: `my-new-dialog.component` or `MyNewDialogComponent`
        * `{#FORMAT+DialogService}` - **only** the following text in either angular-standard.format or UpperCamelCaseFormat, depending on the format option chosen. ie: `dialog.service` or `DialogService`
        * `{#WIDTH}` - the width of the dialog box.
        * `{#SELECTOR}` - the selector lead for views in the dialog box.
    * Note the `$` in the following tokens. These are used only for multiple-view templates.
        * `{$IF}thencontent{$IFEND}` - inserts the `thencontent` code only if there are views.
        * `{$IF}thencontent{$IFELSE}elsecontent{$IFEND}` - inserts the `thencontent` code if there are views, else it inserts the `elsecontent` code.
        * `{$NAME}` - the UpperCamelCase name of the view. ie: `MyFirst`
        * `{$FILE}` - the name of the view in either angular-standard.format or
        UpperCamelCaseFormat, depending on the format option chosen. ie: `my-first` or `MyFirst`
        * `{$FILE+Component}` - the name of the view plus following text in either angular-standard.format or UpperCamelCaseFormat, depending on the format option chosen. ie: `my-first.component` or `MyFirstComponent`
        * `{$ID}` - the UPPER_UNDERSCORE_CASE name of the view. ie: `MY_FIRST`
        * `{$REPEAT}content{$REPEATEND}` - repeats the `content` code once for each view.
        * `{$REPEAT}content{$REPEATDELIM}delimiter{$REPEATEND}` - repeats the `content` code once for each view, separated by the `delimeter` code.
* All files in the template are copied, replacing tokens in the file's path, name, and contents, to the output folder.
    * Files with the `{$FILE}` or `{$NAME}` multiple-view tokens anywhere in their path are copied once for each view.
    * Files with the `{$IF}` multiple-view token anywhere in their path are copied if there are multiple views:
        * The `{$IF}` token is removed from the path.
        * Do not close with `{$IFEND}` tokens in file paths.
        * If the file path also has `{$FILE}` or `{$NAME}` multiple-view tokens, the file is copied once for each view.
        * If the file path has no other multiple-view tokens, the file is copied once.
    * All other files are copied once.
* An alternate template library path can be used by setting the `templateLibrary` variable to a relative path in the `ngDialog.cfg` file or `-l=path` on the command line.