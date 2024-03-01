import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
} from '@angular-devkit/schematics';
import { execSync } from 'child_process';

export function formGenerator(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const data = fetchDataFromBackend();
    debugger
    if (!data) {
      throw new SchematicsException('Error fetching data from the backend.');
    }
    const ComponentNames: string[] = []
    execSync(`ng g s app --skip-tests`, { stdio: [0, 1, 2] });
    updateService(tree, options.path);
    createHeader(tree, options.path);
    createButtonBar(tree, options.path);
    // Create a separate component for each tab
    data.tabs.forEach((tab: any, index: number) => {

      const componentName = `${tab.name}`;

      const fileName = `${tab.name.toLowerCase().replace(/\s+/g, '-')}`;

      ComponentNames.push(componentName);

      // tree.create(`${options.path}/${fileName}/${fileName}.component.html`, htmlCode);
      // tree.create(`${options.path}/${fileName}/${fileName}.component.ts`, generateTypeScriptCode(componentName));

      execSync(`ng g c ${fileName} --skip-tests`, { stdio: [0, 1, 2] });
      updatehtmlComponent(tree, options.path, componentName, tab.fields)
      updatetsComponent(tree, options.path, componentName, tab.fields, index);

    });

    execSync(`ng g c tab-group --skip-tests`, { stdio: [0, 1, 2] });
    generateTabGroupCode(ComponentNames, tree, options.path);

    updateAppComponent(tree, options.path);
    updateAppModule(tree, options.path);
    updateStyle(tree);

    return tree;
  };
}




function fetchDataFromBackend(): any {
  return {
    "tabs": [
      {
        "name": "Personal Information",
        "fields": [
          {
            "Id": "ad085285-68d1-4996-9e12-9b87e92b452d",
            "name": "firstName",
            "type": "input",
            "label": "First Name",
            "size": "medium",
            "dataType": "text",
            "validators": ["required"]
          },
          {
            "Id": "2fbc32b3-58b8-4a57-9e77-61f72e071fe1",
            "name": "lastName",
            "type": "input",
            "label": "Last Name",
            "size": "medium",
            "dataType": "text",
            "validators": ["required"]
          },
          {
            "Id": "c4e83f85-2d0b-4e57-83c0-d6be4778777b",
            "name": "gender",
            "type": "select",
            "label": "Gender",
            "options": [
              { "value": "Male", "description": "Male" },
              { "value": "Female", "description": "Female" },
              { "value": "Other", "description": "Other" }
            ],
            "dataType": "text"
          },
          {
            "Id": "fae6b98c-bd6f-4b2f-bf24-31d57dbfb583",
            "name": "email",
            "type": "input",
            "label": "Email",
            "size": "large",
            "dataType": "text",
            "validators": ["required", "email"]
          },
          {
            "Id": "c4e83f85-2d0b-4e57-83c0-d6be4778777b",
            "name": "password",
            "type": "input",
            "label": "Password",
            "size": "large",
            "dataType": "text",
            "validators": ["required", { "minLength": 8 }]
          },
          {
            "Id": "e6c7946a-4dc0-41d5-a452-05f3c2f48688",
            "name": "bio",
            "type": "textarea",
            "label": "Bio",
            "rows": 5,
            "cols": 30,
            "size": "extra-large",
            "dataType": "text"
          },
          {
            "Id": "aa80a6f1-9b8f-4942-b2a2-c7871a2bb845",
            "name": "subscribe",
            "type": "checkbox",
            "label": "Subscribe to Newsletter",
            "size": "small",
            "dataType": "text"
          }
        ]
      },
      {
        "name": "Contact Information",
        "fields": [
          {
            "Id": "97e7986d-5b1e-4e79-9a35-5e8d1b729e13",
            "name": "email",
            "type": "input",
            "label": "Email",
            "size": "large",
            "dataType": "text",
            "validators": ["required", "email"]
          }
        ]
      },
      {
        "name": "Additional Information",
        "fields": [
          {
            "Id": "97e7986d-5b1e-4e79-9a35-5e8d1b729e13",
            "name": "bio",
            "type": "textarea",
            "label": "Bio",
            "rows": 5,
            "cols": 30,
            "size": "extra-large",
            "dataType": "text"
          },
          {
            "Id": "97e7986d-5b1e-4e79-9a35-5e8d1b729e13",
            "name": "subscribe",
            "type": "checkbox",
            "label": "Subscribe to Newsletter",
            "size": "small",
            "dataType": "boolean"
          }
        ]
      }
    ]
  }

}
function createHeader(tree: Tree, path: string) {
  execSync(`ng g c header --skip-tests`, { stdio: [0, 1, 2] });
  const htmlCode = `<header>
  <a>AutoGenerated</a>
</header>`;
  tree.overwrite(`${path}/header/header.component.html`, htmlCode);

  const cssCode = `header {
    background: transparent linear-gradient(90deg, #3E5977 10%, #263E6C 100%);
    color: #FFFFFF;
    text-align: left;
    padding: 15px;
    display: flex; 
    align-items: center;
}


@media (max-width: 768px) {
    header {
        flex-direction: column;
        align-items: center;
    }
    
}
`;
  tree.overwrite(`${path}/header/header.component.css`, cssCode);
}

