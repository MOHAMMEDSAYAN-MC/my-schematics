import { Rule, SchematicContext, Tree, strings } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
export function generatePageComponents(options: any,fileName:string,componentName:string,fields: any[], tabNumber: number): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        execSync(`ng g c ${fileName} --skip-tests`, { stdio: [0, 1, 2] });
      updatehtmlComponent(tree, options.path, componentName, fields)
      updatetsComponent(tree, options.path, componentName, fields, tabNumber);
      return tree;
    };
  }
  function updatehtmlComponent(tree: Tree, path: string, component: string, fields: any[]): void {
    const fileName = `${component.toLowerCase().replace(/\s+/g, '-')}`;
    const componentPath = `${path}/${fileName}/${fileName}.component.html`;
    const htmlCode = generateHtmlCode(fields, component);
    tree.overwrite(componentPath, htmlCode);
  
  }
  
  
  function generateHtmlCode(fields: any[], component: string): string {
    //const formName = `${getComponentName(component)}Form`;
    const formName = `${strings.classify(component)}Form`;
    const htmlCode = fields.map((field: any, index: number) => {
      field.name=strings.camelize(field.name).replace(/\s/g, '');
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
          fieldHtml += `<option *ngFor="let option of ${field.name}Options" [value]="option.DataValue">{{ option.DisplayValue }}</option>\n`;
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

  function updatetsComponent(tree: Tree, path: string, component: string, fields: any[], tabNumber: number) {
    // const componentFilename = getComponentFileName(component);
    const componentFilename = strings.dasherize(component);
    const componentPath = `${path}/${componentFilename}/${componentFilename}.component.ts`;
    // const classname = `${getComponentName(component)}`;
    // const formName = `${getComponentName(component)}Form`;
    const classname = strings.classify(component);
    const formName = `${classname}Form`;
    
    const moduleContent = tree.read(componentPath);
    if (!moduleContent) {
      throw new Error(`File ${componentFilename} not found.`);
    }
  
    const moduleContentString = moduleContent.toString('utf-8');
  
    const InsertionIndex = moduleContentString.indexOf('export class ' + classname) + 'export class '.length + classname.length + 'Component {'.length;
  
  
    let FormImport = 'import { FormGroup, FormBuilder, Validators } from \'@angular/forms\';\n';
    FormImport += 'import { AppService } from \'../app.service\';\n'
    let selectvalue = '';
    let Methods = '';
    let varr='';
    const formGroup = fields.map((field: any, index: any) => {
      field.name=strings.camelize(field.name).replace(/\s/g, '');
      if(index==0){
      selectvalue += `\nngOnInit() {`}
      if (field.type === 'select') {
        varr += `\n${field.name}Options:any;`;
        varr += `\n${field.name}Id='${field.Id}';`;
        selectvalue += `this.get${field.name}Options(this.${field.name}Id);`;
        Methods += `\nget${field.name}Options(${field.name}Id:any){
          this.service.get${field.name}Options(${field.name}Id).subscribe((res: any) => {
            this.${field.name}Options = res;
          });
        }\n`;
  
        AddServiceMethods(tree, path, field.name, 'get');
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
        selectvalue += `\n}`
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
  
    AddServiceMethods(tree, path, classname, 'post');
  
  
  
    let updatedModuleContent = FormImport + moduleContentString.slice(0, InsertionIndex)+varr + selectvalue + formGroup + Methods +
      moduleContentString.slice(InsertionIndex);
  
    updatedModuleContent = updatedModuleContent.replace(
      '{ Component }',
      `{  Component, EventEmitter, Output }`
    )
    tree.overwrite(componentPath, updatedModuleContent);
  }
  

  function AddServiceMethods(tree: Tree, path: string, name: string, type: string) {

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
    if (type == 'post') {
      method = `
    post${name}(data:any){
      return of(true);
    }`
    } else {
      method = `
    get${name}Options(Id:any):Observable<any> {
      return this.http.get<any>("https://localhost:7226/api/DomainTable/GetDomainByFieldId/"+Id);
    }`
    }
  
    const updatedServiceContent = serviceContentString.slice(0, lastIndex) + method + serviceContentString.slice(lastIndex);
  
    tree.overwrite(servicePath, updatedServiceContent);
  
  
  
  
  }
  
  
// function getComponentName(name: string): string {
//     // Capitalize the first letter of each word and join them without spaces
//     return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
//   }
  
//   function getComponentFileName(name: string): string {
//     // Remove spaces and convert to camelCase
//     return name.replace(/\s+/g, '-').toLowerCase();
//   }
  