import { Rule, SchematicContext, Tree, strings } from '@angular-devkit/schematics';
import { execSync } from 'child_process';

export function generateTabGroupComponent(options: any,ComponentNames:string[]): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        execSync(`ng g c tab-group --skip-tests`, { stdio: [0, 1, 2] });
        generateTabGrouphtmlCode(ComponentNames, tree, options.path);
        generateTabGrouptsCode(ComponentNames, tree, options.path);
      return tree;
    };
  }
  function generateTabGrouphtmlCode(componentNames: string[], tree: Tree, path: string): void {

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
    //   console.log("indexhtml=" + index + ",totalhtml=" + totaltabs);
      if (index == 0) {
        tabHtml += `<div style="padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);margin:10px;">
          <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">\n`
      }

    //   console.log("================================"+getComponentFileName(name));
    //   console.log("++++++++++++++++++++++++++++"+strings.dasherize(name));
      let fileName = strings.dasherize(name);
      tabHtml += `<mat-tab label="${strings.classify(name)}">
      <app-${fileName} `
      if (index == 0) {
        tabHtml += `(Next)="nextTab($event)"`;
      } else if (index == LastIndex) {
        tabHtml += `(Previous)="previousTab()"`;
      }
      else {
        tabHtml += `(Next)="nextTab($event)" (Previous)="previousTab()"`;
      }
  
      tabHtml += `> </app-${fileName}>
    </mat-tab>`;
      if (LastIndex == index) {
        tabHtml += ` </mat-tab-group>
        </div>`;
      }
      return tabHtml;
    }).join('\n');
  
    let htmlCode = button + tabsCode;
    tree.overwrite(tabGroupPath, htmlCode);
  
    // console.log("################: " + htmlCode);


    //update ts file
  
   
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: " + finaldata);
  }
  function generateTabGrouptsCode(componentNames: string[], tree: Tree, path: string) :void{
    const totaltabs = componentNames.length;
    const LastIndex = totaltabs - 1;
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
      const compName=strings.classify(name)
      importData += `import {${compName}Component} from \'../${strings.dasherize(name)}/${strings.dasherize(name)}.component\';\n`;
  
  
      classData += `\n@ViewChild(${compName}Component) ${compName}Component!: ${compName}Component;`;
  
    //   console.log("index=" + index + ",total=" + totaltabs);
      if (index == 0) {
        nextData += `\nonNext() {
          switch (this.selectedTabIndex) {\n`;
        saveData += `\nonSave() {
          switch (this.selectedTabIndex) {\n`;
  
      }
      saveData += `\n case ${index}:
          this.${compName}Component.onSubmit();
          break;`;
      nextData += `\n case ${index}:
          this.${compName}Component.onNext();
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
  }
  
// function getComponentName(name: string): string {
//     // Capitalize the first letter of each word and join them without spaces
//     return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
//   }
  
//   function getComponentFileName(name: string): string {
//     // Remove spaces and convert to camelCase
//     return name.replace(/\s+/g, '-').toLowerCase();
//   }