function createButtonBar(tree: Tree, path: string) {

  execSync(`ng g c button-bar --skip-tests`, { stdio: [0, 1, 2] });
  updateButtonBarComponent(tree, path);
}
function updateButtonBarComponent(tree: Tree, path: string) {
  const htmlCode = `<div class="button-bar">
  <button *ngIf="!isFirstTab" class="btn btn-primary" (click)="onPrevious()">
      Previous
  </button>&nbsp;
  <button class="btn btn-secondary" (click)="onSave()">Save</button>&nbsp;
  <button *ngIf="!isLastTab" class="btn btn-primary" (click)="onNext()">
      Next
  </button>
</div>`
  tree.overwrite(`${path}/button-bar/button-bar.component.html`, htmlCode);

  const cssCode = `.button-bar {
    display: flex;
    margin-right: 10px;
  }
`
  tree.overwrite(`${path}/button-bar/button-bar.component.css`, cssCode);


  const typescriptContent = tree.read(`${path}/button-bar/button-bar.component.ts`);
  if (!typescriptContent) {
    throw new Error(`File ${path}/button-bar/button-bar.component.ts not found.`);
  }
  const ContentString = typescriptContent.toString('utf-8');

  const updatedImport = ContentString.replace(
    'import { Component',
    `import { Component, EventEmitter, Input, Output `
  );
  const updatedContent = updatedImport.replace(
    'export class ButtonBarComponent {',
    `export class ButtonBarComponent {

      @Input() isFirstTab = false;
      @Input() isLastTab = false;
    
      @Output() previousClicked = new EventEmitter<void>();
      @Output() saveClicked = new EventEmitter<void>();
      @Output() nextClicked = new EventEmitter<void>();
    
      
    
      onPrevious() {
        this.previousClicked.emit();
      }
    
      onSave() {
        this.saveClicked.emit();
      }
    
      onNext() {
        this.nextClicked.emit();
      }`)

  tree.overwrite(`${path}/button-bar/button-bar.component.ts`, updatedContent);


}



function updateService(tree: Tree, path: string) {
  const servicePath = `${path}/app.service.ts`;
  const ServiceContent = tree.read(servicePath);
  if (!ServiceContent) {
    throw new Error(`File ${servicePath} not found.`);
  }
  const httpImport = `import { HttpClient } from '@angular/common/http';\n
  import { Observable,of } from 'rxjs';\n`
  const serviceContentString = ServiceContent.toString('utf-8');
  const httpInject = `private http:HttpClient`
  const InsertionIndex = serviceContentString.indexOf('constructor(') + 'constructor('.length;
  const updatedServiceContent = httpImport + serviceContentString.slice(0, InsertionIndex) + httpInject + serviceContentString.slice(InsertionIndex);

  tree.overwrite(servicePath, updatedServiceContent);
}

function updateAppComponent(tree: Tree, path: string) {
  const componentPath = `${path}/app.component.html`;
  const htmlCode = `<app-header></app-header>
  <app-tab-group></app-tab-group>`;
  tree.overwrite(componentPath, htmlCode);
}

