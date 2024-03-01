import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';

export function mySchematics(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const destinationPath = 'D:/';
    const projectName='ProjectOne';
    try {
      process.chdir(destinationPath);

     
      execSync(`ng new ${projectName} --style=css --ssr=false --standalone=false`, { stdio: [0, 1, 2] });


      process.chdir(projectName);

      //please change location details corresponding to schematics project located in the system
      execSync(`npm install D:/CodeGeneration/Check/my-schematics/my-schematics/ --save-dev`, { stdio: [0, 1, 2] });
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
