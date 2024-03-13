import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
export function generateButtonComponent(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      execSync(`ng g c button-bar --skip-tests`, { stdio: [0, 1, 2] });
      updateButtonBarComponent(tree, options.path);
      return tree;
    };
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