function updatehtmlComponent(tree: Tree, path: string, component: string, fields: any[]): void {
  const fileName = `${component.toLowerCase().replace(/\s+/g, '-')}`;
  const componentPath = `${path}/${fileName}/${fileName}.component.html`;
  const htmlCode = generateHtmlCode(fields, component);
  tree.overwrite(componentPath, htmlCode);

}

function updateStyle(tree: Tree) {
  const stylePath = `src/styles.css`
  const moduleContent = tree.read(stylePath);
  if (!moduleContent) {
    throw new Error(`File ${stylePath} not found.`);
  }
  const bootstrapImport = `@import 'bootstrap/dist/css/bootstrap.min.css';`
  const moduleContentString = moduleContent.toString('utf-8');

  const updatedStyle = bootstrapImport + moduleContentString;

  tree.overwrite(stylePath, updatedStyle);
}

function updatetsComponent(tree: Tree, path: string, component: string, fields: any[], tabNumber: number) {
  const componentFilename = getComponentFileName(component);
  const componentPath = `${path}/${componentFilename}/${componentFilename}.component.ts`;
  const classname = `${getComponentName(component)}`;
  const formName = `${getComponentName(component)}Form`;
  const moduleContent = tree.read(componentPath);
  if (!moduleContent) {
    throw new Error(`File ${componentFilename} not found.`);
  }

  const moduleContentString = moduleContent.toString('utf-8');

  const InsertionIndex = moduleContentString.indexOf('export class ' + classname) + 'export class '.length + classname.length + 'Component {'.length;
  // const variables = fields.map((field: any) => {
  //   let vars = '';
  //   switch (field.dataType) {
  //     case 'text':
  //       vars += `${field.name}: string ='';`;
  //       break;
  //     case 'boolean':
  //       vars += `${field.name}: boolean =false;;`;
  //       break;
  //     case 'number':
  //       vars += `${field.name}: number =0;`;
  //       break;
  //     default:
  //       break;
  //   }
  //   return vars;
  // }).join('\n');

  let FormImport = 'import { FormGroup, FormBuilder, Validators } from \'@angular/forms\';\n';
  FormImport += 'import { AppService } from \'../app.service\';\n'
  let selectvalue = '';
  let Methods ='';
  const formGroup = fields.map((field: any, index: any) => {
    if (field.options) {
      // for (let index = 0; index < field.options.length; index++) {
      //   let value = field.options[index]

      //   if (index == 0) {
      //     selectvalue += `\n${field.name}Options=[\n`;
      //   }
      //   selectvalue += `{"value":"${value.value}","description":"${value.description}"}`;
      //   if (index != field.options.length - 1) {
      //     selectvalue += ',\n';
      //   }
      //   if (index == field.options.length - 1) {
      //     selectvalue += '\n];';
      //   }
      // };
      selectvalue+=`\n${field.name}Options:any;`;
      selectvalue+=`\n${field.name}Id='${field.Id};'`;
      selectvalue+=`\nngOnInit() {
        this.get${field.name}Options(this.${field.name}Id);
      }`;
      Methods+=`\nget${field.name}Options(${field.name}Id:any){
        this.service.get${field.name}Options(${field.name}Id).subscribe((res: any) => {
          this.${field.name}Options = res;
        });
      }\n`;

      AddServiceMethods(tree, path, field.name,'get');
    }


    let fg = '';
    if (index === 0) {
      fg += '\n';
      fg += `
      @Output() Next = new EventEmitter;
      @Output() Previous = new EventEmitter;\n`;
      fg += `${formName}:FormGroup\n`
      fg += `submitted=false;\n`;
      fg += `constructor(private fb: FormBuilder,private service:AppService) {\n`;
      fg += `this.${classname}Form = this.fb.group({\n`;
    }

    fg += `${field.name}:[\'\'`
    if (field.validators != undefined) {
      field.validators.forEach((validator: any, index: any) => {
        if (index == 0) {
          fg += `,[`
        }
        if (typeof validator === 'string') {
          fg += `Validators.${validator}`
        } else if (typeof validator === 'object') {
          const key = Object.keys(validator)[0];
          const value = validator[key];
          fg += `Validators.${key}(${value})`;
        }


        if (index !== field.validators.length - 1) {
          fg += ', ';
        }
        if (index === field.validators.length - 1) {
          fg += ']';
        }
      });
    }
    fg += ']';
    if (index !== fields.length - 1) {
      fg += ',';
    }

    if (index === fields.length - 1) {
      fg += '\n';
      fg += `});\n}`;

    }

    return fg
  }).join('\n');


   Methods += `
  get ${formName}Control() {
    return this.${formName}.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.${formName}.invalid) {
      return;
    }
    console.log("${formName} submitted="+JSON.stringify(this.${formName}.value));
    this.service.post${classname}(this.${formName}.value).subscribe({
        next: (response) => {
          window.alert('successfully saved');
        },
        error: (e) => {
          window.alert('error occurred while saving the form');
        }
      });
  }`
  if (tabNumber != 0 && tabNumber != fields.length - 1) {
    Methods += `\nonPrevious(){
      this.Previous.emit();
    }
    onNext(){
      this.Next.emit(${tabNumber + 1});
    }`
  }
  if (tabNumber == 0) {
    Methods += `\nonNext(){
      this.Next.emit(${tabNumber + 1});
    }`
  }
  if (tabNumber == fields.length - 1) {
    Methods += `\nonPrevious(){
      this.Previous.emit();
    }`
  }


  // const Option=fields.map((field: any) => {
  //   let optio='';
  //   if(field.options){
  //     // const key = Object.keys(field.options)[0];
  //     //       const value = field.options[key];
  //     //       console.log("keyvalue"+key+"aa"+ value);
  //     optio+=`${field.name}Options=[{ "value": "${field.options.value}", "description": "${field.options.description}}" }},];\n`;

  //   }
  //   return optio
  // }).join('\n');

  AddServiceMethods(tree, path, classname,'post');



  let updatedModuleContent = FormImport + moduleContentString.slice(0, InsertionIndex) + selectvalue + formGroup + Methods +
    moduleContentString.slice(InsertionIndex);

  //  const updatedModuleContent = `${moduleContentString.slice(0, InsertionIndex)}${variables}${Methods}${moduleContentString.slice(InsertionIndex)}`;

  updatedModuleContent = updatedModuleContent.replace(
    '{ Component }',
    `{  Component, EventEmitter, Output }`
  )
  tree.overwrite(componentPath, updatedModuleContent);
}





