import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import * as path from 'path';

export function mySchematics(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const destinationPath = 'D:/Generated';
    const projectName='Projectkooool';
    const currentDirectory = __dirname;
    const schematicsProjectDir = path.join(currentDirectory, '..', '..');

    try {
      process.chdir(destinationPath);

     
      execSync(`ng new ${projectName} --style=css --ssr=false --standalone=false --skip-install`, { stdio: [0, 1, 2] });


      process.chdir(projectName);

    
      execSync(`npm install ${schematicsProjectDir} --save-dev`, { stdio: [0, 1, 2] });
      execSync(`ng generate my-schematics:form-generator`, { stdio: [0, 1, 2] });

      execSync(`npm install @angular/material @angular/animations bootstrap`,{ stdio: [0, 1, 2] });
      execSync(`ng add @angular/material --style=scss --theme=custom --globalTypography=true --animations=true --force --defaults`,{ stdio: [0, 1, 2] });
      execSync(`ng serve -o`, { stdio: [0, 1, 2] });
      
    } catch (error) {
      console.error('Error occurred while creating the new project:', error);
    }

    return tree;
  };
}
