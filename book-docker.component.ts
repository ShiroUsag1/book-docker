import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { ArquivosService } from '../../services/arquivos/arquivos.service';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { FileData } from '../../models/fileData';
import { NewAlertService } from '@shaenkan/alert-library';
import { SessionPerfilService } from '@shaenkan/login-library';
import { ResponseClient, ServidorService } from '@shaenkan/server-communication-library';
import { DatagridFooterComponent } from "../../../../../commons/src/lib/components/datagrid-footer/datagrid-footer.component";
import { ControleServidorContract } from '@shaenkan/server-contract-library';
import { DataGridHeader } from '../../../../../commons/src/lib/models/DataGridHeader';
import { BackdropService } from '@shaenkan/backdrop-library';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-book-docker',
  standalone: true,
  imports: [
    CommonModule,
    FormModalComponent,
    BookCardComponent,
    DatagridFooterComponent
],
  templateUrl: './book-docker.component.html',
  styleUrl: './book-docker.component.scss'
})
export class BookDockerComponent implements OnInit {

  @Input() showModal: boolean;
  @Output() CallClose = new EventEmitter();
  @Output() CallOpen = new EventEmitter();
  
  arquivo: FileData;
  header:DataGridHeader[] = [];

  currentPage = 1;
  itemsPerPage: number = 4;
  itenspInput: number = 4;
  totalPages: number;
  searchTerm = '';
  showModalBook = false;

  constructor(private sanitizer:DomSanitizer){}

  ngOnInit(): void {
    this.arquivo = ArquivosService.novoArquivo();

    this.showModal = false;
    this.header = [
      {key:' ', label:' ', dataVisivel: true, visivel: true}, 
      {key:'titulo', label:'Título', dataVisivel: true, visivel: true},  
      {key:'autor', label:'Autor', dataVisivel: true, visivel: true}, 
      {key:'data', label:'Data', dataVisivel: true, visivel: true}, 
      {key:'ações', label:'Ações', dataVisivel: true, visivel: true}
    ];

    let QIP = 
          window.localStorage.getItem(
              ControleServidorContract.getPrefixApp()+"DATAGRID-QIP-BookDockerComponent"
          );

    if(!QIP){
      QIP = this.itemsPerPage+"";
      window.localStorage.setItem(
        ControleServidorContract.getPrefixApp()+"DATAGRID-QIP-BookDockerComponent",
        QIP
      );
    }

    this.itemsPerPage = parseInt(QIP);
    this.itenspInput = parseInt(QIP);
  }

  getSafeUrl(arg0: string) {
    return this.sanitizer.bypassSecurityTrustUrl(arg0);
  }

  //Qtde itens por página
  setQtdeItens(NumItensPagina: number) {
    this.itemsPerPage = NumItensPagina;
    window.localStorage.setItem(ControleServidorContract.getPrefixApp()+"DATAGRID-QIP-BookDockerComponent", NumItensPagina+"");
  }

  getMaxItens(): any {
    if((ArquivosService.getArquivos() == null ) || (ArquivosService.getArquivos().length < 1)){
      return 0;
    }

    return ArquivosService.getArquivos().length;
  }

  setPage(page: any) {
    this.currentPage = page;
  }

  updatePaginatedArticles() {
    ArquivosService.CarregarDados();
  }

  CloseModal() {
    this.CallClose.emit();
  }

  CloseDownloadModal() {
    this.showModalBook = false;
    BackdropService.hide();
  }

  MarcarDownload() {
    ServidorService.postJSONResponseClient(
      'MeuAcervo/marcar-download',
      {
        idregistro: this.arquivo.AcervoArtefatoEntityId
      },
      (RespostaServidor: ResponseClient)=>{
        console.log(RespostaServidor);
      },
      (error)=>{
        NewAlertService.setModel(NewAlertService.ConstDangerModel);
        NewAlertService.showBasicAlert('Erro ao se comunicar com o servidor, por favor tente mais tarde!');
      }
    );
  }

  CallModal($event: any) {

    let DataFunc = this;

    let selecionado = ArquivosService.getArquivos().filter((objx)=>{
      return objx.AcervoArtefatoEntityId == $event;
    });

    this.arquivo = selecionado[0];

    NewAlertService.hideAlert();
    if(SessionPerfilService.isAdministrator){
      NewAlertService.acaoYes = () => {
        NewAlertService.hideAlert();
        if(selecionado.length < 1){
          this.CallClose.emit();
          return;
        }
        this.CallOpen.emit();
      };
      NewAlertService.acaoNo = () => {
        NewAlertService.hideAlert();
        window.open(DataFunc.arquivo.EnderecoWeb, '_blank');
        DataFunc.MarcarDownload();
      };
      NewAlertService.setModel(NewAlertService.ConstWarningModel);
      NewAlertService.showYesNoAlert('Deseja editar o link?');
    }
    else
    {
      BackdropService.show();
      this.showModalBook = true;
    }
  }

  Acessar() {
    window.open(this.arquivo.EnderecoWeb, '_blank');
    this.MarcarDownload();
    BackdropService.hide();
    this.showModalBook = false;
  }

  getArticles() {

    if((ArquivosService.getArquivos() == null ) || (ArquivosService.getArquivos().length < 1)){
      return [];
    }

    return ArquivosService.getArquivos().
      slice(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage * this.currentPage);
  }
}
