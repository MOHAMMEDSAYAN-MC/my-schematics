import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';

export function generateServiceComponent(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        execSync(`ng g s app --skip-tests`, { stdio: [0, 1, 2] });
        updateService(tree, options.path);
      return tree;
    };
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