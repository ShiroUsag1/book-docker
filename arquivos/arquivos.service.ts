import { Injectable } from '@angular/core';
import { FileData } from '../../models/fileData';
import { NormalizestringService } from '../../../../../commons/src/lib/services/normalizestring/normalizestring.service';
import { ServidorService } from '@shaenkan/server-communication-library';
import { NewAlertService } from '@shaenkan/alert-library';
import { AcervoResponseCliente } from '../../models/AcervoResponseClient';

@Injectable({
  providedIn: 'root',
})
export class ArquivosService {
  private static tdsArquivos: FileData[];
  private static filteredArticles: FileData[];

  public static addArquivo(arquivo: FileData){
    ArquivosService.tdsArquivos.push(arquivo);
    ArquivosService.filteredArticles.push(arquivo);
  }

  public static setArquivos(arquivos: FileData[]){
    ArquivosService.tdsArquivos = arquivos;
    ArquivosService.filteredArticles = arquivos;
  }

  public static clear(){
    ArquivosService.tdsArquivos = [];
  }

  public static CarregarDados(){
    NewAlertService.showLoadingAlert();
    ServidorService.postJSONResponseClient(
      'MeuAcervo/ListarTodos',
      { },
      (RespostaServidor: AcervoResponseCliente)=>{
        ArquivosService.clear();
        NewAlertService.hideAlert();
        if(RespostaServidor.status == 0){
          ArquivosService.setArquivos(RespostaServidor.response);
        }
        else
        {
          NewAlertService.setModel(NewAlertService.ConstDangerModel);
          NewAlertService.showBasicAlert(RespostaServidor.msg);
        }
      },
      (error)=>{
        NewAlertService.hideAlert();
        NewAlertService.setModel(NewAlertService.ConstDangerModel);
        NewAlertService.showBasicAlert('Erro na comunicação com o servidor, por favor tente mais tarde!');
      }
    );
  }

  public static novoArquivo() {
    return {
      AcervoArtefatoEntityId: 0,
      Titulo: '',
      Tipo: '',
      EnderecoWeb: '',
      Capa: '',
      DataCriacao: '',
      Descricao: '',
      Autor: '',
      MetaDados: ''
    };
  }

  public static getArquivos() {
    return ArquivosService.filteredArticles;
  }

  public static setFiltro(searchQuery): void {
    if (searchQuery.length > 0) {
      ArquivosService.filteredArticles = ArquivosService.tdsArquivos.filter((article) => {
        let NormSearchQuery = NormalizestringService.normalizeString(searchQuery.toLowerCase());

        return NormalizestringService.normalizeString(article.Titulo.toLowerCase()).includes(NormSearchQuery) || 
               NormalizestringService.normalizeString(article.Descricao.toLowerCase()).includes(NormSearchQuery)|| 
               NormalizestringService.normalizeString(article.Autor.toLowerCase()).includes(NormSearchQuery) || 
               NormalizestringService.normalizeString(article.Tipo.toLowerCase()).includes(NormSearchQuery) || 
               NormalizestringService.normalizeString(article.MetaDados.toLowerCase()).includes(NormSearchQuery) || 
               NormalizestringService.normalizeString(article.DataCriacao.toLowerCase()).includes(NormSearchQuery);
      });
    } else {
      ArquivosService.filteredArticles = ArquivosService.tdsArquivos;
    }
  }

  constructor() {}
}
