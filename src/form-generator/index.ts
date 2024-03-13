import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  chain,
} from '@angular-devkit/schematics';
import { generateServiceComponent } from './generate-service-component';
import { generateButtonComponent } from './generate-button-component';
import { generateHeaderComponent } from './generate-header-component';
import { generatePageComponents } from './generate-page-component';
import { generateTabGroupComponent } from './generate-tab-group-component';
import { updateAppComponent } from './update-app-component';
import { updateAppModule } from './update-app-module';


export function formGenerator(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const data = fetchDataFromBackend();
    if (!data) {
      throw new SchematicsException('Error fetching data from the backend.');
    }
    const ComponentNames: string[] = []
    const schematicChain: Rule[] = [];
    //service,header,buttonbar creation and html injection
      schematicChain.push(generateServiceComponent(options),
                          generateButtonComponent(options),
                          generateHeaderComponent(options)
                         );
  
    // Create a separate component for each tab
    data.tabs.forEach((tab: any, index: number) => {
      const componentName = `${tab.name}`;
      const fileName = `${tab.name.toLowerCase().replace(/\s+/g, '-')}`;
      ComponentNames.push(componentName);
      schematicChain.push(generatePageComponents(options,fileName,componentName,tab.fields,index));

    });

    schematicChain.push(generateTabGroupComponent(options,ComponentNames),
            updateAppComponent(options),
            updateAppModule(options)
            );
    
    return chain(schematicChain);
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
            "Id": "06ED2851-50F5-42C6-AFA7-03FE05E7E5B2",
            "name": "Utility Type",
            "type": "select",
            "label": "Utility Type",
            "dataType": "text"
          },
          {
            "Id": "FF7501A1-2EFC-4960-9C27-04793EEDB242",
            "name": "Utility",
            "type": "select",
            "label": "Utility",
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





























