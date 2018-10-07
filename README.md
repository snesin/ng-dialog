# ng-dialog

Create skeleton code for Angular.io Material dialog boxes in an easy and consistent manner.

The architectural goal is to have a separate service for each dialog in an Angular.io project. These services will have strongly-typed open methods that return strongly-typed observables. The services are simple to use and encapsulate the vagaries of opening Material Dialogs, passing in data, and returning data when closed. Each dialog will have its own module to import into the application's module, encapsulating all its declarations.

This tool handles two types of dialogs:
* Dialogs with a single view. For example, a Privacy Policy dialog that does not change drastically with user interaction.
* Dialogs with multiple views. For example, an Authentication dialog that presents different views depending on whether the user is logging in, forgot their password, is entering a code to change their password, or is a first-time user signing up to the service.

## To install:
* Download this project to somewhere NOT in your Angular.io project.
* Create a `dialogs` (or `Dialogs`) directory in your Angular.io project.
* Copy the contents of the `dialogs` directory in this project to the `dialogs` directory in your Angular.io project.
* Edit the `ngDialog.cfg` file in this project.
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
* Press the Create Dialog Skeleton button.
    * The tool command line will display in the output.
    * The tool results will display in the output.
    * In your Angular.io project's `dialogs` directory, there will be a new directory with the skeleton for your dialog.
    * See section below on using your new dialog.

## To create a dialog skeleton using the command line:
* Pick a name for your dialog. It should be in UpperCamelCase. Dialog will be appended to the name, so do not include Dialog in the name.
* If the dialog will have multiple views, pick names for them, also in UpperCamelCase.
* Execute the following command line :
    *For a single view dialog, substitute `MyNew` with your dialog's UpperCamelCase name:
    `node ngDialog.js -c=ngDialog.cfg -d=MyNew -x=false`
    *For a multiple view dialog, substitute `MyNew` with your dialog's UpperCamelCase name and `MyFirst,MySecond,MyThird` with a comma-separated list of your dialog's UpperCamelCase view names:
    `node ngDialog.js -c=ngDialog.cfg -d=MyNew -v=MyFirst,MySecond,MyThird -x=false`
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
