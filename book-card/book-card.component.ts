import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControleServidorContract } from '@shaenkan/server-contract-library';
import { DomSanitizer } from '@angular/platform-browser';
import { FileData } from '../../models/fileData';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {

  @Input() DataModel: FileData;
  @Output() CallModal = new EventEmitter();

  constructor(private domSanitizer:DomSanitizer){ }

  abrir() {
    this.CallModal.emit(this.DataModel.AcervoArtefatoEntityId);
  }

  checkType(arquivo: any) {

    if(!arquivo || !arquivo.Capa){
      return this.getAssets() + 'acervo/Hidden-cuate.png';
    }
    
    return this.domSanitizer.bypassSecurityTrustUrl(arquivo.Capa);
  }

  getAssets() {
    return ControleServidorContract.getAssetsFolder();
  }
}
