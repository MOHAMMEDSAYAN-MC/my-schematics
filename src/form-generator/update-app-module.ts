import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updateAppModule(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        moduleUpdations(tree, options.path);
        updateStyle(tree);
        
      return tree;
    };
  }
  

function moduleUpdations(tree: Tree, path: string) {
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
  