function generateHtmlCode(fields: any[], component: string): string {
  const formName = `${getComponentName(component)}Form`;
  const htmlCode = fields.map((field: any, index: number) => {
    let fieldHtml = '';
    if (index == 0) {
      fieldHtml += '<div style="padding:20px;">';
      fieldHtml += '\n'
      fieldHtml += `<form [formGroup]="${formName}" (ngSubmit)="onSubmit()">`;
      fieldHtml += '\n'
    }
    if (index % 4 === 0) {
      fieldHtml += '<div class="row">\n';
    }
    fieldHtml += `<div class="col-sm-3">\n`;
    fieldHtml += `<div style="margin-bottom: 20px;">\n`;

    fieldHtml += `<label style="margin-right: 10px; font-weight: bold;">${field.label}`
    if (field.validators != undefined) {
      field.validators.forEach((validator: any) => {
        if (validator == 'required') {
          fieldHtml += '<span style="color:red;">*</span>'
        }
      })
    }

    fieldHtml += `</label>\n`;


    switch (field.type) {
      case 'input':
        fieldHtml += `<input type="text" class="form-control" style="width:100%;" formControlName=${field.name} />\n`;
        break;
      case 'select':
        fieldHtml += `<select class="form-control" style="width:100%" formControlName=${field.name}>\n`;
        // field.options.forEach((option: string) => {
        //   fieldHtml += `<option value="${option}">${option}</option>`;
        // });
        fieldHtml += `<option value="" disabled selected>Select ${field.name}</option>\n`;
        fieldHtml += `<option *ngFor="let option of ${field.name}Options" [value]="option.value">{{ option.description }}</option>\n`;
        fieldHtml += `</select>`;

        break;
      case 'textarea':
        fieldHtml += `<textarea class="form-control" rows="${field.rows}" cols="${field.cols}" style="width: 100%;"  formControlName=${field.name}></textarea>\n`;
        break;
      case 'checkbox':
        fieldHtml += `<input type="checkbox" style="margin-left: 5px;"   formControlName=${field.name}/>\n`;
        break;
      default:
        break;
    }
    if (field.validators != undefined) {
      field.validators.forEach((validator: any) => {
        if (validator == 'required') {
          fieldHtml += `<div style="color:red;" *ngIf="(submitted||${formName}Control['${field.name}'].touched)&&${formName}Control['${field.name}'].errors?.['required']">${field.name} is required.</div>\n`
        }


      });
    }



    fieldHtml += `</div>\n</div>\n`;
    if ((index + 1) % 4 === 0 || index === fields.length - 1) {
      fieldHtml += '</div>\n';
    }
    if (index === fields.length - 1) {
      fieldHtml += '</form>\n';
      fieldHtml += '</div>\n';
    }
    return fieldHtml;
  }).join('\n');

  return htmlCode;
}





