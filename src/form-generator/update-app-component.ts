import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updateAppComponent(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        updateappComponent(tree, options.path);
      return tree;
    };
  }
  
function updateappComponent(tree: Tree, path: string) {
    const componentPath = `${path}/app.component.html`;
    const htmlCode = `<app-header></app-header>
    <app-tab-group></app-tab-group>`;
    tree.overwrite(componentPath, htmlCode);
  }