function getComponentName(name: string): string {
  // Capitalize the first letter of each word and join them without spaces
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function getComponentFileName(name: string): string {
  // Remove spaces and convert to camelCase
  return name.replace(/\s+/g, '-').toLowerCase();
}

function generateTabGroupCode(componentNames: string[], tree: Tree, path: string): void {

  //html updates
  const tabGroupPath = `${path}/tab-group/tab-group.component.html`;
  const totaltabs = componentNames.length;
  const LastIndex = totaltabs - 1;

  const button = `<div class="exclusive-section mt-2 d-flex justify-content-end ">
  <app-button-bar [isFirstTab]="selectedTabIndex === 0"
      [isLastTab]="selectedTabIndex === ${LastIndex}" 
     
      (previousClicked)="previousTab()" 
      (saveClicked)="onSave()"
      (nextClicked)="onNext()"></app-button-bar>
</div>\n\n
`

  // const tabsCode = componentNames.map(name => `<mat-tab label="${getComponentName(name)}">
  //   <app-${getComponentFileName(name)}></app-${getComponentFileName(name)}>
  // </mat-tab>
  // `);
  // const tabsFinalCode= `<div style="padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
  //   <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
  //     ${tabsCode.join('\n')}
  //   </mat-tab-group>
  // </div>`;



  const tabsCode = componentNames.map((name: any, index: number) => {
    let tabHtml = '';
    console.log("indexhtml=" + index + ",totalhtml=" + totaltabs);
    if (index == 0) {
      tabHtml += `<div style="padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);margin:10px;">
        <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">\n`
    }
    tabHtml += `<mat-tab label="${getComponentName(name)}">
    <app-${getComponentFileName(name)} `
    if (index == 0) {
      tabHtml += `(Next)="nextTab($event)"`;
    } else if (index == LastIndex) {
      tabHtml += `(Previous)="previousTab()"`;
    }
    else {
      tabHtml += `(Next)="nextTab($event)" (Previous)="previousTab()"`;
    }

    tabHtml += `> </app-${getComponentFileName(name)}>
  </mat-tab>`;
    if (LastIndex == index) {
      tabHtml += ` </mat-tab-group>
      </div>`;
    }
    return tabHtml;
  }).join('\n');

  let htmlCode = button + tabsCode;
  tree.overwrite(tabGroupPath, htmlCode);

  console.log("################: " + htmlCode);
  //update ts file

  const tabstsPath = `${path}/tab-group/tab-group.component.ts`
  const tsContent = tree.read(tabstsPath);
  if (!tsContent) {
    throw new Error(`File ${tabstsPath} not found.`);
  }
  const ContentString = tsContent.toString('utf-8');
  const InsertionIndex = ContentString.indexOf('export class TabGroupComponent {') + 'export class TabGroupComponent {'.length;
  // const tabstsCode = componentNames.map((name: any,index:number) => {
  let importData = '';
  let classData = '';
  let saveData = '';
  let nextData = '';
  for (let index = 0; index < totaltabs; index++) {
    let name = componentNames[index]

    importData += `import {${getComponentName(name)}Component} from \'../${getComponentFileName(name)}/${getComponentFileName(name)}.component\';\n`;


    classData += `\n@ViewChild(${getComponentName(name)}Component) ${getComponentName(name)}Component!: ${getComponentName(name)}Component;`;

    console.log("index=" + index + ",total=" + totaltabs);
    if (index == 0) {
      nextData += `\nonNext() {
        switch (this.selectedTabIndex) {\n`;
      saveData += `\nonSave() {
        switch (this.selectedTabIndex) {\n`;

    }
    saveData += `\n case ${index}:
        this.${getComponentName(name)}Component.onSubmit();
        break;`;
    nextData += `\n case ${index}:
        this.${getComponentName(name)}Component.onNext();
        break;`;
    if (index == LastIndex) {
      classData += `\nselectedTabIndex = 0;\n`;
      classData += `previousTab() {
        const tabCount = ${totaltabs};
        this.selectedTabIndex = (this.selectedTabIndex + tabCount - 1) % tabCount;
      }\n
        nextTab(flag: number) {
        this.selectedTabIndex = (this.selectedTabIndex + 1) % ${totaltabs};
      }\n
        onTabChange(event: any) { 
        this.selectedTabIndex = event.index;
      }\n`;

      saveData += '}\n}\n';
      nextData += '}\n}\n';



    }


    //return finaldata;

    // }).join('\n');
  }
  let finaldata = importData + ContentString.slice(0, InsertionIndex) + classData + saveData + nextData + ContentString.slice(InsertionIndex);

  //console.log("qqqqqqqqqqqqqqqqqqqqqq"+tabstsCode);

  finaldata = finaldata.replace(
    '{ Component }',
    `{ Component, ViewChild }`
  );
  tree.overwrite(tabstsPath, finaldata);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: " + finaldata);
}



function updateAppModule(tree: Tree, path: string) {
  const modulePath = `${path}/app.module.ts`;
  const moduleContent = tree.read(modulePath);
  if (!moduleContent) {
    throw new Error(`File ${modulePath} not found.`);
  }

  const moduleContentString = moduleContent.toString('utf-8');

  const changes = [];

  // Check if imports for BrowserAnimationsModule and MatTabsModule already exist
  if (!moduleContentString.includes('BrowserAnimationsModule')) {
    changes.push('import { BrowserAnimationsModule } from \'@angular/platform-browser/animations\';\n');
  }
  if (!moduleContentString.includes('MatTabsModule')) {
    changes.push('import { MatTabsModule } from \'@angular/material/tabs\';\n');
  }
  if (!moduleContentString.includes('FormsModule')) {
    changes.push('import { FormsModule,ReactiveFormsModule } from \'@angular/forms\';\n');
  }
  if (!moduleContentString.includes('HttpClientModule')) {
    changes.push('import { HttpClientModule } from \'@angular/common/http\';\n');
  }

  const importData = `BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,`
  // Add BrowserAnimationsModule and MatTabsModule to the imports array if not already present
  if (changes.length > 0) {
    const importInsertionIndex = moduleContentString.indexOf('imports: [') + 'imports: ['.length;
    const updatedModuleContent = '\n' + changes.join('') + moduleContentString.slice(0, importInsertionIndex) + importData +
      moduleContentString.slice(importInsertionIndex);

    tree.overwrite(modulePath, updatedModuleContent);
  }

}


function AddServiceMethods(tree: Tree, path: string, name: string,type: string) {

  const servicePath = `${path}/app.service.ts`;
  const ServiceContent = tree.read(servicePath);
  if (!ServiceContent) {
    throw new Error(`File ${servicePath} not found.`);
  }
  let lastIndex;
  const serviceContentString = ServiceContent.toString('utf-8');
  // const lastIndex = serviceContentString.lastIndexOf(`}\s*$`);
  for (let i = serviceContentString.length - 1; i >= 0; i--) {
    if (serviceContentString[i] === '}') {
      lastIndex = i;
      break;
    }
  }

  let method = '';
  if(type=='post') {
  method = `
  post${name}(data:any){
    return of(true);
  }`
  }else{
    method = `
  get${name}Options(Id:any){
    return of( [
      { "value": "Male", "description": "Male" },
      { "value": "Female", "description": "Female" },
      { "value": "Other", "description": "Other" }
    ]);
  }`
  }

  const updatedServiceContent = serviceContentString.slice(0, lastIndex) + method + serviceContentString.slice(lastIndex);

  tree.overwrite(servicePath, updatedServiceContent);




}



